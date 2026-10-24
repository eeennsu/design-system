import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
type CodeBlockProps = Contracts<"web">["CodeBlock"];
/**
 * 코드 블록 하나(R27). 채움은 `pre` 가 아니라 루트 `figure` 에 있어 `className="bg-surface"` 가 채움을 바꾼다(AC-11).
 * `pre` 의 `bg-transparent` 는 Prose 안에서 Prose 의 `pre` 채움이 루트 배경을 가리지 않게 한다.
 * `pre` 는 넘치지 않아도 Tab 정지점이고, `label` 이 있으면 `region` 도 겸한다(decisions-r27 10, 알려진 동작 29).
 * `children` 은 Text 처럼 그대로 렌더한다 — `string[]` 은 JSX 보간(`npm i {pkg}`)이 만드는 조각이라 줄바꿈 없이 이어 붙고,
 * 줄 배열은 소비자가 `lines.join("\n")` 으로 넘긴다. 공백은 `pre` 기본 `white-space: pre` 가 지킨다.
 */
export declare const CodeBlock: FC<CodeBlockProps>;
export {};
//# sourceMappingURL=code-block.d.ts.map