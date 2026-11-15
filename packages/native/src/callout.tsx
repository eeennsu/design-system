import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
import { Text as RNText, View } from "react-native-css/components";
import { cn } from "./cn.js";
import { Icon } from "./icon.js";
import { tones } from "./text.js";

type CalloutProps = Contracts<"native">["Callout"];
type CalloutTone = NonNullable<CalloutProps["tone"]>;

/** `tone` 별 연한 채움(R28). 제목 · 아이콘 색은 Text 와 같은 `text-fg-<tone>` 이다. 웹과 같은 맵이다. */
const fills: Record<CalloutTone, string> = {
  info: "bg-info-subtle",
  success: "bg-success-subtle",
  warning: "bg-warning-subtle",
  danger: "bg-danger-subtle",
  brand: "bg-brand-subtle",
};

/**
 * 본문 흐름에서 한 구역을 짚는 상자(R28). 역할 없이 제목과 내용이 순서대로 읽힌다(C-13).
 * 테두리와 왼쪽 색 띠가 없다(알려진 동작 37). 레이아웃은 웹과 같은 아이콘 열 + 내용 열(제목 → `children`)이다.
 *
 * 웹과 다른 점 — RN 은 글자 속성이 상속되지 않는다.
 * - 루트에 웹의 `text-md text-fg` 와 `break-keep wrap-break-word` 가 없다. 제목은 스스로 `text-md` 를 갖고
 *   `children` 은 소비자가 놓는 Text 가 제 글자 스타일을 갖는다
 * - `className` 은 표면(View)에 붙고 글자 클래스(`text-*`)는 제목 · 내용 글자에 닿지 않는다(알려진 동작 22)
 * - RN `View` 는 세로 flex 라 루트가 `flex-row` 이고, 아이콘 열은 `h-6`(text-md 행간 24px) 안에서
 *   `justify-center` 로 20px 아이콘을 첫 줄에 맞춘다
 *
 * 아이콘은 공개 `Icon` 에 Callout `tone` 을 그대로 넘긴다. `label` 이 없어 꾸밈으로 숨는다.
 */
export const Callout: FC<CalloutProps> = ({ children, tone = "info", title, icon, className }) => (
  <View className={cn("flex-row gap-3 rounded-lg p-4", fills[tone], className)}>
    {icon ? (
      <View className="h-6 shrink-0 justify-center">
        <Icon name={icon} size="md" tone={tone} />
      </View>
    ) : null}
    <View className="min-w-0 flex-1">
      {title ? <RNText className={cn("font-sans text-md font-semibold", tones[tone])}>{title}</RNText> : null}
      {children}
    </View>
  </View>
);
