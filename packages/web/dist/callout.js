import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "./cn.js";
import { Icon } from "./icon.js";
const fills = {
    info: "bg-info-subtle",
    success: "bg-success-subtle",
    warning: "bg-warning-subtle",
    danger: "bg-danger-subtle",
    brand: "bg-brand-subtle",
};
const titles = {
    info: "text-fg-info",
    success: "text-fg-success",
    warning: "text-fg-warning",
    danger: "text-fg-danger",
    brand: "text-fg-brand",
};
/** 안내 상자(R28). 테두리 없이 tone 채움만 쓴다. 아이콘은 꾸밈이라 이름이 없다. */
export const Callout = ({ children, tone = "info", title, icon, className }) => (_jsxs("div", { role: "note", className: cn("flex gap-3 rounded-lg p-4 text-md text-fg break-keep wrap-break-word", fills[tone], className), children: [icon === undefined ? null : _jsx(Icon, { name: icon, tone: tone }), _jsxs("div", { className: "min-w-0 flex-1", children: [title === undefined ? null : _jsx("p", { className: cn("font-semibold", titles[tone]), children: title }), children] })] }));
//# sourceMappingURL=callout.js.map