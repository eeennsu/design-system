import { type Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
type TextareaProps = Contracts<"native">["Textarea"];
/**
 * 여러 줄 입력. `size` 는 글자 크기가 아니라 **행수**로 해석한다 — 3 / 5 / 8 (plan D-14).
 * 패딩과 글자 크기는 Input `md` 로 고정한다. 웹 `rows` 는 RN `numberOfLines` 로 간다.
 *
 * `textAlignVertical="top"` 이 없으면 Android 가 여러 줄 입력의 글자를 세로 가운데에 놓는다.
 * 웹 textarea 는 위에서 시작하므로 맞춘다.
 *
 * `invalid` 는 Input 과 같이 테두리 색까지만 간다 — RN 에 `aria-invalid` 가 없다(구현 노트 F-16).
 */
export declare const Textarea: FC<TextareaProps>;
export {};
//# sourceMappingURL=textarea.d.ts.map