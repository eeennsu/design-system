import type { Contracts, ControlSize } from "@eeennsu/tokens";
import type { FC } from "react";
type InputProps = Contracts<"native">["Input"];
/** 웹 Input 과 같은 크기 클래스다(AC-25). 웹의 `text-*` 는 여기서도 같은 스텝을 쓴다. */
export declare const inputSizes: Record<ControlSize, string>;
/**
 * 테두리 1px 이 Button 과 높이를 맞춘다 — 없으면 Input 이 2px 낮다(plan D-6).
 * 웹에는 있는 `placeholder:text-fg-muted` 가 빠져 있다 — react-native-css 는
 * `placeholder:` 변형을 `placeholderTextColor` 로 옮기지 않는다. v1 은 플랫폼 기본색을 쓴다.
 */
export declare const controlBase = "w-full bg-surface text-fg border border-border";
/**
 * 한 줄 입력. `label` 은 `accessibilityLabel` 로만 간다 — 가시 라벨은 Label 조합이다(C-13).
 * `id` 를 주면 같은 `htmlFor` 의 Label 과 `accessibilityLabelledBy` 로 이어진다(Android 전용).
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