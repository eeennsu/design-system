import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Text as RNText, View } from "react-native-css/components";
import { cn } from "./cn.js";
import { Icon } from "./icon.js";
import { steps } from "./text.js";
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
/**
 * 안내 상자(R28). 테두리 없이 tone 채움만 쓴다. 제목은 웹처럼 md 스텝이다(RN Text 는 View 에서 글자 크기를 상속하지 않는다). 아이콘은 꾸밈이라 이름이 없다.
 * `className` 은 표면(View)에만 붙고 글자 클래스는 안쪽 Text 에 닿지 않는다(알려진 동작 22) —
 * 본문 글은 `children` 이 직접 정한다.
 */
export const Callout = ({ children, tone = "info", title, icon, className }) => (_jsxs(View, { className: cn("flex-row gap-3 rounded-lg p-4", fills[tone], className), children: [icon === undefined ? null : _jsx(Icon, { name: icon, tone: tone }), _jsxs(View, { className: "min-w-0 flex-1", children: [title === undefined ? null : _jsx(RNText, { className: cn("font-sans font-semibold", steps.md, titles[tone]), children: title }), children] })] }));
//# sourceMappingURL=callout.js.map