import type { Contracts, ControlSize } from "@eeennsu/tokens";
import type { FC } from "react";
type InputProps = Contracts<"web">["Input"];
export declare const inputSizes: Record<ControlSize, string>;
/**
 * 테두리 1px 이 Button 과 높이를 맞춘다 — 없으면 Input 이 2px 낮다(plan D-6).
 * R26 부터 칸은 `surface-muted` 채움으로 보인다(알려진 동작 25). 쉬는 테두리는 R28 부터 `border.surface`
 * (base 투명)이고 오류 때 `border-danger` 가 병합으로 그것을 민다(F-28).
 */
export declare const controlBase = "block w-full bg-surface-muted text-fg border border-border-surface placeholder:text-fg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus";
/**
 * 한 줄 입력. `label` 은 `aria-label` 로만 간다 — 가시 라벨은 `Label` 조합이다(C-13).
 * 값 제어는 `value` / `defaultValue` / `onValueChange` 3종뿐이다(C-12).
 */
export declare const Input: FC<InputProps>;
export {};
//# sourceMappingURL=input.d.ts.map