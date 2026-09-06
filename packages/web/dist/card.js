import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "./cn.js";
/**
 * 표면 컨테이너. `variant` 를 두지 않는다 — 표면은 하나뿐이고
 * 색을 바꾸려면 `className` 이다(§4.2).
 */
export const Card = ({ children, className }) => (_jsx("div", { className: cn("bg-surface border border-border rounded-lg shadow-sm p-4", className), children: children }));
//# sourceMappingURL=card.js.map