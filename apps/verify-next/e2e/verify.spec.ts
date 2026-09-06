/**
 * T-V1 (AC-16 · AC-11 웹 통합 계층 · AC-19 (b) · AC-24 · AC-26 웹).
 *
 * 이 앱은 C-5b 로컬 오버라이드를 쓰는 소비 프로젝트다 — `--bg-brand` 만 앱 전용 값으로
 * 재선언했고 나머지 semantic 변수는 브랜드 `base` 그대로다.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { colors } from "@eeennsu/tokens/brands/base";
import { expect, test } from "@playwright/test";
import { backgroundRgba, expectDifferentColor, expectSameColor, toRgba } from "./color.js";

// Playwright 는 앱 디렉터리에서 돈다(playwright.config.ts 기준).
const appRoot = process.cwd();

/** app/(app)/globals.css 가 재선언한 앱 전용 브랜드 값. */
const appBrand = { light: "oklch(62% 0.19 145)", dark: "oklch(72% 0.16 145)" };

test.describe("AC-16 부트스트랩", () => {
  test("로그인 화면이 DS 컴포넌트만으로 렌더된다", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();
    await expect(page.locator("form")).toHaveCount(1);
    await expect(page.getByLabel("이메일")).toHaveAttribute("type", "email");
    await expect(page.getByLabel("이메일")).toHaveAttribute("autocomplete", "email");
    await expect(page.getByLabel("비밀번호")).toHaveAttribute("type", "password");
    await expect(page.getByLabel("비밀번호")).toHaveAttribute("autocomplete", "current-password");
    await expect(page.getByText("이메일 또는 비밀번호가 올바르지 않습니다")).toBeVisible();
  });

  test("Button 은 submit 이 아니라 button 이다 — Enter 는 무동작이다 (C-21)", async ({ page }) => {
    await page.goto("/");
    for (const name of ["로그인", "기본", "변경"]) {
      await expect(page.getByRole("button", { name })).toHaveAttribute("type", "button");
    }
  });
});

test.describe("AC-26 (c) 소비자 설정은 CSS 선언뿐이다", () => {
  test("tailwind.config 가 없다", () => {
    for (const name of ["tailwind.config.js", "tailwind.config.ts", "tailwind.config.mjs"]) {
      expect(() => readFileSync(join(appRoot, name), "utf8")).toThrow();
    }
  });

  test("postcss.config.mjs · next.config.ts 가 생성 원본과 diff 0 이다", () => {
    for (const name of ["postcss.config.mjs", "next.config.ts"]) {
      const current = readFileSync(join(appRoot, name), "utf8");
      const original = readFileSync(join(appRoot, "e2e", "fixtures", `${name}.original`), "utf8");
      expect(current, name).toBe(original);
    }
  });
});

test.describe("AC-24 · AC-11 웹 통합 — className 이 그 버튼만 바꾼다", () => {
  test("변경한 버튼만 danger 이고 나머지는 앱 브랜드 그대로다", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");

    const changed = await backgroundRgba(page, "button:has-text('변경')");
    const untouched = await backgroundRgba(page, "button:has-text('기본')");

    expectSameColor(changed, await toRgba(page, colors.light.bg.danger), "변경 버튼");
    expectSameColor(untouched, await toRgba(page, appBrand.light), "기본 버튼");
    expectDifferentColor(changed, untouched);
  });

  test("열거 밖 간격은 DS 기본값을 밀어내지 않는다", async ({ page }) => {
    await page.goto("/");
    // mt-6 은 열거 안이라 실제로 적용된다.
    const marginTop = await page
      .getByRole("button", { name: "변경" })
      .evaluate((element) => getComputedStyle(element).marginTop);
    expect(marginTop).toBe("24px");
  });
});

test.describe("AC-26 (a)(b) 로컬 오버라이드", () => {
  test("재선언한 변수는 앱 값을, 재선언하지 않은 변수는 브랜드 값을 쓴다", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");

    expectSameColor(await backgroundRgba(page, ".bg-brand"), await toRgba(page, appBrand.light), "brand");
    expectSameColor(
      await backgroundRgba(page, ".bg-danger.p-8"),
      await toRgba(page, colors.light.bg.danger),
      "danger",
    );
  });

  test("다크에서도 같은 격리가 유지된다", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");

    expectSameColor(await backgroundRgba(page, ".bg-brand"), await toRgba(page, appBrand.dark), "brand");
    expectSameColor(
      await backgroundRgba(page, ".bg-danger.p-8"),
      await toRgba(page, colors.dark.bg.danger),
      "danger",
    );
  });
});

test.describe("AC-19 (b) 루트 클래스가 OS 보다 우선한다", () => {
  for (const osScheme of ["light", "dark"] as const) {
    for (const rootClass of ["light", "dark"] as const) {
      test(`OS ${osScheme} + 루트 .${rootClass} → ${rootClass} 값`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: osScheme });
        await page.goto("/theme");
        await page.getByRole("button", { name: rootClass === "dark" ? "다크" : "라이트" }).click();
        await expect(page.locator("html")).toHaveClass(new RegExp(`\\b${rootClass}\\b`));

        expectSameColor(await backgroundRgba(page, ".bg-brand"), await toRgba(page, appBrand[rootClass]));
      });
    }
  }

  for (const osScheme of ["light", "dark"] as const) {
    test(`OS ${osScheme} + 루트 클래스 없음 → OS 를 따른다`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: osScheme });
      await page.goto("/");
      await expect(page.locator("html")).not.toHaveClass(/\b(dark|light)\b/);

      expectSameColor(await backgroundRgba(page, ".bg-brand"), await toRgba(page, appBrand[osScheme]));
    });
  }
});

test.describe("AC-26 (d) 회귀 가드 — :root 만 재선언하면 어긋난다", () => {
  test("루트 .dark 에서는 소비자 :root 가 뒤에 와서 이긴다", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/partial");
    await page.evaluate(() => document.documentElement.classList.add("dark"));

    expectSameColor(await backgroundRgba(page, ".bg-brand"), await toRgba(page, appBrand.light));
  });

  test("클래스 없는 OS 다크에서는 DS 의 @media 블록이 이겨 브랜드 다크 값이 나온다", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/partial");

    expectSameColor(await backgroundRgba(page, ".bg-brand"), await toRgba(page, colors.dark.bg.brand));
  });
});
