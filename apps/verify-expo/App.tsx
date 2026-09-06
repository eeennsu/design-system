import { useUnstableNativeVariable } from "nativewind";
import { Appearance, Pressable, Text, View } from "react-native";

import "./global.css";

// tsc 는 react-native-css 의 web 구현(`() => never`)으로 해석한다. Metro 는 native 구현을 쓴다.
const useNativeVariable = useUnstableNativeVariable as unknown as (
  name: string,
) => string | undefined;

/** 게이트 판정 (b) 화면. 값 확인은 화면 텍스트로 읽는다. */
function Probe({ name }: { name: string }) {
  const value = useNativeVariable(name);
  return (
    <Text className="text-sm text-fg">
      {name} = {String(value)}
    </Text>
  );
}

export default function App() {
  return (
    <View className="bg-canvas gap-4 p-8 pt-24">
      <Text className="text-2xl text-fg">C-19 gate</Text>

      {/* (1) @theme inline — bg-brand 이 :root 의 --bg-brand 로 칠해지는가 */}
      <View className="bg-brand h-16 rounded-md" />

      {/* (5) 복합 폰트 변수 — fontSize · lineHeight · fontWeight */}
      <Text className="text-xl text-fg">text-xl</Text>

      <Probe name="--bg-brand" />
      <Probe name="--fg-default" />

      {/* (2) .dark 셀렉터 — Appearance 로 전환 */}
      <Pressable
        className="bg-surface-muted rounded-md p-4"
        onPress={() =>
          Appearance.setColorScheme(
            Appearance.getColorScheme() === "dark" ? "light" : "dark",
          )
        }
      >
        <Text className="text-md text-fg">toggle color scheme</Text>
      </Pressable>
    </View>
  );
}
