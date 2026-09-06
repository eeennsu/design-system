import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "./cn.js";
/** `tone` 은 fg semantic 색과 1:1 이다(C-8). `danger` 는 `bg.danger` 별칭이다(plan D-3). */
const tones = {
    default: "text-fg",
    muted: "text-fg-muted",
    danger: "text-fg-danger",
};
/** 스텝 하나가 크기·행간·무게를 함께 바꾼다(C-6 복합 폰트 변수). */
const steps = {
    sm: "text-sm",
    md: "text-md",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
};
/**
 * 텍스트. `heading` 이 있으면 그 레벨의 제목 엘리먼트로 렌더한다 —
 * 시각적 크기는 `size` 가 정하므로 의미와 크기가 분리된다.
 */
export const Text = ({ children, tone = "default", size = "md", heading, className }) => {
    const merged = cn(tones[tone], steps[size], className);
    if (heading === "1")
        return _jsx("h1", { className: merged, children: children });
    if (heading === "2")
        return _jsx("h2", { className: merged, children: children });
    if (heading === "3")
        return _jsx("h3", { className: merged, children: children });
    return _jsx("span", { className: merged, children: children });
};
//# sourceMappingURL=text.js.map