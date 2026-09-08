/**
 * T-N4 native 타입 테스트 (AC-21 · AC-13 RN 절).
 *
 * 웹 구현과 **같은 계약 맵**을 만족하는지, 그리고 플랫폼 갈래(누름 이벤트)가
 * 계약대로 갈리는지를 컴파일 결과로 판정한다.
 */
import type {
  Contracts,
  ControlSize,
  FocusHandle,
  NativeKey,
  Size,
  Tone,
  Variant,
} from "@eeennsu/tokens";
import { nativeComponents } from "@eeennsu/tokens";
import type { FC } from "react";
import { assertType, describe, expectTypeOf, it } from "vitest";
import { Button, Card, Input, Stack, Text, components } from "../src/index.js";

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

  it("키 목록이 맵의 키와 같다 — v1 RN 은 5개다(AC-20)", () => {
    expectTypeOf<(typeof nativeComponents)[number]>().toEqualTypeOf<keyof typeof components>();
    expectTypeOf<NativeKey>().toEqualTypeOf<"Button" | "Input" | "Card" | "Stack" | "Text">();
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

  it("Input 값 제어는 3종뿐이고 onChange 계열이 없다(C-12)", () => {
    expectTypeOf<Contracts<"native">["Input"]>().toHaveProperty("value");
    expectTypeOf<Contracts<"native">["Input"]>().toHaveProperty("defaultValue");
    expectTypeOf<Contracts<"native">["Input"]>().toHaveProperty("onValueChange");
    expectTypeOf<Contracts<"native">["Input"]>().not.toHaveProperty("onChange");
    expectTypeOf<Contracts<"native">["Input"]>().not.toHaveProperty("onChangeText");
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

describe("AC-14 · AC-15a 잘못된 사용은 타입 에러다", () => {
  it("label 이 빠지면 에러다", () => {
    // @ts-expect-error label 필수
    assertType(<Button />);
    // @ts-expect-error label 필수
    assertType(<Input />);
  });

  it("색·크기를 임의 문자열로 못 준다", () => {
    // @ts-expect-error tone 은 열거형이다
    assertType(<Text tone="#333">x</Text>);
    // @ts-expect-error 컨트롤 size 는 sm | md | lg 다
    assertType(<Input label="a" size="2xl" />);
  });

  it("icon 은 큐레이션 이름만 받는다", () => {
    // @ts-expect-error 목록에 없는 이름
    assertType(<Button label="a" icon="nope" />);
  });

  it("누름 핸들러가 이벤트 인자를 받지 않는다", () => {
    // @ts-expect-error 계약은 () => void 다
    assertType(<Button label="a" onPress={(event) => event} />);
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
  });
});
