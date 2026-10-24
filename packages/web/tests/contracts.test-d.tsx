/**
 * T-W8 타입 테스트 (AC-9 · 10 · 11a · 12 · 13 · 14 · 15 · 15a).
 *
 * 구현이 계약을 만족하는지, 그리고 계약에 **없어야 할 것이 없는지**를 타입으로 본다.
 * 런타임 단언이 아니라 컴파일 결과가 곧 판정이다.
 */
import type {
  Contracts,
  ControlSize,
  Size,
  Tone,
  Variant,
  WebKey,
} from "@eeennsu/tokens";
import { webComponents } from "@eeennsu/tokens";
import { Trash } from "lucide-react";
import type { FC, ReactNode } from "react";
import { assertType, describe, expectTypeOf, it } from "vitest";
import type { TabItem, TableColumn, TableRow } from "../src/index.js";
import { Badge, Button, Chip, CodeBlock, Collapsible, Dialog, Icon, Input, Prose, Stack, Table, Tabs, Text, components } from "../src/index.js";

// label 을 뺀 JSX 를 쓰기 위한 지역 별칭. AC-14 테스트에서만 쓴다.
const ButtonGroupProbe = components.ButtonGroup;
const TextareaProbe = components.Textarea;
const TooltipProbe = components.Tooltip;
const DrawerProbe = components.Drawer;

describe("C-17 맵 동등성", () => {
  it("components 가 계약 맵과 정확히 같다", () => {
    expectTypeOf(components).toEqualTypeOf<{ [K in WebKey]: FC<Contracts<"web">[K]> }>();
  });

  it("키 목록이 맵의 키와 같다", () => {
    expectTypeOf<(typeof webComponents)[number]>().toEqualTypeOf<keyof typeof components>();
  });
});

describe("AC-9 · AC-10 전역 축", () => {
  it("variant 4개 · tone 3개가 전역 집합이다", () => {
    expectTypeOf<Variant>().toEqualTypeOf<"primary" | "secondary" | "ghost" | "danger">();
    expectTypeOf<Tone>().toEqualTypeOf<"default" | "muted" | "danger">();
  });

  it("Size 는 5단이고 컨트롤은 부분집합이다", () => {
    expectTypeOf<Size>().toEqualTypeOf<"sm" | "md" | "lg" | "xl" | "2xl">();
    expectTypeOf<ControlSize>().toEqualTypeOf<"sm" | "md" | "lg">();
    expectTypeOf<Contracts<"web">["Button"]["size"]>().toEqualTypeOf<ControlSize | undefined>();
    expectTypeOf<Contracts<"web">["Text"]["size"]>().toEqualTypeOf<Size | undefined>();
  });

  it("Badge 는 variant · size 의 부분집합만 받는다", () => {
    expectTypeOf<Contracts<"web">["Badge"]["variant"]>().toEqualTypeOf<
      "primary" | "secondary" | "danger" | undefined
    >();
    expectTypeOf<Contracts<"web">["Badge"]["size"]>().toEqualTypeOf<"sm" | "md" | undefined>();
  });
});

/** 계약 전체의 prop 키를 한 덩어리로 모은다. mapped type 테스트의 입력이다. */
type AllKeys = { [K in WebKey]: keyof Contracts<"web">[K] }[WebKey];

/** 값 타입이 number 인 prop 의 이름. 하나도 없어야 한다(AC-15). */
type NumberPropNames = {
  [K in WebKey]: {
    [P in keyof Contracts<"web">[K]]-?: NonNullable<Contracts<"web">[K][P]> extends number ? P : never;
  }[keyof Contracts<"web">[K]];
}[WebKey];

describe("AC-11a · AC-12 · AC-13 · AC-15 없어야 할 prop", () => {
  it("style · as · render · asChild 가 어디에도 없다", () => {
    expectTypeOf<Extract<AllKeys, "style" | "as" | "render" | "asChild">>().toEqualTypeOf<never>();
  });

  it("onChange · onToggle · onPress 가 어디에도 없다 (웹은 onClick 하나)", () => {
    expectTypeOf<Extract<AllKeys, "onChange" | "onToggle" | "onPress">>().toEqualTypeOf<never>();
  });

  it("number 타입 prop 이 하나도 없다", () => {
    expectTypeOf<NumberPropNames>().toEqualTypeOf<never>();
  });

  it("제어 API 가 두 갈래로만 있다", () => {
    expectTypeOf<Contracts<"web">["Input"]["onValueChange"]>().toEqualTypeOf<
      ((value: string) => void) | undefined
    >();
    expectTypeOf<Contracts<"web">["Dialog"]["onOpenChange"]>().toEqualTypeOf<
      ((open: boolean) => void) | undefined
    >();
    expectTypeOf<Contracts<"web">["Button"]["onClick"]>().toEqualTypeOf<(() => void) | undefined>();
  });

  it("ButtonGroup 자체에는 누름 이벤트도 size 도 없다 (plan D-30)", () => {
    expectTypeOf<Extract<keyof Contracts<"web">["ButtonGroup"], "onClick" | "size">>().toEqualTypeOf<never>();
  });
});

describe("N-17 Chip · Icon 계약", () => {
  it("Chip 은 Button 처럼 label 필수 · onClick · FocusHandle ref 이고 selected 는 불리언이다", () => {
    expectTypeOf<Contracts<"web">["Chip"]["label"]>().toEqualTypeOf<string>();
    expectTypeOf<Contracts<"web">["Chip"]["selected"]>().toEqualTypeOf<boolean | undefined>();
    expectTypeOf<Contracts<"web">["Chip"]["onClick"]>().toEqualTypeOf<(() => void) | undefined>();
    expectTypeOf<Contracts<"web">["Chip"]>().not.toHaveProperty("onPress");
    // @ts-expect-error label 필수
    assertType(<Chip />);
    // @ts-expect-error 선택 상태를 바꾸는 콜백은 계약이 아니다 — 소비자가 onClick 에서 바꾼다
    assertType(<Chip label="식비" onValueChange={() => {}} />);
    // @ts-expect-error 이벤트 객체를 받는 핸들러는 계약이 아니다
    assertType(<Chip label="식비" onClick={(event: MouseEvent) => void event} />);
    // @ts-expect-error 아이콘 크기는 컨트롤 3단이다
    assertType(<Icon name="home" size="xl" />);
  });

  it("Icon 은 이름 · 크기 · tone · label 만 받고 label 은 선택이다", () => {
    assertType(<Icon name="home" />);
    assertType(<Icon name="calendar" size="lg" tone="muted" label="날짜" />);
    // @ts-expect-error 목록에 없는 이름
    assertType(<Icon name="nope" />);
    // @ts-expect-error 색 리터럴은 tone 이 아니다
    assertType(<Icon name="home" tone="#333" />);
    // @ts-expect-error 아이콘에 누름 이벤트는 없다 — 누르는 것은 Button 이다
    assertType(<Icon name="home" onClick={() => {}} />);
  });
});

describe("R27 Table 계약", () => {
  it("진입점이 TableColumn · TableRow 를 타입 전용으로 다시 내보낸다", () => {
    expectTypeOf<TableColumn>().toEqualTypeOf<{ label: string; align?: "start" | "end" }>();
    expectTypeOf<TableRow>().toEqualTypeOf<{ cells: ReactNode[] }>();
    expectTypeOf<Contracts<"web">["Table"]["columns"]>().toEqualTypeOf<TableColumn[]>();
    expectTypeOf<Contracts<"web">["Table"]["rows"]>().toEqualTypeOf<TableRow[]>();
    expectTypeOf<Contracts<"web">["Table"]["label"]>().toEqualTypeOf<string | undefined>();
  });

  it("label 은 선택이다 (비인터랙티브) — 열 정렬은 start · end 뿐이고 행은 { cells } 객체다", () => {
    assertType(<Table columns={[{ label: "이름" }]} rows={[{ cells: ["a"] }]} />);
    assertType(<Table label="표" columns={[{ label: "금액", align: "end" }]} rows={[]} />);
    // @ts-expect-error 가운데 정렬은 두지 않는다
    assertType(<Table columns={[{ label: "이름", align: "center" }]} rows={[]} />);
    // @ts-expect-error 행은 셀 배열의 배열이 아니라 { cells } 객체다
    assertType(<Table columns={[{ label: "이름" }]} rows={[["a"]]} />);
  });
});

describe("R27 CodeBlock 계약", () => {
  it("children 은 글자뿐이고 label 은 선택이다 (비인터랙티브)", () => {
    expectTypeOf<Contracts<"web">["CodeBlock"]["children"]>().toEqualTypeOf<string | string[]>();
    expectTypeOf<Contracts<"web">["CodeBlock"]["label"]>().toEqualTypeOf<string | undefined>();
    assertType(<CodeBlock>{"const a = 1;"}</CodeBlock>);
    assertType(<CodeBlock label="예제">{["a", "b"]}</CodeBlock>);
    // @ts-expect-error 엘리먼트 children 은 막는다 (글자 컴포넌트 규칙)
    assertType(<CodeBlock>{<span />}</CodeBlock>);
  });
});

describe("R27 Prose 계약", () => {
  it("children 과 className 뿐이다 (비인터랙티브라 label 이 없다)", () => {
    expectTypeOf<Contracts<"web">["Prose"]>().toEqualTypeOf<{ children: ReactNode; className?: string }>();
    assertType(
      <Prose>
        <h2>제목</h2>
      </Prose>,
    );
    // @ts-expect-error children 은 필수다
    assertType(<Prose />);
  });
});

describe("R27 Tabs 계약", () => {
  const items: TabItem[] = [{ value: "c", label: "C", content: "내용" }];

  it("진입점이 TabItem 을 타입 전용으로 다시 내보내고 값 3종은 string 이다", () => {
    expectTypeOf<TabItem>().toEqualTypeOf<{ value: string; label: string; content: ReactNode }>();
    expectTypeOf<Contracts<"web">["Tabs"]["items"]>().toEqualTypeOf<TabItem[]>();
    expectTypeOf<Contracts<"web">["Tabs"]["value"]>().toEqualTypeOf<string | undefined>();
    expectTypeOf<Contracts<"web">["Tabs"]["defaultValue"]>().toEqualTypeOf<string | undefined>();
    expectTypeOf<Contracts<"web">["Tabs"]["onValueChange"]>().toEqualTypeOf<((value: string) => void) | undefined>();
  });

  it("값은 문자열이고 콜백은 값 하나를 받으며 항목은 content 가 필수다", () => {
    assertType(<Tabs label="탭" items={items} value="c" defaultValue="c" onValueChange={(v: string) => void v} />);
    // @ts-expect-error 값은 string 이다 (C-14)
    assertType(<Tabs label="탭" items={items} value={1} />);
    // @ts-expect-error 콜백 인자는 string 이다
    assertType(<Tabs label="탭" items={items} onValueChange={(v: number) => void v} />);
    // @ts-expect-error 항목에 content 가 필수다
    assertType(<Tabs label="탭" items={[{ value: "c", label: "C" }]} />);
  });
});

describe("R27 Collapsible 계약", () => {
  it("개폐 3종은 Dialog 와 같은 모양이고 기본값은 계약이 아니라 구현이 가진다", () => {
    expectTypeOf<Contracts<"web">["Collapsible"]["open"]>().toEqualTypeOf<boolean | undefined>();
    expectTypeOf<Contracts<"web">["Collapsible"]["defaultOpen"]>().toEqualTypeOf<boolean | undefined>();
    expectTypeOf<Contracts<"web">["Collapsible"]["onOpenChange"]>().toEqualTypeOf<
      ((open: boolean) => void) | undefined
    >();
    expectTypeOf<Contracts<"web">["Collapsible"]["children"]>().toEqualTypeOf<ReactNode>();
  });

  it("값 콜백 이름과 number 열림은 받지 않는다", () => {
    assertType(
      <Collapsible label="답" open defaultOpen onOpenChange={(open: boolean) => void open}>
        {null}
      </Collapsible>,
    );
    assertType(
      // @ts-expect-error 개폐 3종만 있다 — onValueChange 는 값 입력 컴포넌트의 이름이다
      <Collapsible label="답" onValueChange={() => undefined}>
        {null}
      </Collapsible>,
    );
    assertType(
      // @ts-expect-error open 은 boolean 이다 (C-14)
      <Collapsible label="답" open={1}>
        {null}
      </Collapsible>,
    );
  });
});

describe("AC-14 label 누락은 타입 에러다", () => {
  it("Tabs", () => {
    // @ts-expect-error label 필수
    assertType(<Tabs items={[]} />);
  });

  it("Collapsible", () => {
    // @ts-expect-error label 필수
    assertType(<Collapsible>{null}</Collapsible>);
  });

  it("인터랙티브 7개", () => {
    // @ts-expect-error label 필수
    assertType(<Button />);
    // @ts-expect-error label 필수
    assertType(<ButtonGroupProbe />);
    // @ts-expect-error label 필수
    assertType(<Input />);
    // @ts-expect-error label 필수
    assertType(<TextareaProbe />);
    // @ts-expect-error label 필수
    assertType(<TooltipProbe />);
    // @ts-expect-error label 필수
    assertType(<Dialog>{null}</Dialog>);
    // @ts-expect-error label 필수
    assertType(<DrawerProbe />);
  });
});

describe("AC-15 · AC-15a 값 형태", () => {
  it("tone 은 enum 키만 받는다", () => {
    // @ts-expect-error 색 리터럴은 tone 이 아니다
    assertType(<Text tone="#333">본문</Text>);
  });

  it("icon 은 목록에 있는 이름 문자열만 받는다", () => {
    assertType(<Button label="삭제" icon="trash" />);
    // @ts-expect-error 목록에 없는 이름
    assertType(<Button label="삭제" icon="nope" />);
    // @ts-expect-error 아이콘 노드는 거부된다
    assertType(<Button label="삭제" icon={<Trash />} />);
  });

  it("onClick 은 인자를 받지 않는다", () => {
    // @ts-expect-error 이벤트 객체를 받는 핸들러는 계약이 아니다
    assertType(<Button label="확인" onClick={(event: MouseEvent) => void event} />);
  });

  it("Stack 에는 간격 prop 이 없다 (C-14)", () => {
    // @ts-expect-error 간격은 className 전용이다
    assertType(<Stack gap="4">{null}</Stack>);
    assertType(<Stack className="gap-4">{null}</Stack>);
  });

  it("Badge children 은 문자열이다", () => {
    assertType(<Badge>{"3개"}</Badge>);
    // @ts-expect-error 엘리먼트 children 은 계약이 아니다
    assertType(<Badge>{<span>3</span>}</Badge>);
  });
});
