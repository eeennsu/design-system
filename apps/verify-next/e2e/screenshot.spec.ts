import { expect, test } from "@playwright/test";

/**
 * AC-23 수동 비교용 스크린샷. RN(`apps/verify-expo`) 화면과 나란히 놓고
 * 색·간격이 같은지 사람이 본다 — 자동 단언이 아니라 증거 생성이다.
 *
 * 뷰포트는 Pixel 4a 논리 해상도(393x851)에 맞춘다.
 */
test.use({ viewport: { width: 393, height: 851 } });

for (const scheme of ["light", "dark"] as const) {
  test(`AC-23 비교용 스크린샷 (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/");
    await expect(page.getByRole("button", { name: "로그인" })).toBeVisible();
    await page.screenshot({
      path: `../../docs/assets/ac23-web-${scheme}.png`,
      fullPage: true,
    });
  });
}
