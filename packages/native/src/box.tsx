import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
import { View } from "react-native-css/components";
import { cn } from "./cn.js";

/**
 * 스타일 없는 블록 컨테이너. `className` 을 붙일 자리다(웹 Box 와 같은 역할).
 * 배치 prop 은 Stack 만 갖는다(plan D-7). RN `View` 는 원래 세로 flex 라 웹 `div` 와 달리
 * 자식이 가로 폭으로 늘어난다 — 웹 Stack 의 기본값(`column` · `stretch`)과 같은 모양이다.
 */
export const Box: FC<Contracts<"native">["Box"]> = ({ children, className }) => (
  <View className={cn(className)}>{children}</View>
);
