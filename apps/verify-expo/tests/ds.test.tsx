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
import { Button, Card, Input, Stack, Text } from "@eeennsu/native";
import { cleanup, render, screen } from "@testing-library/react-native";
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
