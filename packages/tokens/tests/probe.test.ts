/**
 * T-T4 probe 컴파일 · 브랜드 diff (AC-6 · AC-6a · AC-6b).
 *
 * 토큰 CSS 를 Tailwind 로 실제 컴파일해 "어떤 클래스가 생성되지 않는지"를 확인한다.
 * lint 가 아니라 구조로 막는다는 C-7 의 주장을 검증하는 자리다.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "@tailwindcss/node";
import { describe, expect, it } from "vitest";

const tokensRoot = dirname(dirname(fileURLToPath(import.meta.url)));

function tokenCss(brand: "base" | "bakery"): string {
  return readFileSync(join(tokensRoot, "themes", `${brand}.css`), "utf8");
}

/** 토큰 CSS 를 Tailwind 로 컴파일하고 주어진 후보 클래스로 유틸리티를 만든다. */
async function build(candidates: string[], options: { css?: string; append?: string } = {}): Promise<string> {
  const source = `@import "tailwindcss";\n${options.css ?? tokenCss("base")}\n${options.append ?? ""}`;
  const compiler = await compile(source, { base: tokensRoot, onDependency: () => {} });
  return compiler.build(candidates);
}

/** 유틸리티 클래스 규칙이 출력에 있는가. `.mt-4 {` 처럼 셀렉터로 찾는다. */
function hasRule(css: string, candidate: string): boolean {
  const escaped = candidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\.${escaped}\\s*[,{]`).test(css);
}

describe("AC-6 primitive 클래스가 생성되지 않는다", () => {
  it("primitive 색 클래스 3종이 출력에 없다", async () => {
    const candidates = ["bg-red-500", "bg-blue-500", "text-gray-900"];
    const css = await build(candidates);
    for (const candidate of candidates) expect(hasRule(css, candidate), candidate).toBe(false);
  });

  it("semantic 색 클래스는 생성된다 (대조군)", async () => {
    const css = await build(["bg-brand", "text-fg-muted", "border-border-focus", "bg-info-subtle", "text-fg-success", "border-border-surface"]);
    expect(hasRule(css, "bg-brand")).toBe(true);
    expect(hasRule(css, "text-fg-muted")).toBe(true);
    expect(hasRule(css, "border-border-focus")).toBe(true);
    expect(hasRule(css, "bg-info-subtle")).toBe(true);
    expect(hasRule(css, "text-fg-success")).toBe(true);
    expect(hasRule(css, "border-border-surface")).toBe(true);
  });
});

describe("AC-6b 열거 밖 어휘가 무효다 (알려진 동작 1)", () => {
  it("mt-5 · mt-17 · w-28 · font-medium · text-base 가 출력에 없다", async () => {
    const candidates = ["mt-5", "mt-17", "w-28", "font-medium", "text-base"];
    const css = await build(candidates);
    for (const candidate of candidates) expect(hasRule(css, candidate), candidate).toBe(false);
  });

  it("R28 새 키가 생성된다", async () => {
    const candidates = ["h-64", "max-h-96", "w-80", "p-32", "text-3xl", "text-4xl", "font-normal", "font-semibold", "font-bold"];
    const css = await build(candidates);
    for (const candidate of candidates) expect(hasRule(css, candidate), candidate).toBe(true);
    expect(css).toContain("font-weight: var(--font-weight-semibold)");
    expect(css).toContain("--font-weight-semibold: 600");
  });

  it("웹 font-weight 는 --tw-font-weight 가 스텝 기본값보다 앞선다 (decisions-r28 7)", async () => {
    const css = await build(["text-lg", "font-bold"]);
    expect(css).toMatch(/\.text-lg\s*\{[^}]*font-weight: var\(--tw-font-weight, var\(--text-lg--font-weight\)\)/);
  });

  it("열거 안 어휘는 생성된다 — mt-4 · mt-6 · bg-brand · text-md · rounded-md", async () => {
    const candidates = ["mt-4", "mt-6", "bg-brand", "text-md", "rounded-md"];
    const css = await build(candidates);
    for (const candidate of candidates) expect(hasRule(css, candidate), candidate).toBe(true);
  });

  it("정적 유틸리티는 리셋과 무관하게 남는다 (C-6 유지 목록)", async () => {
    const css = await build(["flex", "w-full", "max-w-md", "border", "border-transparent"]);
    for (const candidate of ["flex", "w-full", "max-w-md", "border", "border-transparent"]) {
      expect(hasRule(css, candidate), candidate).toBe(true);
    }
  });

  it("단독 --spacing: initial 이 없어도 mt-5 는 안 나온다 (tailwindcss 4.3.3 관측, plan v2 F-26)", async () => {
    const css = await build(["mt-5", "mt-4"], {
      css: tokenCss("base").replace("  --spacing: initial;\n", ""),
    });
    expect(hasRule(css, "mt-5")).toBe(false);
    expect(hasRule(css, "mt-4")).toBe(true);
  });

  it("font-mono 는 DS 토큰 --font-mono 를 참조한다 (R28)", async () => {
    const css = await build(["font-mono"]);
    expect(css).toMatch(/\.font-mono\s*\{[^}]*font-family: var\(--font-mono\)/);
    expect(tokenCss("base")).toContain(
      '--font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;',
    );
  });

  it("font-serif 는 Tailwind 기본값으로 남는다 (알려진 동작 28, plan §9 S-7)", async () => {
    const css = await build(["font-serif"]);
    expect(hasRule(css, "font-serif")).toBe(true);
  });
});

describe("R27 Prose 임의 변형이 특이성 0 선택자를 낸다 (decisions-r27 13, plan D-34)", () => {
  it("[:where(&)…] 변형은 선택자가 :where( 로 시작하고 값을 담는다", async () => {
    const css = await build(["[:where(&)_h2]:text-xl", "[:where(&)>*+*]:mt-4", "[:where(&)_:not(pre)>code]:font-mono"]);
    // 클래스 이름에 이스케이프된 `)` 가 있어 선택자 끝은 `\)` 가 아닌 `) ` 로 잡는다. 규칙 줄은 `:where(` 로 시작해야 한다.
    expect(css).toMatch(/^\s*:where\(\.[^\n{]*\) h2 \{\s*font-size: var\(--text-xl\)/m);
    expect(css).toMatch(/^\s*:where\(\.[^\n{]*\) > \* \+ \* \{\s*margin-top: var\(--spacing-4\)/m);
    expect(css).toMatch(/^\s*:where\(\.[^\n{]*\) :not\(pre\) > code \{\s*font-family: var\(--font-mono\)/m);
  });
});

describe("R27 Tabs 겹침 유틸리티가 리셋과 무관하게 남는다 (decisions-r27 6)", () => {
  it("-mb-px 는 생성된다 (음수 px 는 정적 값)", async () => {
    const css = await build(["-mb-px"]);
    expect(hasRule(css, "-mb-px")).toBe(true);
    expect(css).toMatch(/\.-mb-px\s*\{\s*margin-bottom: -1px/);
  });
});

describe("AC-6a 브랜드 교체가 semantic 색만 바꾼다", () => {
  it("base 와 bakery 의 차이가 semantic 색 선언 줄뿐이다", () => {
    const baseLines = tokenCss("base").split("\n");
    const bakeryLines = tokenCss("bakery").split("\n");
    expect(bakeryLines).toHaveLength(baseLines.length);

    const changed = baseLines
      .map((line, index) => [line, bakeryLines[index]!] as const)
      .filter(([left, right]) => left !== right);

    expect(changed.length).toBeGreaterThan(0);
    for (const [left, right] of changed) {
      // 브랜드 이름이 적힌 헤더 주석 1줄은 예외다.
      if (left.startsWith("/* @eeennsu/tokens — brand:")) continue;
      for (const line of [left, right]) {
        expect(line, `semantic 색이 아닌 줄이 바뀌었다: ${line}`).toMatch(
          /^\s+--(bg|fg|border)-[a-z-]+: .+;$/,
        );
      }
    }
  });

  it("primitive 블록은 두 브랜드가 동일하다", () => {
    const primitiveBlock = (brand: "base" | "bakery") =>
      tokenCss(brand)
        .split("\n")
        .filter((line) => line.trim().startsWith("--ds-"));
    expect(primitiveBlock("bakery")).toEqual(primitiveBlock("base"));
    expect(primitiveBlock("base").length).toBe(96); // 8램프 x 11단 + 반 단계 3 + white + black + transparent + 검정 알파 2 (R28)
  });
});

describe("R23 요구 (a) 비-inline @theme 변수도 소비자 :root 재선언으로 덮인다", () => {
  it("rounded-md · rounded-xl · font-sans 가 var() 를 참조하므로 뒤에 온 :root 선언이 이긴다 (C-5c 계약)", async () => {
    const append = ":root { --radius-md: 2px; --radius-xl: 2px; --font-sans: ProbeFont; }";
    const css = await build(["rounded-md", "rounded-xl", "font-sans"], { append });

    expect(css).toMatch(/\.rounded-xl\s*\{[^}]*var\(--radius-xl\)/);
    expect(css).toMatch(/\.rounded-md\s*\{[^}]*var\(--radius-md\)/);
    expect(css).toMatch(/\.font-sans\s*\{[^}]*var\(--font-sans\)/);
    // 소비자 선언이 출력 뒤쪽에 그대로 남아 last-wins 로 이긴다.
    expect(css.lastIndexOf("--radius-md: 2px")).toBeGreaterThan(css.indexOf(".rounded-md"));
    expect(css).toContain("--font-sans: ProbeFont");
  });

  it("semantic 색은 @theme inline 이라 같은 재선언이 클래스까지 전파된다 (C-5b)", async () => {
    const css = await build(["bg-brand"], { append: ":root { --bg-brand: oklch(50% 0.2 30); }" });
    expect(css).toMatch(/\.bg-brand\s*\{[^}]*var\(--bg-brand\)/);
    expect(css).toContain("--bg-brand: oklch(50% 0.2 30)");
  });
});
