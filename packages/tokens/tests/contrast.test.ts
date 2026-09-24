/**
 * semantic 색 대비 (R25, 구현 노트 F-23).
 *
 * 글자 쌍은 4.5:1, 포커스 표시 같은 비텍스트는 3:1 이다(WCAG 2.1). 값은 브랜드 JS 객체(해석값)에서 읽고,
 * oklch → sRGB 는 CSS Color 4 식으로 환산해 [0, 1] 로 자른다. 기기의 환산(F-15)과 한 단계쯤 다를 수 있어
 * 경계에 붙은 쌍은 기기에서 다시 본다. 0.2.0 까지 base 다크의 흰 on-brand(3.7:1)와 bakery 라이트의
 * 흰 on-brand(3.2:1)가 이 검사 없이 나갔다.
 */
import { describe, expect, it } from "vitest";
import { colors as bakery } from "../src/brands/bakery.js";
import { colors as base } from "../src/brands/base.js";

function parseOklch(value: string): [number, number, number] {
  const match = /^oklch\(([\d.]+)% ([\d.]+) ([\d.]+)(?: \/ [\d.]+)?\)$/.exec(value);
  if (!match) throw new Error(`oklch 가 아니다: ${value}`);
  return [Number(match[1]) / 100, Number(match[2]), Number(match[3])];
}

/** oklch → 선형 sRGB (CSS Color 4 의 OKLab 행렬). */
function linearSrgb([l, c, h]: [number, number, number]): [number, number, number] {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const lms = [
    (l + 0.3963377774 * a + 0.2158037573 * b) ** 3,
    (l - 0.1055613458 * a - 0.0638541728 * b) ** 3,
    (l - 0.0894841775 * a - 1.291485548 * b) ** 3,
  ] as const;
  return [
    4.0767416621 * lms[0] - 3.3077115913 * lms[1] + 0.2309699292 * lms[2],
    -1.2684380046 * lms[0] + 2.6097574011 * lms[1] - 0.3413193965 * lms[2],
    -0.0041960863 * lms[0] - 0.7034186147 * lms[1] + 1.707614701 * lms[2],
  ];
}

function luminance(value: string): number {
  const [r, g, b] = linearSrgb(parseOklch(value)).map((channel) => Math.min(Math.max(channel, 0), 1));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light! + 0.05) / (dark! + 0.05);
}

type Scheme = (typeof base)["light"];

/** [글자, 배경] — 컴포넌트가 실제로 겹쳐 쓰는 쌍만 둔다. */
const textPairs = (s: Scheme): [string, string, string][] => [
  ["fg.default / bg.canvas", s.fg.default, s.bg.canvas],
  ["fg.default / bg.surface", s.fg.default, s.bg.surface],
  ["fg.default / bg.surface-muted (secondary Button · Badge)", s.fg.default, s.bg["surface-muted"]],
  ["fg.default / bg.surface-hover (hover)", s.fg.default, s.bg["surface-hover"]],
  ["fg.muted / bg.canvas", s.fg.muted, s.bg.canvas],
  ["fg.muted / bg.surface (placeholder 포함)", s.fg.muted, s.bg.surface],
  ["fg.danger / bg.canvas", s.fg.danger, s.bg.canvas],
  ["fg.danger / bg.surface", s.fg.danger, s.bg.surface],
  ["fg.on-brand / bg.brand", s.fg["on-brand"], s.bg.brand],
  ["fg.on-brand / bg.brand-hover", s.fg["on-brand"], s.bg["brand-hover"]],
  ["fg.on-danger / bg.danger", s.fg["on-danger"], s.bg.danger],
  ["fg.on-danger / bg.danger-hover", s.fg["on-danger"], s.bg["danger-hover"]],
];

const nonTextPairs = (s: Scheme): [string, string, string][] => [
  ["border.focus / bg.canvas (포커스 표시)", s.border.focus, s.bg.canvas],
  ["border.focus / bg.surface (포커스 표시)", s.border.focus, s.bg.surface],
];

describe.each([
  ["base", base],
  ["bakery", bakery],
] as const)("%s", (_brand, colors) => {
  for (const scheme of ["light", "dark"] as const) {
    it(`${scheme}: 글자 쌍이 4.5:1 이상이다`, () => {
      const failing = textPairs(colors[scheme])
        .map(([name, fg, bg]) => [name, Number(contrast(fg, bg).toFixed(2))] as const)
        .filter(([, ratio]) => ratio < 4.5);
      expect(failing).toEqual([]);
    });

    it(`${scheme}: 포커스 표시가 3:1 이상이다`, () => {
      const failing = nonTextPairs(colors[scheme])
        .map(([name, fg, bg]) => [name, Number(contrast(fg, bg).toFixed(2))] as const)
        .filter(([, ratio]) => ratio < 3);
      expect(failing).toEqual([]);
    });
  }
});

it("환산이 jest 의 react-native-css 값과 맞는다 — blue-500(#2b7fff) 위 흰색 3.76, gray-950 5.35 (F-15 · F-23)", () => {
  expect(contrast("oklch(100% 0 0)", "oklch(62.3% 0.214 259.815)")).toBeCloseTo(3.76, 1);
  expect(contrast("oklch(13% 0.028 261.692)", "oklch(62.3% 0.214 259.815)")).toBeCloseTo(5.35, 1);
});
