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
import { Badge, Box, Button, Callout, Card, Chip, Icon, Input, Label, Link, Stack, Stepper, Text, Textarea } from "@eeennsu/native";
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
const DS_SURFACE_DARK = "#18181b"; // zinc-900 (R26)
const DS_SURFACE_MUTED_LIGHT = "#e5e7eb"; // gray-200 (R26 채움 톤)
const DS_ON_BRAND = "#fff";
/** base 다크의 on-brand · on-danger 는 R26 부터 다시 흰색이다 — 다크 brand · danger 가 진한 채움이다. */
const DS_ON_BRAND_DARK = "#fff";
const DS_FG_MUTED_LIGHT = "#5a6374"; // gray-550 (R26)
const DS_FG_MUTED_DARK = "#9f9fa9"; // zinc-400 (R26)
/** border.surface — base 는 투명 `oklch(0% 0 0 / 0)` 이고 jest 환산값은 4자리 hex 다(F-15). R28 */
const DS_BORDER_SURFACE = "#0000";
/** base radius xl. R28 Badge · Chip 모서리 */
const DS_RADIUS_XL = 20;
/** base 라이트 fg.warning — amber-800 의 jest 환산값(F-15). R28 상태색 */
const DS_FG_WARNING_LIGHT = "#973c00";
/** base 라이트 fg.brand — blue 계열의 jest 환산값(F-15). 앱은 bg.brand 만 재선언해 이 값은 DS 기본이다. R28 Link */
const DS_FG_BRAND_LIGHT = "#1b64da";
/** base 라이트 fg.danger — red-700 의 jest 환산값(F-15). R28 Callout 제목 */
const DS_FG_DANGER_LIGHT = "#c10007";
/** base 라이트 bg.info-subtle — sky-50 의 jest 환산값(F-15). R28 Callout 채움 */
const DS_BG_INFO_SUBTLE_LIGHT = "#f0f9ff";

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
      fontFamily: "Pretendard", // native 래퍼의 --font-sans (C-7b R26)
      fontSize: 22,
      lineHeight: 30,
      fontWeight: 700,
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
    // component 토큰 chip: px 4 · py 2 · radius xl(R28) (높이 38 = 8 + 줄 높이 20 + 8 + 테두리 2)
    expect(food.props.style).toMatchObject({ backgroundColor: APP_BRAND_LIGHT, borderRadius: DS_RADIUS_XL });
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

  test("base 다크의 on-brand · on-danger 글자는 흰색이다 (R26 진한 채움)", async () => {
    await mount(<Badge variant="primary">신규</Badge>, "dark");
    expect(screen.getByText("신규").props.style).toMatchObject({ color: DS_ON_BRAND_DARK });

    await mount(<Chip label="식비" selected />, "dark");
    expect(screen.getByText("식비").props.style).toMatchObject({ color: DS_ON_BRAND_DARK });
    expect(screen.getByText("식비").props.maxFontSizeMultiplier).toBeUndefined();

    await mount(<Button label="삭제" variant="danger" />, "dark");
    expect(screen.getByText("삭제").props.style).toMatchObject({ color: DS_ON_BRAND_DARK });
  });
});

describe("R28 tone", () => {
  test("Text tone=warning 이 fg.warning 색이다", async () => {
    await mount(<Text tone="warning">주의</Text>);
    expect(rootStyle()).toMatchObject({ color: DS_FG_WARNING_LIGHT });
  });
});

describe("R28 표면 경계선 · Badge Chip 모서리", () => {
  test("Card 는 1px 테두리를 갖고 색은 border.surface(base 투명)다", async () => {
    await mount(
      <Card>
        <Text>내용</Text>
      </Card>,
    );
    expect(rootStyle()).toMatchObject({ borderWidth: 1, borderColor: DS_BORDER_SURFACE });
  });

  test("Input · Textarea 의 쉬는 테두리는 border.surface 이고 invalid 의 danger 가 그것을 이긴다(F-28)", async () => {
    await mount(<Input label="이름" />);
    expect(screen.getByLabelText("이름").props.style).toMatchObject({ borderColor: DS_BORDER_SURFACE });

    await mount(<Textarea label="메모" />);
    expect(screen.getByLabelText("메모").props.style).toMatchObject({ borderColor: DS_BORDER_SURFACE });

    await mount(<Input label="이메일" invalid />);
    expect(screen.getByLabelText("이메일").props.style).toMatchObject({ borderColor: DS_DANGER_LIGHT });

    await mount(<Textarea label="사유" invalid />);
    expect(screen.getByLabelText("사유").props.style).toMatchObject({ borderColor: DS_DANGER_LIGHT });
  });

  test("고르지 않은 Chip 테두리는 border.surface, 고른 Chip 은 brand 다", async () => {
    await mount(<Chip label="배달" />);
    expect(screen.getByRole("button", { name: "배달" }).props.style).toMatchObject({
      borderColor: DS_BORDER_SURFACE,
    });

    await mount(<Chip label="식비" selected />);
    expect(screen.getByRole("button", { name: "식비" }).props.style).toMatchObject({
      borderColor: APP_BRAND_LIGHT,
    });
  });

  test("Badge 모서리는 radius xl(20)이다", async () => {
    await mount(<Badge>신규</Badge>);
    expect(rootStyle()).toMatchObject({ borderRadius: DS_RADIUS_XL });
  });
});

describe("R28 Link", () => {
  test("accessibilityRole link 이고 label 이 이름이자 보이는 글이다", async () => {
    await mount(<Link label="다음 단계" onPress={() => {}} />);
    expect(screen.getByRole("link", { name: "다음 단계" })).toBeTruthy();
    expect(screen.getByText("다음 단계")).toBeTruthy();
  });

  test("누르면 onPress 가 인자 없이 한 번 불린다", async () => {
    const onPress = jest.fn();
    await mount(<Link label="다음" onPress={onPress} />);
    await fireEvent.press(screen.getByRole("link", { name: "다음" }));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledWith();
  });

  test("기본 tone · size 는 brand · md 이고 글자가 Pretendard 다", async () => {
    await mount(<Link label="다음" onPress={() => {}} />);
    expect(screen.getByText("다음").props.style).toMatchObject({
      fontFamily: "Pretendard",
      fontSize: 16,
      lineHeight: 24,
      color: DS_FG_BRAND_LIGHT,
    });
  });

  test("className 은 표면(Pressable)에 붙고, 기본으로 부모 폭으로 늘지 않으며 누르는 동안 투명도가 내려간다", async () => {
    await mount(<Link label="다음" tone="muted" size="sm" onPress={() => {}} className="mt-6" />);
    const link = screen.getByRole("link", { name: "다음" });
    expect(link.props.style).toMatchObject({ alignSelf: "flex-start", marginTop: 24 });
    expect(screen.getByText("다음").props.style).toMatchObject({ fontSize: 14, color: DS_FG_MUTED_LIGHT });
    await fireEvent(link, "pressIn");
    expect(screen.getByRole("link", { name: "다음" }).props.style).toMatchObject({ opacity: 0.8 });
  });
});

describe("R28 Callout", () => {
  test("기본 tone 은 info 채움이고 테두리가 없다", async () => {
    await mount(
      <Callout>
        <Text>본문</Text>
      </Callout>,
    );
    const style = rootStyle();
    expect(style).toMatchObject({ backgroundColor: DS_BG_INFO_SUBTLE_LIGHT, padding: 16, flexDirection: "row" });
    expect(style.borderWidth ?? 0).toBe(0);
    expect(style.borderLeftWidth ?? 0).toBe(0);
    expect(screen.getByText("본문")).toBeTruthy();
  });

  test("제목은 tone 의 fg 색 · semibold 이고 아이콘은 꾸밈이라 숨는다", async () => {
    await mount(
      <Callout tone="danger" title="주의" icon="alert-circle">
        <Text>되돌릴 수 없다</Text>
      </Callout>,
    );
    expect(screen.getByText("주의").props.style).toMatchObject({
      fontFamily: "Pretendard",
      fontSize: 16,
      fontWeight: 600,
      color: DS_FG_DANGER_LIGHT,
    });
    expect(screen.queryByRole("image")).toBeNull();
    expect(JSON.stringify(screen.toJSON())).toContain(`"stroke":"${DS_FG_DANGER_LIGHT}"`);
  });

  test("내용 열은 제목과 children 사이를 4px 띄운다", async () => {
    await mount(
      <Callout title="주의">
        <Text>본문</Text>
      </Callout>,
    );
    const column = screen.getByText("주의").parent;
    if (!column) throw new Error("내용 열이 없다");
    expect(JSON.stringify(column.props.style)).toMatch(/"(gap|rowGap)":4/);
  });

  test("title · icon 이 없으면 children 만 그린다", async () => {
    await mount(
      <Callout tone="success">
        <Text>저장했다</Text>
      </Callout>,
    );
    expect(JSON.stringify(screen.toJSON())).not.toContain("RNSVGSvgView");
    expect(screen.getAllByText(/./)).toHaveLength(1);
  });
});

type HostNode = { type: string; props: Record<string, unknown>; children: (HostNode | string)[] | null };

/** 렌더 트리에서 조건에 맞는 호스트 노드를 모두 모은다. DS 컴포넌트에 testID 가 없어 style 로 찾는다. */
function findAllHost(predicate: (node: HostNode) => boolean): HostNode[] {
  const found: HostNode[] = [];
  const walk = (node: HostNode | string | null) => {
    if (!node || typeof node === "string") return;
    if (predicate(node)) found.push(node);
    for (const child of node.children ?? []) walk(child);
  };
  const tree = screen.toJSON() as HostNode | HostNode[] | null;
  for (const root of Array.isArray(tree) ? tree : [tree]) walk(root);
  return found;
}

describe("R28 Stepper", () => {
  const items = [
    { value: "a", label: "하나", content: <Text>하나 내용</Text> },
    { value: "b", label: "둘", content: <Text>둘 내용</Text> },
    { value: "c", label: "셋", content: <Text>셋 내용</Text> },
  ];

  test("목록은 label 을 접근성 이름으로 갖고, 펼친 단계만 content 를 그린다", async () => {
    await mount(<Stepper label="가입 단계" items={items} value="b" />);
    expect(screen.getByLabelText("가입 단계")).toBeTruthy();
    expect(screen.getByText("둘 내용")).toBeTruthy();
    expect(screen.queryByText("하나 내용")).toBeNull();
    expect(screen.queryByText("셋 내용")).toBeNull();
  });

  test("지난 단계는 '완료' 를 붙인 버튼이고 누르면 그 값 하나가 간다", async () => {
    const onValueChange = jest.fn();
    await mount(<Stepper label="가입 단계" items={items} value="b" onValueChange={onValueChange} />);
    const done = screen.getByRole("button", { name: /완료/ });
    expect(done.props.accessibilityLabel).toBe("하나, 완료");
    await fireEvent.press(done);
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("a");
    // 펼친 단계와 남은 단계는 버튼이 아니다
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.queryByRole("button", { name: /둘/ })).toBeNull();
    expect(screen.queryByRole("button", { name: /셋/ })).toBeNull();
  });

  test("onValueChange 가 없으면 버튼이 없고, 지난 단계는 여전히 '완료' 로 읽힌다", async () => {
    await mount(<Stepper label="가입 단계" items={items} value="c" />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.getByLabelText("하나, 완료")).toBeTruthy();
    expect(screen.getByLabelText("둘, 완료")).toBeTruthy();
  });

  test("펼친 단계 글은 selected 이고 semibold · fg, 다른 단계 글은 fg-muted 다", async () => {
    await mount(<Stepper label="가입 단계" items={items} value="b" />);
    const current = screen.getByText("둘");
    expect(current.props.accessibilityState).toMatchObject({ selected: true });
    expect(current.props.style).toMatchObject({ fontFamily: "Pretendard", fontSize: 16, fontWeight: 600, color: DS_FG_LIGHT });
    expect(screen.getByText("셋").props.style).toMatchObject({ color: DS_FG_MUTED_LIGHT });
    expect(screen.getByText("셋").props.accessibilityState).toBeUndefined();
    expect(screen.getByText("하나").props.style).toMatchObject({ color: DS_FG_MUTED_LIGHT });
  });

  test("펼친 단계 표시는 2px brand 막대, 지난 단계 표시는 muted 체크, 남은 단계는 표시가 없다", async () => {
    await mount(<Stepper label="가입 단계" items={items} value="b" />);
    const bars = findAllHost((node) => (node.props.style as Record<string, unknown> | undefined)?.borderLeftWidth === 2);
    expect(bars).toHaveLength(1);
    // react-native-css 는 border-<색> 을 네 변 공통 borderColor 로 낸다 — 폭이 왼쪽뿐이라 왼쪽만 보인다
    expect(bars[0]?.props.style).toMatchObject({ borderColor: APP_BRAND_LIGHT });
    const checks = findAllHost((node) => node.type === "RNSVGSvgView");
    expect(checks).toHaveLength(1);
    expect(checks[0]?.props.stroke).toBe(DS_FG_MUTED_LIGHT);
  });

  test("어긋난 입력에도 던지지 않는다 — 없는 value 는 전부 남은 단계, 빈 items 는 빈 목록", async () => {
    await mount(<Stepper label="가입 단계" items={items} value="z" reached="c" onValueChange={() => {}} />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryByText("둘 내용")).toBeNull();
    expect(screen.getByText("둘").props.style).toMatchObject({ color: DS_FG_MUTED_LIGHT });

    await mount(<Stepper label="빈 단계" items={[]} value="a" />);
    expect(screen.getByLabelText("빈 단계")).toBeTruthy();
  });
});
