/**
 * T-T5 twMergeConfig 검증 (C-15 · 알려진 동작 1 · 4).
 *
 * 웹·RN 의 `cn()` 이 이 설정으로 만들어진다. 여기서 확인하는 것은
 * "미등록 클래스가 DS 기본값을 밀어내지 않는다"는 병합 규칙 하나다.
 */
import { extendTailwindMerge } from "tailwind-merge";
import { describe, expect, it } from "vitest";
import { twMergeConfig } from "../src/generated/values.js";

const cn = extendTailwindMerge({ override: { theme: twMergeConfig } });

/** 비교군: `extend` 로 붙였을 때의 동작(= 기본 검증자가 남는다). */
const cnExtend = extendTailwindMerge({ extend: { theme: twMergeConfig } });

describe("설정이 빌드 산출물에서 나온다", () => {
  it("색 키가 semantic 16개와 같다", () => {
    expect(twMergeConfig.color).toEqual([
      "canvas",
      "surface",
      "surface-muted",
      "surface-hover",
      "brand",
      "brand-hover",
      "danger",
      "danger-hover",
      "overlay",
      "fg",
      "fg-muted",
      "fg-danger",
      "fg-on-brand",
      "fg-on-danger",
      "border",
      "border-focus",
    ]);
  });

  it("색 키와 text 크기 키가 겹치지 않는다 (C-6)", () => {
    const overlap = twMergeConfig.color.filter((key) => twMergeConfig.text.includes(key));
    expect(overlap).toEqual([]);
  });
});

describe("병합 규칙", () => {
  it("미등록 spacing 키는 DS 기본값을 밀어내지 않는다", () => {
    expect(cn("mt-4", "mt-5")).toBe("mt-4 mt-5");
  });

  it("override 가 아니면 위 규칙이 깨진다 (plan v2 F-4)", () => {
    // extend 는 기본 isNumber 검증자에 concat 이라 mt-5 가 같은 그룹으로 인식돼 mt-4 를 지운다.
    expect(cnExtend("mt-4", "mt-5")).toBe("mt-5");
  });

  it("같은 그룹의 등록된 색은 뒤가 이긴다 (소비자 className 승리)", () => {
    expect(cn("bg-brand", "bg-danger")).toBe("bg-danger");
  });

  it("text 의 크기와 색은 다른 그룹이다", () => {
    expect(cn("text-md", "text-fg")).toBe("text-md text-fg");
  });

  it("변형(hover:)이 붙으면 다른 그룹이다", () => {
    expect(cn("hover:bg-brand-hover", "bg-danger")).toBe("hover:bg-brand-hover bg-danger");
  });

  it("미등록 radius 키도 DS 기본값을 밀어내지 않는다", () => {
    expect(cn("rounded-md", "rounded-xl")).toBe("rounded-md rounded-xl");
  });

  it("알려진 동작: text-base 는 tailwind-merge 에 하드코딩돼 DS 크기를 밀어낸다 (§9 S-18)", () => {
    // text-base 는 리셋으로 CSS 가 없으므로 결과적으로 글자 크기가 사라진다.
    // 소비자가 text-base 를 쓰지 않는 것이 규칙이다.
    expect(cn("text-md", "text-base")).toBe("text-base");
  });
});
