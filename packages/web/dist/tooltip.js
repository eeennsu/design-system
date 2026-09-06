"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { cn } from "./cn.js";
/**
 * 앵커에 붙는 설명. `label` 이 표시 내용이자 접근성 설명이다(C-13).
 *
 * `Provider` 를 컴포넌트마다 안에서 감싼다 — 소비자 설정 0 이 목표다(§4.3).
 * `children` 은 앵커 엘리먼트 하나다. Base UI `Trigger` 의 `render` 로 넘기며 이는
 * 내부 구현 디테일이라 공개 prop 이 아니다(C-10 · AC-12). DS Button 을 앵커로 쓰면
 * React 19 에서 `ref` 가 일반 prop 이라 Base UI 가 주입할 수 있다.
 */
export const Tooltip = ({ label, children, side = "top", open, defaultOpen, onOpenChange, className, }) => (_jsx(BaseTooltip.Provider, { children: _jsxs(BaseTooltip.Root, { open: open, defaultOpen: defaultOpen, onOpenChange: (next) => onOpenChange?.(next), children: [_jsx(BaseTooltip.Trigger, { render: children }), _jsx(BaseTooltip.Portal, { children: _jsx(BaseTooltip.Positioner, { side: side, children: _jsx(BaseTooltip.Popup, { className: cn("bg-surface text-fg border border-border px-2 py-1 text-sm rounded-sm shadow-md", className), children: label }) }) })] }) }));
//# sourceMappingURL=tooltip.js.map