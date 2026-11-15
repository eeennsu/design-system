// App 은 Metro 용으로 global.css 를 import 한다. jest 는 CSS 를 모듈로 읽지 못하므로 비운다.
jest.mock("../global.css", () => ({}));

import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text, View } from "react-native";

import App from "../App";

test("jest-expo + RNTL 14 가 뜬다", async () => {
  await render(
    <View>
      <Text>ok</Text>
    </View>,
  );
  expect(screen.getByText("ok")).toBeTruthy();
});

test("검증 앱 App 이 R28 화면까지 렌더된다", async () => {
  await render(<App />);
  expect(screen.getByText("R28")).toBeTruthy();
  expect(screen.getByText("semibold 본문")).toBeTruthy();
  for (const tone of ["brand", "success", "warning", "info"]) {
    expect(screen.getByText(`${tone} 글자`)).toBeTruthy();
  }
  expect(screen.getByText("알림")).toBeTruthy();
  expect(screen.getByText("주의")).toBeTruthy();
  expect(screen.getByLabelText("가입 단계")).toBeTruthy();
  expect(screen.getByText("이름과 사진을 넣는다")).toBeTruthy();

  // Stepper 는 useState 로 제어된다 — Link 를 누르면 첫 단계가 펼쳐진다.
  await fireEvent.press(screen.getByRole("link", { name: "처음 단계로" }));
  expect(screen.getByText("이메일과 비밀번호를 정한다")).toBeTruthy();
  expect(screen.queryByText("이름과 사진을 넣는다")).toBeNull();
});
