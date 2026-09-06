import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
import { cn } from "./cn.js";

/**
 * 표면 컨테이너. `variant` 를 두지 않는다 — 표면은 하나뿐이고
 * 색을 바꾸려면 `className` 이다(§4.2).
 */
export const Card: FC<Contracts<"web">["Card"]> = ({ children, className }) => (
  <div className={cn("bg-surface border border-border rounded-lg shadow-sm p-4", className)}>
    {children}
  </div>
);
