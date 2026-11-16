import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
import { Text as RNText, View } from "react-native-css/components";
import { cn } from "./cn.js";
import { Icon } from "./icon.js";

type CalloutTone = NonNullable<Contracts<"native">["Callout"]["tone"]>;

const fills: Record<CalloutTone, string> = {
  info: "bg-info-subtle",
  success: "bg-success-subtle",
  warning: "bg-warning-subtle",
  danger: "bg-danger-subtle",
  brand: "bg-brand-subtle",
};

const titles: Record<CalloutTone, string> = {
  info: "text-fg-info",
  success: "text-fg-success",
  warning: "text-fg-warning",
  danger: "text-fg-danger",
  brand: "text-fg-brand",
};

/**
 * 안내 상자(R28). 테두리 없이 tone 채움만 쓴다. 아이콘은 꾸밈이라 이름이 없다.
 * `className` 은 표면(View)에만 붙고 글자 클래스는 안쪽 Text 에 닿지 않는다(알려진 동작 22) —
 * 본문 글은 `children` 이 직접 정한다.
 */
export const Callout: FC<Contracts<"native">["Callout"]> = ({ children, tone = "info", title, icon, className }) => (
  <View className={cn("flex-row gap-3 rounded-lg p-4", fills[tone], className)}>
    {icon === undefined ? null : <Icon name={icon} tone={tone} />}
    <View className="min-w-0 flex-1">
      {title === undefined ? null : <RNText className={cn("font-sans font-semibold", titles[tone])}>{title}</RNText>}
      {children}
    </View>
  </View>
);
