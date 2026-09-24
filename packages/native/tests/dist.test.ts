/**
 * T-N4 dist 산출물 제약 (C-4 (2) · AC-18).
 *
 * native 래퍼도 `@source "../dist"` 로 스캔하므로 웹과 같은 제약이 걸린다(plan v2 F-19) —
 * 클래스가 템플릿 리터럴로 조립되면 Tailwind 가 찾지 못한다.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(packageRoot, "dist");
const built = existsSync(join(dist, "index.js"));

describe.skipIf(!built)("dist 검사", () => {
  it("템플릿 리터럴로 클래스를 조립한 곳이 없다", () => {
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

  it("게이트 스텁이 남아 있지 않다 (T-N1 이 실제 dist 로 대체한다)", () => {
    expect(existsSync(join(dist, "_gate-stub.js"))).toBe(false);
  });

  it("lucide 목록 파일을 import 하지 않는다 — Metro 가 아이콘 전체를 번들에 넣는다(N-17, F-22)", () => {
    const icon = readFileSync(join(dist, "icon.js"), "utf8");
    expect(icon).not.toMatch(/from "lucide-react-native";/);
    expect(icon).toMatch(/from "lucide-react-native\/icons\/check";/);
  });

  it('"use client" 를 쓰지 않는다 — RN 에는 서버 컴포넌트 경계가 없다', () => {
    for (const file of readdirSync(dist).filter((name) => name.endsWith(".js"))) {
      expect(readFileSync(join(dist, file), "utf8"), file).not.toContain('"use client"');
    }
  });
});

it("dist 가 있어야 위 검사가 의미를 갖는다", () => {
  expect(built, "pnpm --filter @eeennsu/native build 를 먼저 돌린다").toBe(true);
});
