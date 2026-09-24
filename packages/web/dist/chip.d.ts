import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
type ChipProps = Contracts<"web">["Chip"];
/**
 * 고르는 칩(구현 노트 N-17). 토글 버튼이라 고른 상태를 `aria-pressed` 로 알린다.
 * `label` 이 가시 텍스트이자 접근성 이름이고(C-13), 상태를 바꾸는 것은 소비자의 `onClick` 이다.
 *
 * 고른 칩은 brand 로 채우고, 고르지 않은 칩은 surface 에 테두리다. 칩은 글자가 컨트롤을 식별하므로
 * 테두리에 3:1 을 요구하지 않는다(WCAG 1.4.11). 고른 상태의 채움은 배경과 3:1 을 넘긴다(tokens 대비 테스트).
 */
export declare const Chip: FC<ChipProps>;
export {};
//# sourceMappingURL=chip.d.ts.map