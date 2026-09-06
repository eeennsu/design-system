import type { ReactElement, ReactNode, Ref } from "react";
/** 구현 플랫폼. 계약 하나를 두 플랫폼이 각자 구현한다(C-17). */
export type Platform = "web" | "native";
/** 전역 축 1 — 의도 4개 고정(C-8). 컴포넌트별 부분집합은 Extract 로 좁힌다. */
export type Variant = "primary" | "secondary" | "ghost" | "danger";
/** 전역 축 2 — t-shirt 5단(C-7a). 간격 어휘(숫자 키)와 의도적으로 분리한다. */
export type Size = "sm" | "md" | "lg" | "xl" | "2xl";
/**
 * 글자 크기 · 행간 · 무게를 함께 바꾸는 타이포 스텝. `Size` 5단 전부를 쓰며
 * Text 전용 의미다(C-7b). 유틸리티 하나(`text-lg`)가 세 속성을 적용한다.
 */
export type TypographyStep = Size;
/** 컨트롤(Button · Input · Textarea)이 쓰는 `Size` 부분집합(C-7a). */
export type ControlSize = Extract<Size, "sm" | "md" | "lg">;
/** Badge 가 쓰는 `Size` 부분집합. lg 이상은 Badge 용도 밖(plan D-15). */
export type BadgeSize = Extract<Size, "sm" | "md">;
/** 전역 축 3 — 글자색 의도(C-8). danger 는 variant 의 danger 와 같은 semantic 색이다. */
export type Tone = "default" | "muted" | "danger";
/** Input 의 입력 종류. type · inputMode · autoComplete 매핑의 단일 입력이다(C-11). */
export type InputKind = "text" | "password" | "email" | "number";
/** ref 로 노출하는 명령형 핸들. DOM 노드·RN 인스턴스를 그대로 열지 않는다(C-17). */
export type FocusHandle = {
    focus(): void;
    blur(): void;
};
/**
 * 컨테이너 children — 문자열을 제외한 엘리먼트 노드(C-17).
 * 컨테이너에 raw 문자열을 넣으면 RN 에서 Text 밖 문자열이 되어 깨진다.
 */
export type ElementChildren = ReactElement | boolean | null | undefined | ElementChildren[];
/**
 * 누름 이벤트는 플랫폼마다 이름이 다르므로 계약을 갈래로 둔다(C-12 · C-13).
 * 웹에 `onPress` 가, RN 에 `onClick` 이 생기지 않는 것을 AC-13 이 타입으로 검사한다.
 */
type Press<P extends Platform> = P extends "web" ? {
    onClick?: () => void;
} : {
    onPress?: () => void;
};
/**
 * 아이콘 이름 — tokens 가 소유한 큐레이션 유니온 24개(plan D-8).
 * lucide 전체 이름에서 파생하지 않는다: 계약이 tokens 에 있어 lucide 에 의존할 수 없고,
 * 웹·RN lucide 버전이 어긋나면 이름이 갈린다. 이름 추가는 tokens + 양쪽 맵 3곳이며
 * 한쪽만 고치면 `Record<IconName, LucideIcon>` 이 컴파일 에러를 낸다.
 */
export type IconName = "check" | "x" | "plus" | "minus" | "trash" | "pencil" | "search" | "chevron-down" | "chevron-up" | "chevron-left" | "chevron-right" | "arrow-left" | "arrow-right" | "menu" | "settings" | "user" | "mail" | "lock" | "eye" | "eye-off" | "info" | "alert-circle" | "loader" | "external-link";
/**
 * 컴포넌트 prop 계약. 웹·RN 구현이 이 맵을 그대로 만족해야 한다(C-17, AC-21).
 * 닫힌 type 리터럴로 두는 이유: AC-11a · AC-15 의 mapped type 테스트가
 * "선언된 키 전부"를 순회할 수 있어야 한다.
 */
export type Contracts<P extends Platform> = {
    Button: {
        label: string;
        variant?: Variant;
        size?: ControlSize;
        icon?: IconName;
        loading?: boolean;
        disabled?: boolean;
        className?: string;
        ref?: Ref<FocusHandle>;
    } & Press<P>;
    ButtonGroup: {
        label: string;
        children: ReactElement | ReactElement[];
        className?: string;
    };
    Input: {
        label: string;
        kind?: InputKind;
        size?: ControlSize;
        id?: string;
        placeholder?: string;
        disabled?: boolean;
        invalid?: boolean;
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
        className?: string;
        ref?: Ref<FocusHandle>;
    };
    Textarea: {
        label: string;
        size?: ControlSize;
        id?: string;
        placeholder?: string;
        disabled?: boolean;
        invalid?: boolean;
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
        className?: string;
        ref?: Ref<FocusHandle>;
    };
    Label: {
        children: string | string[];
        htmlFor?: string;
        className?: string;
    };
    Card: {
        children: ElementChildren;
        className?: string;
    };
    Badge: {
        children: string | string[];
        variant?: Extract<Variant, "primary" | "secondary" | "danger">;
        size?: BadgeSize;
        className?: string;
    };
    Text: {
        children: string | string[];
        tone?: Tone;
        size?: TypographyStep;
        heading?: "1" | "2" | "3";
        className?: string;
    };
    Stack: {
        children: ElementChildren;
        direction?: "row" | "column";
        align?: "start" | "center" | "end" | "stretch";
        justify?: "start" | "center" | "end" | "between";
        wrap?: boolean;
        className?: string;
    };
    Box: {
        children: ElementChildren;
        className?: string;
    };
    Tooltip: {
        label: string;
        children: ReactElement;
        side?: "top" | "bottom" | "left" | "right";
        open?: boolean;
        defaultOpen?: boolean;
        onOpenChange?: (open: boolean) => void;
        className?: string;
    };
    Dialog: {
        label: string;
        children: ReactNode;
        open?: boolean;
        defaultOpen?: boolean;
        onOpenChange?: (open: boolean) => void;
        className?: string;
    };
    Drawer: {
        label: string;
        children: ReactNode;
        side?: "left" | "right" | "bottom";
        open?: boolean;
        defaultOpen?: boolean;
        onOpenChange?: (open: boolean) => void;
        className?: string;
    };
    Form: {
        children: ReactNode;
        className?: string;
    };
};
/** v1 웹 구현 12개 + Text · Box 를 포함한 전체 목록(AC-7). */
export declare const webComponents: readonly ["Button", "ButtonGroup", "Input", "Textarea", "Label", "Card", "Badge", "Text", "Stack", "Box", "Tooltip", "Dialog", "Drawer", "Form"];
/** v1 RN 구현 5개(AC-20). 오버레이·Box 는 v2. */
export declare const nativeComponents: readonly ["Button", "Input", "Card", "Stack", "Text"];
export type WebKey = (typeof webComponents)[number];
export type NativeKey = (typeof nativeComponents)[number];
export {};
//# sourceMappingURL=contracts.d.ts.map