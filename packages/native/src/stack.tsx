import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
import { View } from "react-native-css/components";
import { cn } from "./cn.js";

type StackProps = Contracts<"native">["Stack"];

/** 클래스는 전부 정적 리터럴이어야 `@source` 스캔이 잡는다(C-4 (2)). */
const directions: Record<NonNullable<StackProps["direction"]>, string> = {
  row: "flex-row",
  column: "flex-col",
};

const aligns: Record<NonNullable<StackProps["align"]>, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifies: Record<NonNullable<StackProps["justify"]>, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

/**
 * flex 컨테이너. 웹 Stack 과 **같은 클래스 문자열**을 낸다(AC-25).
 * 간격 prop 은 없다 — 소비자가 `className="gap-4"` 로 준다(C-14).
 */
export const Stack: FC<StackProps> = ({
  children,
  direction = "column",
  align = "stretch",
  justify = "start",
  wrap = false,
  className,
}) => (
  <View
    className={cn(
      "flex",
      directions[direction],
      aligns[align],
      justifies[justify],
      wrap && "flex-wrap",
      className,
    )}
  >
    {children}
  </View>
);
