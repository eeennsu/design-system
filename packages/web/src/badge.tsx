import type { BadgeSize, Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
import { cn } from "./cn.js";

type BadgeProps = Contracts<"web">["Badge"];
type BadgeVariant = NonNullable<BadgeProps["variant"]>;

/** Button 과 같은 semantic 매핑이되 hover 가 없다(§4.2). */
const variants: Record<BadgeVariant, string> = {
  primary: "bg-brand text-fg-on-brand",
  secondary: "bg-surface-muted text-fg",
  danger: "bg-danger text-fg-on-danger",
};

/**
 * 투명 테두리를 둔다 — 같은 `py + text` 조합에서 Input 과 높이를 맞추기 위해서다(plan D-6).
 */
const sizes: Record<BadgeSize, string> = {
  sm: "px-2 py-0 text-sm rounded-full",
  md: "px-3 py-1 text-sm rounded-full",
};

export const Badge: FC<BadgeProps> = ({ children, variant = "secondary", size = "sm", className }) => (
  <span
    className={cn(
      "inline-flex items-center border border-transparent",
      variants[variant],
      sizes[size],
      className,
    )}
  >
    {children}
  </span>
);
