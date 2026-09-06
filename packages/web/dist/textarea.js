"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { component } from "@eeennsu/tokens";
import { cn } from "./cn.js";
import { controlBase, inputSizes } from "./input.js";
/**
 * 여러 줄 입력. `size` 는 글자 크기가 아니라 **행수**로 해석한다 — 3 / 5 / 8 (plan D-14).
 * 패딩과 글자 크기는 Input `md` 로 고정한다.
 */
export const Textarea = ({ label, size = "md", id, placeholder, disabled = false, invalid = false, value, defaultValue, onValueChange, className, ref, }) => {
    return (_jsx("textarea", { ref: ref, id: id, rows: component.textarea.rows[size], "aria-label": label, "aria-invalid": invalid || undefined, placeholder: placeholder, disabled: disabled, value: value, defaultValue: defaultValue, onChange: (event) => onValueChange?.(event.target.value), className: cn(controlBase, inputSizes.md, invalid && "border-danger", disabled && "opacity-50 pointer-events-none", className) }));
};
//# sourceMappingURL=textarea.js.map