import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
import { cn } from "./cn.js";

/**
 * 표면 컨테이너. `variant` 를 두지 않는다 — 표면은 하나뿐이고
 * 색을 바꾸려면 `className` 이다(§4.2).
 * 테두리 1px 은 `border.surface` 색이다 — base 는 투명이고, 소비자가 `:root` 에서 선을 켤 수 있다(R28, 알려진 동작 24).
 */
export const Card: FC<Contracts<"web">["Card"]> = ({ children, className }) => (
  <div className={cn("bg-surface rounded-xl p-6 border border-border-surface", className)}>
    {children}
  </div>
);
