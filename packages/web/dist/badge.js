import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "./cn.js";
/** Button 과 같은 semantic 매핑이되 hover 가 없다(§4.2). */
const variants = {
    primary: "bg-brand text-fg-on-brand",
    secondary: "bg-surface-muted text-fg",
    danger: "bg-danger text-fg-on-danger",
};
/**
 * 투명 테두리를 둔다 — 같은 `py + text` 조합에서 Input 과 높이를 맞추기 위해서다(plan D-6).
 */
const sizes = {
    sm: "px-2 py-0 text-sm rounded-full",
    md: "px-3 py-1 text-sm rounded-full",
};
export const Badge = ({ children, variant = "secondary", size = "sm", className }) => (_jsx("span", { className: cn("inline-flex items-center border border-transparent", variants[variant], sizes[size], className), children: children }));
//# sourceMappingURL=badge.js.map