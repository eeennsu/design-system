import { jsx as _jsx } from "react/jsx-runtime";
import { Pressable, Text as RNText } from "react-native-css/components";
import { cn } from "./cn.js";
import { steps, tones } from "./text.js";
/**
 * 글 속 링크(R28). 표면(Pressable)과 글(Text)로 쪼갠다. `className` 은 표면에만 붙고
 * 글자 클래스(색 · 크기)는 안쪽 Text 에 닿지 않는다(알려진 동작 22) — 색은 `tone` 으로 바꾼다.
 */
export const Link = ({ label, onPress, tone = "brand", size = "md", className }) => (_jsx(Pressable, { accessibilityRole: "link", accessibilityLabel: label, 
    // 계약은 `() => void` 다. 누름 이벤트 객체를 넘기지 않는다.
    onPress: () => onPress(), className: cn("self-start active:opacity-80", className), children: _jsx(RNText, { className: cn("font-sans", tones[tone], steps[size]), children: label }) }));
//# sourceMappingURL=link.js.map