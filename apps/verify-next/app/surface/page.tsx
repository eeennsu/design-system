import { Badge, Box, Button, Card, Chip, Input, Stack, Text } from "@eeennsu/web";

/** AC-26 (e) — `surface.css` 가 radius · 표면 관계를 덮은 화면(R28). */
export default function SurfacePage() {
  return (
    <Stack className="bg-canvas min-h-screen p-4 gap-4">
      <Text heading="1" size="xl">
        표면 재선언
      </Text>
      <Card className="flex flex-col gap-3">
        <Text>카드 안이다</Text>
        <Input label="이름" />
        <Stack direction="row" className="gap-2">
          <Badge>배지</Badge>
          <Chip label="칩" />
        </Stack>
        <Button label="저장" />
      </Card>
      <Box className="rounded-lg bg-surface-muted p-4">
        <Text>rounded-lg 상자</Text>
      </Box>
      <Box className="rounded-full bg-surface-muted p-4">
        <Text>rounded-full 상자</Text>
      </Box>
    </Stack>
  );
}
