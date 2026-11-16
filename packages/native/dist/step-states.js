/**
 * 단계 상태(웹 `stepStates` 와 같은 규칙, react-native 를 import 하지 않아 vitest 가 직접 읽는다).
 * 어긋난 입력은 던지지 않는다 — `value` 가 없으면 전부 upcoming 이고,
 * `reached` 가 없거나 없는 값이면 `value` 를 끝으로 본다.
 */
export function stepStates(items, value, reached) {
    const values = items.map((item) => item.value);
    const vi = values.indexOf(value);
    if (vi < 0)
        return values.map(() => "upcoming");
    const last = Math.max(vi, reached === undefined ? -1 : values.indexOf(reached));
    return values.map((_, i) => (i === vi ? "current" : i <= last ? "done" : "upcoming"));
}
//# sourceMappingURL=step-states.js.map