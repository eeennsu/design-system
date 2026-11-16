/**
 * R27 T-V4 (AC-7 검증 항목 · AC-11 웹 통합 계층 · C-4).
 *
 * `/components` 는 서버 컴포넌트 화면이다. jsdom 이 증명하지 못한 것 — 실제 브라우저의 키보드 활성화,
 * 스크롤 넘침, `:where` 특이성, 계산된 색 — 을 여기서 확인한다. 이 파일만 돌린다:
 * `screenshot.spec.ts` 는 `docs/assets/ac23-web-*.png` 를 덮어쓴다(F-25).
 */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { colors } from "@eeennsu/tokens/brands/base";
import { expect, type Page, test } from "@playwright/test";
import { backgroundRgba, expectSameColor, toRgba } from "./color.js";

// playwright.config.ts 에 뷰포트가 없어 기본은 1280x720 이다. 표 넘침 확인에 393 이 필요하다.
test.use({ viewport: { width: 393, height: 851 } });

/** app/(app)/globals.css 가 재선언한 앱 전용 브랜드 값(verify.spec.ts 와 같다). */
const appBrand = { light: "oklch(62% 0.19 145)", dark: "oklch(72% 0.16 145)" };

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/components");
});

test("C-4 — 다섯 컴포넌트와 Chip · Icon 이 서버 렌더로 보인다", async ({ page }) => {
  await expect(page.getByRole("tablist", { name: "예시 탭" })).toBeVisible();
  await expect(page.getByRole("region", { name: "분기별 지출" })).toBeVisible();
  await expect(page.getByRole("region", { name: "긴 한 줄" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Prose 제목" })).toBeVisible();
  await expect(page.getByRole("button", { name: "정답 보기", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "고른 칩", exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: "설정" })).toBeVisible();
});

test.describe("Tabs", () => {
  test("tablist 이름 · 첫 탭 선택 · 활성 탭 밑줄이 앱 brand 다", async ({ page }) => {
    const first = page.getByRole("tab", { name: "코드" });
    await expect(first).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tab", { name: "사용법" })).toHaveAttribute("aria-selected", "false");
    await expect(page.getByRole("tabpanel")).toContainText("const total");

    const border = await first.evaluate((element) => getComputedStyle(element).borderBottomColor);
    expectSameColor(await toRgba(page, border), await toRgba(page, appBrand.light), "활성 탭 밑줄");
  });

  test("탭 버튼은 줄을 바꾸지 않는다 (white-space: nowrap)", async ({ page }) => {
    for (const tab of await page.getByRole("tab").all()) {
      expect(await tab.evaluate((element) => getComputedStyle(element).whiteSpace)).toBe("nowrap");
    }
  });

  test("키보드 — ArrowRight 는 포커스만 옮기고 Enter 가 활성화한다", async ({ page }) => {
    const first = page.getByRole("tab", { name: "코드" });
    const second = page.getByRole("tab", { name: "사용법" });
    await first.focus();
    await page.keyboard.press("ArrowRight");
    await expect(second).toBeFocused();
    await expect(first).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("Enter");
    await expect(second).toHaveAttribute("aria-selected", "true");
    await expect(first).toHaveAttribute("aria-selected", "false");
    await expect(page.getByRole("tabpanel")).toContainText("사용법 패널이다");
  });

  test("키보드 — 포커스한 비활성 탭에서 Space 가 활성화한다", async ({ page }) => {
    const second = page.getByRole("tab", { name: "사용법" });
    await second.focus();
    await expect(second).toHaveAttribute("aria-selected", "false");
    await page.keyboard.press("Space");
    await expect(second).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("사용법 패널이다");
  });
});

test.describe("Collapsible", () => {
  const answer = "정답은 사십이다";

  test("기본 닫힘이고 클릭으로 열린다", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "정답 보기", exact: true });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByText(answer)).toHaveCount(0);

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText(answer)).toBeVisible();
  });

  for (const key of ["Enter", "Space"] as const) {
    test(`${key} 로 열고 다시 ${key} 로 닫는다`, async ({ page }) => {
      const trigger = page.getByRole("button", { name: "정답 보기", exact: true });
      await trigger.focus();
      await page.keyboard.press(key);
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(page.getByText(answer)).toBeVisible();

      await page.keyboard.press(key);
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(page.getByText(answer)).toHaveCount(0);
    });
  }
});

test.describe("Table", () => {
  test("숫자 열은 end 정렬 · tabular-nums 이고 머리글 열은 start 다", async ({ page }) => {
    const region = page.getByRole("region", { name: "분기별 지출" });
    for (const cell of [region.locator("th").nth(1), region.locator("tbody tr").first().locator("td").nth(1)]) {
      const computed = await cell.evaluate((element) => {
        const { textAlign, fontVariantNumeric } = getComputedStyle(element);
        return { textAlign, fontVariantNumeric };
      });
      expect(computed.textAlign).toBe("end");
      expect(computed.fontVariantNumeric).toContain("tabular-nums");
    }
    expect(await region.locator("th").first().evaluate((element) => getComputedStyle(element).textAlign)).toBe("start");
  });

  test("글자 th · td 는 줄을 바꾸지 않는다 (decisions-r27 10)", async ({ page }) => {
    const region = page.getByRole("region", { name: "분기별 지출" });
    for (const cell of [region.locator("th").first(), region.locator("td").first()]) {
      expect(await cell.evaluate((element) => getComputedStyle(element).whiteSpace)).toBe("nowrap");
    }
  });

  test("393px 에서 가로로 넘치고 Tab 정지점이며 region 이름과 caption 이 label 이다", async ({ page }) => {
    const region = page.getByRole("region", { name: "분기별 지출" });
    const { scrollWidth, clientWidth } = await region.evaluate((element) => ({
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
    }));
    expect(scrollWidth).toBeGreaterThan(clientWidth);
    await expect(region).toHaveAttribute("tabindex", "0");
    await expect(region.locator("caption")).toHaveText("분기별 지출");
  });
});

test.describe("CodeBlock", () => {
  const figureOf = (page: Page, label: string) =>
    page.locator("figure", { has: page.getByRole("region", { name: label }) });

  test("pre 는 monospace · 가로 스크롤 · Tab 정지점이고 figure 가 surface-muted 다", async ({ page }) => {
    const pre = page.getByRole("region", { name: "긴 한 줄" });
    // R28 부터 DS 가 --font-mono 를 소유한다(decisions-r28 8).
    expect(await pre.evaluate((element) => getComputedStyle(element).fontFamily)).toMatch(/^"JetBrains Mono", ui-monospace/);
    expect(await pre.evaluate((element) => getComputedStyle(element).overflowX)).toBe("auto");
    await expect(pre).toHaveAttribute("tabindex", "0");

    const background = await figureOf(page, "긴 한 줄").evaluate((element) => getComputedStyle(element).backgroundColor);
    expectSameColor(await toRgba(page, background), await toRgba(page, colors.light.bg["surface-muted"]), "figure");
  });

  test("다크에서도 figure 가 surface-muted(다크)다", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    const background = await figureOf(page, "긴 한 줄").evaluate((element) => getComputedStyle(element).backgroundColor);
    expectSameColor(await toRgba(page, background), await toRgba(page, colors.dark.bg["surface-muted"]), "figure 다크");
  });
});

test.describe("Prose", () => {
  const prose = (page: Page) => page.locator("section[aria-label='Prose 영역']");
  const px = (page: Page, selector: string, property: string) =>
    prose(page)
      .locator(selector)
      .first()
      .evaluate((element, name) => getComputedStyle(element).getPropertyValue(name), property);

  test("원시 요소가 DS 어휘로 꾸며진다", async ({ page }) => {
    expect(await px(page, "h2", "font-size")).toBe("22px");
    expect(await px(page, "p", "margin-top")).toBe("16px");
    // R27 T-W11 이 th · td 에 text-sm 을 더했다(decisions-r27 14). 상속받은 text-md 로 돌아가면 여기서 깨진다.
    expect(await px(page, "td", "font-size")).toBe("14px");

    const code = await px(page, "p code", "background-color");
    expectSameColor(await toRgba(page, code), await toRgba(page, colors.light.bg["surface-muted"]), "인라인 code");
    const link = await px(page, "a", "color");
    expectSameColor(await toRgba(page, link), await toRgba(page, colors.light.fg.brand), "a");
  });

  test("안의 DS 컴포넌트가 :where 선택자에 지지 않는다", async ({ page }) => {
    expect(
      await prose(page)
        .getByRole("heading", { name: "Prose 안 DS 제목" })
        .evaluate((element) => getComputedStyle(element).fontSize),
    ).toBe("14px");

    // 회귀 가드일 뿐이다: Prose 의 pre padding 도 16px 라 :where 가 졌는지 가려내지 못한다. 진짜 증거는 위 Text 14px 단언이다.
    const inside = prose(page).getByRole("region", { name: "Prose 안 코드" });
    expect(await inside.evaluate((element) => getComputedStyle(element).padding)).toBe("16px");
  });

  test("className=bg-surface 를 준 CodeBlock 은 figure 가 surface 이고 pre 는 투명이다", async ({ page }) => {
    const label = "Prose 안 surface 코드";
    const figure = prose(page).locator("figure", { has: page.getByRole("region", { name: label }) });
    const pre = prose(page).getByRole("region", { name: label });

    const figureBackground = await figure.evaluate((element) => getComputedStyle(element).backgroundColor);
    expectSameColor(await toRgba(page, figureBackground), await toRgba(page, colors.light.bg.surface), "figure");
    const preBackground = await pre.evaluate((element) => getComputedStyle(element).backgroundColor);
    expect((await toRgba(page, preBackground))[3]).toBe(0);
  });
});

test.describe("Chip · Icon", () => {
  test("고른 Chip 은 앱 brand, 안 고른 Chip 은 surface-muted 이고 aria-pressed 가 맞다", async ({ page }) => {
    const selected = page.getByRole("button", { name: "고른 칩", exact: true });
    const idle = page.getByRole("button", { name: "안 고른 칩" });
    await expect(selected).toHaveAttribute("aria-pressed", "true");
    await expect(idle).toHaveAttribute("aria-pressed", "false");

    const area = "section[aria-label='칩 영역']";
    expectSameColor(await backgroundRgba(page, `${area} button[aria-pressed='true']`), await toRgba(page, appBrand.light), "고른 칩");
    expectSameColor(
      await backgroundRgba(page, `${area} button[aria-pressed='false']`),
      await toRgba(page, colors.light.bg["surface-muted"]),
      "안 고른 칩",
    );
  });

  test("label 있는 Icon 은 img + 이름, 없는 Icon 은 aria-hidden 이다", async ({ page }) => {
    const area = page.locator("section[aria-label='아이콘 영역']");
    await expect(area.getByRole("img", { name: "설정" })).toHaveAttribute("role", "img");
    const hidden = area.locator("svg[aria-hidden='true']");
    await expect(hidden).toHaveCount(1);
    await expect(hidden).not.toHaveAttribute("role", /.+/);
  });

  test("tone=muted Icon 의 color 는 fg.muted 다", async ({ page }) => {
    const color = await page.getByRole("img", { name: "안내" }).evaluate((element) => getComputedStyle(element).color);
    expectSameColor(await toRgba(page, color), await toRgba(page, colors.light.fg.muted), "muted Icon");
  });
});

/**
 * 구분선 증거(decisions-r27 19). 단언이 아니라 사람이 볼 스크린샷이다 — `out/`(gitignored)에만 쓴다.
 * 다크 전환은 다른 spec 들과 같은 `emulateMedia` 다. canvas 위 Tabs · Table 과 Card 위 Table 이 한 화면에 든다.
 */
test.describe("구분선 증거 스크린샷", () => {
  test.use({ deviceScaleFactor: 2 });

  for (const scheme of ["light", "dark"] as const) {
    test(`out/r27-dividers/${scheme}.png`, async ({ page }) => {
      test.skip(!process.env.R27_DIVIDERS, "구분선 증거는 요청할 때만 찍는다");
      await page.emulateMedia({ colorScheme: scheme });
      // 설정 파일은 apps/verify-next 에 있다. 레포 루트의 out/ 은 gitignored 다.
      const outDir = join(dirname(test.info().config.configFile!), "..", "..", "out", "r27-dividers");
      mkdirSync(outDir, { recursive: true });

      const box = (await page.locator("section[aria-label='카드 안 표 영역']").boundingBox())!;
      await page.screenshot({
        path: join(outDir, `${scheme}.png`),
        fullPage: true,
        clip: { x: 0, y: 0, width: 393, height: box.y + box.height + 16 },
      });
    });
  }
});
