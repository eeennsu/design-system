import { Badge } from "./badge.js";
import { Box } from "./box.js";
import { Button } from "./button.js";
import { Callout } from "./callout.js";
import { Card } from "./card.js";
import { Chip } from "./chip.js";
import { Icon } from "./icon.js";
import { Input } from "./input.js";
import { Label } from "./label.js";
import { Link } from "./link.js";
import { Stack } from "./stack.js";
import { Stepper } from "./stepper.js";
import { Text } from "./text.js";
import { Textarea } from "./textarea.js";
export { Badge, Box, Button, Callout, Card, Chip, Icon, Input, Label, Link, Stack, Stepper, Text, Textarea };
export type { StepItem } from "@eeennsu/tokens";
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
    Textarea: import("react").FC<{
        label: string;
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
    Label: import("react").FC<{
        children: string | string[];
        htmlFor?: string;
        className?: string;
    }>;
    Card: import("react").FC<{
        children: import("@eeennsu/tokens").ElementChildren;
        className?: string;
    }>;
    Badge: import("react").FC<{
        children: string | string[];
        variant?: Extract<import("@eeennsu/tokens").Variant, "primary" | "secondary" | "danger">;
        size?: import("@eeennsu/tokens").BadgeSize;
        className?: string;
    }>;
    Chip: import("react").FC<{
        label: string;
        selected?: boolean;
        disabled?: boolean;
        className?: string;
        ref?: import("react").Ref<import("@eeennsu/tokens").FocusHandle>;
    } & {
        onPress?: () => void;
    }>;
    Icon: import("react").FC<{
        name: import("@eeennsu/tokens").IconName;
        size?: import("@eeennsu/tokens").ControlSize;
        tone?: import("@eeennsu/tokens").Tone;
        label?: string;
        className?: string;
    }>;
    Text: import("react").FC<{
        children: string | string[];
        tone?: import("@eeennsu/tokens").Tone;
        size?: import("@eeennsu/tokens").TypographyStep;
        heading?: "1" | "2" | "3";
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
    Box: import("react").FC<{
        children: import("@eeennsu/tokens").ElementChildren;
        className?: string;
    }>;
    Link: import("react").FC<{
        label: string;
        tone?: import("@eeennsu/tokens").Tone;
        size?: import("@eeennsu/tokens").TypographyStep;
        className?: string;
    } & {
        onPress: () => void;
    }>;
    Callout: import("react").FC<{
        children: import("@eeennsu/tokens").ElementChildren;
        tone?: Extract<import("@eeennsu/tokens").Tone, "info" | "success" | "warning" | "danger" | "brand">;
        title?: string;
        icon?: import("@eeennsu/tokens").IconName;
        className?: string;
    }>;
    Stepper: import("react").FC<{
        label: string;
        items: import("@eeennsu/tokens").StepItem<"native">[];
        value: string;
        reached?: string;
        onValueChange?: (value: string) => void;
        className?: string;
    }>;
};
//# sourceMappingURL=index.d.ts.map