/**
 * T-N4 native 타입 테스트 (AC-21 · AC-13 RN 절).
 *
 * 웹 구현과 **같은 계약 맵**을 만족하는지, 그리고 플랫폼 갈래(누름 이벤트)가
 * 계약대로 갈리는지를 컴파일 결과로 판정한다.
 */
import type {
  Contracts,
  ControlSize,
  ElementChildren,
  FocusHandle,
  NativeKey,
  Size,
  Tone,
  Variant,
} from "@eeennsu/tokens";
import type { StepItem as PlatformStepItem } from "@eeennsu/tokens";
import { nativeComponents } from "@eeennsu/tokens";
import type { FC } from "react";
import { assertType, describe, expectTypeOf, it } from "vitest";
import {
  Badge,
  Box,
  Button,
  Callout,
  Card,
  Chip,
  Icon,
  Input,
  Label,
  Link,
  Stack,
  Stepper,
  Text,
  Textarea,
  components,
} from "../src/index.js";
import type { StepItem } from "../src/index.js";

/**
 * AC-21 "실제로 깨지는지" 확인 — 2026-09-08 수동 1회. 되돌렸다.
 *
 * 1. `Button` 을 `FC<ButtonProps & { extra?: string }>` 로 넓혔다
 *    → "components 가 native 계약 맵과 정확히 같다" 1건 실패.
 * 2. `components` 에서 `Text` 를 뺐다
 *    → 위 테스트 + "키 목록이 맵의 키와 같다" 2건 실패.
 *
 * 즉 prop 추가와 컴포넌트 누락이 둘 다 타입 테스트에서 잡힌다.
 */
describe("C-17 맵 동등성", () => {
  it("components 가 native 계약 맵과 정확히 같다", () => {
    expectTypeOf(components).toEqualTypeOf<{ [K in NativeKey]: FC<Contracts<"native">[K]> }>();
  });

  it("키 목록이 맵의 키와 같다 — v1 핵심 5개(AC-20) + 4개(N-16) + Chip · Icon(N-17) + Link · Callout · Stepper(R28)", () => {
    expectTypeOf<(typeof nativeComponents)[number]>().toEqualTypeOf<keyof typeof components>();
    expectTypeOf<NativeKey>().toEqualTypeOf<
      | "Button"
      | "Input"
      | "Textarea"
      | "Label"
      | "Card"
      | "Badge"
      | "Chip"
      | "Icon"
      | "Text"
      | "Stack"
      | "Box"
      | "Link"
      | "Callout"
      | "Stepper"
    >();
  });

  it("Chip 은 누름 갈래만 웹과 다르고, Icon 은 웹과 같다(N-17)", () => {
    expectTypeOf<Contracts<"native">["Chip"]>().toHaveProperty("onPress");
    expectTypeOf<Contracts<"native">["Chip"]>().not.toHaveProperty("onClick");
    expectTypeOf<Omit<Contracts<"native">["Chip"], "onPress">>().toEqualTypeOf<
      Omit<Contracts<"web">["Chip"], "onClick">
    >();
    expectTypeOf<Contracts<"native">["Icon"]>().toEqualTypeOf<Contracts<"web">["Icon"]>();
  });

  it("추가한 4개는 웹과 prop 이 같다 — 누름 갈래가 없는 컴포넌트다", () => {
    expectTypeOf<Contracts<"native">["Textarea"]>().toEqualTypeOf<Contracts<"web">["Textarea"]>();
    expectTypeOf<Contracts<"native">["Label"]>().toEqualTypeOf<Contracts<"web">["Label"]>();
    expectTypeOf<Contracts<"native">["Badge"]>().toEqualTypeOf<Contracts<"web">["Badge"]>();
    expectTypeOf<Contracts<"native">["Box"]>().toEqualTypeOf<Contracts<"web">["Box"]>();
  });
});

describe("AC-13 RN 절 — 누름 이벤트가 플랫폼 갈래다", () => {
  it("native Button 은 onPress 를 갖고 onClick 은 없다", () => {
    expectTypeOf<Contracts<"native">["Button"]>().toHaveProperty("onPress");
    expectTypeOf<Contracts<"native">["Button"]>().not.toHaveProperty("onClick");
    expectTypeOf<Contracts<"native">["Button"]["onPress"]>().toEqualTypeOf<(() => void) | undefined>();
  });

  it("웹 Button 은 반대다 — 같은 계약 타입의 다른 갈래", () => {
    expectTypeOf<Contracts<"web">["Button"]>().toHaveProperty("onClick");
    expectTypeOf<Contracts<"web">["Button"]>().not.toHaveProperty("onPress");
  });

  it("누름 말고는 웹과 prop 이름이 같다", () => {
    type NativeButton = Omit<Contracts<"native">["Button"], "onPress">;
    type WebButton = Omit<Contracts<"web">["Button"], "onClick">;
    expectTypeOf<NativeButton>().toEqualTypeOf<WebButton>();
  });
});

describe("전역 축과 제어 API", () => {
  it("variant · tone · size 가 웹과 같은 전역 집합이다", () => {
    expectTypeOf<Contracts<"native">["Button"]["variant"]>().toEqualTypeOf<Variant | undefined>();
    expectTypeOf<Contracts<"native">["Text"]["tone"]>().toEqualTypeOf<Tone | undefined>();
    expectTypeOf<Contracts<"native">["Text"]["size"]>().toEqualTypeOf<Size | undefined>();
    expectTypeOf<Contracts<"native">["Input"]["size"]>().toEqualTypeOf<ControlSize | undefined>();
  });

  it("Input · Textarea 값 제어는 3종뿐이고 onChange 계열이 없다(C-12)", () => {
    expectTypeOf<Contracts<"native">["Input"]>().toHaveProperty("value");
    expectTypeOf<Contracts<"native">["Input"]>().toHaveProperty("defaultValue");
    expectTypeOf<Contracts<"native">["Input"]>().toHaveProperty("onValueChange");
    expectTypeOf<Contracts<"native">["Input"]>().not.toHaveProperty("onChange");
    expectTypeOf<Contracts<"native">["Input"]>().not.toHaveProperty("onChangeText");
    expectTypeOf<Contracts<"native">["Textarea"]>().toHaveProperty("onValueChange");
    expectTypeOf<Contracts<"native">["Textarea"]>().not.toHaveProperty("onChangeText");
  });

  it("ref 는 FocusHandle 이다 — 호스트 인스턴스를 그대로 열지 않는다(C-17)", () => {
    expectTypeOf<Contracts<"native">["Button"]["ref"]>().toExtend<
      React.Ref<FocusHandle> | undefined
    >();
  });
});

/** 계약 전체의 prop 키를 한 덩어리로 모은다. */
type AllKeys = { [K in NativeKey]: keyof Contracts<"native">[K] }[NativeKey];

/** 값 타입이 number 인 prop 의 이름. 하나도 없어야 한다(AC-15). */
type NumberPropNames = {
  [K in NativeKey]: {
    [P in keyof Contracts<"native">[K]]-?: NonNullable<Contracts<"native">[K][P]> extends number
      ? P
      : never;
  }[keyof Contracts<"native">[K]];
}[NativeKey];

describe("AC-11a · AC-12 · AC-15 없어야 할 것", () => {
  it("style · 스프레드 · 렌더 prop 이 없다", () => {
    expectTypeOf<Extract<AllKeys, "style" | "as" | "render" | "asChild">>().toEqualTypeOf<never>();
  });

  it("number 타입 prop 이 없다(C-14)", () => {
    expectTypeOf<NumberPropNames>().toEqualTypeOf<never>();
  });

  it("전 컴포넌트가 className 을 받는다(C-15)", () => {
    type WithoutClassName = {
      [K in NativeKey]: "className" extends keyof Contracts<"native">[K] ? never : K;
    }[NativeKey];
    expectTypeOf<WithoutClassName>().toEqualTypeOf<never>();
  });
});

describe("R28 Link 계약 — 이동은 onPress 갈래다", () => {
  it("href 대신 onPress 가 필수이고 나머지는 웹과 같다", () => {
    expectTypeOf<Contracts<"native">["Link"]["onPress"]>().toEqualTypeOf<() => void>();
    expectTypeOf<Contracts<"native">["Link"]>().not.toHaveProperty("href");
    expectTypeOf<Contracts<"native">["Link"]>().not.toHaveProperty("onClick");
    expectTypeOf<Omit<Contracts<"native">["Link"], "onPress">>().toEqualTypeOf<
      Omit<Contracts<"web">["Link"], "href">
    >();
    assertType(<Link label="다음" onPress={() => {}} tone="muted" size="sm" className="mt-2" />);
  });

  it("href · onPress 누락 · 이벤트 인자 · children 은 타입 에러다", () => {
    // @ts-expect-error href 는 웹 갈래다 — RN 이동은 onPress 다
    assertType(<Link label="다음" href="/next" onPress={() => {}} />);
    // @ts-expect-error onPress 필수
    assertType(<Link label="다음" />);
    // @ts-expect-error label 필수
    assertType(<Link onPress={() => {}} />);
    // @ts-expect-error 계약은 () => void 다
    assertType(<Link label="다음" onPress={(event) => event} />);
    // @ts-expect-error children 이 없다 — 글은 label 이다
    assertType(<Link label="다음" onPress={() => {}}>다음</Link>);
  });
});

describe("R28 Callout 계약 — children 은 컨테이너 규칙이다", () => {
  it("children 만 웹과 갈리고 나머지 prop 은 같다", () => {
    expectTypeOf<Contracts<"native">["Callout"]["children"]>().toEqualTypeOf<ElementChildren>();
    expectTypeOf<Omit<Contracts<"native">["Callout"], "children">>().toEqualTypeOf<
      Omit<Contracts<"web">["Callout"], "children">
    >();
    assertType(
      <Callout tone="danger" title="주의" icon="alert-circle">
        <Text>글</Text>
      </Callout>,
    );
  });

  it("문자열 children · 상태 밖 tone 은 타입 에러다", () => {
    // @ts-expect-error RN Callout 은 Text 밖 문자열을 받지 않는다(C-17)
    assertType(<Callout>문자열</Callout>);
    // @ts-expect-error muted 는 Callout tone 이 아니다
    assertType(<Callout tone="muted">{null}</Callout>);
    // @ts-expect-error children 은 필수다
    assertType(<Callout />);
  });
});

describe("R28 Stepper 계약 — 항목 content 는 컨테이너 규칙이다", () => {
  const items: StepItem[] = [{ value: "a", label: "하나", content: <Text>내용</Text> }, { value: "b", label: "둘" }];

  it("진입점이 StepItem 을 native 로 고정해 다시 내보낸다", () => {
    expectTypeOf<StepItem>().toEqualTypeOf<PlatformStepItem<"native">>();
    expectTypeOf<StepItem>().toEqualTypeOf<{ value: string; label: string; content?: ElementChildren }>();
    expectTypeOf<Contracts<"native">["Stepper"]["items"]>().toEqualTypeOf<StepItem[]>();
  });

  it("items 말고는 웹과 prop 이 같다 — 제어 전용 value · onValueChange", () => {
    expectTypeOf<Omit<Contracts<"native">["Stepper"], "items">>().toEqualTypeOf<
      Omit<Contracts<"web">["Stepper"], "items">
    >();
    expectTypeOf<Contracts<"native">["Stepper"]>().not.toHaveProperty("defaultValue");
    assertType(<Stepper label="단계" items={items} value="a" reached="b" onValueChange={(v: string) => void v} className="mt-4" />);
  });

  it("문자열 content · 값 누락 · number 값 · defaultValue 는 타입 에러다", () => {
    // @ts-expect-error RN content 는 Text 밖 문자열을 받지 않는다(C-17)
    const bad: StepItem = { value: "a", label: "하나", content: "문자열" };
    void bad;
    // @ts-expect-error value 필수 (제어 전용)
    assertType(<Stepper label="단계" items={items} />);
    // @ts-expect-error 값은 string 이다 (C-14)
    assertType(<Stepper label="단계" items={items} value={1} />);
    // @ts-expect-error 제어 전용이라 defaultValue 가 없다
    assertType(<Stepper label="단계" items={items} value="a" defaultValue="a" />);
    // @ts-expect-error 콜백 인자는 string 이다
    assertType(<Stepper label="단계" items={items} value="a" onValueChange={(v: number) => void v} />);
    // @ts-expect-error label 필수
    assertType(<Stepper items={items} value="a" />);
  });
});

describe("AC-14 · AC-15a 잘못된 사용은 타입 에러다", () => {
  it("label 이 빠지면 에러다", () => {
    // @ts-expect-error label 필수
    assertType(<Chip />);
    // @ts-expect-error label 필수
    assertType(<Button />);
    // @ts-expect-error label 필수
    assertType(<Input />);
    // @ts-expect-error label 필수
    assertType(<Textarea />);
  });

  it("색·크기를 임의 문자열로 못 준다", () => {
    // @ts-expect-error tone 은 열거형이다
    assertType(<Text tone="#333">x</Text>);
    // @ts-expect-error 컨트롤 size 는 sm | md | lg 다
    assertType(<Input label="a" size="2xl" />);
    // @ts-expect-error Badge 는 ghost 가 없다(plan D-15)
    assertType(<Badge variant="ghost">x</Badge>);
    // @ts-expect-error Badge size 는 sm | md 다
    assertType(<Badge size="lg">x</Badge>);
  });

  it("icon 은 큐레이션 이름만 받는다", () => {
    // @ts-expect-error 목록에 없는 이름
    assertType(<Button label="a" icon="nope" />);
    // @ts-expect-error 목록에 없는 이름
    assertType(<Icon name="nope" />);
    assertType(<Icon name="chart-pie" tone="muted" />);
  });

  it("누름 핸들러가 이벤트 인자를 받지 않는다", () => {
    // @ts-expect-error 계약은 () => void 다
    assertType(<Button label="a" onPress={(event) => event} />);
    // @ts-expect-error Chip 도 같다
    assertType(<Chip label="a" onPress={(event) => event} />);
    // @ts-expect-error 아이콘에 누름 이벤트는 없다
    assertType(<Icon name="home" onPress={() => {}} />);
  });

  it("웹 전용 이름은 RN 에 없다", () => {
    // @ts-expect-error onClick 은 웹 갈래다
    assertType(<Button label="a" onClick={() => {}} />);
    // @ts-expect-error style 은 열지 않는다(C-15)
    assertType(<Card style={{}}>{null}</Card>);
  });

  it("컨테이너 children 에 문자열을 넣지 못한다(C-17)", () => {
    // @ts-expect-error ElementChildren 은 문자열을 제외한다
    assertType(<Stack>문자열</Stack>);
    // @ts-expect-error Box 도 컨테이너다
    assertType(<Box>문자열</Box>);
  });

  it("텍스트 컴포넌트 children 은 문자열뿐이다(C-17)", () => {
    // @ts-expect-error Label 에 엘리먼트를 넣지 못한다
    assertType(<Label>{<Text>x</Text>}</Label>);
    // @ts-expect-error Badge 도 같다
    assertType(<Badge>{<Text>x</Text>}</Badge>);
  });
});
