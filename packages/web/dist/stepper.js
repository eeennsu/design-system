"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "./cn.js";
import { Glyph } from "./icon.js";
/**
 * 단계 상태. 어긋난 입력은 던지지 않는다 — `value` 가 없으면 전부 upcoming 이고,
 * `reached` 가 없거나 없는 값이면 `value` 를 끝으로 본다.
 */
export function stepStates(items, value, reached) {
    const values = items.map((item) => item.value);
    const vi = values.indexOf(value);
    if (vi < 0)
        return values.map(() => "upcoming");
    const last = Math.max(vi, reached === undefined ? -1 : values.indexOf(reached));
    return values.map((_, i) => (i === vi ? "current" : i <= last ? "done" : "upcoming"));
}
/** 단계 표시(R28). 번호 없이 지난 단계는 체크, 펼친 단계는 막대다. 되돌아가기는 `onValueChange` 가 있을 때만 버튼이다. */
export const Stepper = ({ label, items, value, reached, onValueChange, className }) => {
    const states = stepStates(items, value, reached);
    return (_jsx("ol", { "aria-label": label, className: cn("flex flex-col", className), children: items.map((item, i) => {
            const state = states[i];
            return (_jsxs("li", { "aria-current": state === "current" ? "step" : undefined, className: "flex gap-3 py-2", children: [_jsxs("span", { className: "flex h-6 w-4 shrink-0 items-center justify-center", children: [state === "done" ? _jsx(Glyph, { name: "check", size: "sm", className: "text-fg-muted" }) : null, state === "current" ? _jsx("span", { className: "h-full border-l-2 border-brand" }) : null] }), _jsxs("div", { className: "min-w-0 flex-1", children: [state === "current" ? (_jsx("p", { className: "text-md font-semibold text-fg", children: item.label })) : state === "done" && onValueChange ? (_jsxs("button", { type: "button", onClick: () => onValueChange(item.value), className: "rounded-sm text-start text-md text-fg-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus", children: [item.label, _jsx("span", { className: "sr-only", children: ", \uC644\uB8CC" })] })) : (_jsx("p", { className: "text-md text-fg-muted", children: item.label })), state === "current" && item.content !== undefined ? _jsx("div", { className: "mt-2", children: item.content }) : null] })] }, item.value));
        }) }));
};
//# sourceMappingURL=stepper.js.map