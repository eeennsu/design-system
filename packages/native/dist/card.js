import { jsx as _jsx } from "react/jsx-runtime";
import { View } from "react-native-css/components";
import { cn } from "./cn.js";
/**
 * 표면 컨테이너. 웹 Card 와 같은 클래스 문자열이다(AC-25).
 * `variant` 를 두지 않는다 — 표면은 하나뿐이고 색을 바꾸려면 `className` 이다(§4.2).
 */
export const Card = ({ children, className }) => (_jsx(View, { className: cn("bg-surface border border-border rounded-lg shadow-sm p-4", className), children: children }));
//# sourceMappingURL=card.js.map