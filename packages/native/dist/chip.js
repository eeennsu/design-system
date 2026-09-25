import { jsx as _jsx } from "react/jsx-runtime";
import { Pressable, Text as RNText } from "react-native-css/components";
import { cn } from "./cn.js";
/**
 * 칩 높이는 38(py-2 + text-sm 20 + 테두리 2)이다. 세로 hitSlop 5 를 더해 누름 영역 48 을 채우고,
 * 가로는 최소 폭 48(`min-w-12`)을 둔다. 칩 줄 사이를 gap-3(12) 이상 띄우면 누름 영역이 서로
 * 겹치지 않는다(구현 노트 N-17, 알려진 동작 18).
 */
const hitSlop = { top: 5, bottom: 5 };
/**
 * 고르는 칩(N-17). 웹 Chip 과 같은 클래스이고(AC-25), Button 처럼 표면(Pressable)과
 * 전경(라벨 Text)으로 쪼갠다(N-12). 고른 상태는 `accessibilityState.selected` 로 알린다.
 * 라벨은 글자 크기 설정을 끝까지 따른다 — 칩 묶음은 줄을 바꿔 늘어난 글자를 받는다(WCAG 1.4.4, Button 과 같다).
 */
export const Chip = ({ label, selected = false, disabled = false, onPress, className, ref }) => (_jsx(Pressable, { ref: ref, accessibilityRole: "button", accessibilityLabel: label, accessibilityState: { selected, disabled }, disabled: disabled, hitSlop: hitSlop, 
    // 계약은 `() => void` 다. 누름 이벤트 객체를 넘기지 않는다.
    onPress: onPress && (() => onPress()), className: cn("flex-row items-center justify-center border px-4 py-2 rounded-full min-w-12", selected ? "border-brand bg-brand hover:bg-brand-hover" : "border-transparent bg-surface-muted hover:bg-surface-hover", 
    // 누르는 동안은 색이 아니라 투명도다 — 소비자가 배경을 바꿔도 따라간다(Button 과 같다)
    "active:opacity-80", disabled && "opacity-50", className), children: _jsx(RNText, { className: cn("font-sans text-sm", selected ? "text-fg-on-brand" : "text-fg"), children: label }) }));
//# sourceMappingURL=chip.js.map