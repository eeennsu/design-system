import { defineConfig } from "vitest/config";

// `vitest.workspace` 는 3.2 deprecated · 4.0 제거이므로 test.projects 를 쓴다 (plan v2 F-5).
export default defineConfig({
  test: {
    projects: ["packages/*"],
  },
});
