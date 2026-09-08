/**
 * C-19 착수 게이트 (plan.md §2.2) 판정 (a) — jest-expo + RNTL 14.
 *
 * 이 파일은 게이트 결과를 고정하는 특성화 테스트다. 통과/실패 판정은
 * docs/gate-c19.md 에 있고, 여기서는 **관측된 동작**을 그대로 단언한다.
 * 실패로 기록된 항목(2)(4)(5)도 단언이 있다 — 나중에 NativeWind 가 고쳐지면
 * 이 테스트가 깨져서 알려주는 것이 목적이다.
 *
 * 색 값은 토큰 CSS 의 oklch 를 react-native-css 가 sRGB 로 환산한 결과다.
 */
import { cleanup, render, screen } from "@testing-library/react-native";
import { View as ReactNativeView } from "react-native";
import { registerCSS } from "react-native-css/jest";
import { Text, View } from "react-native-css/components";

import { setColorScheme } from "./color-scheme";
import { compileGlobalCss, hasClass } from "./gate-css";

/** :root 의 --bg-brand = oklch(54.6% 0.245 262.881) */
const BRAND_LIGHT = "#155dfc";
/** @media 다크의 --bg-brand = oklch(62.3% 0.214 259.815) */
const BRAND_DARK = "#2b7fff";
/** @media 다크의 --bg-danger = oklch(63.7% 0.237 25.331) */
const DANGER_DARK = "#fb2c36";

async function styleOf(
  className: string,
  { extraCss = "", scheme = null as "light" | "dark" | null } = {},
) {
  // 앞 렌더가 남아 있으면 스킴 전환이 그 트리를 act 밖에서 갱신한다.
  await cleanup();
  registerCSS(await compileGlobalCss(extraCss));
  setColorScheme(scheme);
  await render(<View testID="probe" className={className} />);
  return screen.getByTestId("probe").props.style;
}

describe("(1) @theme inline — 통과", () => {
  test("bg-brand 이 :root 의 --bg-brand 해석값으로 칠해진다", async () => {
    expect(await styleOf("bg-brand")).toEqual({ backgroundColor: BRAND_LIGHT });
  });

  test("간격 · radius 도 토큰 값 그대로 들어온다", async () => {
    expect(await styleOf("p-8 rounded-md")).toEqual({
      padding: 32,
      borderRadius: 8,
    });
  });
});

describe("(2) .dark 루트 셀렉터 — 실패(무시)", () => {
  test("소비자가 쓴 .dark 블록은 무시된다 — 값은 래퍼 다크 블록이 정한다", async () => {
    const style = await styleOf("bg-brand", {
      extraCss: `.dark { --bg-brand: rgb(10 11 12); }`,
      scheme: "dark",
    });
    expect(style).toEqual({ backgroundColor: BRAND_DARK });
  });

  test("대신 dark: 유틸리티 변형은 동작한다", async () => {
    const extraCss = `@source inline("dark:bg-danger");`;
    expect(await styleOf("bg-brand dark:bg-danger", { extraCss, scheme: "dark" })).toEqual({
      backgroundColor: DANGER_DARK,
    });
    expect(await styleOf("bg-brand dark:bg-danger", { extraCss, scheme: "light" })).toEqual({
      backgroundColor: BRAND_LIGHT,
    });
  });
});

describe("T-N0 native 래퍼 다크 블록 — (2)·(4) 실패의 우회", () => {
  test("래퍼의 @media (prefers-color-scheme: dark) { :root } 가 다크에서 적용된다", async () => {
    expect(await styleOf("bg-brand", { scheme: "dark" })).toEqual({
      backgroundColor: BRAND_DARK,
    });
    expect(await styleOf("bg-brand", { scheme: "light" })).toEqual({
      backgroundColor: BRAND_LIGHT,
    });
  });

  test("canvas · fg 도 함께 다크 값이 된다", async () => {
    expect(await styleOf("bg-canvas text-fg", { scheme: "dark" })).toEqual({
      backgroundColor: "#030712",
      color: "#f9fafb",
    });
  });
});

describe("(3) @source — 통과", () => {
  test("래퍼의 @source \"../dist\" 만으로 클래스가 생성된다", async () => {
    // 아래 셋은 packages/native/dist/_gate-stub.js 에만 있고 앱 소스에는 없다.
    const css = await compileGlobalCss();
    expect(hasClass(css, "mt-6")).toBe(true);
    expect(hasClass(css, "text-fg-muted")).toBe(true);
    expect(hasClass(css, "bg-danger")).toBe(true);
  });

  test("스텁에도 앱 소스에도 없는 클래스는 생성되지 않는다", async () => {
    const css = await compileGlobalCss();
    for (const className of ["bg-surface-hover", "text-lg", "p-24", "shadow-lg"]) {
      expect(hasClass(css, className)).toBe(false);
    }
  });
});

describe("(4) @media (prefers-color-scheme: dark) — :not(.light) 만 실패", () => {
  test(":root:not(.light) 는 다크에서도 적용되지 않는다 — 래퍼 다크 값이 남는다", async () => {
    const style = await styleOf("bg-brand", {
      extraCss: `@media (prefers-color-scheme: dark) { :root:not(.light) { --bg-brand: rgb(7 8 9); } }`,
      scheme: "dark",
    });
    expect(style).toEqual({ backgroundColor: BRAND_DARK });
  });

  test(":not(.light) 을 뺀 :root 는 다크에서 적용된다", async () => {
    const extraCss = `@media (prefers-color-scheme: dark) { :root { --bg-brand: rgb(4 5 6); } }`;
    expect(await styleOf("bg-brand", { extraCss, scheme: "dark" })).toEqual({
      backgroundColor: "#040506",
    });
    expect(await styleOf("bg-brand", { extraCss, scheme: "light" })).toEqual({
      backgroundColor: BRAND_LIGHT,
    });
  });
});

describe("(5) 복합 폰트 변수 — T-N0 배수 처리 후 통과", () => {
  test("text-xl 이 fontSize · lineHeight · fontWeight 세 값을 다 적용한다", async () => {
    registerCSS(await compileGlobalCss());
    await render(
      <Text testID="probe" className="text-xl">
        x
      </Text>,
    );
    // T-N0 이 native 래퍼에서 배수(1.4)로 다시 내므로 20 * 1.4 = 28 이 된다(plan D-31).
    expect(screen.getByTestId("probe").props.style).toEqual({
      fontSize: 20,
      lineHeight: 28,
      fontWeight: 600,
    });
  });

  test("line-height 를 단위 없는 배수로 내면 맞는다", async () => {
    registerCSS(await compileGlobalCss(`@theme { --text-xl--line-height: 1.4; }`));
    await render(
      <Text testID="probe" className="text-xl">
        x
      </Text>,
    );
    expect(screen.getByTestId("probe").props.style).toEqual({
      fontSize: 20,
      lineHeight: 28,
      fontWeight: 600,
    });
  });
});

describe("(6) 소비자 :root 재선언 last-wins — 통과(블록 형태 제한)", () => {
  const CONSUMER_LIGHT = "#010203";
  const CONSUMER_DARK = "#070809";

  test(":root 재선언이 토큰 값을 이긴다", async () => {
    const style = await styleOf("bg-brand", {
      extraCss: `:root { --bg-brand: rgb(1 2 3); }`,
      scheme: "light",
    });
    expect(style).toEqual({ backgroundColor: CONSUMER_LIGHT });
  });

  test("웹과 같은 3블록을 쓰면 다크가 라이트 값에 머문다", async () => {
    const extraCss = `
      :root { --bg-brand: rgb(1 2 3); }
      .dark { --bg-brand: rgb(4 5 6); }
      @media (prefers-color-scheme: dark) { :root:not(.light) { --bg-brand: rgb(7 8 9); } }
    `;
    expect(await styleOf("bg-brand", { extraCss, scheme: "dark" })).toEqual({
      backgroundColor: CONSUMER_LIGHT,
    });
  });

  test("RN 용 2블록(:root + @media :root)은 라이트 · 다크 모두 이긴다", async () => {
    const extraCss = `
      :root { --bg-brand: rgb(1 2 3); }
      @media (prefers-color-scheme: dark) { :root { --bg-brand: rgb(7 8 9); } }
    `;
    expect(await styleOf("bg-brand", { extraCss, scheme: "light" })).toEqual({
      backgroundColor: CONSUMER_LIGHT,
    });
    expect(await styleOf("bg-brand", { extraCss, scheme: "dark" })).toEqual({
      backgroundColor: CONSUMER_DARK,
    });
  });
});

describe("(8) 래퍼 구성", () => {
  test("소비자가 tailwindcss 를 또 import 하면 preflight 만 중복된다", async () => {
    const single = await compileGlobalCss();
    const duplicated = await compileGlobalCss(`@import "tailwindcss";`);
    const preflight = (css: string) => (css.match(/box-sizing: border-box/g) ?? []).length;
    const utility = (css: string) => (css.match(/\.bg-brand \{/g) ?? []).length;

    expect(preflight(single)).toBe(1);
    expect(preflight(duplicated)).toBe(2);
    expect(utility(single)).toBe(1);
    expect(utility(duplicated)).toBe(1);
  });

  test("nativewind/theme 는 --spacing 리셋과 함께 쓸 수 없다", async () => {
    await expect(compileGlobalCss(`@import "nativewind/theme";`)).rejects.toThrow(
      /--spacing\(…\) function requires/,
    );
  });

  test("--spacing 을 되살리면 nativewind/theme 가 컴파일된다", async () => {
    const style = await styleOf("bg-brand", {
      extraCss: `@import "nativewind/theme";\n@theme { --spacing: 4px; }`,
    });
    expect(style).toEqual({ backgroundColor: BRAND_LIGHT });
  });
});

describe("(9) 테스트 환경 className 해석 — 통과(컴포넌트 출처 제한)", () => {
  test("react-native-css/components 의 View 는 className 을 style 로 푼다", async () => {
    expect(await styleOf("bg-brand")).toEqual({ backgroundColor: BRAND_LIGHT });
  });

  test("순수 react-native 의 View 는 jest 에서 className 을 풀지 못한다", async () => {
    registerCSS(await compileGlobalCss());
    await render(<ReactNativeView testID="probe" className="bg-brand" />);
    const props = screen.getByTestId("probe").props;
    expect(props.style).toBeUndefined();
    expect(props.className).toBe("bg-brand");
  });
});
