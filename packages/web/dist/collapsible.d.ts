import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
type CollapsibleProps = Contracts<"web">["Collapsible"];
/**
 * 접고 펴는 패널(R27). `label` 은 트리거의 보이는 글자이자 접근성 이름이다(C-13).
 *
 * 기본(`ghost`)은 상자가 없고 트리거 줄과 패널뿐이다 — 상자로 보이려면 Card 안에 둔다(알려진 동작 32).
 * `keepMounted` · `hiddenUntilFound` 는 Base UI 기본(false)이라 닫힌 패널은 마운트하지 않는다(알려진 동작 31).
 * 기본은 닫힘이다. `onOpenChange` 의 둘째 인자(eventDetails)는 버리고 boolean 하나만 넘긴다(Dialog 와 같다).
 *
 * `disabled` 는 `Root` 로 넘긴다(R28). Base UI 1.8.0 트리거는 비활성에도 포커스를 받는 방식이라
 * native `disabled` 속성 대신 `aria-disabled="true"` 와 `data-disabled` 를 달고 클릭을 막는다.
 * 모양은 그 `data-disabled` 선택자로 Button 비활성과 같은 투명도다. 열린 채 비활성이면 열린 그대로다.
 * 포커스를 받으므로 투명도가 포커스 외곽선에도 걸린다 — Tab 으로 닿은 비활성 트리거의 외곽선은 흐리다.
 */
export declare const Collapsible: FC<CollapsibleProps>;
export {};
//# sourceMappingURL=collapsible.d.ts.map