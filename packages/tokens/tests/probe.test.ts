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
    const css = await build(["bg-brand", "text-fg-muted", "border-border-focus"]);
    expect(hasRule(css, "bg-brand")).toBe(true);
    expect(hasRule(css, "text-fg-muted")).toBe(true);
    expect(hasRule(css, "border-border-focus")).toBe(true);
  });
});

describe("AC-6b 열거 밖 어휘가 무효다 (알려진 동작 1)", () => {
  it("mt-5 · mt-17 · w-64 · font-bold · text-base 가 출력에 없다", async () => {
    const candidates = ["mt-5", "mt-17", "w-64", "font-bold", "text-base"];
    const css = await build(candidates);
    for (const candidate of candidates) expect(hasRule(css, candidate), candidate).toBe(false);
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
    expect(primitiveBlock("base").length).toBe(48); // 4램프 x 11단 + white + black + 검정 알파 2
  });
});

describe("R23 요구 (a) 비-inline @theme 변수도 소비자 :root 재선언으로 덮인다", () => {
  it("rounded-md · font-sans 가 var() 를 참조하므로 뒤에 온 :root 선언이 이긴다", async () => {
    const append = ":root { --radius-md: 2px; --font-sans: ProbeFont; }";
    const css = await build(["rounded-md", "font-sans"], { append });

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
