// 세 패키지 버전을 한 번에 맞춘다 (lockstep, plan.md §5.3).
// 사용법: pnpm version:set 0.2.0
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const PACKAGES = ["tokens", "web", "native"];
const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z-.]+)?$/;

const version = process.argv[2];
if (!version || !SEMVER.test(version)) {
  console.error("usage: pnpm version:set <x.y.z>");
  process.exit(1);
}

for (const name of PACKAGES) {
  const path = join(root, "packages", name, "package.json");
  const raw = await readFile(path, "utf8");
  const json = JSON.parse(raw);
  json.version = version;
  await writeFile(path, `${JSON.stringify(json, null, 2)}\n`, "utf8");
  console.log(`@eeennsu/${name} -> ${version}`);
}
