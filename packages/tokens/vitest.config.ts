import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "tokens",
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
    typecheck: {
      enabled: true,
      include: ["src/**/*.test-d.ts", "tests/**/*.test-d.ts"],
      tsconfig: "./tsconfig.test.json",
    },
  },
});
