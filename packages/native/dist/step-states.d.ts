export type StepState = "done" | "current" | "upcoming";
/**
 * 단계 상태(웹 `stepStates` 와 같은 규칙, react-native 를 import 하지 않아 vitest 가 직접 읽는다).
 * 어긋난 입력은 던지지 않는다 — `value` 가 없으면 전부 upcoming 이고,
 * `reached` 가 없거나 없는 값이면 `value` 를 끝으로 본다.
 */
export declare function stepStates(items: readonly {
    value: string;
}[], value: string, reached?: string): StepState[];
//# sourceMappingURL=step-states.d.ts.map