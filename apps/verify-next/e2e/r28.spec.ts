/**
 * R28 Task 11 (AC-7 · AC-26 (e) · Review Focus 4 · 5).
 *
 * `/components` 의 Link · Callout · Stepper · Collapsible(R28) · 세로 넘침 Table · 긴 URL Prose · 글 어휘와
 * `/surface` 재선언 라우트(C-5c)를 실제 브라우저에서 본다. 이 파일은 `docs/assets` 를 쓰지 않는다(F-25).
 */
import { colors } from "@eeennsu/tokens/brands/base";
import { expect, type Page, test } from "@playwright/test";
import { expectSameColor, toRgba } from "./color.js";

test.use({ viewport: { width: 393, height: 851 } });

const style = (page: Page, selector: string, property: string) =>
  page
    .locator(selector)
    .first()
    .evaluate((element, name) => getComputedStyle(element).getPropertyValue(name), property);

test.describe("/components R28", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/components");
  });

  test.describe("Link", () => {
    test("href 그대로이고 쉴 때 밑줄이 없으며 hover 에서 밑줄이다", async ({ page }) => {
      const link = page.getByRole("link", { name: "기본 링크" });
      await expect(link).toHaveAttribute("href", "#link-default");
      expect(await link.evaluate((element) => getComputedStyle(element).textDecorationLine)).toBe("none");

      await link.hover();
      await expect
        .poll(() => link.evaluate((element) => getComputedStyle(element).textDecorationLine))
        .toBe("underline");
    });

    test("키보드 포커스에서 outline 이 solid 다", async ({ page }) => {
      const link = page.getByRole("link", { name: "기본 링크" });
      // :focus-visible 은 키보드 포커스에서만 켜진다. 앞 요소에 포커스를 둔 뒤 Tab 으로 들어간다.
      await page.getByRole("button", { name: "비활성 접기" }).focus();
      await page.keyboard.press("Tab");
      await expect(link).toBeFocused();
      expect(await link.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe("solid");
      expect(await link.evaluate((element) => getComputedStyle(element).textDecorationLine)).toBe("underline");
    });

    test("tone=muted 는 fg.muted, size=lg 는 큰 글자다", async ({ page }) => {
      const muted = await page.getByRole("link", { name: "muted 링크" }).evaluate((element) => getComputedStyle(element).color);
      expectSameColor(await toRgba(page, muted), await toRgba(page, colors.light.fg.muted), "muted 링크");
      const base = await page.getByRole("link", { name: "기본 링크" }).evaluate((element) => getComputedStyle(element).color);
      expectSameColor(await toRgba(page, base), await toRgba(page, colors.light.fg.brand), "기본 링크");

      const md = await page.getByRole("link", { name: "기본 링크" }).evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
      const lg = await page.getByRole("link", { name: "큰 링크" }).evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
      expect(lg).toBeGreaterThan(md);
    });
  });

  test.describe("Callout", () => {
    test("role=note 다섯이고 info 배경은 bg.info-subtle, 제목은 fg.info 다", async ({ page }) => {
      const area = page.locator("section[aria-label='Callout 영역']");
      await expect(area.getByRole("note")).toHaveCount(5);

      const info = area.getByRole("note").filter({ hasText: "정보 Callout" });
      const background = await info.evaluate((element) => getComputedStyle(element).backgroundColor);
      expectSameColor(await toRgba(page, background), await toRgba(page, colors.light.bg["info-subtle"]), "info 배경");

      const title = info.getByText("안내", { exact: true });
      const color = await title.evaluate((element) => getComputedStyle(element).color);
      expectSameColor(await toRgba(page, color), await toRgba(page, colors.light.fg.info), "info 제목");
    });

    test("아이콘은 꾸밈으로 숨고 제목 · 아이콘 없는 Callout 은 본문만 있다", async ({ page }) => {
      const area = page.locator("section[aria-label='Callout 영역']");
      const info = area.getByRole("note").filter({ hasText: "정보 Callout" });
      await expect(info.locator("svg[aria-hidden='true']")).toHaveCount(1);
      const plain = area.getByRole("note").filter({ hasText: "brand Callout" });
      await expect(plain.locator("svg")).toHaveCount(0);
      await expect(plain.locator("p.font-semibold")).toHaveCount(0);
    });

    test("word-break: keep-all 이다", async ({ page }) => {
      const info = page.locator("section[aria-label='Callout 영역']").getByRole("note").first();
      expect(await info.evaluate((element) => getComputedStyle(element).wordBreak)).toBe("keep-all");
    });
  });

  test.describe("Stepper", () => {
    const list = (page: Page) => page.getByRole("list", { name: "가입 단계" });

    test("펼친 단계는 aria-current=step 하나이고 그 content 만 보인다", async ({ page }) => {
      await expect(list(page).locator("[aria-current='step']")).toHaveCount(1);
      await expect(list(page).locator("[aria-current='step']")).toContainText("프로필 채우기");
      await expect(page.getByText("이름과 사진을 올린다")).toBeVisible();
      await expect(page.getByText("이메일과 비밀번호를 정한다")).toHaveCount(0);
    });

    test("지난 단계 버튼을 누르면 펼친 단계가 바뀐다", async ({ page }) => {
      // reached="d" 라 value 보다 뒤인 c · d 도 지난 단계다.
      // sr-only 가 position: absolute 라 Chromium 접근성 이름은 "계정 만들기 , 완료" 처럼 쉼표 앞에 공백이 든다.
      const back = list(page).getByRole("button", { name: /^계정 만들기\s*, 완료$/ });
      await expect(back).toHaveAttribute("type", "button");
      await back.click();
      await expect(list(page).locator("[aria-current='step']")).toContainText("계정 만들기");
      await expect(page.getByText("이메일과 비밀번호를 정한다")).toBeVisible();
      await expect(page.getByText("이름과 사진을 올린다")).toHaveCount(0);

      await list(page).getByRole("button", { name: /^첫 지출 기록\s*, 완료$/ }).click();
      await expect(list(page).locator("[aria-current='step']")).toContainText("첫 지출 기록");
    });

    test("남은 단계와 펼친 단계에는 버튼이 없다", async ({ page }) => {
      const rows = list(page).getByRole("listitem");
      await expect(rows).toHaveCount(5);
      // a · c · d 지난(버튼), b 펼친, e 남은.
      await expect(list(page).getByRole("button")).toHaveCount(3);
      await expect(rows.nth(4).getByRole("button")).toHaveCount(0);
      await expect(rows.nth(1).getByRole("button")).toHaveCount(0);
    });
  });

  test.describe("Collapsible R28", () => {
    test("기본(ghost) 트리거는 가로 여백이 없고 secondary 는 채움이 있다", async ({ page }) => {
      const ghost = page.getByRole("button", { name: "정답 보기", exact: true });
      expect(await ghost.evaluate((element) => getComputedStyle(element).paddingLeft)).toBe("0px");

      const secondary = page.getByRole("button", { name: "secondary 접기" });
      expect(await secondary.evaluate((element) => getComputedStyle(element).paddingLeft)).toBe("12px");
      const background = await secondary.evaluate((element) => getComputedStyle(element).backgroundColor);
      expectSameColor(await toRgba(page, background), await toRgba(page, colors.light.bg["surface-muted"]), "secondary 트리거");
    });

    test("disabled 트리거는 클릭 · 키보드로 열리지 않는다", async ({ page }) => {
      const trigger = page.getByRole("button", { name: "비활성 접기" });
      await expect(trigger).toHaveAttribute("aria-disabled", "true");
      await expect(trigger).toHaveAttribute("data-disabled", "");
      // pointer-events: none 이라 실제 클릭은 트리거에 닿지 않는다. 이벤트를 직접 보내 Base UI 의 차단도 본다.
      await trigger.click({ force: true });
      await trigger.dispatchEvent("click");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");

      await trigger.focus();
      await expect(trigger).toBeFocused();
      await page.keyboard.press("Enter");
      await page.keyboard.press("Space");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(page.getByText("비활성 패널이다")).toHaveCount(0);
    });
  });

  test.describe("Prose · Table 넘침 (Review Focus 5)", () => {
    test("Prose 는 keep-all 이고 긴 URL 문단이 393px 에서 넘치지 않는다", async ({ page }) => {
      const paragraph = page.getByTestId("long-url");
      expect(await paragraph.evaluate((element) => getComputedStyle(element.parentElement!).wordBreak)).toBe("keep-all");
      const { scrollWidth, clientWidth } = await paragraph.evaluate((element) => ({
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
      // 페이지 자체도 가로로 넘치지 않는다.
      const page_ = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(page_.scrollWidth).toBeLessThanOrEqual(page_.clientWidth);
    });

    test("max-h-96 Table 은 세로로 넘치고 overflow-y: auto · tabindex=0 이다", async ({ page }) => {
      const region = page.getByRole("region", { name: "일별 지출" });
      const { scrollHeight, clientHeight, overflowY } = await region.evaluate((element) => ({
        scrollHeight: element.scrollHeight,
        clientHeight: element.clientHeight,
        overflowY: getComputedStyle(element).overflowY,
      }));
      expect(clientHeight).toBeLessThanOrEqual(384);
      expect(scrollHeight).toBeGreaterThan(clientHeight);
      expect(overflowY).toBe("auto");
      await expect(region).toHaveAttribute("tabindex", "0");
    });
  });

  test("글 어휘 — text-4xl 48px · font-semibold 600 · font-mono 는 JetBrains Mono 부터다", async ({ page }) => {
    const area = page.locator("section[aria-label='글 어휘 영역']");
    expect(await area.getByText("큰 제목 4xl").evaluate((element) => getComputedStyle(element).fontSize)).toBe("48px");
    expect(await area.getByText("semibold 글").evaluate((element) => getComputedStyle(element).fontWeight)).toBe("600");
    expect(await area.getByText("const mono = true;").evaluate((element) => getComputedStyle(element).fontFamily)).toMatch(
      /^"JetBrains Mono"/,
    );
  });
});

test.describe("/surface 재선언 (AC-26 (e) · Review Focus 4)", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/surface");
  });

  const radius = (page: Page, selector: string) => style(page, selector, "border-top-left-radius");

  test("재선언한 radius 는 앱 값, 재선언하지 않은 키는 DS 값이다", async ({ page }) => {
    expect(await page.getByLabel("이름").evaluate((element) => getComputedStyle(element).borderTopLeftRadius)).toBe("2px");
    expect(await page.getByRole("button", { name: "저장" }).evaluate((element) => getComputedStyle(element).borderTopLeftRadius)).toBe(
      "2px",
    );
    expect(await radius(page, "div.bg-surface.border")).toBe("4px");
    expect(await page.getByText("배지", { exact: true }).evaluate((element) => getComputedStyle(element).borderTopLeftRadius)).toBe("4px");
    expect(await page.getByRole("button", { name: "칩" }).evaluate((element) => getComputedStyle(element).borderTopLeftRadius)).toBe("4px");

    expect(await radius(page, "div.rounded-lg")).toBe("16px");
    expect(await radius(page, "div.rounded-full")).toBe("9999px");
  });

  test("canvas 는 흰색이고 Card · Input 테두리는 재선언한 색 1px 이다", async ({ page }) => {
    const canvas = await style(page, "div.bg-canvas", "background-color");
    expectSameColor(await toRgba(page, canvas), await toRgba(page, "oklch(100% 0 0)"), "canvas");

    const expected = await toRgba(page, "oklch(87% 0 0)");
    const card = page.locator("div.bg-surface.border").first();
    expectSameColor(await toRgba(page, await card.evaluate((element) => getComputedStyle(element).borderTopColor)), expected, "Card 테두리");
    expect(await card.evaluate((element) => getComputedStyle(element).borderTopWidth)).toBe("1px");
    const input = page.getByLabel("이름");
    expectSameColor(await toRgba(page, await input.evaluate((element) => getComputedStyle(element).borderTopColor)), expected, "Input 테두리");
  });
});
