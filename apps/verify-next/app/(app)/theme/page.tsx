"use client";

import { Box, Button, Stack, Text } from "@eeennsu/web";
import { ThemeProvider, useTheme } from "next-themes";

/** next-themes 는 해석된 테마를 루트 클래스로 쓴다. 클래스가 있으면 OS 보다 우선한다(C-20). */
function Controls() {
  const { setTheme } = useTheme();
  return (
    <Stack direction="row" className="gap-2">
      <Button label="라이트" variant="secondary" onClick={() => setTheme("light")} />
      <Button label="다크" variant="secondary" onClick={() => setTheme("dark")} />
      <Button label="시스템" variant="secondary" onClick={() => setTheme("system")} />
    </Stack>
  );
}

export default function ThemePage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Stack className="bg-canvas min-h-screen p-4 gap-4">
        <Text heading="1" size="xl">
          테마
        </Text>
        <Controls />
        <Box className="bg-brand p-8">{null}</Box>
      </Stack>
    </ThemeProvider>
  );
}
