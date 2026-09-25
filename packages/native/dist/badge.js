import { jsx as _jsx } from "react/jsx-runtime";
import { Text as RNText, View } from "react-native-css/components";
import { cn } from "./cn.js";
/**
 * Button 과 같은 이유로 variant 를 표면(View)과 전경(Text) 둘로 쪼갠다 — RN 은 View → Text 로
 * 색이 상속되지 않는다(구현 노트 N-12). 클래스 이름은 웹 Badge 와 같은 어휘다(AC-25).
 */
const surfaces = {
    primary: "bg-brand",
    secondary: "bg-surface-muted",
    danger: "bg-danger",
};
const foregrounds = {
    primary: "text-fg-on-brand",
    secondary: "text-fg",
    danger: "text-fg-on-danger",
};
/** 투명 테두리는 웹과 같이 Input 과 높이를 맞추기 위해서다(plan D-6). */
const boxes = {
    sm: "px-2 py-0 rounded-full",
    md: "px-3 py-1 rounded-full",
};
/**
 * 짧은 상태 표시. 웹은 `inline-flex` 라 블록 흐름에서 글자 폭만큼 줄지만 RN 에는 인라인이 없다 —
 * 세로 방향 부모 안에서는 부모 폭으로 늘어난다(웹도 Stack 안에서는 같다). 줄이려면 소비자가
 * `className="self-start"` 를 준다. 기본값으로 넣지 않는 이유는 `align="center"` 인 가로 Stack 에서
 * 세로 가운데 정렬을 깨뜨리기 때문이다.
 */
export const Badge = ({ children, variant = "secondary", size = "sm", className }) => (_jsx(View, { className: cn("flex-row items-center border border-transparent", surfaces[variant], boxes[size], className), children: _jsx(RNText, { className: cn("font-sans", foregrounds[variant], "text-sm"), children: children }) }));
//# sourceMappingURL=badge.js.map