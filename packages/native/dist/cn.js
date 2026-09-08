import { twMergeConfig } from "@eeennsu/tokens";
import { extendTailwindMerge } from "tailwind-merge";
/**
 * DS 기본 클래스와 소비자 `className` 을 병합한다. 충돌하면 소비자가 이긴다(C-15).
 * 웹(`@eeennsu/web`)과 **같은 설정 객체**를 쓴다 — 어휘가 갈리면 AC-25 가 깨진다.
 *
 * `override` 여야 한다 — `extend` 는 기본 검증자에 concat 이라 spacing 의 기본 `isNumber`
 * 가 남고, 존재하지 않는 `mt-5` 가 DS 의 `mt-4` 를 밀어낸다(plan v2 F-4, T-T5 테스트).
 */
export const cn = extendTailwindMerge({ override: { theme: twMergeConfig } });
//# sourceMappingURL=cn.js.map