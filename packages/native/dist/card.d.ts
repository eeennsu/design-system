import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
/**
 * 표면 컨테이너. 웹 Card 와 같은 클래스 문자열이다(AC-25).
 * `variant` 를 두지 않는다 — 표면은 하나뿐이고 색을 바꾸려면 `className` 이다(§4.2).
 * 그림자 없이 canvas 와의 명도 차이로 구분된다(R26, 알려진 동작 24). 테두리 1px 은 `border.surface`
 * 색이다 — base 는 투명이고, 소비자가 `:root` 에서 선을 켤 수 있다(R28).
 */
export declare const Card: FC<Contracts<"native">["Card"]>;
//# sourceMappingURL=card.d.ts.map