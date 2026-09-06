import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
type StackProps = Contracts<"web">["Stack"];
/**
 * flex 컨테이너. 배치의 1순위 수단이다.
 * 간격 prop 은 없다 — 소비자가 `className="gap-4"` 로 준다(C-14).
 * 기본 방향이 `column` 인 것은 RN `View` 기본과 맞추기 위해서다(§4.4).
 */
export declare const Stack: FC<StackProps>;
export {};
//# sourceMappingURL=stack.d.ts.map