/**
 * 토큰 빌드 진입점 (plan.md T-T2). 산출물 문자열은 build-outputs.ts 가 만든다.
 *
 * 출력:
 *   packages/tokens/themes/<brand>.css        내부 산출물 (C-6)
 *   packages/web/themes/<brand>.css           소비자 공개 래퍼 (C-3)
 *   packages/native/themes/<brand>.css        소비자 공개 래퍼 (C-3)
 *   packages/tokens/src/brands/<brand>.ts     RN 런타임 JS 색 객체 (AC-4)
 *   packages/tokens/src/generated/values.ts   스케일 · twMergeConfig · component recipe
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildOutputs } from "./build-outputs.js";

const here = dirname(fileURLToPath(import.meta.url));
const tokensRoot = dirname(here);
const packagesRoot = dirname(tokensRoot);

const outputs = buildOutputs(join(tokensRoot, "src", "tokens"));

console.log("토큰 빌드:");
for (const { path, contents } of outputs) {
  const absolute = join(packagesRoot, path);
  mkdirSync(dirname(absolute), { recursive: true });
  writeFileSync(absolute, contents, "utf8");
  console.log(`  ${path}`);
}
console.log(`완료. 산출물 ${outputs.length}개.`);
