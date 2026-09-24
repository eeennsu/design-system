"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cn } from "./cn.js";
import { Glyph } from "./icon.js";
/** 가장자리 고정 위치. 폭 토큰은 좌·우에만 적용된다(§3.8 drawer.width). */
const sides = {
    left: "inset-y-0 left-0 max-w-sm w-full",
    right: "inset-y-0 right-0 max-w-sm w-full",
    bottom: "inset-x-0 bottom-0 w-full",
};
/**
 * 가장자리에서 열리는 패널. Base UI Dialog 파트를 그대로 쓰고 위치 클래스만 바꾼다 —
 * 별도 라이브러리를 들이지 않는다(plan D-12). 스와이프 닫기는 없다.
 */
export const Drawer = ({ label, children, side = "right", open, defaultOpen, onOpenChange, className, }) => (_jsx(BaseDialog.Root, { open: open, defaultOpen: defaultOpen, onOpenChange: (next) => onOpenChange?.(next), children: _jsxs(BaseDialog.Portal, { children: [_jsx(BaseDialog.Backdrop, { className: "fixed inset-0 bg-overlay transition-opacity" }), _jsxs(BaseDialog.Popup, { className: cn("fixed bg-surface text-fg p-6 shadow-lg", sides[side], className), children: [_jsx(BaseDialog.Title, { className: "text-xl", children: label }), children, _jsx(BaseDialog.Close, { "aria-label": "\uB2EB\uAE30", className: "absolute top-4 right-4 text-fg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus", children: _jsx(Glyph, { name: "x", size: "sm" }) })] })] }) }));
//# sourceMappingURL=drawer.js.map