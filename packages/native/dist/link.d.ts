import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
type LinkProps = Contracts<"native">["Link"];
/**
 * 혼자 놓이는 링크(R28). RN 에는 문서 이동이 없어 `accessibilityRole="link"` 인 누름 글자이고
 * 이동은 소비자 `onPress` 가 한다(C-12, 알려진 동작 33). 밑줄 · 포커스 외곽선은 없다.
 *
 * 색 · 크기는 Text 의 `tones` · `steps` 맵을 그대로 쓴다. Button 처럼 표면(Pressable)과 글자(Text)로 쪼갠다 —
 * `className` 은 표면에 붙고 글자 클래스(`text-*`)는 안쪽 글자에 닿지 않는다(알려진 동작 22).
 * 표면은 `self-start` 라 세로 부모 안에서도 글자 폭만큼만 눌린다.
 */
export declare const Link: FC<LinkProps>;
export {};
//# sourceMappingURL=link.d.ts.map