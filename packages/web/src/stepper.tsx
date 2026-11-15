"use client";

import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
import { cn } from "./cn.js";
import { Glyph } from "./icon.js";

type StepperProps = Contracts<"web">["Stepper"];

/** 줄 하나의 상태. 지난(`done`) · 펼친(`current`) · 남은(`upcoming`) 셋이다(decisions-r28 16). */
export type StepState = "done" | "current" | "upcoming";

/**
 * 항목마다 상태를 정한다. 어긋난 입력에도 던지지 않는다(알려진 동작 36).
 * - `value` 가 어느 항목과도 맞지 않으면 전부 남은 단계다
 * - `reached` 가 없거나, 없는 항목이거나, `value` 보다 앞이면 `value` 를 따른다
 * - `value` 가 펼친 단계, 그 밖에 `max(value, reached)` 까지가 지난 단계, 나머지가 남은 단계다
 */
export function stepStates(items: readonly { value: string }[], value: string, reached?: string): StepState[] {
  const values = items.map((item) => item.value);
  const vi = values.indexOf(value);
  if (vi < 0) return values.map(() => "upcoming");
  const last = Math.max(vi, reached === undefined ? -1 : values.indexOf(reached));
  return values.map((_, i) => (i === vi ? "current" : i <= last ? "done" : "upcoming"));
}

/** 지난 단계 뜻을 보조 기술에 붙여 읽힌다(C-13). 보이는 글은 줄 `label` 뿐이다. */
const doneText = <span className="sr-only">, 완료</span>;

/**
 * 세로 단계 목록(R28). 제어 전용이고 펼친 단계만 `content` 를 마운트한다(알려진 동작 36).
 *
 * 줄은 표시 열(`w-4`, 아이콘 sm 폭) + 내용 열이라 모든 줄의 글자 왼쪽이 맞는다. 지난 단계는 체크(muted),
 * 펼친 단계는 `border-l-2 border-brand` 막대, 남은 단계는 표시가 없다. 번호 · 원 · 연결선 · 상자를 그리지 않는다(decisions-r28 17).
 * `onValueChange` 가 있을 때만 지난 단계 줄 글이 `type="button"` 버튼이고 콜백은 값 하나만 받는다(C-12).
 * 화살표 이동은 없고 버튼의 Tab 순서를 따른다.
 * `role="list"` 는 preflight 의 `list-style: none` 에서 WebKit 이 목록 역할을 빼는 것을 막는다.
 * 항목 `value` 는 서로 달라야 한다(React key 이자 단계 식별자다).
 */
export const Stepper: FC<StepperProps> = ({ label, items, value, reached, onValueChange, className }) => {
  const states = stepStates(items, value, reached);
  return (
    <ol role="list" aria-label={label} className={cn("flex flex-col", className)}>
      {items.map((item, i) => {
        const state = states[i];
        return (
          <li
            key={item.value}
            aria-current={state === "current" ? "step" : undefined}
            className="flex gap-3 py-2"
          >
            <span className="flex h-6 w-4 shrink-0 items-center justify-center">
              {state === "done" ? <Glyph name="check" size="sm" className="text-fg-muted" /> : null}
              {state === "current" ? <span className="h-full border-l-2 border-brand" /> : null}
            </span>
            <div className="min-w-0 flex-1">
              {state === "done" && onValueChange ? (
                <button
                  type="button"
                  onClick={() => onValueChange(item.value)}
                  className="text-start text-md text-fg-muted hover:text-fg rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
                >
                  {item.label}
                  {doneText}
                </button>
              ) : state === "done" ? (
                <p className="text-md text-fg-muted">
                  {item.label}
                  {doneText}
                </p>
              ) : state === "current" ? (
                <p className="text-md font-semibold text-fg">{item.label}</p>
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
