import { jsx as _jsx } from "react/jsx-runtime";
import { TextInput } from "react-native-css/components";
import { cn } from "./cn.js";
import { labelNativeId } from "./label.js";
/**
 * `kind` → RN `TextInput` 속성 매핑(C-11). 계약은 열거형 4값뿐이고 이 표는 어댑터 구현 세부다.
 * 자동완성은 `new-password` 를 구분하지 않는다(알려진 동작 8).
 */
const kinds = {
    text: {},
    password: {
        secureTextEntry: true,
        autoComplete: "password",
        textContentType: "password",
    },
    email: {
        keyboardType: "email-address",
        autoCapitalize: "none",
        autoComplete: "email",
        textContentType: "emailAddress",
    },
    number: { keyboardType: "numeric" },
};
/** 웹 Input 과 같은 크기 클래스다(AC-25). 웹의 `text-*` 는 여기서도 같은 스텝을 쓴다. */
export const inputSizes = {
    sm: "px-3 py-1 text-sm rounded-md",
    md: "px-3 py-2 text-md rounded-md",
    lg: "px-4 py-3 text-lg rounded-md",
};
/**
 * 테두리 1px 이 Button 과 높이를 맞춘다 — 없으면 Input 이 2px 낮다(plan D-6).
 * 포커스되면 테두리가 `border-focus` 색이 된다(plan D-9. 0.2.0 까지 빠져 있었다, N-17).
 * 웹에는 있는 `placeholder:text-fg-muted` 가 빠져 있다 — react-native-css 는
 * `placeholder:` 변형을 `placeholderTextColor` 로 옮기지 않는다. v1 은 플랫폼 기본색을 쓴다.
 */
export const controlBase = "w-full bg-surface text-fg border border-border focus:border-border-focus";
/** 오류 테두리는 포커스 중에도 danger 로 둔다 — 웹은 테두리가 아니라 outline 으로 포커스를 그린다. */
export const invalidBorder = "border-danger focus:border-danger";
/**
 * 한 줄 입력. `label` 은 `accessibilityLabel` 로만 간다 — 가시 라벨은 Label 조합이다(C-13).
 * `id` 를 주면 같은 `htmlFor` 의 Label 과 `accessibilityLabelledBy` 로 이어진다(Android 전용).
 * 값 제어는 `value` / `defaultValue` / `onValueChange` 3종뿐이다(C-12).
 * RN 의 `onChangeText` 가 이미 값을 주므로 어댑터가 이벤트를 벗길 일이 없다.
 *
 * `invalid` 는 **테두리 색까지만** 간다. 웹의 `aria-invalid` 에 해당하는 것이 RN 에 없다 —
 * `accessibilityState` 는 disabled · selected · checked · busy · expanded 뿐이고
 * `aria-invalid` 는 react-native 에 존재하지 않는 prop 이라 넘겨도 무동작이다.
 * 오류를 읽히려면 소비자가 `Text tone="danger"` 로 메시지를 놓는다(C-21 과 같은 방식).
 */
export const Input = ({ label, kind = "text", size = "md", id, placeholder, disabled = false, invalid = false, value, defaultValue, onValueChange, className, ref, }) => {
    const attributes = kinds[kind];
    return (_jsx(TextInput, { ref: ref, id: id, accessibilityLabel: label, accessibilityLabelledBy: id ? labelNativeId(id) : undefined, placeholder: placeholder, editable: !disabled, value: value, defaultValue: defaultValue, onChangeText: onValueChange, 
        // kind 파생 속성은 하나씩 넘긴다. 스프레드로 넘기면 계약에 없는 prop 이 섞여도
        // 타입이 잡아주지 못하고, 웹 Input 과 읽는 방식도 갈린다(AC-11a 취지).
        secureTextEntry: attributes.secureTextEntry, keyboardType: attributes.keyboardType, autoCapitalize: attributes.autoCapitalize, autoComplete: attributes.autoComplete, textContentType: attributes.textContentType, className: cn(controlBase, inputSizes[size], invalid && invalidBorder, disabled && "opacity-50", className) }));
};
//# sourceMappingURL=input.js.map