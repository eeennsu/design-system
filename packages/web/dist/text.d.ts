import type { Contracts, Tone, TypographyStep } from "@eeennsu/tokens";
import type { FC } from "react";
type TextProps = Contracts<"web">["Text"];
/** `tone` 은 fg semantic 색과 1:1 이다(C-8). `danger` 는 `bg.danger` 별칭이다(plan D-3). */
export declare const tones: Record<Tone, string>;
/** 스텝 하나가 크기·행간·무게를 함께 바꾼다(C-6 복합 폰트 변수). */
export declare const steps: Record<TypographyStep, string>;
/**
 * 텍스트. `heading` 이 있으면 그 레벨의 제목 엘리먼트로 렌더한다 —
 * 시각적 크기는 `size` 가 정하므로 의미와 크기가 분리된다.
 */
export declare const Text: FC<TextProps>;
export {};
//# sourceMappingURL=text.d.ts.map