import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "./cn.js";
/** 열 정렬(decisions-r27 8). `end` 는 숫자 열이라 고정폭 숫자도 함께 켠다. */
const ALIGN = {
    start: "text-start",
    end: "text-end tabular-nums",
};
/**
 * 데이터 표(R27). 루트는 가로 스크롤 영역이라 넘치지 않아도 Tab 정지점이다(decisions-r27 10, 알려진 동작 29).
 * `label` 이 있으면 보이는 `<caption>` 이고, 포커스 받는 영역이 이름 없는 덩어리로 읽히지 않게 `region` 도 겸한다.
 * 행 key 는 인덱스다 — 표는 표시용이라 행 안에 상태를 두지 않는다.
 */
export const Table = ({ label, columns, rows, className }) => (_jsx("div", { tabIndex: 0, role: label ? "region" : undefined, "aria-label": label || undefined, className: cn("overflow-x-auto", "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus", className), children: _jsxs("table", { className: "w-full text-sm", children: [label ? _jsx("caption", { className: "text-start text-sm text-fg-muted pb-2", children: label }) : null, _jsx("thead", { children: _jsx("tr", { children: columns.map((column, columnIndex) => (_jsx("th", { scope: "col", className: cn("whitespace-nowrap px-3 py-2 text-fg-muted border-b border-border", ALIGN[column.align ?? "start"]), children: column.label }, columnIndex))) }) }), _jsx("tbody", { children: rows.map((row, rowIndex) => (_jsx("tr", { children: row.cells.map((cell, cellIndex) => (_jsx("td", { className: cn("whitespace-nowrap px-3 py-2 text-sm text-fg border-b border-border", ALIGN[columns[cellIndex]?.align ?? "start"]), children: cell }, cellIndex))) }, rowIndex))) })] }) }));
//# sourceMappingURL=table.js.map