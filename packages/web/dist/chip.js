"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Button as BaseButton } from "@base-ui/react/button";
import { cn } from "./cn.js";
/**
 * 고르는 칩(구현 노트 N-17). 토글 버튼이라 고른 상태를 `aria-pressed` 로 알린다.
 * `label` 이 가시 텍스트이자 접근성 이름이고(C-13), 상태를 바꾸는 것은 소비자의 `onClick` 이다.
 *
 * 고른 칩은 brand 로 채우고, 고르지 않은 칩은 surface 에 테두리다. 테두리 대비가 3:1 이 안 되지만
 * 칩은 글자로 식별되고 고른 상태는 채움 색으로 갈린다(WCAG 1.4.11 예외).
 */
export const Chip = ({ label, selected = false, disabled = false, onClick, className, ref }) => (_jsx(BaseButton, { ref: ref, type: "button", "aria-pressed": selected, disabled: disabled, 
    // 계약은 `() => void` 다. 이벤트 객체를 넘기지 않는다(N-5).
    onClick: onClick && (() => onClick()), className: cn("inline-flex items-center justify-center border px-4 py-2 text-sm rounded-full", "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus", selected
        ? "border-brand bg-brand text-fg-on-brand hover:bg-brand-hover active:bg-brand-hover"
        : "border-border bg-surface text-fg hover:bg-surface-hover active:bg-surface-hover", disabled && "opacity-50 pointer-events-none", className), children: label }));
//# sourceMappingURL=chip.js.map