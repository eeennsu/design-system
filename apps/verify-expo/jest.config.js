const preset = require("jest-expo/jest-preset");

/**
 * jest-expo 의 허용 목록에 두 이름을 더한다.
 *
 * - `lucide-react-native` — ESM 만 배포한다. 목록에 없으면 `export {` 에서 파싱이 깨진다
 * - `@eeennsu` — DS 패키지도 ESM 단일 출력이다(plan D-22). `workspace:*` 심링크로 쓸 때는
 *   경로가 `node_modules` 밖이라 안 걸리지만, **타르볼로 설치하면 걸린다**(T-R1 verify:pack).
 *   RN 소비자가 jest 를 쓴다면 같은 한 줄이 필요하다
 *
 * 목록을 통째로 새로 쓰면 `@react-native/jest-preset` 자체가 변환 대상에서 빠지므로
 * 프리셋 문자열을 읽어 이름만 끼워 넣는다. Metro 는 자체 변환이라 영향이 없다.
 */
const transformIgnorePatterns = preset.transformIgnorePatterns.map((pattern) =>
  pattern.replace("native-base", "native-base|lucide-react-native|@eeennsu"),
);

/**
 * jest-expo 의 transform 은 `^.+\.[jt]sx?$` 라 `.mjs` 를 건드리지 않는다.
 * lucide-react-native 는 `react-native` 조건에서 `.mjs` 를 내주므로 한 줄 더 붙인다.
 */
const transform = {
  ...preset.transform,
  "^.+\\.mjs$": ["babel-jest", { caller: { preserveEnvVars: true } }],
};

/** C-19 게이트 판정 (a) · T-R1 러너. plan §2.1 — jest-expo + RNTL 14(async render). */
module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ["<rootDir>/tests/**/*.test.tsx", "<rootDir>/tests/**/*.test.ts"],
  transformIgnorePatterns,
  transform,
};
