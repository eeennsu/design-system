import type { StepItem as PlatformStepItem } from "@eeennsu/tokens";
import { Badge } from "./badge.js";
import { Box } from "./box.js";
import { Button } from "./button.js";
import { ButtonGroup } from "./button-group.js";
import { Callout } from "./callout.js";
import { Card } from "./card.js";
import { Chip } from "./chip.js";
import { CodeBlock } from "./code-block.js";
import { Collapsible } from "./collapsible.js";
import { Dialog } from "./dialog.js";
import { Drawer } from "./drawer.js";
import { Form } from "./form.js";
import { Icon } from "./icon.js";
import { Input } from "./input.js";
import { Label } from "./label.js";
import { Link } from "./link.js";
import { Prose } from "./prose.js";
import { Stack } from "./stack.js";
import { Stepper } from "./stepper.js";
import { Table } from "./table.js";
import { Tabs } from "./tabs.js";
import { Text } from "./text.js";
import { Textarea } from "./textarea.js";
import { Tooltip } from "./tooltip.js";
export { Badge, Box, Button, ButtonGroup, Callout, Card, Chip, CodeBlock, Collapsible, Dialog, Drawer, Form, Icon, Input, Label, Link, Prose, Stack, Stepper, Table, Tabs, Text, Textarea, Tooltip };
export type { TabItem, TableColumn, TableRow } from "@eeennsu/tokens";
/** Stepper 항목. 계약의 플랫폼 매개변수를 웹으로 고정해 `TabItem` 처럼 `StepItem[]` 로 쓴다. */
export type StepItem = PlatformStepItem<"web">;
export { cn } from "./cn.js";
/**
 * 계약 맵 테스트(C-17)가 보는 객체. 키 집합이 `webComponents` 와 같고
 * 값 타입이 `FC<Contracts<"web">[K]>` 와 같아야 한다.
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
        onClick?: () => void;
    }>;
    ButtonGroup: import("react").FC<{
        label: string;
        children: import("react").ReactElement | import("react").ReactElement[];
        className?: string;
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
        onClick?: () => void;
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
    Tooltip: import("react").FC<{
        label: string;
        children: import("react").ReactElement;
        side?: "top" | "bottom" | "left" | "right";
        open?: boolean;
        defaultOpen?: boolean;
        onOpenChange?: (open: boolean) => void;
        className?: string;
    }>;
    Dialog: import("react").FC<{
        label: string;
        children: import("react").ReactNode;
        open?: boolean;
        defaultOpen?: boolean;
        onOpenChange?: (open: boolean) => void;
        className?: string;
    }>;
    Drawer: import("react").FC<{
        label: string;
        children: import("react").ReactNode;
        side?: "left" | "right" | "bottom";
        open?: boolean;
        defaultOpen?: boolean;
        onOpenChange?: (open: boolean) => void;
        className?: string;
    }>;
    Form: import("react").FC<{
        children: import("react").ReactNode;
        className?: string;
    }>;
    Table: import("react").FC<{
        label?: string;
        columns: import("@eeennsu/tokens").TableColumn[];
        rows: import("@eeennsu/tokens").TableRow[];
        className?: string;
    }>;
    CodeBlock: import("react").FC<{
        children: string | string[];
        label?: string;
        className?: string;
    }>;
    Prose: import("react").FC<{
        children: import("react").ReactNode;
        className?: string;
    }>;
    Tabs: import("react").FC<{
        label: string;
        items: import("@eeennsu/tokens").TabItem[];
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
        className?: string;
    }>;
    Collapsible: import("react").FC<{
        label: string;
        children: import("react").ReactNode;
        open?: boolean;
        defaultOpen?: boolean;
        onOpenChange?: (open: boolean) => void;
        disabled?: boolean;
        variant?: Extract<import("@eeennsu/tokens").Variant, "ghost" | "secondary">;
        className?: string;
    }>;
    Link: import("react").FC<{
        label: string;
        tone?: import("@eeennsu/tokens").Tone;
        size?: import("@eeennsu/tokens").TypographyStep;
        className?: string;
    } & {
        href: string;
    }>;
    Callout: import("react").FC<{
        children: import("react").ReactNode;
        tone?: Extract<import("@eeennsu/tokens").Tone, "info" | "success" | "warning" | "danger" | "brand">;
        title?: string;
        icon?: import("@eeennsu/tokens").IconName;
        className?: string;
    }>;
    Stepper: import("react").FC<{
        label: string;
        items: PlatformStepItem<"web">[];
        value: string;
        reached?: string;
        onValueChange?: (value: string) => void;
        className?: string;
    }>;
};
//# sourceMappingURL=index.d.ts.map