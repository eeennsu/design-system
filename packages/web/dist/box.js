import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "./cn.js";
/**
 * 스타일 없는 블록 컨테이너. `className` 을 붙일 자리다.
 * 배치 prop 은 Stack 만 갖는다 — 둘 다 같은 prop 이면 하나가 죽은 코드가 된다(plan D-7).
 */
export const Box = ({ children, className }) => (_jsx("div", { className: cn(className), children: children }));
//# sourceMappingURL=box.js.map