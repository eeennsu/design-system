import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
type InputProps = Contracts<"native">["Input"];
/**
 * 한 줄 입력. `label` 은 `accessibilityLabel` 로만 간다 — 가시 라벨은 v2 의 Label 조합이다(C-13).
 * 값 제어는 `value` / `defaultValue` / `onValueChange` 3종뿐이다(C-12).
 * RN 의 `onChangeText` 가 이미 값을 주므로 어댑터가 이벤트를 벗길 일이 없다.
 *
 * `invalid` 는 **테두리 색까지만** 간다. 웹의 `aria-invalid` 에 해당하는 것이 RN 에 없다 —
 * `accessibilityState` 는 disabled · selected · checked · busy · expanded 뿐이고
 * `aria-invalid` 는 react-native 에 존재하지 않는 prop 이라 넘겨도 무동작이다.
 * 오류를 읽히려면 소비자가 `Text tone="danger"` 로 메시지를 놓는다(C-21 과 같은 방식).
 */
export declare const Input: FC<InputProps>;
export {};
//# sourceMappingURL=input.d.ts.map