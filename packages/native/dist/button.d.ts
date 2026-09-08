import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
type ButtonProps = Contracts<"native">["Button"];
/**
 * 누름 버튼. `label` 이 가시 텍스트 겸 접근성 이름이다(C-13) — `children` 이 없다.
 * `label` 은 아이콘이 있어도 항상 렌더된다(알려진 동작 9).
 *
 * `ref` 는 호스트 인스턴스를 그대로 넘긴다. RN 의 `NativeMethods` 가 `focus()` · `blur()`
 * 를 가지므로 `FocusHandle` 을 구조적으로 만족한다(웹 N-4 와 같은 처리).
 *
 * 비활성은 `disabled` prop 으로 처리한다 — 웹의 `pointer-events-none` 에 해당하는
 * 클래스가 RN 에 없다. 흐려 보이는 것만 `opacity-50` 으로 맞춘다.
 */
export declare const Button: FC<ButtonProps>;
export {};
//# sourceMappingURL=button.d.ts.map