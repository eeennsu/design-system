/**
 * R28 — `/components` 의 Link · Callout · Stepper 와 R27 보강분, `/surface` 의 소비자 재선언.
 * jsdom 이 증명하지 못한 계산된 스타일 · 넘침 · 실제 클릭을 브라우저에서 확인한다.
 * `screenshot.spec.ts` 는 함께 돌리지 않는다 — `docs/assets` 를 덮어쓴다(F-25).
 */
import { colors } from "@eeennsu/tokens/brands/base";
import { expect, type Locator, test } from "@playwright/test";
import { expectSameColor, toRgba } from "./color.js";

test.use({ viewport: { width: 393, height: 851 } });

const style = (locator: Locator, property: string) =>
  locator.evaluate((element, name) => getComputedStyle(element).getPropertyValue(name), property);

test.describe("/components", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/components");
  });

  test("Link — href, 포커스 outline, 쉬는 때 밑줄 없음 · hover 때 밑줄", async ({ page }) => {
    const link = page.getByRole("link", { name: "기본 링크" });
    await expect(link).toHaveAttribute("href", "#links");
    expect(await style(link, "text-decoration-line")).toBe("none");

    await link.hover();
    expect(await style(link, "text-decoration-line")).toBe("underline");

    await page.mouse.move(0, 0);
    await link.focus();
    expect(await style(link, "outline-style")).toBe("solid");
  });

  test("Callout — 다섯 개가 note 이고 info 는 info-subtle 채움 · fg.info 제목이다", async ({ page }) => {
    const area = page.locator("section[aria-label='안내 상자 영역']");
    await expect(area.getByRole("note")).toHaveCount(5);

    const info = area.getByRole("note").filter({ hasText: "안내 제목" });
    expectSameColor(
      await toRgba(page, await style(info, "background-color")),
      await toRgba(page, colors.light.bg["info-subtle"]),
      "info 채움",
    );
    const title = info.getByText("안내 제목", { exact: true });
    expectSameColor(await toRgba(page, await style(title, "color")), await toRgba(page, colors.light.fg.info), "info 제목");
  });

  test("Stepper — 펼친 단계 하나, 지난 단계 클릭으로 바뀌고 남은 단계는 버튼이 아니다", async ({ page }) => {
    const stepper = page.getByRole("list", { name: "예시 단계" });
    const current = stepper.locator("[aria-current='step']");
    await expect(current).toHaveCount(1);
    await expect(current).toContainText("2단계");
    await expect(stepper.getByText("2단계 내용이다")).toBeVisible();

    // reached="d" 라 value 뒤의 3 · 4단계도 지난 단계(버튼)다. 5단계만 남은 단계다.
    await expect(stepper.getByRole("button")).toHaveCount(3);
    await expect(stepper.locator("li").nth(4).getByRole("button")).toHaveCount(0);

    await stepper.getByRole("button", { name: /^1단계/ }).click();
    await expect(current).toHaveCount(1);
    await expect(current).toContainText("1단계");
    await expect(stepper.getByText("1단계 내용이다")).toBeVisible();
    await expect(stepper.getByText("2단계 내용이다")).toHaveCount(0);
  });

  test("Collapsible — ghost 트리거는 padding-left 0, disabled 는 눌러도 닫혀 있다", async ({ page }) => {
    const ghost = page.getByRole("button", { name: "정답 보기", exact: true });
    expect(await style(ghost, "padding-left")).toBe("0px");

    const disabled = page.getByRole("button", { name: "막힌 접기" });
    // pointer-events: none 이라 실제 클릭은 아래로 빠진다. force 로 그 자리를 누른다.
    await disabled.click({ force: true });
    await expect(disabled).toHaveAttribute("aria-expanded", "false");
    // 버튼에 직접 보낸 click 도 열지 못해야 한다(pointer-events 가 아니라 disabled 가 막는지).
    await disabled.dispatchEvent("click");
    await expect(disabled).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByText("막힌 접기 내용이다")).toHaveCount(0);
  });

  test("Prose — keep-all 이고 긴 한국어 · 긴 URL 문단이 393px 에서 넘치지 않는다", async ({ page }) => {
    const area = page.locator("section[aria-label='긴 글 Prose 영역']");
    const prose = area.locator(":scope > div");
    expect(await style(prose, "word-break")).toBe("keep-all");

    for (const target of [area, prose, prose.locator("p")]) {
      const { scrollWidth, clientWidth } = await target.evaluate((element) => ({
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    }
  });

  test("Table — max-h-96 이면 세로로 스크롤하는 Tab 정지점이다", async ({ page }) => {
    const region = page.getByRole("region", { name: "긴 지출" });
    const { scrollHeight, clientHeight } = await region.evaluate((element) => ({
      scrollHeight: element.scrollHeight,
      clientHeight: element.clientHeight,
    }));
    expect(scrollHeight).toBeGreaterThan(clientHeight);
    expect(await style(region, "overflow-y")).toBe("auto");
    await expect(region).toHaveAttribute("tabindex", "0");
  });

  test("글자 — text-4xl 48px, font-semibold 600, font-mono 는 JetBrains Mono 부터", async ({ page }) => {
    const area = page.locator("section[aria-label='글자 영역']");
    expect(await style(area.getByText("아주 큰 글"), "font-size")).toBe("48px");
    expect(await style(area.getByText("굵은 글"), "font-weight")).toBe("600");
    expect(await style(area.getByText("const mono = true;"), "font-family")).toMatch(/^"JetBrains Mono"/);
  });
});

test.describe("/surface — 소비자 재선언", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/surface");
  });

  test("재선언한 md · xl 만 바뀌고 lg · full 은 그대로다", async ({ page }) => {
    const radius = (locator: Locator) => style(locator, "border-radius");
    expect(await radius(page.getByRole("textbox", { name: "입력" }))).toBe("2px");
    expect(await radius(page.locator("section[aria-label='카드'] > div"))).toBe("4px");
    expect(await radius(page.locator("section[aria-label='배지'] > span"))).toBe("4px");
    expect(await radius(page.getByRole("button", { name: "칩" }))).toBe("4px");
    expect(await radius(page.locator("section[aria-label='lg 상자'] > div"))).toBe("16px");
    // 재선언 전 값은 base 토큰의 --radius-full 9999px 이다.
    expect(await radius(page.locator("section[aria-label='full 상자'] > div"))).toBe("9999px");
  });

  test("Card · Input 테두리가 재선언한 border-surface 이고 Card 테두리는 1px 이다", async ({ page }) => {
    const expected = await toRgba(page, "oklch(87% 0 0)");
    const card = page.locator("section[aria-label='카드'] > div");
    const input = page.getByRole("textbox", { name: "입력" });
    expectSameColor(await toRgba(page, await style(card, "border-top-color")), expected, "Card 테두리");
    expectSameColor(await toRgba(page, await style(input, "border-top-color")), expected, "Input 테두리");
    expect(await style(card, "border-top-width")).toBe("1px");
  });

  test("canvas 재선언 — 바탕이 흰색이다", async ({ page }) => {
    const canvas = page.getByRole("heading", { name: "표면 재선언" }).locator("..");
    expectSameColor(await toRgba(page, await style(canvas, "background-color")), await toRgba(page, "oklch(100% 0 0)"), "canvas");
  });
});
