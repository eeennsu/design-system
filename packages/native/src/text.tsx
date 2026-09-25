import type { Contracts, Tone, TypographyStep } from "@eeennsu/tokens";
import type { FC } from "react";
import { Text as RNText } from "react-native-css/components";
import { cn } from "./cn.js";

type TextProps = Contracts<"native">["Text"];

/** `tone` 은 fg semantic 색과 1:1 이다(C-8). `danger` 는 `bg.danger` 별칭이다(plan D-3). */
export const tones: Record<Tone, string> = {
  default: "text-fg",
  muted: "text-fg-muted",
  danger: "text-fg-danger",
};

/**
 * 스텝 하나가 크기·행간·무게를 함께 바꾼다(C-6 복합 폰트 변수).
 * RN 에서 세 값이 다 맞는 것은 native 래퍼가 line-height 를 배수로 다시 내기 때문이다(T-N0).
 */
export const steps: Record<TypographyStep, string> = {
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
};

/**
 * 텍스트. 웹은 `heading` 을 `h1~h3` 엘리먼트로 내지만 RN 에는 제목 엘리먼트가 없어
 * `accessibilityRole="header"` 로 간다 — 레벨 개념이 없으므로 1·2·3 이 같은 역할이 된다.
 * 시각적 크기는 어느 쪽이든 `size` 가 정한다.
 */
export const Text: FC<TextProps> = ({
  children,
  tone = "default",
  size = "md",
  heading,
  className,
}) => (
  <RNText
    accessibilityRole={heading ? "header" : undefined}
    className={cn("font-sans", tones[tone], steps[size], className)}
  >
    {children}
  </RNText>
);
