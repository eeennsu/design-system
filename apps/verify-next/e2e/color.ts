import { expect, type Page } from "@playwright/test";

/**
 * 색 비교 도구.
 *
 * computed style 문자열을 그대로 비교하면 안 된다 — Next 빌드의 CSS 미니파이어가
 * `oklch(62% 0.19 145)` 를 `lab(...)` 으로 바꿔 내보내기 때문에 같은 색이 다른 문자열이 된다.
 * 그래서 양쪽을 브라우저 캔버스에 칠해 8비트 sRGB 로 환산한 뒤 비교한다.
 */
export type Rgba = [number, number, number, number];

export async function toRgba(page: Page, value: string): Promise<Rgba> {
  return page.evaluate((input) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d")!;
    context.fillStyle = input;
    context.fillRect(0, 0, 1, 1);
    const data = context.getImageData(0, 0, 1, 1).data;
    return [data[0]!, data[1]!, data[2]!, data[3]!] as [number, number, number, number];
  }, value);
}

export async function backgroundRgba(page: Page, selector: string): Promise<Rgba> {
  const value = await page
    .locator(selector)
    .first()
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  return toRgba(page, value);
}

/** 색 공간 변환 반올림 때문에 채널당 2 까지 허용한다. */
export function expectSameColor(actual: Rgba, expected: Rgba, message?: string): void {
  for (const channel of [0, 1, 2, 3] as const) {
    expect(Math.abs(actual[channel] - expected[channel]), `${message ?? ""} 채널 ${channel}`).toBeLessThanOrEqual(2);
  }
}

export function expectDifferentColor(actual: Rgba, other: Rgba): void {
  const distance = [0, 1, 2].reduce((sum, channel) => sum + Math.abs(actual[channel] - other[channel]), 0);
  expect(distance).toBeGreaterThan(10);
}
