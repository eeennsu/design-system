"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { cn } from "./cn.js";
import { Glyph } from "./icon.js";
const variants = {
    ghost: { trigger: "text-fg-muted hover:text-fg", panel: "pt-2" },
    secondary: { trigger: "rounded-md px-3 text-fg bg-surface-muted hover:bg-surface-hover", panel: "px-3 pt-2" },
};
/**
 * 접고 펴는 패널(R27). `label` 은 트리거의 보이는 글자이자 접근성 이름이다(C-13).
 *
 * 상자는 없고 트리거 줄과 패널뿐이다 — 상자로 보이려면 Card 안에 둔다(알려진 동작 32).
 * `keepMounted` · `hiddenUntilFound` 는 Base UI 기본(false)이라 닫힌 패널은 마운트하지 않는다(알려진 동작 31).
 * 기본은 닫힘이다. `onOpenChange` 의 둘째 인자(eventDetails)는 버리고 boolean 하나만 넘긴다(Dialog 와 같다).
 */
export const Collapsible = ({ label, children, open, defaultOpen = false, onOpenChange, disabled = false, variant = "ghost", className, }) => (_jsxs(BaseCollapsible.Root, { open: open, defaultOpen: defaultOpen, onOpenChange: (next) => onOpenChange?.(next), disabled: disabled, className: className, children: [_jsxs(BaseCollapsible.Trigger, { className: cn("group flex w-full items-center justify-between gap-2 border border-transparent py-2 text-md text-start", variants[variant].trigger, disabled && "opacity-50 pointer-events-none", "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"), children: [label, _jsx(Glyph, { name: "chevron-down", className: "text-fg-muted transition-transform group-data-[panel-open]:rotate-180" })] }), _jsx(BaseCollapsible.Panel, { className: variants[variant].panel, children: children })] }));
//# sourceMappingURL=collapsible.js.map