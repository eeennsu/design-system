import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
import { cn } from "./cn.js";
import { Icon } from "./icon.js";

type CalloutTone = NonNullable<Contracts<"web">["Callout"]["tone"]>;

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

/** 안내 상자(R28). 테두리 없이 tone 채움만 쓴다. 아이콘은 꾸밈이라 이름이 없다. */
export const Callout: FC<Contracts<"web">["Callout"]> = ({ children, tone = "info", title, icon, className }) => (
  <div
    role="note"
    className={cn("flex gap-3 rounded-lg p-4 text-md text-fg break-keep wrap-break-word", fills[tone], className)}
  >
    {icon === undefined ? null : <Icon name={icon} tone={tone} />}
    <div className="min-w-0 flex-1">
      {title === undefined ? null : <p className={cn("font-semibold", titles[tone])}>{title}</p>}
      {children}
    </div>
  </div>
);
