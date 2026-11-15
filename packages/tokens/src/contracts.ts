import type { ReactElement, ReactNode, Ref } from "react";

/** 구현 플랫폼. 계약 하나를 두 플랫폼이 각자 구현한다(C-17). */
export type Platform = "web" | "native";

/** 전역 축 1 — 의도 4개 고정(C-8). 컴포넌트별 부분집합은 Extract 로 좁힌다. */
export type Variant = "primary" | "secondary" | "ghost" | "danger";

/** 전역 축 2 — t-shirt 7단(C-7a, R28). 간격 어휘(숫자 키)와 의도적으로 분리한다. */
export type Size = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

/**
 * 글자 크기 · 행간 · 무게를 함께 바꾸는 타이포 스텝. `Size` 7단(R28) 전부를 쓰며
 * Text 전용 의미다(C-7b). 유틸리티 하나(`text-lg`)가 세 속성을 적용한다.
 */
export type TypographyStep = Size;

/** 컨트롤(Button · Input · Textarea)이 쓰는 `Size` 부분집합(C-7a). */
export type ControlSize = Extract<Size, "sm" | "md" | "lg">;

/** Badge 가 쓰는 `Size` 부분집합. lg 이상은 Badge 용도 밖(plan D-15). */
export type BadgeSize = Extract<Size, "sm" | "md">;

/**
 * 전역 축 3 — 글자색 의도(C-8). danger 는 variant 의 danger 와 같은 semantic 색이다.
 * brand · success · warning · info 는 fg semantic 과 1:1 이다(R28).
 */
export type Tone = "default" | "muted" | "danger" | "brand" | "success" | "warning" | "info";

/** Input 의 입력 종류. type · inputMode · autoComplete 매핑의 단일 입력이다(C-11). */
export type InputKind = "text" | "password" | "email" | "number";

/** ref 로 노출하는 명령형 핸들. DOM 노드·RN 인스턴스를 그대로 열지 않는다(C-17). */
export type FocusHandle = { focus(): void; blur(): void };

/**
 * 컨테이너 children — 문자열을 제외한 엘리먼트 노드(C-17).
 * 컨테이너에 raw 문자열을 넣으면 RN 에서 Text 밖 문자열이 되어 깨진다.
 */
export type ElementChildren = ReactElement | boolean | null | undefined | ElementChildren[];

/**
 * 누름 이벤트는 플랫폼마다 이름이 다르므로 계약을 갈래로 둔다(C-12 · C-13).
 * 웹에 `onPress` 가, RN 에 `onClick` 이 생기지 않는 것을 AC-13 이 타입으로 검사한다.
 */
type Press<P extends Platform> = P extends "web" ? { onClick?: () => void } : { onPress?: () => void };

/**
 * 아이콘 이름 — tokens 가 소유한 큐레이션 유니온 28개(plan D-8). v1 24개에 탭 바 · 날짜용 4개
 * (home · list · chart-pie · calendar)를 더했다(구현 노트 N-17).
 * lucide 전체 이름에서 파생하지 않는다: 계약이 tokens 에 있어 lucide 에 의존할 수 없고,
 * 웹·RN lucide 버전이 어긋나면 이름이 갈린다. 이름 추가는 tokens + 양쪽 맵 3곳이며
 * 한쪽만 고치면 `Record<IconName, LucideIcon>` 이 컴파일 에러를 낸다.
 */
export type IconName =
  | "check"
  | "x"
  | "plus"
  | "minus"
  | "trash"
  | "pencil"
  | "search"
  | "chevron-down"
  | "chevron-up"
  | "chevron-left"
  | "chevron-right"
  | "arrow-left"
  | "arrow-right"
  | "menu"
  | "settings"
  | "user"
  | "mail"
  | "lock"
  | "eye"
  | "eye-off"
  | "info"
  | "alert-circle"
  | "loader"
  | "external-link"
  | "home"
  | "list"
  | "chart-pie"
  | "calendar";

/** Tabs 항목. 탭 글자와 패널 내용을 한 항목에 묶는다(decisions-r27 2). */
export type TabItem = { value: string; label: string; content: ReactNode };

/** Table 열. `end` 는 숫자 열이다 — 머리글과 셀이 `text-end tabular-nums`(decisions-r27 8). */
export type TableColumn = { label: string; align?: "start" | "end" };

/** Table 행. 객체라 행 key · 행 머리글 · 행 강조를 선택 필드로 나중에 더해도 호출부가 깨지지 않는다(decisions-r27 7). */
export type TableRow = { cells: ReactNode[] };

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
  /**
   * 고르는 칩(N-17). `label` 이 가시 텍스트이자 접근성 이름이고(C-13), `selected` 는
   * `disabled` 와 같은 상태 불리언이다(C-11 예외). 고른 상태를 바꾸는 것은 소비자의 누름 이벤트다 —
   * 오버레이의 `open` 을 Button 누름으로 토글하는 것과 같은 방식이다(C-12).
   */
  Chip: {
    label: string;
    selected?: boolean;
    disabled?: boolean;
    className?: string;
    ref?: Ref<FocusHandle>;
  } & Press<P>;
  /**
   * 단독 아이콘(N-17). 이름 문자열만 받고 플랫폼 분기는 DS 안에 둔다(C-7c). 색은 Text 와 같은
   * `tone` 이다. `label` 이 있으면 의미 있는 그림으로 읽히고, 없으면 꾸밈이라 보조 기술에서 숨긴다.
   */
  Icon: {
    name: IconName;
    size?: ControlSize;
    tone?: Tone;
    label?: string;
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
  /**
   * 데이터 표(R27, 웹 전용). 비인터랙티브라 `label` 은 선택이고, 있으면 보이는 `<caption>` 이자 접근성 이름이다.
   * 셀은 `ReactNode` 내용이라 `number` 타입 prop 을 여는 것이 아니다(C-14).
   */
  Table: {
    label?: string;
    columns: TableColumn[];
    rows: TableRow[];
    className?: string;
  };
  /**
   * 코드 블록 하나(R27, 웹 전용). 글자 컴포넌트라 `children` 은 `string | string[]` 이다.
   * 배열은 Text 처럼 줄바꿈 없이 이어 붙는다 — JSX 보간(`npm i {pkg}`)이 만드는 조각이기 때문이다. 줄 배열은 `lines.join("\n")` 으로 넘긴다.
   * 비인터랙티브라 `label` 은 선택이고, 있으면 보이는 `<figcaption>` 이자 접근성 이름이다.
   */
  CodeBlock: {
    children: string | string[];
    label?: string;
    className?: string;
  };
  /**
   * 마크다운식 원시 요소(h1~h3 · p · ul · a · code · pre · blockquote · table 등)를 DS 어휘로 꾸미는 래퍼(R27, 웹 전용).
   * 요소 선택자로 스타일하므로 `children` 은 `ReactNode` 이고, 선택자는 `:where` 라 안의 DS 컴포넌트와 소비자 클래스가 이긴다.
   */
  Prose: {
    children: ReactNode;
    className?: string;
  };
  /**
   * 탭 목록과 패널(R27, 웹 전용). 데이터 방식이라 항목이 `content` 를 가진다(decisions-r27 2).
   * `label` 은 탭 목록(`role="tablist"`)의 접근성 이름이고 화면에 보이지 않는다(C-13). 항목의 `label` 이 탭 글자다.
   * 값은 `string` 이고 비제어 기본은 첫 항목이다. 콜백은 값 하나만 받는다(C-12).
   */
  Tabs: {
    label: string;
    items: TabItem[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    className?: string;
  };
  /**
   * 접고 펴는 패널 하나(R27, 웹 전용). `label` 은 트리거의 보이는 글자이자 접근성 이름이다(C-13).
   * 개폐 3종은 오버레이와 같다(C-12) — `open` / `defaultOpen` / `onOpenChange`, 기본은 닫힘이고 닫힌 패널은 DOM 에 없다.
   * 상자는 없다. 상자로 보이려면 Card 안에 둔다(알려진 동작 32).
   */
  Collapsible: {
    label: string;
    children: ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
  };
};

/** v1 웹 구현 12개 + Text · Box 를 포함한 전체 목록(AC-7). Chip · Icon 은 v1 이후(N-17), Table · CodeBlock · Prose · Tabs · Collapsible 은 R27. */
export const webComponents = [
  "Button",
  "ButtonGroup",
  "Input",
  "Textarea",
  "Label",
  "Card",
  "Badge",
  "Chip",
  "Icon",
  "Text",
  "Stack",
  "Box",
  "Tooltip",
  "Dialog",
  "Drawer",
  "Form",
  "Table",
  "CodeBlock",
  "Prose",
  "Tabs",
  "Collapsible",
] as const satisfies readonly (keyof Contracts<"web">)[];

/**
 * RN 구현 11개. v1 핵심 5개(AC-20)에 Textarea · Label · Badge · Box(구현 노트 N-16)와
 * Chip · Icon(N-17)을 더했다. 오버레이 · Form · ButtonGroup 은 v2.
 */
export const nativeComponents = [
  "Button",
  "Input",
  "Textarea",
  "Label",
  "Card",
  "Badge",
  "Chip",
  "Icon",
  "Text",
  "Stack",
  "Box",
] as const satisfies readonly (keyof Contracts<"native">)[];

export type WebKey = (typeof webComponents)[number];
export type NativeKey = (typeof nativeComponents)[number];
