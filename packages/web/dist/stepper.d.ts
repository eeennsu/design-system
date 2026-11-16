import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
type StepState = "done" | "current" | "upcoming";
/**
 * 단계 상태. 어긋난 입력은 던지지 않는다 — `value` 가 없으면 전부 upcoming 이고,
 * `reached` 가 없거나 없는 값이면 `value` 를 끝으로 본다.
 */
export declare function stepStates(items: readonly {
    value: string;
}[], value: string, reached?: string): StepState[];
/** 단계 표시(R28). 번호 없이 지난 단계는 체크, 펼친 단계는 막대다. 되돌아가기는 `onValueChange` 가 있을 때만 버튼이다. */
export declare const Stepper: FC<Contracts<"web">["Stepper"]>;
export {};
//# sourceMappingURL=stepper.d.ts.map