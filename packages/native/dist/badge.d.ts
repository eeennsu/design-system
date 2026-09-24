import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
type BadgeProps = Contracts<"native">["Badge"];
/**
 * 짧은 상태 표시. 웹은 `inline-flex` 라 블록 흐름에서 글자 폭만큼 줄지만 RN 에는 인라인이 없다 —
 * 세로 방향 부모 안에서는 부모 폭으로 늘어난다(웹도 Stack 안에서는 같다). 줄이려면 소비자가
 * `className="self-start"` 를 준다. 기본값으로 넣지 않는 이유는 `align="center"` 인 가로 Stack 에서
 * 세로 가운데 정렬을 깨뜨리기 때문이다.
 */
export declare const Badge: FC<BadgeProps>;
export {};
//# sourceMappingURL=badge.d.ts.map