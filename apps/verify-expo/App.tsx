import { Box, Button, Card, Chip, Icon, Input, Label, Stack, Text } from "@eeennsu/native";
import { useUnstableNativeVariable } from "nativewind";
import { useState } from "react";
import { Appearance, Pressable, Text as RNText, ScrollView } from "react-native";

import "./global.css";

// tsc 는 react-native-css 의 web 구현(`() => never`)으로 해석한다. Metro 는 native 구현을 쓴다.
const useNativeVariable = useUnstableNativeVariable as unknown as (
  name: string,
) => string | undefined;

/** 게이트 판정 (b) 화면에서 쓰던 변수 probe. 기기 확인을 다시 할 수 있게 남긴다. */
function Probe({ name }: { name: string }) {
  const value = useNativeVariable(name);
  return (
    <Text size="sm" tone="muted">
      {name} = {String(value)}
    </Text>
  );
}

/**
 * T-R1 검증 화면 (AC-11 RN절 · AC-19 (c) · AC-22 · AC-23 · AC-25 · AC-26 RN절).
 *
 * `apps/verify-next` 의 로그인 화면과 같은 구성이다 — 두 스크린샷을 나란히 놓고
 * 색·간격이 같은지 보는 것이 AC-23 의 수동 확인이다. 다크모드 코드는 없다(OS 를 따른다).
 */
export default function App() {
  const [category, setCategory] = useState("식비");

  return (
    <ScrollView className="bg-canvas" contentContainerClassName="p-4 pt-24">
      <Card className="w-full">
        <Stack className="gap-4">
          <Text heading="1" size="xl">
            로그인
          </Text>

          <Stack className="gap-1">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" label="이메일" kind="email" placeholder="you@example.com" />
          </Stack>

          <Stack className="gap-1">
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" label="비밀번호" kind="password" />
          </Stack>

          <Text tone="danger" size="sm">
            이메일 또는 비밀번호가 올바르지 않습니다
          </Text>

          <Button label="로그인" variant="primary" />

          {/* AC-25: 같은 variant 인데 하나만 className 으로 바꾼다. */}
          <Stack direction="row" className="gap-2">
            <Button label="기본" variant="primary" />
            <Button label="변경" variant="primary" className="bg-danger mt-6" />
          </Stack>

          {/* N-17: 고르는 칩과 단독 아이콘. 칩을 누르는 동안 표면이 진해진다(active:). */}
          <Stack direction="row" wrap className="gap-3">
            {["식비", "배달", "교통"].map((name) => (
              <Chip
                key={name}
                label={name}
                selected={name === category}
                onPress={() => setCategory(name)}
              />
            ))}
          </Stack>
          <Stack direction="row" align="center" className="gap-4">
            <Icon name="home" />
            <Icon name="list" tone="muted" />
            <Icon name="chart-pie" className="text-brand" />
            <Icon name="calendar" label="날짜" size="lg" />
            <Text size="sm" tone="muted" className="tabular-nums">
              1,234,567원
            </Text>
          </Stack>

          {/* AC-26: 재선언한 변수는 따라가고, 재선언하지 않은 변수는 그대로여야 한다. */}
          <Box className="bg-brand p-8">{null}</Box>
          <Box className="bg-danger p-8">{null}</Box>

          <Probe name="--bg-brand" />
          <Probe name="--fg-default" />

          {/* AC-19 (c): 수동 전환. OS 다크는 이 버튼 없이도 따라간다. */}
          <Pressable
            className="bg-surface-muted rounded-md p-4"
            onPress={() =>
              Appearance.setColorScheme(
                Appearance.getColorScheme() === "dark" ? "light" : "dark",
              )
            }
          >
            <RNText className="text-md text-fg">toggle color scheme</RNText>
          </Pressable>
        </Stack>
      </Card>
    </ScrollView>
  );
}
