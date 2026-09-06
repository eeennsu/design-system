import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "web",
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "tests/**/*.test.ts", "tests/**/*.test.tsx"],
    typecheck: {
      enabled: true,
      include: ["src/**/*.test-d.ts", "src/**/*.test-d.tsx", "tests/**/*.test-d.ts", "tests/**/*.test-d.tsx"],
      tsconfig: "./tsconfig.test.json",
    },
  },
});
