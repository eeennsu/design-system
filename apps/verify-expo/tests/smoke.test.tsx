import { render, screen } from "@testing-library/react-native";
import { Text, View } from "react-native";

test("jest-expo + RNTL 14 가 뜬다", async () => {
  await render(
    <View>
      <Text>ok</Text>
    </View>,
  );
  expect(screen.getByText("ok")).toBeTruthy();
});
