import { type Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
type TextareaProps = Contracts<"web">["Textarea"];
/**
 * 여러 줄 입력. `size` 는 글자 크기가 아니라 **행수**로 해석한다 — 3 / 5 / 8 (plan D-14).
 * 패딩과 글자 크기는 Input `md` 로 고정한다.
 */
export declare const Textarea: FC<TextareaProps>;
export {};
//# sourceMappingURL=textarea.d.ts.map