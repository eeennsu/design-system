import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "./cn.js";
/**
 * Input · Textarea 의 가시 라벨. `htmlFor` 와 컨트롤의 `id` 로 연결한다(C-13).
 * 비인터랙티브라 `label` prop 대상이 아니다 — 가시 텍스트가 곧 내용이다.
 */
export const Label = ({ children, htmlFor, className }) => (_jsx("label", { htmlFor: htmlFor, className: cn("text-sm text-fg", className), children: children }));
//# sourceMappingURL=label.js.map