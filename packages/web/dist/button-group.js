"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "./cn.js";
/**
 * 관련 Button 을 묶는다. `label` 이 그룹의 접근성 이름이 된다(C-13).
 * 그룹 `size` 는 두지 않는다 — 자식 Button 이 각자 갖는다(plan D-30).
 */
export const ButtonGroup = ({ label, children, className }) => (_jsx("div", { role: "group", "aria-label": label, className: cn("inline-flex items-center gap-2", className), children: children }));
//# sourceMappingURL=button-group.js.map