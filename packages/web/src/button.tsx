"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import type { Contracts, ControlSize, Variant } from "@eeennsu/tokens";
import type { FC, Ref } from "react";
import { cn } from "./cn.js";
import { Glyph } from "./icon.js";

type ButtonProps = Contracts<"web">["Button"];

/**
 * variant → semantic 색 매핑(§4.2). ghost 만 배경이 없다.
 * `active:` 는 누르는 동안의 표면이다 — RN 에는 hover 가 없어 눌림 표시를 이것으로 낸다(N-17).
 * 웹도 같은 클래스를 가져 두 플랫폼의 어휘가 같다(AC-25).
 */
const variants: Record<Variant, string> = {
  primary: "bg-brand text-fg-on-brand hover:bg-brand-hover active:bg-brand-hover",
  secondary: "bg-surface-muted text-fg hover:bg-surface-hover active:bg-surface-hover",
  ghost: "text-fg hover:bg-surface-hover active:bg-surface-hover",
  danger: "bg-danger text-fg-on-danger hover:bg-danger-hover active:bg-danger-hover",
};

/** 높이는 고정 `h-*` 없이 `py + text + 투명 테두리` 로 만든다 — 30 / 42 / 54 (plan D-6). */
const sizes: Record<ControlSize, string> = {
  sm: "px-3 py-1 text-sm rounded-md gap-1",
  md: "px-4 py-2 text-md rounded-md gap-2",
  lg: "px-6 py-3 text-lg rounded-lg gap-2",
};

/**
 * 누름 버튼. `label` 이 가시 텍스트이자 접근성 이름이다 — `children` 이 없어
 * WCAG 2.5.3(Label in Name) 위반 경로가 사라진다(C-13).
 *
 * `label` 은 아이콘 전용 모드에서도 항상 렌더된다(알려진 동작 9).
 * `type="button"` 을 고정한다 — 기본값 `submit` 이면 `<form>` 안에서 Enter 가
 * 암묵적 제출을 일으켜 `onClick` 이 실행된다(C-21).
 *
 * `ref` 는 엘리먼트를 그대로 넘긴다. HTMLElement 가 `FocusHandle` 을 구조적으로 만족하므로
 * 계약 타입은 `Ref<FocusHandle>` 로 닫힌 채다(넓히는 방향은 스펙이 "추가적"이라 못박았다, C-17).
 * 구성한 핸들을 넘기면 Base UI Tooltip 이 이 Button 을 앵커로 쓸 때 floating-ui 가
 * `getBoundingClientRect` 를 찾지 못해 위치 계산이 깨진다.
 */
export const Button: FC<ButtonProps> = ({
  label,
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  disabled = false,
  onClick,
  className,
  ref,
}) => {
  const inactive = disabled || loading;

  return (
    <BaseButton
      ref={ref as Ref<HTMLElement>}
      type="button"
      disabled={inactive}
      // 계약은 `() => void` 다. 그대로 넘기면 이벤트 객체가 새어 나가
      // `onClick={setOpen}` 같은 코드가 이벤트를 상태로 넣는다.
      onClick={onClick && (() => onClick())}
      className={cn(
        "inline-flex items-center justify-center border border-transparent",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
        variants[variant],
        sizes[size],
        inactive && "opacity-50 pointer-events-none",
        className,
      )}
    >
      {loading ? <Glyph name="loader" size={size} spin /> : icon ? <Glyph name={icon} size={size} /> : null}
      {label}
    </BaseButton>
  );
};
