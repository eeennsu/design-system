"use client";

import type { Contracts, ControlSize, InputKind } from "@eeennsu/tokens";
import type { FC, Ref } from "react";
import { cn } from "./cn.js";

type InputProps = Contracts<"web">["Input"];

/**
 * `kind` → DOM 속성 매핑(C-11). 계약은 열거형 4값뿐이고 이 표는 어댑터 구현 세부다.
 * `number` 가 `type="number"` 가 아닌 이유는 스피너를 띄우지 않기 위해서다.
 * 자동완성은 `new-password` 를 구분하지 않는다(알려진 동작 8).
 */
const kinds: Record<
  InputKind,
  { type: string; inputMode?: "numeric"; autoComplete?: "current-password" | "email" }
> = {
  text: { type: "text" },
  password: { type: "password", autoComplete: "current-password" },
  email: { type: "email", autoComplete: "email" },
  number: { type: "text", inputMode: "numeric" },
};

export const inputSizes: Record<ControlSize, string> = {
  sm: "px-3 py-1 text-sm rounded-md",
  md: "px-3 py-2 text-md rounded-md",
  lg: "px-4 py-3 text-lg rounded-md",
};

/**
 * 테두리 1px 이 Button 과 높이를 맞춘다 — 없으면 Input 이 2px 낮다(plan D-6).
 * R26 부터 테두리는 투명이고 칸은 `surface-muted` 채움으로 보인다(알려진 동작 25). 오류 때만 색이 생긴다.
 */
export const controlBase =
  "block w-full bg-surface-muted text-fg border border-transparent placeholder:text-fg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus";

/**
 * 한 줄 입력. `label` 은 `aria-label` 로만 간다 — 가시 라벨은 `Label` 조합이다(C-13).
 * 값 제어는 `value` / `defaultValue` / `onValueChange` 3종뿐이다(C-12).
 */
export const Input: FC<InputProps> = ({
  label,
  kind = "text",
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
  const attributes = kinds[kind];

  return (
    <input
      ref={ref as Ref<HTMLInputElement>}
      id={id}
      type={attributes.type}
      inputMode={attributes.inputMode}
      autoComplete={attributes.autoComplete}
      aria-label={label}
      aria-invalid={invalid || undefined}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      defaultValue={defaultValue}
      onChange={(event) => onValueChange?.(event.target.value)}
      className={cn(
        controlBase,
        inputSizes[size],
        invalid && "border-danger",
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
    />
  );
};
