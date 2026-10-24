import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
/**
 * 탭 목록과 패널(R27). `label` 은 `tablist` 의 접근성 이름이고 화면에 보이지 않는다(C-13).
 *
 * Base UI 기본을 그대로 쓴다 — 화살표는 포커스만 옮기고(`activateOnFocus` false) Enter · Space 가 활성화하며,
 * 숨은 패널은 마운트하지 않는다(알려진 동작 31). `Tabs.Indicator` 는 쓰지 않고 밑줄은 탭 버튼의 테두리다.
 * Base UI 의 기본 값은 숫자 `0` 이라 첫 항목 값을 명시하고, `onValueChange` 의 둘째 인자(eventDetails)는 버린다(C-12).
 */
export declare const Tabs: FC<Contracts<"web">["Tabs"]>;
//# sourceMappingURL=tabs.d.ts.map