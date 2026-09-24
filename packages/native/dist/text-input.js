import { TextInput as RNTextInput } from "react-native";
import { useCssElement } from "react-native-css";
/**
 * `react-native-css/components` 의 TextInput 과 같되 placeholder 색 매핑을 하나 더 둔다(N-17).
 * react-native-css 는 `placeholder:` 변형을 `placeholderTextColor` 로 옮기지 않아(N-13) 플랫폼
 * 기본 hint 색이 나오는데, Android AppCompat 라이트의 기본값은 흰 표면 위 약 2.7:1 이다.
 * `placeholderClassName` 의 글자색을 `placeholderTextColor` 로 옮겨 토큰 색을 쓴다.
 */
const mapping = {
    className: { target: "style", nativeStyleMapping: { textAlign: true } },
    placeholderClassName: { target: false, nativeStyleMapping: { color: "placeholderTextColor" } },
};
/** DS 내부 전용. Input · Textarea 가 쓴다. */
export function StyledTextInput(props) {
    return useCssElement(RNTextInput, props, mapping);
}
//# sourceMappingURL=text-input.js.map