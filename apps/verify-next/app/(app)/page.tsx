import { Box, Button, Card, Form, Input, Label, Stack, Text } from "@eeennsu/web";

/**
 * AC-16 로그인 화면 + AC-24 · AC-26 확인용 요소.
 * 다크모드 코드는 이 라우트에 없다 — 루트 클래스가 없으므로 OS 를 따른다.
 */
export default function LoginPage() {
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

          {/* AC-24: 같은 variant 인데 하나만 className 으로 바꾼다. */}
          <Stack direction="row" className="gap-2">
            <Button label="기본" variant="primary" />
            <Button label="변경" variant="primary" className="bg-danger mt-6" />
          </Stack>

          {/* AC-26: 재선언한 변수는 따라가고, 재선언하지 않은 변수는 그대로여야 한다. */}
          <Box className="bg-brand p-8">{null}</Box>
          <Box className="bg-danger p-8">{null}</Box>
        </Stack>
      </Card>
    </Stack>
  );
}
