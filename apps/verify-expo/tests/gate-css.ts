import { readFileSync } from "node:fs";
import path from "node:path";

import tailwind from "@tailwindcss/postcss";
import postcss from "postcss";

/** 소비자 전역 CSS. 게이트는 이 파일과 DS 래퍼만 쓴다(plan §2.1). */
export const GLOBAL_CSS = path.join(__dirname, "..", "global.css");

const cache = new Map<string, Promise<string>>();

/**
 * `global.css` 를 @tailwindcss/postcss 로 컴파일한다.
 * `extraCss` 는 소비자가 래퍼 import 다음 줄에 쓴 CSS 를 흉내낸다(게이트 (6)).
 */
export function compileGlobalCss(extraCss = ""): Promise<string> {
  const cached = cache.get(extraCss);
  if (cached) return cached;

  const source = readFileSync(GLOBAL_CSS, "utf8") + "\n" + extraCss;
  const compiled = postcss([tailwind({ base: Date.now().toString() })])
    .process(source, { from: GLOBAL_CSS })
    .then((result) => result.css)
    .catch((error: unknown) => {
      // 실패는 캐시하지 않는다 — 다음 호출이 같은 거부를 다시 만들게 둔다.
      cache.delete(extraCss);
      throw error;
    });

  cache.set(extraCss, compiled);
  return compiled;
}

/** 컴파일된 CSS 에 유틸리티 클래스가 생성됐는지 본다(게이트 (3)). */
export function hasClass(css: string, className: string): boolean {
  return css.includes(`.${className} {`);
}
