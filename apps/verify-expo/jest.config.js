/** C-19 게이트 판정 (a) 러너. plan §2.1 — jest-expo + RNTL 14(async render). */
module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ["<rootDir>/tests/**/*.test.tsx", "<rootDir>/tests/**/*.test.ts"],
};
