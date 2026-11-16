"use client";

import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
import { cn } from "./cn.js";
import { Glyph } from "./icon.js";

type StepState = "done" | "current" | "upcoming";

/**
 * 단계 상태. 어긋난 입력은 던지지 않는다 — `value` 가 없으면 전부 upcoming 이고,
 * `reached` 가 없거나 없는 값이면 `value` 를 끝으로 본다.
 */
export function stepStates(items: readonly { value: string }[], value: string, reached?: string): StepState[] {
  const values = items.map((item) => item.value);
  const vi = values.indexOf(value);
  if (vi < 0) return values.map(() => "upcoming");
  const last = Math.max(vi, reached === undefined ? -1 : values.indexOf(reached));
  return values.map((_, i) => (i === vi ? "current" : i <= last ? "done" : "upcoming"));
}

/** 단계 표시(R28). 번호 없이 지난 단계는 체크, 펼친 단계는 막대다. 되돌아가기는 `onValueChange` 가 있을 때만 버튼이다. */
export const Stepper: FC<Contracts<"web">["Stepper"]> = ({ label, items, value, reached, onValueChange, className }) => {
  const states = stepStates(items, value, reached);
  return (
    <ol aria-label={label} className={cn("flex flex-col", className)}>
      {items.map((item, i) => {
        const state = states[i];
        return (
          <li key={item.value} aria-current={state === "current" ? "step" : undefined} className="flex gap-3 py-2">
            <span className="flex h-6 w-4 shrink-0 items-center justify-center">
              {state === "done" ? <Glyph name="check" size="sm" className="text-fg-muted" /> : null}
              {state === "current" ? <span className="h-full border-l-2 border-brand" /> : null}
            </span>
            <div className="min-w-0 flex-1">
              {state === "current" ? (
                <p className="text-md font-semibold text-fg">{item.label}</p>
              ) : state === "done" && onValueChange ? (
                <button
                  type="button"
                  onClick={() => onValueChange(item.value)}
                  className="rounded-sm text-start text-md text-fg-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
                >
                  {item.label}
                  <span className="sr-only">, 완료</span>
                </button>
              ) : (
                <p className="text-md text-fg-muted">{item.label}</p>
              )}
              {state === "current" && item.content !== undefined ? <div className="mt-2">{item.content}</div> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
};
