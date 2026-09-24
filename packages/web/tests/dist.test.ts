/**
 * T-W8 (4) dist 산출물 제약 (C-4 · AC-18).
 *
 * 번들러를 쓰지 않는 이유가 여기 있다 — 지시어가 보존되고, 클래스가 파일별 정적 문자열로
 * 남아야 web 래퍼의 `@source "../dist"` 스캔이 잡는다.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(packageRoot, "dist");

/** `"use client"` 가 필요한 파일 — 훅·이벤트 핸들러·Base UI 를 쓰는 것들. */
const interactive = [
  "button.js",
  "button-group.js",
  "chip.js",
  "input.js",
  "textarea.js",
  "form.js",
  "tooltip.js",
  "dialog.js",
  "drawer.js",
];

const built = existsSync(join(dist, "index.js"));

describe.skipIf(!built)("dist 검사", () => {
  it("인터랙티브 컴포넌트 첫 줄이 \"use client\" 다", () => {
    for (const file of interactive) {
      const first = readFileSync(join(dist, file), "utf8").split("\n")[0]!.trim();
      expect(first, file).toBe('"use client";');
    }
  });

  it("템플릿 리터럴로 클래스를 조립한 곳이 없다 (C-4 (2))", () => {
    const offenders: string[] = [];
    for (const file of readdirSync(dist).filter((name) => name.endsWith(".js"))) {
      const source = readFileSync(join(dist, file), "utf8");
      if (/`[^`]*\$\{/.test(source)) offenders.push(file);
    }
    expect(offenders).toEqual([]);
  });

  it(".d.ts 가 함께 나온다 (AC-18)", () => {
    const files = readdirSync(dist);
    expect(files).toContain("index.d.ts");
    for (const file of files.filter((name) => name.endsWith(".js"))) {
      expect(files, file).toContain(file.replace(/\.js$/, ".d.ts"));
    }
  });
});

it("dist 가 있어야 위 검사가 의미를 갖는다", () => {
  expect(built, "pnpm --filter @eeennsu/web build 를 먼저 돌린다").toBe(true);
});
