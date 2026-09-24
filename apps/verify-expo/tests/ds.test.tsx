/**
 * T-R1 RN 검증 (AC-11 RN절 · AC-19 (c) · AC-22 · AC-25 · AC-26 RN절).
 *
 * 게이트 (9) 가 `react-native-css/components` 출처면 jest 에서 className 이 style 로
 * 풀린다는 것을 확인했으므로, 격하(className prop 스냅샷) 없이 style 로 본다.
 * `@eeennsu/native` 컴포넌트는 그 출처를 쓴다(T-N1).
 *
 * DS 컴포넌트에는 `testID` prop 이 없다(AC-11a: 스프레드 없음). 그래서 조회는
 * 접근성 이름·텍스트·렌더 트리로 한다 — 소비자가 실제로 쓸 수 있는 것과 같은 경로다.
 */
import { Badge, Box, Button, Card, Chip, Icon, Input, Label, Stack, Text, Textarea } from "@eeennsu/native";
import { cleanup, fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { registerCSS } from "react-native-css/jest";

import { setColorScheme } from "./color-scheme";
import { compileAppCss } from "./gate-css";

/** 앱 `global.css` 가 재선언한 값. `apps/verify-next` 와 같은 초록이다(C-5b). */
const APP_BRAND_LIGHT = "#11a22f";
const APP_BRAND_DARK = "#5bbe62";

/** 재선언하지 않은 값 — DS 기본을 그대로 따라야 한다(AC-26 격리). */
const DS_DANGER_LIGHT = "#e7000b";
const DS_FG_LIGHT = "#101828";
const DS_SURFACE_LIGHT = "#fff";
const DS_SURFACE_DARK = "#101828";
const DS_SURFACE_MUTED_LIGHT = "#f3f4f6";
const DS_ON_BRAND = "#fff";
/** base 다크의 on-brand · on-danger 는 gray-950 이다 — 흰 글자는 4.5:1 이 안 된다(N-17). */
const DS_ON_BRAND_DARK = "#030712";
const DS_FG_MUTED_LIGHT = "#6a7282";
const DS_FG_MUTED_DARK = "#99a1af";

async function mount(ui: ReactElement, scheme: "light" | "dark" = "light"): Promise<void> {
  await cleanup();
  registerCSS(await compileAppCss());
  setColorScheme(scheme);
  await render(ui);
}

/** 렌더 트리 루트의 style. 단일 컴포넌트를 마운트했을 때만 쓴다. */
function rootStyle(): Record<string, unknown> {
  const tree = screen.toJSON();
  if (!tree || Array.isArray(tree)) throw new Error("루트가 하나가 아니다");
  return (tree.props as { style?: Record<string, unknown> }).style ?? {};
}

describe("AC-22 label 이 RN 접근성 이름이 된다", () => {
  test("Button 은 가시 텍스트이자 accessibilityLabel 이다", async () => {
    await mount(<Button label="로그인" />);
    expect(screen.getByRole("button", { name: "로그인" })).toBeTruthy();
    // C-13: label 은 아이콘이 있든 없든 항상 렌더된다(알려진 동작 9).
    expect(screen.getByText("로그인")).toBeTruthy();
  });

  test("Input 은 accessibilityLabel 로만 간다 — 가시 라벨이 아니다", async () => {
    await mount(<Input label="이메일" placeholder="you@example.com" />);
    expect(screen.getByLabelText("이메일")).toBeTruthy();
    expect(screen.queryByText("이메일")).toBeNull();
  });

  test("invalid 는 테두리 색까지만 간다 — RN 에 aria-invalid 가 없다", async () => {
    await mount(<Input label="이메일" invalid />);
    expect(screen.getByLabelText("이메일").props.style).toMatchObject({
      borderColor: DS_DANGER_LIGHT,
    });
    // 오류를 읽히는 건 소비자가 놓는 Text tone="danger" 다(C-21 과 같은 방식).
    expect(screen.getByLabelText("이메일").props["aria-invalid"]).toBeUndefined();
  });

  test("kind 가 RN 속성으로 파생된다(C-11)", async () => {
    await mount(
      <Stack>
        <Input label="비밀번호" kind="password" />
        <Input label="이메일" kind="email" />
      </Stack>,
    );
    const password = screen.getByLabelText("비밀번호");
    expect(password.props.secureTextEntry).toBe(true);
    expect(password.props.textContentType).toBe("password");

    const email = screen.getByLabelText("이메일");
    expect(email.props.keyboardType).toBe("email-address");
    expect(email.props.autoCapitalize).toBe("none");
  });
});

describe("AC-26 RN절 소비자 :root 재선언", () => {
  test("재선언한 --bg-brand 가 라이트에서 적용된다", async () => {
    await mount(<Stack className="bg-brand">{null}</Stack>, "light");
    expect(rootStyle()).toMatchObject({ backgroundColor: APP_BRAND_LIGHT });
  });

  test("@media 블록이 다크에서 적용된다 — RN 은 2블록이다", async () => {
    await mount(<Stack className="bg-brand">{null}</Stack>, "dark");
    expect(rootStyle()).toMatchObject({ backgroundColor: APP_BRAND_DARK });
  });

  test("재선언하지 않은 변수는 DS 기본값 그대로다(격리)", async () => {
    await mount(<Stack className="bg-danger">{null}</Stack>, "light");
    expect(rootStyle()).toMatchObject({ backgroundColor: DS_DANGER_LIGHT });
  });
});

describe("AC-19 (c) 색 구성표", () => {
  test("코드 0줄로 OS 다크를 따른다", async () => {
    await mount(<Card>{null}</Card>, "light");
    expect(rootStyle()).toMatchObject({ backgroundColor: DS_SURFACE_LIGHT });

    await mount(<Card>{null}</Card>, "dark");
    expect(rootStyle()).toMatchObject({ backgroundColor: DS_SURFACE_DARK });
  });
});

describe("AC-11 RN절 · AC-25 className 병합", () => {
  test("소비자 className 이 DS 기본 배경을 이긴다", async () => {
    await mount(
      <Stack direction="row">
        <Button label="기본" variant="primary" />
        <Button label="변경" variant="primary" className="bg-danger mt-6" />
      </Stack>,
    );
    expect(screen.getByRole("button", { name: "기본" }).props.style).toMatchObject({
      backgroundColor: APP_BRAND_LIGHT,
    });
    expect(screen.getByRole("button", { name: "변경" }).props.style).toMatchObject({
      backgroundColor: DS_DANGER_LIGHT,
      marginTop: 24,
    });
  });

  test("Text 스텝이 세 값을 함께 적용한다(T-N0 배수 line-height)", async () => {
    await mount(
      <Text size="xl" tone="default">
        제목
      </Text>,
    );
    expect(rootStyle()).toMatchObject({
      fontSize: 20,
      lineHeight: 28,
      fontWeight: 600,
      color: DS_FG_LIGHT,
    });
  });
});

describe("N-16 추가 4개 — Textarea · Label · Badge · Box", () => {
  test("Label 이 같은 id 의 Input · Textarea 를 accessibilityLabelledBy 로 가리킨다", async () => {
    await mount(
      <Stack>
        <Label htmlFor="email">이메일 주소</Label>
        <Input id="email" label="이메일" />
        <Label htmlFor="memo">메모 입력</Label>
        <Textarea id="memo" label="메모" />
      </Stack>,
    );
    // label 과 다른 가시 텍스트로 찾는다 — accessibilityLabel 이 아니라 연결로 찾았다는 뜻이다.
    // 연결이 있으면 RNTL 은 ARIA 처럼 연결된 텍스트를 이름으로 삼는다(labelledby > label).
    expect(screen.getByLabelText("이메일 주소").props.accessibilityLabel).toBe("이메일");
    expect(screen.getByLabelText("메모 입력").props.accessibilityLabel).toBe("메모");
  });

  test("htmlFor 가 없으면 연결 없이 가시 텍스트만 남는다", async () => {
    await mount(
      <Stack>
        <Label>메모</Label>
        <Textarea label="메모 칸" />
      </Stack>,
    );
    expect(screen.getByText("메모").props.nativeID).toBeUndefined();
    expect(screen.getByLabelText("메모 칸").props.accessibilityLabelledBy).toBeUndefined();
  });

  test("Label 은 웹과 같은 text-sm · text-fg 다", async () => {
    await mount(<Label>이메일</Label>);
    expect(rootStyle()).toMatchObject({ fontSize: 14, lineHeight: 20, color: DS_FG_LIGHT });
  });

  test("Textarea size 가 행수로 간다 — 3 / 5 / 8 (plan D-14)", async () => {
    await mount(
      <Stack>
        <Textarea label="작게" size="sm" />
        <Textarea label="기본" />
        <Textarea label="크게" size="lg" />
      </Stack>,
    );
    expect(screen.getByLabelText("작게").props.numberOfLines).toBe(3);
    expect(screen.getByLabelText("기본").props.numberOfLines).toBe(5);
    expect(screen.getByLabelText("크게").props.numberOfLines).toBe(8);

    const textarea = screen.getByLabelText("기본");
    expect(textarea.props.multiline).toBe(true);
    expect(textarea.props.textAlignVertical).toBe("top");
  });

  test("Textarea 글자 크기는 size 와 무관하게 Input md 다", async () => {
    await mount(<Textarea label="크게" size="lg" invalid />);
    expect(screen.getByLabelText("크게").props.style).toMatchObject({
      fontSize: 16,
      borderColor: DS_DANGER_LIGHT,
    });
  });

  test("Badge 는 표면과 글자에 variant 색을 나눠 건다", async () => {
    await mount(<Badge variant="primary">신규</Badge>);
    expect(rootStyle()).toMatchObject({ backgroundColor: APP_BRAND_LIGHT });
    expect(screen.getByText("신규").props.style).toMatchObject({ color: DS_ON_BRAND, fontSize: 14 });
  });

  test("Badge 기본은 secondary · sm 이다", async () => {
    await mount(<Badge>기본</Badge>);
    expect(rootStyle()).toMatchObject({
      backgroundColor: DS_SURFACE_MUTED_LIGHT,
      // react-native-css 는 px · py 를 논리 속성으로 낸다.
      paddingInline: 8,
      paddingBlock: 0,
    });
    expect(screen.getByText("기본").props.style).toMatchObject({ color: DS_FG_LIGHT });
  });

  test("Box 는 className 만 받는다", async () => {
    await mount(<Box className="bg-danger p-8">{null}</Box>);
    expect(rootStyle()).toMatchObject({ backgroundColor: DS_DANGER_LIGHT, padding: 32 });
  });
});

describe("N-17 Chip · Icon · 눌림 · 누름 영역 · 포커스 · 고정폭 숫자", () => {
  test("Chip 은 고른 상태를 selected 로 알리고 brand 로 채운다", async () => {
    await mount(
      <Stack direction="row" className="gap-3">
        <Chip label="식비" selected />
        <Chip label="배달" />
      </Stack>,
    );
    const food = screen.getByRole("button", { name: "식비" });
    expect(food.props.accessibilityState).toMatchObject({ selected: true });
    // component 토큰 chip: px 4 · py 2 · radius full (높이 38 = 8 + 줄 높이 20 + 8 + 테두리 2)
    expect(food.props.style).toMatchObject({ backgroundColor: APP_BRAND_LIGHT, borderRadius: 9999 });
    expect(JSON.stringify(food.props.style)).toMatch(/"padding(Horizontal|Inline|Left)":16/);
    expect(JSON.stringify(food.props.style)).toMatch(/"padding(Vertical|Block|Top)":8/);
    expect(screen.getByText("식비").props.style).toMatchObject({ color: DS_ON_BRAND, fontSize: 14 });
    expect(screen.getByRole("button", { name: "배달" }).props.accessibilityState).toMatchObject({
      selected: false,
    });
  });

  test("누르는 동안 투명도가 내려가고, 소비자가 바꾼 배경은 그대로다(알려진 동작 4)", async () => {
    await mount(<Chip label="식비" selected />);
    await fireEvent(screen.getByRole("button", { name: "식비" }), "pressIn");
    expect(screen.getByRole("button", { name: "식비" }).props.style).toMatchObject({
      backgroundColor: APP_BRAND_LIGHT,
      opacity: 0.8,
    });

    await mount(<Button label="삭제" className="bg-danger" />);
    await fireEvent(screen.getByRole("button", { name: "삭제" }), "pressIn");
    expect(screen.getByRole("button", { name: "삭제" }).props.style).toMatchObject({
      backgroundColor: DS_DANGER_LIGHT,
      opacity: 0.8,
    });
  });

  test("Chip onPress 는 인자 없이 불리고, disabled 면 막힌다", async () => {
    const onPress = jest.fn();
    await mount(
      <Stack>
        <Chip label="식비" onPress={onPress} />
        <Chip label="배달" disabled onPress={onPress} />
      </Stack>,
    );
    await fireEvent.press(screen.getByRole("button", { name: "식비" }));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledWith();

    await fireEvent.press(screen.getByRole("button", { name: "배달" }));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "배달" }).props.accessibilityState).toMatchObject({
      disabled: true,
    });
  });

  test("누름 영역이 48 이 되도록 세로 hitSlop 을 준다 — Button 30 · 42 · 54, Chip 38", async () => {
    await mount(
      <Stack>
        <Button label="작게" size="sm" />
        <Button label="기본" />
        <Button label="크게" size="lg" />
        <Chip label="칩" />
      </Stack>,
    );
    expect(screen.getByRole("button", { name: "작게" }).props.hitSlop).toEqual({ top: 9, bottom: 9 });
    expect(screen.getByRole("button", { name: "기본" }).props.hitSlop).toEqual({ top: 3, bottom: 3 });
    expect(screen.getByRole("button", { name: "크게" }).props.hitSlop).toBeUndefined();
    expect(screen.getByRole("button", { name: "칩" }).props.hitSlop).toEqual({ top: 5, bottom: 5 });
    // 가로는 최소 폭 48 이다 — 짧은 라벨("예")에서도 모자라지 않다
    for (const name of ["작게", "기본", "칩"]) {
      expect(screen.getByRole("button", { name }).props.style).toMatchObject({ minWidth: 48 });
    }
  });

  test("Input 은 포커스되면 테두리가 border-focus(= brand)다. invalid 는 danger 를 지킨다", async () => {
    await mount(<Input label="금액" />);
    await fireEvent(screen.getByLabelText("금액"), "focus");
    expect(screen.getByLabelText("금액").props.style).toMatchObject({ borderColor: APP_BRAND_LIGHT });
    await fireEvent(screen.getByLabelText("금액"), "blur");
    expect(screen.getByLabelText("금액").props.style).not.toMatchObject({
      borderColor: APP_BRAND_LIGHT,
    });

    await mount(<Textarea label="메모" />);
    await fireEvent(screen.getByLabelText("메모"), "focus");
    expect(screen.getByLabelText("메모").props.style).toMatchObject({ borderColor: APP_BRAND_LIGHT });

    await mount(<Input label="금액" invalid />);
    await fireEvent(screen.getByLabelText("금액"), "focus");
    expect(screen.getByLabelText("금액").props.style).toMatchObject({ borderColor: DS_DANGER_LIGHT });
  });

  test("placeholder 는 fg-muted 색이다 — 플랫폼 기본 hint 색(흰 표면 위 약 2.7:1)을 쓰지 않는다", async () => {
    await mount(
      <Stack>
        <Input label="금액" placeholder="0" />
        <Textarea label="메모" placeholder="무엇에 썼나요" />
      </Stack>,
    );
    expect(screen.getByLabelText("금액").props.placeholderTextColor).toBe(DS_FG_MUTED_LIGHT);
    expect(screen.getByLabelText("메모").props.placeholderTextColor).toBe(DS_FG_MUTED_LIGHT);

    await mount(<Input label="금액" placeholder="0" />, "dark");
    expect(screen.getByLabelText("금액").props.placeholderTextColor).toBe(DS_FG_MUTED_DARK);
  });

  test("tabular-nums 가 fontVariant 로 풀린다 — native 래퍼의 RN 선언(F-21)", async () => {
    await mount(<Text className="tabular-nums">411,600원</Text>);
    expect(rootStyle()).toMatchObject({ fontVariant: "tabular-nums" });
  });

  test("Icon 의 배치 · 변형 · 투명도 클래스는 루트 View 에 한 번만 걸린다", async () => {
    // svg 에 직접 주면 lucide 가 style 을 도형마다 펼쳐 rotate 는 던지고 opacity 는 곱해진다(N-17)
    await mount(<Icon name="chevron-down" tone="muted" className="ml-6 rotate-180 opacity-50" />);
    const tree = screen.toJSON();
    if (!tree || Array.isArray(tree)) throw new Error("루트가 하나가 아니다");
    expect(tree.type).toBe("View");
    expect(tree.props.style).toMatchObject({ marginLeft: 24, opacity: 0.5 });
    expect(JSON.stringify(tree.props.style)).toContain("180deg");
    // label 이 없으면 꾸밈이라 숨는다
    expect(tree.props).toMatchObject({ accessible: false, importantForAccessibility: "no-hide-descendants" });

    const svg = tree.children?.[0];
    if (!svg || typeof svg === "string") throw new Error("svg 가 없다");
    expect(svg.type).toBe("RNSVGSvgView");
    expect(svg.props.stroke).toBe(DS_FG_MUTED_LIGHT);
    // 도형까지 내려가는 style 이 없다
    expect(JSON.stringify(svg)).not.toMatch(/"opacity":0\.5|180deg/);
  });

  test("Icon 색은 소비자 className 이 tone 을 이긴다(C-15)", async () => {
    await mount(<Icon name="home" tone="muted" className="text-brand" />);
    const tree = screen.toJSON();
    if (!tree || Array.isArray(tree)) throw new Error("루트가 하나가 아니다");
    const svg = tree.children?.[0];
    if (!svg || typeof svg === "string") throw new Error("svg 가 없다");
    expect(svg.props.stroke).toBe(APP_BRAND_LIGHT);
  });

  test("Icon label 이 있으면 이름 있는 그림, 빈 문자열이면 꾸밈이다", async () => {
    await mount(<Icon name="calendar" label="날짜" />);
    expect(screen.getByRole("image", { name: "날짜" })).toBeTruthy();

    await mount(<Icon name="calendar" label="" />);
    expect(screen.queryByRole("image")).toBeNull();
  });

  test("base 다크의 on-brand 글자는 gray-950 이다 — 흰 글자는 4.5:1 이 안 된다", async () => {
    await mount(<Badge variant="primary">신규</Badge>, "dark");
    expect(screen.getByText("신규").props.style).toMatchObject({ color: DS_ON_BRAND_DARK });

    await mount(<Chip label="식비" selected />, "dark");
    expect(screen.getByText("식비").props.style).toMatchObject({ color: DS_ON_BRAND_DARK });
    expect(screen.getByText("식비").props.maxFontSizeMultiplier).toBeUndefined();

    await mount(<Button label="삭제" variant="danger" />, "dark");
    expect(screen.getByText("삭제").props.style).toMatchObject({ color: DS_ON_BRAND_DARK });
  });
});
