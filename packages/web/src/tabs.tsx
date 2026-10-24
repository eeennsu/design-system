"use client";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
import { cn } from "./cn.js";

/**
 * 탭 목록과 패널(R27). `label` 은 `tablist` 의 접근성 이름이고 화면에 보이지 않는다(C-13).
 *
 * Base UI 기본을 그대로 쓴다 — 화살표는 포커스만 옮기고(`activateOnFocus` false) Enter · Space 가 활성화하며,
 * 숨은 패널은 마운트하지 않는다(알려진 동작 31). `Tabs.Indicator` 는 쓰지 않고 밑줄은 탭 버튼의 테두리다.
 * Base UI 의 기본 값은 숫자 `0` 이라 첫 항목 값을 명시하고, `onValueChange` 의 둘째 인자(eventDetails)는 버린다(C-12).
 */
export const Tabs: FC<Contracts<"web">["Tabs"]> = ({
  label,
  items,
  value,
  defaultValue,
  onValueChange,
  className,
}) => (
  <BaseTabs.Root
    value={value}
    defaultValue={defaultValue ?? items[0]?.value}
    onValueChange={(next) => {
      // 탭이 모두 사라지면 Base UI 가 null 을 알리므로 계약(string)에 맞게 문자열만 넘긴다.
      if (typeof next === "string") onValueChange?.(next);
    }}
    className={cn("flex flex-col", className)}
  >
    <BaseTabs.List aria-label={label} className="flex border-b border-border">
      {items.map((item) => (
        <BaseTabs.Tab
          key={item.value}
          value={item.value}
          className={cn(
            "-mb-px whitespace-nowrap px-4 py-2 text-md border-b-2 border-transparent text-fg-muted hover:text-fg data-[active]:border-brand data-[active]:text-fg",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
          )}
        >
          {item.label}
        </BaseTabs.Tab>
      ))}
    </BaseTabs.List>
    {items.map((item) => (
      <BaseTabs.Panel
        key={item.value}
        value={item.value}
        className={cn("pt-4", "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus")}
      >
        {item.content}
      </BaseTabs.Panel>
    ))}
  </BaseTabs.Root>
);
