import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "./cn.js";
/** 클래스는 전부 정적 리터럴이어야 `@source` 스캔이 잡는다(C-4 (2)). */
const directions = {
    row: "flex-row",
    column: "flex-col",
};
const aligns = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
};
const justifies = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
};
/**
 * flex 컨테이너. 배치의 1순위 수단이다.
 * 간격 prop 은 없다 — 소비자가 `className="gap-4"` 로 준다(C-14).
 * 기본 방향이 `column` 인 것은 RN `View` 기본과 맞추기 위해서다(§4.4).
 */
export const Stack = ({ children, direction = "column", align = "stretch", justify = "start", wrap = false, className, }) => (_jsx("div", { className: cn("flex", directions[direction], aligns[align], justifies[justify], wrap && "flex-wrap", className), children: children }));
//# sourceMappingURL=stack.js.map