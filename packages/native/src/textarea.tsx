import { component, type Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
import { cn } from "./cn.js";
import { controlBase, inputSizes, invalidBorder, placeholderColor } from "./input.js";
import { labelNativeId } from "./label.js";
import { StyledTextInput } from "./text-input.js";

type TextareaProps = Contracts<"native">["Textarea"];

/**
 * 여러 줄 입력. `size` 는 글자 크기가 아니라 **행수**로 해석한다 — 3 / 5 / 8 (plan D-14).
 * 패딩과 글자 크기는 Input `md` 로 고정한다. 웹 `rows` 는 RN `numberOfLines` 로 간다.
 *
 * `textAlignVertical="top"` 이 없으면 Android 가 여러 줄 입력의 글자를 세로 가운데에 놓는다.
 * 웹 textarea 는 위에서 시작하므로 맞춘다.
 *
 * `invalid` 는 Input 과 같이 테두리 색까지만 간다 — RN 에 `aria-invalid` 가 없다(구현 노트 F-16).
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
}) => (
  <StyledTextInput
    ref={ref as TextareaProps["ref"] & undefined}
    id={id}
    multiline
    numberOfLines={component.textarea.rows[size]}
    textAlignVertical="top"
    accessibilityLabel={label}
    accessibilityLabelledBy={id ? labelNativeId(id) : undefined}
    placeholder={placeholder}
    placeholderClassName={placeholderColor}
    editable={!disabled}
    value={value}
    defaultValue={defaultValue}
    onChangeText={onValueChange}
    className={cn(
      controlBase,
      inputSizes.md,
      invalid && invalidBorder,
      disabled && "opacity-50",
      className,
    )}
  />
);
