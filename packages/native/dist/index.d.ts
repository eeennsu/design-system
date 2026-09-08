import { Button } from "./button.js";
import { Card } from "./card.js";
import { Input } from "./input.js";
import { Stack } from "./stack.js";
import { Text } from "./text.js";
export { Button, Card, Input, Stack, Text };
export { cn } from "./cn.js";
/**
 * 계약 맵 테스트(C-17)가 보는 객체. 키 집합이 `nativeComponents` 와 같고
 * 값 타입이 `FC<Contracts<"native">[K]>` 와 같아야 한다(AC-21).
 */
export declare const components: {
    Button: import("react").FC<{
        label: string;
        variant?: import("@eeennsu/tokens").Variant;
        size?: import("@eeennsu/tokens").ControlSize;
        icon?: import("@eeennsu/tokens").IconName;
        loading?: boolean;
        disabled?: boolean;
        className?: string;
        ref?: import("react").Ref<import("@eeennsu/tokens").FocusHandle>;
    } & {
        onPress?: () => void;
    }>;
    Input: import("react").FC<{
        label: string;
        kind?: import("@eeennsu/tokens").InputKind;
        size?: import("@eeennsu/tokens").ControlSize;
        id?: string;
        placeholder?: string;
        disabled?: boolean;
        invalid?: boolean;
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
        className?: string;
        ref?: import("react").Ref<import("@eeennsu/tokens").FocusHandle>;
    }>;
    Card: import("react").FC<{
        children: import("@eeennsu/tokens").ElementChildren;
        className?: string;
    }>;
    Stack: import("react").FC<{
        children: import("@eeennsu/tokens").ElementChildren;
        direction?: "row" | "column";
        align?: "start" | "center" | "end" | "stretch";
        justify?: "start" | "center" | "end" | "between";
        wrap?: boolean;
        className?: string;
    }>;
    Text: import("react").FC<{
        children: string | string[];
        tone?: import("@eeennsu/tokens").Tone;
        size?: import("@eeennsu/tokens").TypographyStep;
        heading?: "1" | "2" | "3";
        className?: string;
    }>;
};
//# sourceMappingURL=index.d.ts.map