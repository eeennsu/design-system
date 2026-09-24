/**
 * T-T1 토큰 소스 스키마 (AC-1 · AC-2 · AC-6c).
 *
 * 세 계층이 디렉터리로 갈리고, 참조 방향이 primitive ← semantic / component 한 방향이며,
 * 브랜드 파일이 같은 semantic 키 집합을 갖는지 검사한다.
 */
import { readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  ALLOWED_TYPES,
  BRANDS,
  MODES,
  SEMANTIC_GROUPS,
  type Json,
  getNode,
  isRecord,
  isToken,
  loadDir,
  loadSource,
  readJson,
  refTarget,
  resolveToken,
  semanticEntries,
} from "../scripts/build-outputs.js";

const tokensRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const packagesRoot = dirname(tokensRoot);
const tokensDir = join(tokensRoot, "src", "tokens");
const source = loadSource(tokensDir);

/** 트리의 모든 토큰을 [경로, 노드] 로 펼친다. */
function walkTokens(node: Json, path: string[] = []): Array<[string, Json]> {
  const out: Array<[string, Json]> = [];
  for (const key of Object.keys(node)) {
    if (key.startsWith("$")) continue;
    const child = node[key];
    if (!isRecord(child)) continue;
    if (isToken(child)) out.push([[...path, key].join("."), child]);
    else out.push(...walkTokens(child, [...path, key]));
  }
  return out;
}

describe("AC-2 3계층 구분", () => {
  it("계층이 디렉터리로 갈린다", () => {
    expect(readdirSync(tokensDir).sort()).toEqual(["component", "primitive", "semantic"]);
  });

  it("각 파일의 루트 키가 자기 계층 이름이다", () => {
    for (const layer of ["primitive", "semantic", "component"] as const) {
      for (const file of readdirSync(join(tokensDir, layer)).filter((n) => n.endsWith(".json"))) {
        const json = readJson(join(tokensDir, layer, file));
        const roots = Object.keys(json).filter((key) => !key.startsWith("$"));
        expect(roots, `${layer}/${file}`).toEqual([layer]);
      }
    }
  });

  it("primitive 는 다른 계층을 참조하지 않는다", () => {
    for (const [path, node] of walkTokens(source.primitive)) {
      const target = refTarget(node["$value"]);
      expect(target, `${path} 가 참조를 갖는다`).toBeNull();
    }
  });

  it("component 는 semantic 을 참조하지 않는다 (색은 클래스로 붙는다)", () => {
    for (const [path, node] of walkTokens(source.component)) {
      const value = node["$value"];
      const targets = isRecord(value)
        ? Object.values(value).map(refTarget)
        : [refTarget(value)];
      for (const target of targets) {
        if (target === null) continue;
        expect(target.startsWith("semantic."), `${path} -> ${target}`).toBe(false);
      }
    }
  });
});

describe("AC-1 단일 소스와 참조 해석", () => {
  it("모든 참조가 해석되고 $type 이 허용 목록 안이다", () => {
    for (const brand of BRANDS) {
      const tree = source.trees.get(brand)!;
      for (const [path, node] of walkTokens(tree)) {
        expect(() => resolveToken(tree, path), `${brand}: ${path}`).not.toThrow();
        const declared = node["$type"];
        if (typeof declared === "string") expect(ALLOWED_TYPES.has(declared), path).toBe(true);
      }
    }
  });

  it("semantic 값은 primitive 참조이거나 같은 모드의 semantic 별칭뿐이다", () => {
    for (const brand of BRANDS) {
      const tree = source.trees.get(brand)!;
      for (const mode of MODES) {
        for (const { group, name } of semanticEntries(source, brand, mode)) {
          const path = `semantic.${mode}.${group}.${name}`;
          const node = getNode(tree, path);
          const target = refTarget(isRecord(node) ? node["$value"] : undefined);
          expect(target, `${brand} ${path} 가 리터럴이다`).not.toBeNull();
          const allowed = target!.startsWith("primitive.color.") || target!.startsWith(`semantic.${mode}.`);
          expect(allowed, `${brand} ${path} -> ${target}`).toBe(true);
        }
      }
    }
  });

  it("별칭은 2개다 — fg.danger 와 border.focus (plan D-3)", () => {
    for (const brand of BRANDS) {
      const tree = source.trees.get(brand)!;
      for (const mode of MODES) {
        const aliases = semanticEntries(source, brand, mode)
          .filter(({ group, name }) => {
            const node = getNode(tree, `semantic.${mode}.${group}.${name}`);
            return refTarget(isRecord(node) ? node["$value"] : undefined)?.startsWith("semantic.") ?? false;
          })
          .map(({ group, name }) => `${group}.${name}`);
        expect(aliases).toEqual(["fg.danger", "border.focus"]);
      }
    }
  });

  it("브랜드 간 semantic 키 집합이 같다 (AC-6a 전제)", () => {
    const signature = (brand: (typeof BRANDS)[number]) =>
      MODES.map((mode) =>
        semanticEntries(source, brand, mode).map((entry) => `${entry.group}.${entry.name}`),
      );
    expect(signature("bakery")).toEqual(signature("base"));
  });

  it("semantic 색은 그룹 3개 · 16개다", () => {
    const entries = semanticEntries(source, "base", "light");
    expect(entries).toHaveLength(16);
    expect([...new Set(entries.map((entry) => entry.group))]).toEqual([...SEMANTIC_GROUPS]);
  });
});

describe("AC-6c fontFamily 토큰", () => {
  it("fontFamily.sans 가 웹 스택과 RN 이름을 함께 갖는다", () => {
    const node = getNode(source.primitive, "primitive.typography.fontFamily.sans");
    expect(isToken(node)).toBe(true);
    const token = node as Json;
    expect(Array.isArray(token["$value"])).toBe(true);
    expect((token["$value"] as unknown[])[0]).toBe("Pretendard Variable");
    expect((token["$extensions"] as Json)["ds.native"]).toBe("Pretendard");
  });

  it("레포 패키지에 폰트 파일이 없다 (로딩은 소비 프로젝트 책임)", () => {
    const fontExtensions = [".woff", ".woff2", ".ttf", ".otf", ".eot"];
    const found: string[] = [];
    const walk = (dir: string): void => {
      for (const entry of readdirSync(dir)) {
        if (entry === "node_modules" || entry === ".git") continue;
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) walk(full);
        else if (fontExtensions.some((extension) => entry.toLowerCase().endsWith(extension))) found.push(full);
      }
    };
    walk(packagesRoot);
    expect(found).toEqual([]);
  });
});

describe("component 계층 인벤토리", () => {
  it("plan §3.8 의 10개 컴포넌트와 Chip(구현 노트 N-17)이 있다", () => {
    const root = getNode(loadDir(join(tokensDir, "component")), "component");
    expect(Object.keys(root as Json).sort()).toEqual([
      "badge",
      "button",
      "card",
      "chip",
      "dialog",
      "drawer",
      "icon",
      "input",
      "text",
      "textarea",
      "tooltip",
    ]);
  });
});
