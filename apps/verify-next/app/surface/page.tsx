import { Badge, Box, Button, Card, Chip, Input, Stack, Text } from "@eeennsu/web";

export default function SurfacePage() {
  return (
    <Stack className="bg-canvas min-h-screen p-4 gap-4">
      <Text heading="1" size="xl">
        표면 재선언
      </Text>
      <section aria-label="카드">
        <Card>
          <Text>카드 본문</Text>
        </Card>
      </section>
      <Input label="입력" placeholder="입력 칸" />
      <section aria-label="배지">
        <Badge>배지</Badge>
      </section>
      <Chip label="칩" />
      <Button label="버튼" variant="primary" />
      <section aria-label="lg 상자">
        <Box className="rounded-lg bg-surface-muted p-8">{null}</Box>
      </section>
      <section aria-label="full 상자">
        <Box className="rounded-full bg-surface-muted p-8">{null}</Box>
      </section>
    </Stack>
  );
}
