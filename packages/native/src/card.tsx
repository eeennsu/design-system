import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
import { View } from "react-native-css/components";
import { cn } from "./cn.js";

/**
 * 표면 컨테이너. 웹 Card 와 같은 클래스 문자열이다(AC-25).
 * `variant` 를 두지 않는다 — 표면은 하나뿐이고 색을 바꾸려면 `className` 이다(§4.2).
 * 그림자 없이 canvas 와의 명도 차이로 구분되고, 1px `border-surface` 경계선이 더해진다(R26, R28, 알려진 동작 24).
 */
export const Card: FC<Contracts<"native">["Card"]> = ({ children, className }) => (
  <View className={cn("bg-surface border border-border-surface rounded-xl p-6", className)}>
    {children}
  </View>
);
