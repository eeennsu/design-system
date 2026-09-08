/**
 * T-V3 타르볼 설치 검증 (AC-16 · AC-17 · AC-18 · AC-6c).
 *
 * `workspace:*` 는 심링크라 exports 맵 · `files` 필드 · `.d.ts` 동봉을 검증하지 못한다.
 * 그래서 실제 타르볼을 만들어 **워크스페이스 밖** 임시 디렉터리에서 설치하고 검증 앱을 다시 돌린다.
 *
 * 워크스페이스 밖에서 하는 이유(plan v2 F-11): `pnpm pack` 이 `workspace:*` 를 실제 버전으로
 * 치환하므로 web 타르볼은 `@eeennsu/tokens@0.1.0` 을 npm 에서 찾다 실패한다. 루트
 * `pnpm.overrides` 로 풀면 워크스페이스 소스 `packages/web` 까지 타르볼 사본으로 바뀐다.
 *
 * 사용법: pnpm verify:pack [앱이름 ...]   (기본값: verify-next verify-vite verify-expo)
 *
 * T-R1 이 native 타르볼과 `verify-expo` 를 더했다. 앱마다 자기가 선언한 DS 의존성만 바꾼다.
 */
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const apps = process.argv.slice(2);
const targets = apps.length > 0 ? apps : ["verify-next", "verify-vite", "verify-expo"];

/** publish 대상 3패키지. lockstep 이라 항상 함께 낸다(§5.3). */
const packages = ["tokens", "web", "native"];

/** `file:` 스펙과 pnpm 인자에는 슬래시 경로를 쓴다 — Windows 역슬래시는 이스케이프로 먹힌다. */
const slash = (path) => path.split("\\").join("/");

const run = (command, args, cwd) =>
  execFileSync(command, args, { cwd, stdio: "inherit", shell: process.platform === "win32" });

const capture = (command, args, cwd) =>
  execFileSync(command, args, { cwd, encoding: "utf8", shell: process.platform === "win32" });

const scratch = mkdtempSync(join(tmpdir(), "ds-verify-pack-"));
console.log(`임시 디렉터리: ${scratch}`);

/**
 * 검증이 끝난 뒤에도 그대로여야 하는 파일. 사본에만 `file:` 스펙을 쓰므로
 * 원본 앱의 `workspace:*` 와 루트 lockfile 은 손대지 않아야 한다(§5.6).
 */
const untouched = new Map(
  [join(root, "pnpm-lock.yaml"), ...targets.map((app) => join(root, "apps", app, "package.json"))].map(
    (path) => [path, readFileSync(path, "utf8")],
  ),
);

// ------------------------------------------------------------------ 1. pack

const tarballs = {};
for (const name of packages) {
  run("pnpm", ["--filter", `@eeennsu/${name}`, "pack", "--pack-destination", slash(scratch)], root);
}
for (const file of readdirSync(scratch).filter((entry) => entry.endsWith(".tgz"))) {
  const name = packages.find((candidate) => file.startsWith(`eeennsu-${candidate}-`));
  if (name) tarballs[name] = join(scratch, file);
}
for (const name of packages) {
  if (!tarballs[name]) throw new Error(`타르볼을 못 찾았다: ${name}`);
  console.log(`  ${name} → ${tarballs[name]}`);
}

// -------------------------------------------------------- 2. 타르볼 내용 검사

const failures = [];
const check = (condition, message) => {
  console.log(`  ${condition ? "ok  " : "FAIL"} ${message}`);
  if (!condition) failures.push(message);
};

console.log("\n타르볼 내용:");
for (const name of packages) {
  // GNU tar 는 `C:/...` 를 원격 호스트로 읽는다. cwd 를 옮기고 파일명만 넘긴다.
  const entries = capture("tar", ["-tzf", basename(tarballs[name])], scratch)
    .split("\n")
    .map((line) => line.trim());
  check(
    entries.some((entry) => entry.startsWith("package/dist/") && entry.endsWith(".d.ts")),
    `${name}: dist 에 .d.ts 가 있다 (AC-18)`,
  );
  check(
    entries.some((entry) => entry.startsWith("package/themes/") && entry.endsWith(".css")),
    `${name}: themes 에 CSS 가 있다`,
  );
  check(
    !entries.some((entry) => /\.(woff2?|ttf|otf|eot)$/i.test(entry)),
    `${name}: 폰트 파일이 없다 (AC-6c)`,
  );
}

for (const name of ["web", "native"]) {
  const manifest = JSON.parse(
    capture("tar", ["-xzOf", basename(tarballs[name]), "package/package.json"], scratch),
  );
  const tokensRange = manifest.dependencies["@eeennsu/tokens"];
  check(
    typeof tokensRange === "string" && !tokensRange.startsWith("workspace:"),
    `${name}: @eeennsu/tokens 가 실제 버전으로 치환됐다 (${tokensRange})`,
  );
}

// ------------------------------------------------- 3. 앱 사본 설치 후 재실행

for (const app of targets) {
  console.log(`\n${app}: 워크스페이스 밖에서 타르볼 설치`);
  const source = join(root, "apps", app);
  const copy = join(scratch, app);
  cpSync(source, copy, {
    recursive: true,
    filter: (path) =>
      !/[\\/](node_modules|\.next|\.expo|dist|test-results|playwright-report)([\\/]|$)/.test(path),
  });

  const manifest = JSON.parse(readFileSync(join(copy, "package.json"), "utf8"));
  let replaced = 0;
  for (const name of ["web", "native"]) {
    if (manifest.dependencies?.[`@eeennsu/${name}`]) {
      manifest.dependencies[`@eeennsu/${name}`] = `file:${slash(tarballs[name])}`;
      replaced += 1;
    }
  }
  if (replaced === 0) throw new Error(`${app} 이 DS 패키지를 의존하지 않는다`);
  if (manifest.devDependencies?.["@eeennsu/tokens"]) {
    manifest.devDependencies["@eeennsu/tokens"] = `file:${slash(tarballs.tokens)}`;
  }
  // web 타르볼 안의 `@eeennsu/tokens@<버전>` 도 타르볼로 풀어준다.
  manifest.pnpm = { ...manifest.pnpm, overrides: { "@eeennsu/tokens": `file:${slash(tarballs.tokens)}` } };
  writeFileSync(join(copy, "package.json"), `${JSON.stringify(manifest, null, 2)}\n`);

  run("pnpm", ["install", "--ignore-workspace"], copy);
  run("pnpm", ["test"], copy);
  console.log(`  ok   ${app}: 타르볼 설치 상태에서 통과`);
}

// --------------------------------------------------- 4. 원본이 안 바뀌었는지

console.log("\n원본 상태:");
for (const [path, before] of untouched) {
  check(readFileSync(path, "utf8") === before, `${slash(path).slice(slash(root).length + 1)} 가 그대로다`);
}

rmSync(scratch, { recursive: true, force: true });

if (failures.length > 0) {
  console.error(`\n실패 ${failures.length}건`);
  process.exit(1);
}
console.log("\nverify:pack 통과");
