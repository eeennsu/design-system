import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "./cn.js";
import { steps, tones } from "./text.js";
/**
 * 혼자 놓이는 링크(R28). `<a href>` 문서 이동이고 클라이언트 라우터와 연동하지 않는다(알려진 동작 33).
 * 이벤트 prop 이 없어 `"use client"` 대상이 아니다 — 서버 컴포넌트에서 렌더된다(C-4).
 *
 * 색 · 크기는 Text 의 `tones` · `steps` 맵을 그대로 쓴다. 밑줄은 hover · 포커스에서만 보인다 —
 * 문단 속에서 색만으로 링크를 구분하지 않도록 문단 속 링크는 늘 밑줄인 Prose `a` 를 쓴다(WCAG 1.4.1).
 */
export const Link = ({ label, href, tone = "brand", size = "md", className }) => (_jsx("a", { href: href, className: cn("rounded-sm hover:underline focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus", tones[tone], steps[size], className), children: label }));
//# sourceMappingURL=link.js.map