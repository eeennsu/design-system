import type { Ref } from "react";
import { TextInput as RNTextInput, type TextInputProps } from "react-native";
type StyledTextInputProps = TextInputProps & {
    className?: string;
    placeholderClassName?: string;
    ref?: Ref<RNTextInput>;
};
/** DS 내부 전용. Input · Textarea 가 쓴다. */
export declare function StyledTextInput(props: StyledTextInputProps): import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
export {};
//# sourceMappingURL=text-input.d.ts.map