import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Pressable, Text as RNText, View } from "react-native-css/components";
import { cn } from "./cn.js";
import { Glyph } from "./icon.js";
import { stepStates } from "./step-states.js";
/**
 * 세로 단계 목록(R28). 제어 전용이고 펼친 단계만 `content` 를 마운트한다(알려진 동작 36). 웹과 같은 구조를
 * `View` · `Pressable` · `Text` 로 옮겼다 — 줄은 표시 열(`w-4`) + 내용 열이고, 지난 단계는 체크(muted),
 * 펼친 단계는 `border-l-2 border-brand` 막대, 남은 단계는 표시가 없다(decisions-r28 17).
 *
 * 접근성(C-13) — 목록 View 가 `label` 을 이름으로 갖는다. 줄마다 읽히는 단위는 줄 글이다.
 * 지난 단계 글은 `label + ", 완료"` 라벨로(dist 검사가 템플릿 리터럴을 막는다) 읽히고 `onValueChange` 가 있을 때만 `button` 이다(콜백은 값 하나, C-12).
 * 펼친 단계 글은 `accessibilityState.selected` 를 갖는다 — 줄 View 는 접근성 요소가 아니라(묶으면 `content` 안의
 * 컨트롤이 하나로 합쳐진다) 상태를 글에 붙였다. 남은 단계 글은 누를 수 없다.
 * `className` 은 목록 View 에 붙고 줄 글자에 닿지 않는다(알려진 동작 22).
 */
export const Stepper = ({ label, items, value, reached, onValueChange, className }) => {
    const states = stepStates(items, value, reached);
    return (_jsx(View, { accessibilityRole: "list", accessibilityLabel: label, className: cn(className), children: items.map((item, i) => {
            const state = states[i];
            return (_jsxs(View, { className: "flex-row gap-3 py-2", children: [_jsxs(View, { className: "h-6 w-4 shrink-0 items-center justify-center", children: [state === "done" ? _jsx(Glyph, { name: "check", size: "sm", className: "text-fg-muted" }) : null, state === "current" ? _jsx(View, { className: "h-full border-l-2 border-brand" }) : null] }), _jsxs(View, { className: "min-w-0 flex-1", children: [state === "done" && onValueChange ? (_jsx(Pressable, { accessibilityRole: "button", accessibilityLabel: item.label + ", 완료", onPress: () => onValueChange(item.value), className: "self-start active:opacity-80", children: _jsx(RNText, { className: "font-sans text-md text-fg-muted", children: item.label }) })) : state === "done" ? (_jsx(RNText, { accessibilityLabel: item.label + ", 완료", className: "font-sans text-md text-fg-muted", children: item.label })) : state === "current" ? (_jsx(RNText, { accessibilityState: { selected: true }, className: "font-sans text-md font-semibold text-fg", children: item.label })) : (_jsx(RNText, { className: "font-sans text-md text-fg-muted", children: item.label })), state === "current" && item.content !== undefined ? _jsx(View, { className: "mt-2", children: item.content }) : null] })] }, item.value));
        }) }));
};
//# sourceMappingURL=stepper.js.map