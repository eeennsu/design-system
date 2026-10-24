"use client";

import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
import { cn } from "./cn.js";
import { Glyph } from "./icon.js";

/**
 * 접고 펴는 패널(R27). `label` 은 트리거의 보이는 글자이자 접근성 이름이다(C-13).
 *
 * 상자는 없고 트리거 줄과 패널뿐이다 — 상자로 보이려면 Card 안에 둔다(알려진 동작 32).
 * `keepMounted` · `hiddenUntilFound` 는 Base UI 기본(false)이라 닫힌 패널은 마운트하지 않는다(알려진 동작 31).
 * 기본은 닫힘이다. `onOpenChange` 의 둘째 인자(eventDetails)는 버리고 boolean 하나만 넘긴다(Dialog 와 같다).
 */
export const Collapsible: FC<Contracts<"web">["Collapsible"]> = ({
  label,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  className,
}) => (
  <BaseCollapsible.Root
    open={open}
    defaultOpen={defaultOpen}
    onOpenChange={(next) => onOpenChange?.(next)}
    className={className}
  >
    <BaseCollapsible.Trigger
      className={cn(
        "group flex w-full items-center justify-between gap-2 border border-transparent rounded-md px-3 py-2 text-md text-fg text-start hover:bg-surface-hover",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
      )}
    >
      {label}
      <Glyph name="chevron-down" className="text-fg-muted transition-transform group-data-[panel-open]:rotate-180" />
    </BaseCollapsible.Trigger>
    <BaseCollapsible.Panel className="px-3 pt-2">{children}</BaseCollapsible.Panel>
  </BaseCollapsible.Root>
);
