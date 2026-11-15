import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
type StepperProps = Contracts<"web">["Stepper"];
/** 줄 하나의 상태. 지난(`done`) · 펼친(`current`) · 남은(`upcoming`) 셋이다(decisions-r28 16). */
export type StepState = "done" | "current" | "upcoming";
/**
 * 항목마다 상태를 정한다. 어긋난 입력에도 던지지 않는다(알려진 동작 36).
 * - `value` 가 어느 항목과도 맞지 않으면 전부 남은 단계다
 * - `reached` 가 없거나, 없는 항목이거나, `value` 보다 앞이면 `value` 를 따른다
 * - `value` 가 펼친 단계, 그 밖에 `max(value, reached)` 까지가 지난 단계, 나머지가 남은 단계다
 */
export declare function stepStates(items: readonly {
    value: string;
}[], value: string, reached?: string): StepState[];
/**
 * 세로 단계 목록(R28). 제어 전용이고 펼친 단계만 `content` 를 마운트한다(알려진 동작 36).
 *
 * 줄은 표시 열(`w-4`, 아이콘 sm 폭) + 내용 열이라 모든 줄의 글자 왼쪽이 맞는다. 지난 단계는 체크(muted),
 * 펼친 단계는 `border-l-2 border-brand` 막대, 남은 단계는 표시가 없다. 번호 · 원 · 연결선 · 상자를 그리지 않는다(decisions-r28 17).
 * `onValueChange` 가 있을 때만 지난 단계 줄 글이 `type="button"` 버튼이고 콜백은 값 하나만 받는다(C-12).
 * 화살표 이동은 없고 버튼의 Tab 순서를 따른다.
 */
export declare const Stepper: FC<StepperProps>;
export {};
//# sourceMappingURL=stepper.d.ts.map