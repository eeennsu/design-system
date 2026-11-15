import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "./cn.js";
import { Icon } from "./icon.js";
import { tones } from "./text.js";
/** `tone` 별 연한 채움(R28). 제목 · 아이콘 색은 Text 와 같은 `text-fg-<tone>` 이다. */
const fills = {
    info: "bg-info-subtle",
    success: "bg-success-subtle",
    warning: "bg-warning-subtle",
    danger: "bg-danger-subtle",
    brand: "bg-brand-subtle",
};
/**
 * 본문 흐름에서 한 구역을 짚는 상자(R28). 정적 내용이라 `role="note"` 이고(`alert` 가 아니다)
 * 훅 · 이벤트가 없어 `"use client"` 대상이 아니다(C-4).
 *
 * 테두리와 왼쪽 색 띠가 없다(알려진 동작 37). 레이아웃은 아이콘 열 + 내용 열(제목 → `children`, 사이 `gap-1`)이다.
 * 아이콘 열은 `h-6`(text-md 행간 24px) 안에서 가운데라 20px 아이콘이 첫 줄과 맞는다.
 * 아이콘은 공개 `Icon` 에 Callout `tone` 을 그대로 넘긴다(`Tone` 의 부분집합). `label` 이 없어 꾸밈으로 숨는다 —
 * `icon` 은 기본값이 없고 뜻은 `title` 이나 본문 글이 전한다.
 * 루트의 `break-keep` 은 한국어를 어절 단위로 바꾸고 `wrap-break-word` 는 줄보다 긴 URL 을 끊는다.
 */
export const Callout = ({ children, tone = "info", title, icon, className }) => (_jsxs("div", { role: "note", className: cn("flex gap-3 rounded-lg p-4 text-md text-fg break-keep wrap-break-word", fills[tone], className), children: [icon ? (_jsx("span", { className: "flex h-6 shrink-0 items-center", children: _jsx(Icon, { name: icon, size: "md", tone: tone }) })) : null, _jsxs("div", { className: "flex min-w-0 flex-1 flex-col gap-1", children: [title ? _jsx("p", { className: cn("font-semibold", tones[tone]), children: title }) : null, children] })] }));
//# sourceMappingURL=callout.js.map