/**
 * Stepper 상태 규칙(R28). 웹 `stepper.tsx` 의 `stepStates` 와 같은 시그니처 · 같은 규칙이다.
 * react-native 를 import 하지 않아 native vitest 가 이 파일을 직접 불러온다(vitest 는 react-native 를 못 읽는다).
 */
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
//# sourceMappingURL=step-states.d.ts.map