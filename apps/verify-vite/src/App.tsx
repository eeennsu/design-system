import { Button, Card, Form, Input, Label, Stack, Text } from "@eeennsu/web";

/**
 * AC-17 검증 화면. AC-16(Next)과 같은 구성이며 **코드를 공유하지 않고 복사**했다 —
 * 프레임워크 비종속을 확인하는 것이 목적이라 공유하면 검증이 약해진다.
 *
 * 다크모드 코드는 0줄이다. OS `prefers-color-scheme` 만으로 따라가야 한다(AC-19 (a)).
 */
export default function App() {
  return (
    <Stack align="center" justify="center" className="bg-canvas min-h-screen p-4">
      <Card className="max-w-sm w-full">
        <Stack className="gap-4">
          <Text heading="1" size="xl">
            로그인
          </Text>

          <Form>
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
          </Form>
        </Stack>
      </Card>
    </Stack>
  );
}
