import { Box, Stack, Text } from "@eeennsu/web";

export default function PartialPage() {
  return (
    <Stack className="bg-canvas min-h-screen p-4 gap-4">
      <Text heading="1" size="xl">
        부분 재선언
      </Text>
      <Box className="bg-brand p-8">{null}</Box>
    </Stack>
  );
}
