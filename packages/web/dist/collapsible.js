"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { cn } from "./cn.js";
import { Glyph } from "./icon.js";
/**
 * variant 별 트리거 · 패널 클래스(R28). `ghost` 는 가로 여백 · 모서리 · hover 채움이 없어
 * 글자 왼쪽이 주변 문단과 맞는다(알려진 동작 35). `secondary` 는 트리거 줄만 채우고 패널은 채우지 않는다 —
 * 안에 둔 CodeBlock · 인라인 코드의 `surface-muted` 채움이 같은 색 위에서 사라지기 때문이다(알려진 동작 32).
 */
const variants = {
    ghost: {
        trigger: "border border-transparent py-2 text-md text-fg-muted hover:text-fg",
        panel: "pt-2",
    },
    secondary: {
        trigger: "border border-transparent rounded-md px-3 py-2 text-md text-fg bg-surface-muted hover:bg-surface-hover",
        panel: "px-3 pt-2",
    },
};
/**
 * 접고 펴는 패널(R27). `label` 은 트리거의 보이는 글자이자 접근성 이름이다(C-13).
 *
 * 기본(`ghost`)은 상자가 없고 트리거 줄과 패널뿐이다 — 상자로 보이려면 Card 안에 둔다(알려진 동작 32).
 * `keepMounted` · `hiddenUntilFound` 는 Base UI 기본(false)이라 닫힌 패널은 마운트하지 않는다(알려진 동작 31).
 * 기본은 닫힘이다. `onOpenChange` 의 둘째 인자(eventDetails)는 버리고 boolean 하나만 넘긴다(Dialog 와 같다).
 *
 * `disabled` 는 `Root` 로 넘긴다(R28). Base UI 1.8.0 트리거는 비활성에도 포커스를 받는 방식이라
 * native `disabled` 속성 대신 `aria-disabled="true"` 와 `data-disabled` 를 달고 클릭을 막는다.
 * 모양은 그 `data-disabled` 선택자로 Button 비활성과 같은 투명도다. 열린 채 비활성이면 열린 그대로다.
 */
export const Collapsible = ({ label, children, open, defaultOpen = false, onOpenChange, disabled = false, variant = "ghost", className, }) => (_jsxs(BaseCollapsible.Root, { open: open, defaultOpen: defaultOpen, onOpenChange: (next) => onOpenChange?.(next), disabled: disabled, className: className, children: [_jsxs(BaseCollapsible.Trigger, { className: cn("group flex w-full items-center justify-between gap-2 text-start", variants[variant].trigger, "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus", "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none"), children: [label, _jsx(Glyph, { name: "chevron-down", className: "text-fg-muted transition-transform group-data-[panel-open]:rotate-180" })] }), _jsx(BaseCollapsible.Panel, { className: variants[variant].panel, children: children })] }));
//# sourceMappingURL=collapsible.js.map