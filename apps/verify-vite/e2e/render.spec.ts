/**
 * T-V2 (AC-17 · AC-19 (a)).
 *
 * Next 검증과 같은 화면이 Vite 에서도 import 한 줄로 렌더되는가(프레임워크 비종속),
 * 그리고 다크모드 코드 0줄로 OS 설정을 따라가는가.
 */
import { colors } from "@eeennsu/tokens/brands/base";
import { expect, test } from "@playwright/test";
import { backgroundRgba, expectSameColor, toRgba } from "./color.js";

test.describe("AC-17 프레임워크 비종속 렌더", () => {
  test("로그인 화면이 DS 컴포넌트만으로 렌더된다", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();
    await expect(page.locator("form")).toHaveCount(1);
    await expect(page.getByLabel("이메일")).toHaveAttribute("autocomplete", "email");
    await expect(page.getByLabel("비밀번호")).toHaveAttribute("autocomplete", "current-password");
    await expect(page.getByRole("button", { name: "로그인" })).toHaveAttribute("type", "button");
  });

  test("소비자 설정은 CSS import 한 줄뿐이다 (C-3)", async ({ page }) => {
    await page.goto("/");
    expectSameColor(
      await backgroundRgba(page, "button:has-text('로그인')"),
      await toRgba(page, colors.light.bg.brand),
    );
  });
});

test.describe("AC-19 (a) 루트 클래스가 없으면 OS 를 따른다", () => {
  test("라이트", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    expectSameColor(await backgroundRgba(page, "#root > div"), await toRgba(page, colors.light.bg.canvas));
  });

  test("다크", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    expectSameColor(await backgroundRgba(page, "#root > div"), await toRgba(page, colors.dark.bg.canvas));
  });

  test("다크에서 primary 버튼도 다크 값이다", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    expectSameColor(
      await backgroundRgba(page, "button:has-text('로그인')"),
      await toRgba(page, colors.dark.bg.brand),
    );
  });
});
