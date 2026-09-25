"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cn } from "./cn.js";
import { Glyph } from "./icon.js";
/**
 * 모달 대화상자. `label` 은 제목으로 렌더되고 Base UI 가 `aria-labelledby` 를 연결한다(plan D-10).
 *
 * `Dialog.Trigger` 는 쓰지 않는다 — v1 오버레이는 제어 API 만 노출하고(C-12),
 * 소비자가 Button 누름 이벤트로 `open` 을 토글한다.
 * Base UI `onOpenChange` 는 `(open, eventDetails)` 2인자라 DS 가 boolean 하나로 감싼다.
 */
export const Dialog = ({ label, children, open, defaultOpen, onOpenChange, className, }) => (_jsx(BaseDialog.Root, { open: open, defaultOpen: defaultOpen, onOpenChange: (next) => onOpenChange?.(next), children: _jsxs(BaseDialog.Portal, { children: [_jsx(BaseDialog.Backdrop, { className: "fixed inset-0 bg-overlay transition-opacity" }), _jsxs(BaseDialog.Popup, { className: cn("fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", "bg-surface text-fg max-w-md w-full p-6 rounded-xl shadow-lg", className), children: [_jsx(BaseDialog.Title, { className: "text-xl", children: label }), children, _jsx(BaseDialog.Close, { "aria-label": "\uB2EB\uAE30", className: "absolute top-4 right-4 text-fg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus", children: _jsx(Glyph, { name: "x", size: "sm" }) })] })] }) }));
//# sourceMappingURL=dialog.js.map