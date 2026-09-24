import type { Contracts, ControlSize, Variant } from "@eeennsu/tokens";
import type { FC } from "react";
import type { Insets } from "react-native";
import { Pressable, Text as RNText } from "react-native-css/components";
import { cn } from "./cn.js";
import { Glyph } from "./icon.js";

type ButtonProps = Contracts<"native">["Button"];

/**
 * 웹은 배경과 글자색을 버튼 하나에 얹지만 RN 은 View → Text 로 색이 상속되지 않는다.
 * 그래서 variant 를 표면(컨테이너)과 전경(라벨 Text) 둘로 쪼갠다. 클래스 이름 자체는
 * 웹과 같은 어휘다(AC-25). `hover:` 는 RN 에서 무동작이지만 어휘를 맞추려고 남긴다.
 * 눌림 표시는 `active:` 다 — react-native-css 가 Pressable 의 누름 상태로 푼다(N-17).
 */
const surfaces: Record<Variant, string> = {
  primary: "bg-brand hover:bg-brand-hover active:bg-brand-hover",
  secondary: "bg-surface-muted hover:bg-surface-hover active:bg-surface-hover",
  ghost: "hover:bg-surface-hover active:bg-surface-hover",
  danger: "bg-danger hover:bg-danger-hover active:bg-danger-hover",
};

const foregrounds: Record<Variant, string> = {
  primary: "text-fg-on-brand",
  secondary: "text-fg",
  ghost: "text-fg",
  danger: "text-fg-on-danger",
};

/** 높이는 고정 `h-*` 없이 `py + text + 투명 테두리` 로 만든다 — 30 / 42 / 54 (plan D-6). */
const boxes: Record<ControlSize, string> = {
  sm: "px-3 py-1 rounded-md gap-1",
  md: "px-4 py-2 rounded-md gap-2",
  lg: "px-6 py-3 rounded-lg gap-2",
};

/**
 * 누름 영역을 48dp 로 채우는 세로 여유(N-17). 높이 30 · 42 · 54 는 Input 과 맞춘 값이라(plan D-6)
 * 모양은 두고 누름 영역만 넓힌다. 가로는 라벨과 패딩으로 이미 48 을 넘는다.
 */
const hitSlops: Record<ControlSize, Insets | undefined> = {
  sm: { top: 9, bottom: 9 },
  md: { top: 3, bottom: 3 },
  lg: undefined,
};

const labels: Record<ControlSize, string> = {
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
};

/**
 * 누름 버튼. `label` 이 가시 텍스트 겸 접근성 이름이다(C-13) — `children` 이 없다.
 * `label` 은 아이콘이 있어도 항상 렌더된다(알려진 동작 9).
 *
 * `ref` 는 호스트 인스턴스를 그대로 넘긴다. RN 의 `NativeMethods` 가 `focus()` · `blur()`
 * 를 가지므로 `FocusHandle` 을 구조적으로 만족한다(웹 N-4 와 같은 처리).
 *
 * 비활성은 `disabled` prop 으로 처리한다 — 웹의 `pointer-events-none` 에 해당하는
 * 클래스가 RN 에 없다. 흐려 보이는 것만 `opacity-50` 으로 맞춘다.
 */
export const Button: FC<ButtonProps> = ({
  label,
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  disabled = false,
  onPress,
  className,
  ref,
}) => {
  const inactive = disabled || loading;
  const foreground = foregrounds[variant];

  return (
    <Pressable
      ref={ref as ButtonProps["ref"] & undefined}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive }}
      disabled={inactive}
      hitSlop={hitSlops[size]}
      // 계약은 `() => void` 다. 그대로 넘기면 누름 이벤트 객체가 새어 나간다.
      onPress={onPress && (() => onPress())}
      className={cn(
        "flex-row items-center justify-center border border-transparent",
        surfaces[variant],
        boxes[size],
        inactive && "opacity-50",
        className,
      )}
    >
      {loading ? (
        <Glyph name="loader" size={size} className={foreground} />
      ) : icon ? (
        <Glyph name={icon} size={size} className={foreground} />
      ) : null}
      <RNText className={cn(foreground, labels[size])}>{label}</RNText>
    </Pressable>
  );
};
