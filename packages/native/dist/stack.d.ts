import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
type StackProps = Contracts<"native">["Stack"];
/**
 * flex 컨테이너. 웹 Stack 과 **같은 클래스 문자열**을 낸다(AC-25).
 * 간격 prop 은 없다 — 소비자가 `className="gap-4"` 로 준다(C-14).
 */
export declare const Stack: FC<StackProps>;
export {};
//# sourceMappingURL=stack.d.ts.map