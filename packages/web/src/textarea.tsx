"use client";

import { component, type Contracts } from "@eeennsu/tokens";
import type { FC, Ref } from "react";
import { cn } from "./cn.js";
import { controlBase, inputSizes } from "./input.js";

type TextareaProps = Contracts<"web">["Textarea"];

/**
 * 여러 줄 입력. `size` 는 글자 크기가 아니라 **행수**로 해석한다 — 3 / 5 / 8 (plan D-14).
 * 패딩과 글자 크기는 Input `md` 로 고정한다.
 */
export const Textarea: FC<TextareaProps> = ({
  label,
  size = "md",
  id,
  placeholder,
  disabled = false,
  invalid = false,
  value,
  defaultValue,
  onValueChange,
  className,
  ref,
}) => {
  return (
    <textarea
      ref={ref as Ref<HTMLTextAreaElement>}
      id={id}
      rows={component.textarea.rows[size]}
      aria-label={label}
      aria-invalid={invalid || undefined}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      defaultValue={defaultValue}
      onChange={(event) => onValueChange?.(event.target.value)}
      className={cn(
        controlBase,
        inputSizes.md,
        invalid && "border-danger",
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
    />
  );
};
