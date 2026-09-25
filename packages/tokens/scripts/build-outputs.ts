/**
 * 토큰 소스를 읽어 산출물 문자열을 만든다 (plan.md T-T2). 파일 쓰기는 build.ts 가 한다.
 *
 * 순수 함수로 두는 이유: AC-5(semantic 한 줄 변경이 CSS 와 JS 에 동시 전파) 테스트가
 * 변형한 소스 디렉터리를 넣고 두 산출물을 함께 볼 수 있어야 한다.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const BRANDS = ["base", "bakery"] as const;
export type Brand = (typeof BRANDS)[number];

export const SEMANTIC_GROUPS = ["bg", "fg", "border"] as const;
/** 테마와 무관한 Tailwind 정적 색 유틸리티 키. twMergeConfig 색 키 끝에 붙는다(R26). */
export const STATIC_COLORS = ["inherit", "current", "transparent"] as const;
export const MODES = ["light", "dark"] as const;
export type Mode = (typeof MODES)[number];

export const TEXT_STEPS = ["sm", "md", "lg", "xl", "2xl"] as const;
export type TextStep = (typeof TEXT_STEPS)[number];

/** DS-local $type. DTCG 표준 타입 + 원시 유틸리티 클래스 조각(className). */
export const ALLOWED_TYPES = new Set([
  "color",
  "dimension",
  "shadow",
  "number",
  "fontFamily",
  "fontWeight",
  "typography",
  "className",
]);

export type Json = { [key: string]: unknown };

export function isRecord(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isToken(value: unknown): value is Json {
  return isRecord(value) && "$value" in value;
}

const REF = /^\{([^}]+)\}$/;

export function refTarget(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const matched = REF.exec(value.trim());
  return matched ? matched[1]! : null;
}

export function getNode(tree: Json, path: string): unknown {
  let current: unknown = tree;
  for (const segment of path.split(".")) {
    if (!isRecord(current)) return undefined;
    current = current[segment];
  }
  return current;
}

export function readJson(path: string): Json {
  const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));
  if (!isRecord(parsed)) throw new Error(`객체가 아닌 토큰 파일: ${path}`);
  return parsed;
}

function mergeInto(target: Json, source: Json, path: string, file: string): void {
  for (const [key, value] of Object.entries(source)) {
    if (key.startsWith("$")) continue;
    const existing = target[key];
    if (isRecord(existing) && isRecord(value) && !isToken(existing) && !isToken(value)) {
      mergeInto(existing, value, `${path}${key}.`, file);
      continue;
    }
    if (existing !== undefined) throw new Error(`토큰 경로 충돌: ${path}${key} (${file})`);
    target[key] = value;
  }
}

/** 디렉터리의 JSON 을 파일명 순으로 하나의 트리로 합친다. 경로가 겹치면 오류다. */
export function loadDir(dir: string): Json {
  const out: Json = {};
  const names = readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort();
  for (const name of names) mergeInto(out, readJson(join(dir, name)), "", name);
  return out;
}

export type Resolved = { type: string | undefined; value: unknown };

/** 참조를 끝까지 따라가 리터럴 값을 얻는다. 복합 토큰은 멤버별로 푼다. */
export function resolveToken(tree: Json, path: string, seen: readonly string[] = []): Resolved {
  if (seen.includes(path)) throw new Error(`순환 참조: ${[...seen, path].join(" -> ")}`);
  const node = getNode(tree, path);
  if (!isToken(node)) throw new Error(`토큰이 아닌 참조 대상: ${path}`);
  const declared = typeof node["$type"] === "string" ? node["$type"] : undefined;
  if (declared !== undefined && !ALLOWED_TYPES.has(declared)) {
    throw new Error(`알 수 없는 $type: ${declared} (${path})`);
  }
  const value = node["$value"];

  const target = refTarget(value);
  if (target) {
    const inner = resolveToken(tree, target, [...seen, path]);
    return { type: declared ?? inner.type, value: inner.value };
  }

  if (isRecord(value)) {
    const composite: Json = {};
    for (const [key, member] of Object.entries(value)) {
      const memberTarget = refTarget(member);
      composite[key] = memberTarget ? resolveToken(tree, memberTarget, [...seen, path]).value : member;
    }
    return { type: declared, value: composite };
  }

  return { type: declared, value };
}

function expectString(value: unknown, path: string): string {
  if (typeof value !== "string") throw new Error(`문자열이 아니다: ${path}`);
  return value;
}

function expectNumber(value: unknown, path: string): number {
  if (typeof value !== "number") throw new Error(`숫자가 아니다: ${path}`);
  return value;
}

/** `"20px"` → `20`. native 래퍼가 line-height 를 배수로 낼 때 쓴다(T-N0). */
function pxNumber(value: string, path: string): number {
  const matched = /^(-?\d+(?:\.\d+)?)px$/.exec(value.trim());
  if (!matched) throw new Error(`px 값이 아니다: ${value} (${path})`);
  return Number(matched[1]);
}

// ------------------------------------------------------- 이름 규칙 (§3.1)

/** `:root` 변수 이름. 소비자 로컬 오버라이드의 공개 계약이다(C-5b). */
export function rootVariable(group: string, name: string): string {
  return `--${group}-${name}`;
}

/**
 * `@theme inline` 키. Tailwind 색 네임스페이스라 bg 그룹은 그룹 이름을 뺀다
 * (`bg-bg-brand` 같은 클래스를 만들지 않기 위해서다).
 */
export function themeColorKey(group: string, name: string): string {
  if (group === "bg") return `--color-${name}`;
  return name === "default" ? `--color-${group}` : `--color-${group}-${name}`;
}

/** `@theme inline` 색 키에서 `--color-` 를 뗀 이름. twMergeConfig 색 키와 같다. */
export function colorKey(group: string, name: string): string {
  return themeColorKey(group, name).slice("--color-".length);
}

// ------------------------------------------------------------- 소스 모델

export type TokenSource = {
  primitive: Json;
  component: Json;
  shared: Json;
  trees: Map<Brand, Json>;
};

export function loadSource(tokensDir: string): TokenSource {
  const primitive = loadDir(join(tokensDir, "primitive"));
  const component = loadDir(join(tokensDir, "component"));
  const shared: Json = { ...primitive, ...component };
  const trees = new Map<Brand, Json>(
    BRANDS.map((brand) => {
      const file = readJson(join(tokensDir, "semantic", `${brand}.json`));
      return [brand, { ...shared, semantic: file["semantic"] }] as const;
    }),
  );
  return { primitive, component, shared, trees };
}

export function brandTree(source: TokenSource, brand: Brand): Json {
  const tree = source.trees.get(brand);
  if (!tree) throw new Error(`브랜드 트리 없음: ${brand}`);
  return tree;
}

export function semanticEntries(
  source: TokenSource,
  brand: Brand,
  mode: Mode,
): Array<{ group: string; name: string }> {
  const tree = brandTree(source, brand);
  const entries: Array<{ group: string; name: string }> = [];
  for (const group of SEMANTIC_GROUPS) {
    const node = getNode(tree, `semantic.${mode}.${group}`);
    if (!isRecord(node)) throw new Error(`semantic.${mode}.${group} 없음 (${brand})`);
    for (const name of Object.keys(node)) {
      if (name.startsWith("$")) continue;
      entries.push({ group, name });
    }
  }
  return entries;
}

/**
 * CSS 에 넣을 semantic 값.
 * primitive 참조는 해석값으로 기입한다 — 소비자가 primitive 를 모른 채 덮을 수 있어야 한다(plan D-25).
 * 같은 모드의 semantic 참조(별칭 2개)만 var() 로 남긴다(plan D-3).
 */
export function semanticCssValue(
  source: TokenSource,
  brand: Brand,
  mode: Mode,
  group: string,
  name: string,
): string {
  const tree = brandTree(source, brand);
  const path = `semantic.${mode}.${group}.${name}`;
  const node = getNode(tree, path);
  if (!isToken(node)) throw new Error(`토큰이 아니다: ${path} (${brand})`);
  const target = refTarget(node["$value"]);
  if (target?.startsWith("semantic.")) {
    const segments = target.split(".");
    const aliasName = segments[segments.length - 1]!;
    const aliasGroup = segments[segments.length - 2]!;
    return `var(${rootVariable(aliasGroup, aliasName)})`;
  }
  return expectString(resolveToken(tree, path).value, path);
}

export function semanticJsValue(
  source: TokenSource,
  brand: Brand,
  mode: Mode,
  group: string,
  name: string,
): string {
  const path = `semantic.${mode}.${group}.${name}`;
  return expectString(resolveToken(brandTree(source, brand), path).value, path);
}

// -------------------------------------------------- 공유 스케일 (§3.4 ~ §3.6)

function scaleRecord(primitive: Json, group: string): Record<string, string> {
  const node = getNode(primitive, `primitive.${group}`);
  if (!isRecord(node)) throw new Error(`primitive.${group} 없음`);
  const out: Record<string, string> = {};
  for (const key of Object.keys(node)) {
    if (key.startsWith("$")) continue;
    out[key] = expectString(resolveToken(primitive, `primitive.${group}.${key}`).value, key);
  }
  return out;
}

export type TextValue = { fontSize: string; lineHeight: string; fontWeight: number };

function textSteps(shared: Json): Record<TextStep, TextValue> {
  return Object.fromEntries(
    TEXT_STEPS.map((step) => {
      const path = `component.text.${step}`;
      const resolved = resolveToken(shared, path).value;
      if (!isRecord(resolved)) throw new Error(`복합 토큰이 아니다: ${path}`);
      const value: TextValue = {
        fontSize: expectString(resolved["fontSize"], `${path}.fontSize`),
        lineHeight: expectString(resolved["lineHeight"], `${path}.lineHeight`),
        fontWeight: expectNumber(resolved["fontWeight"], `${path}.fontWeight`),
      };
      return [step, value] as const;
    }),
  ) as Record<TextStep, TextValue>;
}

/** 공백이 있는 패밀리 이름은 CSS 에서 따옴표로 감싼다. */
function cssFontStack(stack: readonly unknown[]): string {
  return stack
    .map((entry) => {
      const name = expectString(entry, "fontFamily.sans");
      return /\s/.test(name) ? `"${name}"` : name;
    })
    .join(", ");
}

function fontFamilyOf(primitive: Json): { sans: { web: string; native: string } } {
  const node = getNode(primitive, "primitive.typography.fontFamily.sans");
  if (!isToken(node)) throw new Error("primitive.typography.fontFamily.sans 없음");
  const stack = node["$value"];
  if (!Array.isArray(stack)) throw new Error("fontFamily.sans 는 배열이어야 한다");
  const extensions = node["$extensions"];
  const native = isRecord(extensions) ? extensions["ds.native"] : undefined;
  return {
    sans: {
      web: cssFontStack(stack),
      native: expectString(native, "fontFamily.sans.$extensions.ds.native"),
    },
  };
}

// ----------------------------------------------------- component 계층 (§3.8)

/** 참조는 스케일 키로, 리터럴은 값으로 접는다. 클래스 조립은 컴포넌트 구현의 몫이다. */
function scaleKey(shared: Json, path: string): string | number {
  const node = getNode(shared, path);
  if (!isToken(node)) throw new Error(`토큰이 아니다: ${path}`);
  const target = refTarget(node["$value"]);
  if (target) {
    resolveToken(shared, path); // 참조가 실제로 풀리는지 확인한다
    const segments = target.split(".");
    return segments[segments.length - 1]!;
  }
  const value = node["$value"];
  if (typeof value === "string" || typeof value === "number") return value;
  throw new Error(`스케일 키로 쓸 수 없는 값: ${path}`);
}

function foldComponent(shared: Json, node: Json, path: string): unknown {
  if (isToken(node)) return scaleKey(shared, path);
  const out: Json = {};
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    if (!isRecord(child)) throw new Error(`예상치 못한 값: ${path}.${key}`);
    out[key] = foldComponent(shared, child, `${path}.${key}`);
  }
  return out;
}

function componentRecipes(source: TokenSource): Json {
  const root = getNode(source.component, "component");
  if (!isRecord(root)) throw new Error("component 루트 없음");
  const out: Json = {};
  for (const name of Object.keys(root)) {
    if (name.startsWith("$") || name === "text") continue; // text 는 별도 export
    const node = root[name];
    if (!isRecord(node)) throw new Error(`component.${name} 이 객체가 아니다`);
    out[name] = foldComponent(source.shared, node, `component.${name}`);
  }
  return out;
}

// ------------------------------------------------------------- CSS 생성

const GENERATED = "/* 생성 파일. packages/tokens/scripts/build.ts 가 만든다. 직접 수정하지 않는다. */";
const TS_HEADER = "// 생성 파일. packages/tokens/scripts/build.ts 가 만든다. 직접 수정하지 않는다.";

function primitiveDeclarations(primitive: Json): string[] {
  const root = getNode(primitive, "primitive.color");
  if (!isRecord(root)) throw new Error("primitive.color 없음");
  const lines: string[] = [];
  const walk = (node: Json, path: readonly string[]): void => {
    for (const key of Object.keys(node)) {
      if (key.startsWith("$")) continue;
      const child = node[key];
      if (!isRecord(child)) continue;
      if (isToken(child)) {
        const joined = [...path, key].join(".");
        lines.push(`  --ds-${[...path, key].join("-")}: ${expectString(child["$value"], joined)};`);
      } else {
        walk(child, [...path, key]);
      }
    }
  };
  walk(root, []);
  return lines;
}

function semanticBlock(source: TokenSource, brand: Brand, mode: Mode, indent: string): string[] {
  return semanticEntries(source, brand, mode).map(
    ({ group, name }) =>
      `${indent}${rootVariable(group, name)}: ${semanticCssValue(source, brand, mode, group, name)};`,
  );
}

function tokenCss(source: TokenSource, brand: Brand): string {
  const spacing = scaleRecord(source.primitive, "spacing");
  const radius = scaleRecord(source.primitive, "radius");
  const shadow = scaleRecord(source.primitive, "shadow");
  const text = textSteps(source.shared);
  const fontFamily = fontFamilyOf(source.primitive);

  const lines: string[] = [];
  lines.push(GENERATED);
  lines.push(`/* @eeennsu/tokens — brand: ${brand}. 내부 산출물이며 소비자는 플랫폼 래퍼를 import 한다(C-3). */`);
  lines.push("");
  lines.push(":root {");
  lines.push("  /* primitive — 공개 계약이 아니다. 이름 안정성을 보장하지 않는다(알려진 동작 13). */");
  lines.push(...primitiveDeclarations(source.primitive));
  lines.push("");
  lines.push("  /* semantic (light) — 이 변수 이름이 공개 계약이다(C-5b). */");
  lines.push(...semanticBlock(source, brand, "light", "  "));
  lines.push("}");
  lines.push("");
  lines.push("/* 다크는 두 셀렉터에 같은 값을 낸다(C-20). */");
  lines.push(".dark {");
  lines.push(...semanticBlock(source, brand, "dark", "  "));
  lines.push("}");
  lines.push("");
  lines.push("@media (prefers-color-scheme: dark) {");
  lines.push("  :root:not(.light) {");
  lines.push(...semanticBlock(source, brand, "dark", "    "));
  lines.push("  }");
  lines.push("}");
  lines.push("");
  lines.push("@theme {");
  lines.push("  /* 네임스페이스 리셋 — DS 어휘 밖 클래스는 생성되지 않는다(C-6, 알려진 동작 1). */");
  lines.push("  --color-*: initial;");
  lines.push("  --spacing-*: initial;");
  lines.push("  --spacing: initial;");
  lines.push("  --radius-*: initial;");
  lines.push("  --shadow-*: initial;");
  lines.push("  --text-*: initial;");
  lines.push("  --font-weight-*: initial;");
  lines.push("");
  for (const [key, value] of Object.entries(spacing)) lines.push(`  --spacing-${key}: ${value};`);
  lines.push("");
  for (const [key, value] of Object.entries(radius)) lines.push(`  --radius-${key}: ${value};`);
  lines.push("");
  for (const [key, value] of Object.entries(shadow)) lines.push(`  --shadow-${key}: ${value};`);
  lines.push("");
  for (const step of TEXT_STEPS) {
    const value = text[step];
    lines.push(`  --text-${step}: ${value.fontSize};`);
    lines.push(`  --text-${step}--line-height: ${value.lineHeight};`);
    lines.push(`  --text-${step}--font-weight: ${value.fontWeight};`);
  }
  lines.push("");
  lines.push(`  --font-sans: ${fontFamily.sans.web};`);
  lines.push("}");
  lines.push("");
  lines.push("/* inline 은 색만 — var() 참조여야 :root 재선언이 클래스까지 전파된다(C-5b). */");
  lines.push("@theme inline {");
  for (const { group, name } of semanticEntries(source, brand, "light")) {
    lines.push(`  ${themeColorKey(group, name)}: var(${rootVariable(group, name)});`);
  }
  lines.push("}");
  lines.push("");
  return lines.join("\n");
}

function webWrapperCss(brand: Brand): string {
  return [
    GENERATED,
    `/* @eeennsu/web — brand: ${brand}. 소비자 공개 경로다(C-3). */`,
    "",
    '@import "tailwindcss";',
    `@import "@eeennsu/tokens/themes/${brand}.css";`,
    "",
    "/* 다크모드 hybrid — 루트 클래스가 OS 설정보다 우선한다(C-20). */",
    "@custom-variant dark {",
    "  &:where(.dark, .dark *) { @slot; }",
    "  @media (prefers-color-scheme: dark) {",
    "    &:where(:not(.light, .light *)) { @slot; }",
    "  }",
    "}",
    "",
    "/* DS 컴포넌트의 정적 클래스 문자열을 스캔한다(C-3 · C-4 (2)). */",
    '@source "../dist";',
    "",
  ].join("\n");
}

/**
 * native 래퍼 (T-N0).
 *
 * 토큰 파일이 낸 다크 2셀렉터는 RN 에서 둘 다 죽는다(게이트 (2)·(4)) — `.dark` 는 무시되고
 * `@media` 쪽은 `:not(.light)` 때문에 매칭되지 않는다. 그래서 native 래퍼만 `:not` 없는
 * `@media (prefers-color-scheme: dark) { :root }` 를 한 블록 더 낸다. 값은 같은 DTCG 소스에서
 * 나오므로 셀렉터만 다르다(C-6 R24, C-20 RN 항목).
 *
 * line-height 는 px 를 배수로 오독하므로(게이트 (5)) 같은 래퍼에서 단위 없는 배수로 다시 낸다
 * (plan D-31 (A)). 배수 = 스텝의 line-height px ÷ 같은 스텝의 fontSize px.
 *
 * `tabular-nums` 는 react-native-css 가 `font-variant-numeric` 을 옮기지 않아 RN 에서 무효다.
 * 같은 클래스에 RN 전용 선언을 더해 웹과 같은 결과를 낸다(AC-25, 구현 노트 F-21).
 *
 * `--font-sans` 는 웹 목록(`"Pretendard Variable", Pretendard, …`)의 첫 이름을 RN 이 그대로 요청하므로
 * 토큰 소스의 RN 이름(`$extensions["ds.native"]`) 하나로 다시 낸다(C-7b R26).
 */
function nativeWrapperCss(source: TokenSource, brand: Brand): string {
  const text = textSteps(source.shared);
  const lines: string[] = [
    GENERATED,
    `/* @eeennsu/native — brand: ${brand}. 소비자 공개 경로다(C-3). */`,
    "/* @custom-variant dark 를 넣지 않는다 — RN 은 NativeWind 의 dark: 기본 동작을 쓴다(C-20, plan v2 F-21). */",
    "",
    '@import "tailwindcss";',
    `@import "@eeennsu/tokens/themes/${brand}.css";`,
    "",
    "/* RN 다크 — 토큰 파일의 .dark 와 :root:not(.light) 는 NativeWind v5 에서 죽는다(게이트 (2)·(4)). */",
    "@media (prefers-color-scheme: dark) {",
    "  :root {",
    ...semanticBlock(source, brand, "dark", "    "),
    "  }",
    "}",
    "",
    "/* RN line-height — px 를 배수로 읽으므로 배수로 다시 낸다(게이트 (5), plan D-31). */",
    "@theme {",
  ];
  for (const step of TEXT_STEPS) {
    const value = text[step];
    const fontSize = pxNumber(value.fontSize, `component.text.${step}.fontSize`);
    const lineHeight = pxNumber(value.lineHeight, `component.text.${step}.lineHeight`);
    lines.push(`  --text-${step}--line-height: ${lineHeight / fontSize};`);
  }
  lines.push("}");
  lines.push("");
  lines.push("/* RN 글꼴 — react-native-css 는 font-family 목록의 첫 이름만 쓴다. RN 패밀리 이름 하나로 다시 낸다(C-7b R26). */");
  lines.push("@theme {");
  lines.push(`  --font-sans: ${fontFamilyOf(source.primitive).sans.native};`);
  lines.push("}");
  lines.push("");
  lines.push("/* RN tabular-nums — font-variant-numeric 을 옮기지 않으므로 RN 선언을 더한다(구현 노트 F-21). */");
  lines.push(".tabular-nums {");
  lines.push("  -rn-font-variant: tabular-nums;");
  lines.push("}");
  lines.push("");
  lines.push('@source "../dist";');
  lines.push("");
  return lines.join("\n");
}

// -------------------------------------------------------------- TS 생성

function literal(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function brandTs(source: TokenSource, brand: Brand): string {
  const colors: Record<Mode, Record<string, Record<string, string>>> = { light: {}, dark: {} };
  for (const mode of MODES) {
    for (const { group, name } of semanticEntries(source, brand, mode)) {
      const bucket = (colors[mode][group] ??= {});
      bucket[name] = semanticJsValue(source, brand, mode, group, name);
    }
  }
  return [
    TS_HEADER,
    "",
    "/**",
    ` * 브랜드 ${brand} 의 semantic 색 해석값 (RN 런타임용, AC-4).`,
    " * 별칭(fg.danger · border.focus)도 여기서는 해석값이다 — RN 은 var() 를 쓸 수 없다.",
    " * 소비자 로컬 오버라이드(C-5b)는 이 객체에 닿지 않는다(알려진 동작 11).",
    " */",
    `export const colors = ${literal(colors)} as const;`,
    "",
  ].join("\n");
}

function valuesTs(source: TokenSource): string {
  const spacing = scaleRecord(source.primitive, "spacing");
  const radius = scaleRecord(source.primitive, "radius");
  const shadow = scaleRecord(source.primitive, "shadow");
  const text = textSteps(source.shared);
  const fontFamily = fontFamilyOf(source.primitive);
  const component = componentRecipes(source);

  const twMergeConfig = {
    // Tailwind 정적 색(inherit · current · transparent)은 --color-* 리셋과 무관하게 생성된다. 키에 없으면
    // twMerge 가 border-transparent 를 색 그룹으로 보지 않아 border-danger 와 병합하지 않고, CSS 순서상
    // transparent 가 이긴다(R26 입력 칸 invalid 테두리가 사라졌다).
    color: [
      ...semanticEntries(source, "base", "light").map(({ group, name }) => colorKey(group, name)),
      ...STATIC_COLORS,
    ],
    spacing: Object.keys(spacing),
    radius: Object.keys(radius),
    shadow: Object.keys(shadow),
    text: [...TEXT_STEPS],
  };

  const semanticVariables: Record<string, string> = {};
  for (const { group, name } of semanticEntries(source, "base", "light")) {
    semanticVariables[colorKey(group, name)] = rootVariable(group, name);
  }

  return [
    TS_HEADER,
    "",
    "/** 간격 스케일. 희소 열거이며 열거 밖 키는 클래스가 없다(C-7a). */",
    `export const spacing = ${literal(spacing)} as const;`,
    "",
    "/** 모서리 반경 스케일. */",
    `export const radius = ${literal(radius)} as const;`,
    "",
    "/** 그림자 스케일. */",
    `export const shadow = ${literal(shadow)} as const;`,
    "",
    "/** 타이포 스텝 해석값. RN Text 가 클래스 대신 style 로 넣어야 할 때 읽는다(C-19 (5) 분기). */",
    `export const text = ${literal(text)} as const;`,
    "",
    "/** 폰트 패밀리. 폰트 파일은 동봉하지 않는다 — 로딩은 소비 프로젝트 책임(C-7b, AC-6c). */",
    `export const fontFamily = ${literal(fontFamily)} as const;`,
    "",
    "/**",
    " * tailwind-merge 설정. 웹·RN 이 extendTailwindMerge({ override: { theme: twMergeConfig } }) 로 쓴다.",
    " * override 여야 한다 — extend 는 기본 검증자에 concat 이라 spacing 의 기본 isNumber 가 남아",
    ' * cn("mt-4", "mt-5") 가 mt-5 로 접히고 DS 기본 여백이 사라진다(plan v2 F-4).',
    " */",
    `export const twMergeConfig = ${literal(twMergeConfig)};`,
    "",
    "/** @theme inline 색 키 → :root 변수 이름. C-5b 공개 계약의 실체다. */",
    `export const semanticVariables = ${literal(semanticVariables)} as const;`,
    "",
    "/**",
    " * component 계층 recipe. 값은 스케일 키이며 클래스 조립은 컴포넌트 구현이 한다",
    " * (정적 리터럴이어야 @source 스캔이 잡는다 — C-4 (2)).",
    " */",
    `export const component = ${literal(component)} as const;`,
    "",
  ].join("\n");
}

export type Output = { path: string; contents: string };

/**
 * 산출물 전량. `path` 는 packages/ 기준 상대 경로다.
 * 순서가 고정이라 두 번 호출해도 같은 배열이 나온다(T-T2 결정성).
 */
export function buildOutputs(tokensDir: string): Output[] {
  const source = loadSource(tokensDir);

  // 브랜드 간 semantic 키 집합이 같아야 브랜드 교체가 색만 바꾼다(AC-6a).
  const signature = (brand: Brand): string =>
    MODES.map((mode) =>
      semanticEntries(source, brand, mode)
        .map((entry) => `${entry.group}.${entry.name}`)
        .join(","),
    ).join("|");
  for (const brand of BRANDS) {
    if (signature(brand) !== signature("base")) {
      throw new Error(`semantic 키 집합이 base 와 다르다: ${brand}`);
    }
  }

  const outputs: Output[] = [];
  for (const brand of BRANDS) {
    outputs.push({ path: `tokens/themes/${brand}.css`, contents: tokenCss(source, brand) });
    outputs.push({ path: `web/themes/${brand}.css`, contents: webWrapperCss(brand) });
    outputs.push({ path: `native/themes/${brand}.css`, contents: nativeWrapperCss(source, brand) });
    outputs.push({ path: `tokens/src/brands/${brand}.ts`, contents: brandTs(source, brand) });
  }
  outputs.push({ path: "tokens/src/generated/values.ts", contents: valuesTs(source) });
  return outputs;
}
