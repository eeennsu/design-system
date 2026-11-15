import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
type CalloutProps = Contracts<"web">["Callout"];
/**
 * 본문 흐름에서 한 구역을 짚는 상자(R28). 정적 내용이라 `role="note"` 이고(`alert` 가 아니다)
 * 훅 · 이벤트가 없어 `"use client"` 대상이 아니다(C-4).
 *
 * 테두리와 왼쪽 색 띠가 없다(알려진 동작 37). 레이아웃은 아이콘 열 + 내용 열(제목 → `children`)이다.
 * 아이콘 열은 `h-6`(text-md 행간 24px) 안에서 가운데라 20px 아이콘이 첫 줄과 맞는다.
 * 아이콘은 공개 `Icon` 에 Callout `tone` 을 그대로 넘긴다(`Tone` 의 부분집합). `label` 이 없어 꾸밈으로 숨는다 —
 * `icon` 은 기본값이 없고 뜻은 `title` 이나 본문 글이 전한다.
 * 루트의 `break-keep` 은 한국어를 어절 단위로 바꾸고 `wrap-break-word` 는 줄보다 긴 URL 을 끊는다.
 */
export declare const Callout: FC<CalloutProps>;
export {};
//# sourceMappingURL=callout.d.ts.map