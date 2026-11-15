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
import type { StepItem, TabItem, TableColumn, TableRow } from "../src/index.js";
import { Badge, Button, Callout, Chip, CodeBlock, Collapsible, Dialog, Icon, Input, Link, Prose, Stack, Stepper, Table, Tabs, Text, components } from "../src/index.js";

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
  it("variant 4개 · tone 7개(R28)가 전역 집합이다", () => {
    expectTypeOf<Variant>().toEqualTypeOf<"primary" | "secondary" | "ghost" | "danger">();
    expectTypeOf<Tone>().toEqualTypeOf<"default" | "muted" | "danger" | "brand" | "success" | "warning" | "info">();
  });

  it("Size 는 7단(R28)이고 컨트롤은 부분집합이다", () => {
    expectTypeOf<Size>().toEqualTypeOf<"sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl">();
    expectTypeOf<ControlSize>().toEqualTypeOf<"sm" | "md" | "lg">();
    expectTypeOf<Contracts<"web">["Button"]["size"]>().toEqualTypeOf<ControlSize | undefined>();
    expectTypeOf<Contracts<"web">["Text"]["size"]>().toEqualTypeOf<Size | undefined>();
  });

  it("Text 는 R28 스텝 4xl 까지 받고 그 밖은 거부한다", () => {
    assertType(<Text size="4xl">큰 제목</Text>);
    // @ts-expect-error 7단 밖의 스텝
    assertType(<Text size="5xl">큰 제목</Text>);
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

describe("R28 Collapsible disabled · variant 계약", () => {
  it("disabled 는 boolean, variant 는 ghost · secondary 뿐이다", () => {
    expectTypeOf<Contracts<"web">["Collapsible"]["disabled"]>().toEqualTypeOf<boolean | undefined>();
    expectTypeOf<Contracts<"web">["Collapsible"]["variant"]>().toEqualTypeOf<"ghost" | "secondary" | undefined>();
    assertType(
      <Collapsible label="답" variant="secondary" disabled>
        {null}
      </Collapsible>,
    );
    assertType(
      // @ts-expect-error variant 는 ghost · secondary 뿐이다
      <Collapsible label="답" variant="primary">
        {null}
      </Collapsible>,
    );
    assertType(
      // @ts-expect-error variant 는 ghost · secondary 뿐이다
      <Collapsible label="답" variant="danger">
        {null}
      </Collapsible>,
    );
  });
});

describe("R28 Link 계약", () => {
  it("label · href 필수, tone · size 는 Text 와 같은 축이고 이동은 href 하나다", () => {
    expectTypeOf<Contracts<"web">["Link"]["label"]>().toEqualTypeOf<string>();
    expectTypeOf<Contracts<"web">["Link"]["href"]>().toEqualTypeOf<string>();
    expectTypeOf<Contracts<"web">["Link"]["tone"]>().toEqualTypeOf<Tone | undefined>();
    expectTypeOf<Contracts<"web">["Link"]["size"]>().toEqualTypeOf<Size | undefined>();
    expectTypeOf<Contracts<"web">["Link"]>().not.toHaveProperty("onClick");
    expectTypeOf<Contracts<"web">["Link"]>().not.toHaveProperty("onPress");
    assertType(<Link label="다음" href="/next" tone="muted" size="sm" className="mt-2" />);
    // @ts-expect-error href 필수
    assertType(<Link label="다음" />);
    // @ts-expect-error 웹 Link 는 누름 이벤트를 받지 않는다 — 이동은 href 다
    assertType(<Link label="다음" href="/next" onClick={() => {}} />);
    // @ts-expect-error children 이 없다 — 글은 label 이다
    assertType(<Link label="다음" href="/next">다음</Link>);
  });
});

describe("R28 Callout 계약", () => {
  it("children 은 ReactNode, tone 은 상태 다섯 개, title · icon 은 선택이다", () => {
    expectTypeOf<Contracts<"web">["Callout"]["children"]>().toEqualTypeOf<ReactNode>();
    expectTypeOf<Contracts<"web">["Callout"]["tone"]>().toEqualTypeOf<
      "info" | "success" | "warning" | "danger" | "brand" | undefined
    >();
    expectTypeOf<Contracts<"web">["Callout"]["title"]>().toEqualTypeOf<string | undefined>();
    assertType(<Callout>{"글"}</Callout>);
    assertType(
      <Callout tone="danger" title="주의" icon="alert-circle">
        <p>글</p>
      </Callout>,
    );
    // @ts-expect-error muted 는 Callout tone 이 아니다
    assertType(<Callout tone="muted">{"글"}</Callout>);
    // @ts-expect-error default 는 Callout tone 이 아니다
    assertType(<Callout tone="default">{"글"}</Callout>);
    // @ts-expect-error 목록에 없는 아이콘 이름
    assertType(<Callout icon="nope">{"글"}</Callout>);
    // @ts-expect-error children 은 필수다
    assertType(<Callout />);
  });
});

describe("R28 Stepper 계약", () => {
  const items: StepItem<"web">[] = [{ value: "a", label: "하나", content: <p>내용</p> }, { value: "b", label: "둘" }];

  it("진입점이 StepItem 을 타입 전용으로 다시 내보내고 제어 전용 value · onValueChange 만 있다", () => {
    expectTypeOf<StepItem<"web">>().toEqualTypeOf<{ value: string; label: string; content?: ReactNode }>();
    expectTypeOf<Contracts<"web">["Stepper"]["items"]>().toEqualTypeOf<StepItem<"web">[]>();
    expectTypeOf<Contracts<"web">["Stepper"]["value"]>().toEqualTypeOf<string>();
    expectTypeOf<Contracts<"web">["Stepper"]["reached"]>().toEqualTypeOf<string | undefined>();
    expectTypeOf<Contracts<"web">["Stepper"]["onValueChange"]>().toEqualTypeOf<((value: string) => void) | undefined>();
    expectTypeOf<Contracts<"web">["Stepper"]>().not.toHaveProperty("defaultValue");
  });

  it("값은 문자열 필수이고 number · defaultValue · 번호 prop 은 받지 않는다", () => {
    assertType(<Stepper label="단계" items={items} value="a" reached="b" onValueChange={(v: string) => void v} className="mt-4" />);
    // @ts-expect-error value 필수 (제어 전용)
    assertType(<Stepper label="단계" items={items} />);
    // @ts-expect-error 값은 string 이다 (C-14)
    assertType(<Stepper label="단계" items={items} value={1} />);
    // @ts-expect-error 단계 번호 prop 은 없다 (C-14 · AC-15)
    assertType(<Stepper label="단계" items={items} value="a" current={2} />);
    // @ts-expect-error 제어 전용이라 defaultValue 가 없다
    assertType(<Stepper label="단계" items={items} value="a" defaultValue="a" />);
    // @ts-expect-error 콜백 인자는 string 이다
    assertType(<Stepper label="단계" items={items} value="a" onValueChange={(v: number) => void v} />);
  });
});

describe("AC-14 label 누락은 타입 에러다", () => {
  it("Stepper", () => {
    // @ts-expect-error label 필수
    assertType(<Stepper items={[]} value="a" />);
  });

  it("Link", () => {
    // @ts-expect-error label 필수
    assertType(<Link href="/next" />);
  });

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
