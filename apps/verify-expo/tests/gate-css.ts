import { readFileSync } from "node:fs";
import path from "node:path";

import tailwind from "@tailwindcss/postcss";
import postcss from "postcss";

/**
 * 게이트 측정용 소비자 CSS. 래퍼 import 한 줄뿐이다(plan §2.1).
 * 앱의 실제 `global.css` 는 AC-26 용 `:root` 재선언을 갖고 있어 분리했다.
 */
export const GATE_CSS = path.join(__dirname, "fixtures", "gate-global.css");

/** 앱이 실제로 쓰는 전역 CSS. T-R1 이 AC-26 RN 절을 여기서 본다. */
export const APP_CSS = path.join(__dirname, "..", "global.css");

/** 앱 루트. Tailwind 자동 소스 탐지의 기준점이며 Metro 빌드와 같은 조건이다. */
const APP_ROOT = path.join(__dirname, "..");

/** 존재하지 않는 기준점 — 자동 소스 탐지가 아무것도 찾지 못하게 한다. */
const NO_SOURCES = path.join(APP_ROOT, "__no_sources__");

const cache = new Map<string, Promise<string>>();

function compile(entry: string, base: string, extraCss: string): Promise<string> {
  const key = `${entry}|${base}|${extraCss}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const source = readFileSync(entry, "utf8") + "\n" + extraCss;
  const compiled = postcss([tailwind({ base })])
    .process(source, { from: entry })
    .then((result) => result.css)
    .catch((error: unknown) => {
      // 실패는 캐시하지 않는다 — 다음 호출이 같은 거부를 다시 만들게 둔다.
      cache.delete(key);
      throw error;
    });

  cache.set(key, compiled);
  return compiled;
}

/**
 * 게이트 CSS 를 `@tailwindcss/postcss` 로 컴파일한다.
 * `extraCss` 는 소비자가 래퍼 import 다음 줄에 쓴 CSS 를 흉내낸다(게이트 (6)).
 *
 * 기준점이 없는 경로라 자동 소스 탐지가 아무것도 못 찾는다. 따라서 생성되는 클래스는
 * 전부 래퍼의 `@source "../dist"` 에서 온 것이다(게이트 (3)).
 */
export function compileGlobalCss(extraCss = ""): Promise<string> {
  return compile(GATE_CSS, NO_SOURCES, extraCss);
}

/**
 * 앱 전역 CSS 를 앱 루트 기준으로 컴파일한다 — Metro 빌드와 같은 조건이다.
 * 소비자 소스(`App.tsx`)의 클래스도 탐지 대상이므로, T-R1 은 "소비자가 쓴 className 이
 * 실제로 생성되는가" 까지 함께 본다(AC-25).
 */
export function compileAppCss(extraCss = ""): Promise<string> {
  return compile(APP_CSS, APP_ROOT, extraCss);
}

/** 컴파일된 CSS 에 유틸리티 클래스가 생성됐는지 본다(게이트 (3)). */
export function hasClass(css: string, className: string): boolean {
  return css.includes(`.${className} {`);
}
