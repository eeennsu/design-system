/**
 * T-T2 빌드 산출물 (AC-3 웹 절 · AC-4 · AC-5).
 *
 * - 커밋된 산출물이 지금 소스로 다시 만든 것과 같은가 (결정성 · 수동 편집 금지)
 * - 래퍼 2종이 같은 토큰 파일을 import 하는가 (AC-3)
 * - semantic 한 줄을 바꾸면 CSS 변수와 RN JS 객체가 함께 바뀌는가 (AC-5)
 */
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
import { buildOutputs } from "../scripts/build-outputs.js";
import { component } from "../src/generated/values.js";

const tokensRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const packagesRoot = dirname(tokensRoot);
const tokensDir = join(tokensRoot, "src", "tokens");

const outputs = buildOutputs(tokensDir);
const output = (path: string): string => {
  const found = outputs.find((entry) => entry.path === path);
  if (!found) throw new Error(`산출물 없음: ${path}`);
  return found.contents;
};

describe("산출물 목록", () => {
  it("브랜드당 4개 + 공통 1개 = 9개다", () => {
    expect(outputs.map((entry) => entry.path)).toEqual([
      "tokens/themes/base.css",
      "web/themes/base.css",
      "native/themes/base.css",
      "tokens/src/brands/base.ts",
      "tokens/themes/bakery.css",
      "web/themes/bakery.css",
      "native/themes/bakery.css",
      "tokens/src/brands/bakery.ts",
      "tokens/src/generated/values.ts",
    ]);
  });

  // 스냅샷 대상은 커밋된 산출물 자체다 — 별도 __snapshots__ 사본을 두면 같은 내용이 세 곳에 생긴다.
  // 토큰 CSS 2개 + JS 3개를 파일 스냅샷으로 고정한다(T-T2 완료 조건).
  const snapshotted = [
    "tokens/themes/base.css",
    "tokens/themes/bakery.css",
    "tokens/src/brands/base.ts",
    "tokens/src/brands/bakery.ts",
    "tokens/src/generated/values.ts",
  ];

  for (const path of snapshotted) {
    it(`스냅샷: ${path}`, async () => {
      await expect(output(path)).toMatchFileSnapshot(join(packagesRoot, path));
    });
  }

  it("래퍼 4개도 커밋된 파일과 같다 (두 번 실행 diff 0)", () => {
    for (const { path, contents } of outputs.filter((entry) => !snapshotted.includes(entry.path))) {
      const onDisk = readFileSync(join(packagesRoot, path), "utf8");
      expect(onDisk, `${path} 가 소스와 어긋난다 — pnpm --filter @eeennsu/tokens build`).toBe(contents);
    }
  });
});

describe("AC-3 래퍼가 같은 토큰 파일을 import 한다", () => {
  it("web 래퍼: tailwindcss + 토큰 + dark 변형 + @source", () => {
    const css = output("web/themes/base.css");
    expect(css).toContain('@import "tailwindcss";');
    expect(css).toContain('@import "@eeennsu/tokens/themes/base.css";');
    expect(css).toContain("@custom-variant dark {");
    expect(css).toContain("&:where(.dark, .dark *) { @slot; }");
    expect(css).toContain("&:where(:not(.light, .light *)) { @slot; }");
    expect(css).toContain('@source "../dist";');
  });

  it("native 래퍼: 같은 토큰 파일. @custom-variant 는 넣지 않는다 (plan v2 F-21)", () => {
    const css = output("native/themes/base.css");
    expect(css).toContain('@import "@eeennsu/tokens/themes/base.css";');
    expect(css).toContain('@source "../dist";');
    expect(css).not.toMatch(/^@custom-variant/m); // 주석에는 이유로 남아 있다
  });

  it("브랜드마다 자기 토큰 파일을 가리킨다", () => {
    expect(output("web/themes/bakery.css")).toContain('@import "@eeennsu/tokens/themes/bakery.css";');
    expect(output("native/themes/bakery.css")).toContain('@import "@eeennsu/tokens/themes/bakery.css";');
  });
});

describe("토큰 CSS 구조 (§3.11)", () => {
  const css = output("tokens/themes/base.css");

  it("다크를 두 셀렉터에 같은 값으로 낸다 (C-20)", () => {
    const darkClass = /^\.dark \{\n([\s\S]*?)^\}/m.exec(css)?.[1] ?? "";
    const darkMedia = /:root:not\(\.light\) \{\n([\s\S]*?)^  \}/m.exec(css)?.[1] ?? "";
    expect(darkClass.trim()).not.toBe("");
    expect(darkMedia.replace(/^ {2}/gm, "").trim()).toBe(darkClass.trim());
  });

  it("레이어를 쓰지 않는다 (소비자 무레이어 :root 재선언이 이겨야 한다 — C-5b)", () => {
    expect(css).not.toContain("@layer");
  });

  it("네임스페이스 리셋이 C-6 목록 그대로다", () => {
    for (const reset of [
      "--color-*: initial;",
      "--spacing-*: initial;",
      "--spacing: initial;",
      "--radius-*: initial;",
      "--shadow-*: initial;",
      "--text-*: initial;",
      "--font-weight-*: initial;",
    ]) {
      expect(css).toContain(reset);
    }
    // 패밀리는 리셋하지 않고 덮어쓴다(C-6). --font-mono · --font-serif 는 Tailwind 기본이 남는다(§9 S-7).
    expect(css).not.toContain("--font-*: initial;");
    expect(css).toContain("--font-sans: ");
  });

  it("inline 은 색 16개뿐이다 (§3.7)", () => {
    const inline = /@theme inline \{\n([\s\S]*?)^\}/m.exec(css)?.[1] ?? "";
    const lines = inline.trim().split("\n");
    expect(lines).toHaveLength(16);
    for (const line of lines) expect(line.trim()).toMatch(/^--color-[a-z-]+: var\(--(bg|fg|border)-[a-z-]+\);$/);
  });

  it("타이포 스텝을 복합 폰트 변수 3종으로 낸다 (C-6)", () => {
    expect(css).toContain("--text-xl: 20px;");
    expect(css).toContain("--text-xl--line-height: 28px;");
    expect(css).toContain("--text-xl--font-weight: 600;");
  });

  it("별칭 2개만 var() 로 남는다 (plan D-3)", () => {
    expect(css).toContain("--fg-danger: var(--bg-danger);");
    expect(css).toContain("--border-focus: var(--bg-brand);");
    const varRefs = css.match(/^\s+--(bg|fg|border)-[a-z-]+: var\(/gm) ?? [];
    expect(varRefs).toHaveLength(6); // 별칭 2개 x (:root · .dark · @media)
  });
});

describe("AC-4 RN JS 객체", () => {
  it("브랜드 파일이 light · dark 해석값을 갖는다", () => {
    const ts = output("tokens/src/brands/base.ts");
    expect(ts).toContain('"brand": "oklch(54.6% 0.245 262.881)"'); // blue-600
    expect(ts).toContain('"danger": "oklch(57.7% 0.245 27.325)"'); // red-600
    expect(ts).not.toContain("var(--"); // RN 은 var() 를 쓸 수 없다
  });

  it("bakery 는 brand 가 amber 다", () => {
    expect(output("tokens/src/brands/bakery.ts")).toContain('"brand": "oklch(66.6% 0.179 58.318)"');
  });
});

describe("component recipe 가 plan §3.8 표와 같다", () => {
  it("컨트롤 3종 크기", () => {
    expect(component.button).toEqual({
      sm: { paddingX: "3", paddingY: "1", text: "sm", radius: "md", gap: "1" },
      md: { paddingX: "4", paddingY: "2", text: "md", radius: "md", gap: "2" },
      lg: { paddingX: "6", paddingY: "3", text: "lg", radius: "lg", gap: "2" },
    });
    expect(component.input).toEqual({
      sm: { paddingX: "3", paddingY: "1", text: "sm", radius: "md" },
      md: { paddingX: "3", paddingY: "2", text: "md", radius: "md" },
      lg: { paddingX: "4", paddingY: "3", text: "lg", radius: "md" },
    });
    expect(component.textarea).toEqual({ rows: { sm: 3, md: 5, lg: 8 } });
  });

  it("나머지 컴포넌트", () => {
    expect(component.badge).toEqual({
      sm: { paddingX: "2", paddingY: "0", text: "sm", radius: "full" },
      md: { paddingX: "3", paddingY: "1", text: "sm", radius: "full" },
    });
    expect(component.icon).toEqual({ size: { sm: 16, md: 20, lg: 24 } });
    expect(component.card).toEqual({ padding: "4", radius: "lg", shadow: "sm" });
    expect(component.dialog).toEqual({ padding: "6", radius: "lg", shadow: "lg", maxWidth: "max-w-md" });
    expect(component.drawer).toEqual({ padding: "6", width: "max-w-sm w-full" });
    expect(component.tooltip).toEqual({ paddingX: "2", paddingY: "1", text: "sm", radius: "sm" });
  });

  it("컨트롤 높이는 2 x paddingY + lineHeight + 2 = 30 / 42 / 54 다 (plan D-6)", () => {
    const spacingPx = { "0": 0, "1": 4, "2": 8, "3": 12, "4": 16, "6": 24 } as const;
    const linePx = { sm: 20, md: 24, lg: 28 } as const;
    const height = (recipe: { paddingY: string; text: string }): number =>
      2 * spacingPx[recipe.paddingY as keyof typeof spacingPx] + linePx[recipe.text as keyof typeof linePx] + 2;
    expect([height(component.button.sm), height(component.button.md), height(component.button.lg)]).toEqual([
      30, 42, 54,
    ]);
    expect([height(component.input.sm), height(component.input.md), height(component.input.lg)]).toEqual([
      30, 42, 54,
    ]);
  });
});

describe("AC-5 semantic 한 줄 변경이 CSS 와 JS 에 동시 전파", () => {
  const scratch = mkdtempSync(join(tmpdir(), "ds-tokens-"));
  afterAll(() => rmSync(scratch, { recursive: true, force: true }));

  it("bg.brand 를 red.600 으로 바꾸면 두 산출물이 함께 바뀐다", () => {
    cpSync(tokensDir, scratch, { recursive: true });
    const semanticPath = join(scratch, "semantic", "base.json");
    const before = readFileSync(semanticPath, "utf8");
    writeFileSync(
      semanticPath,
      before.replace('"{primitive.color.blue.600}"', '"{primitive.color.red.600}"'),
      "utf8",
    );

    const changed = buildOutputs(scratch);
    const css = changed.find((entry) => entry.path === "tokens/themes/base.css")!.contents;
    const js = changed.find((entry) => entry.path === "tokens/src/brands/base.ts")!.contents;
    const red600 = "oklch(57.7% 0.245 27.325)";

    expect(css).toContain(`--bg-brand: ${red600};`);
    expect(js).toContain(`"brand": "${red600}"`);
    // 소스 한 줄만 바뀌었으므로 원본 값은 light brand 자리에서 사라진다.
    expect(css).not.toContain("--bg-brand: oklch(54.6% 0.245 262.881);");
  });
});
