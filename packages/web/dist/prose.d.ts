import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
type ProseProps = Contracts<"web">["Prose"];
/**
 * 마크다운식 원시 요소를 꾸미는 래퍼(R27). 선택자는 전부 `[:where(&)…]` 라 특이성이 요소 수준 이하다 —
 * Prose 안의 DS 컴포넌트 클래스와 소비자 `className` 이 이긴다(decisions-r27 13 · 15).
 * Tailwind 스캐너가 후보를 찾도록 클래스는 정적 리터럴로만 적는다.
 * `pre` · `th` · `td` 값은 CodeBlock · Table recipe 와 같고 recipe 테스트가 지킨다(decisions-r27 20).
 * 한국어는 어절 단위로 바꾸고(`break-keep`) 줄보다 긴 URL · 식별자는 넘치지 않게 끊는다(`wrap-break-word`, R28).
 * 링크는 키보드 포커스 때 다른 컨트롤과 같은 `border-focus` outline 을 그린다(R28).
 */
export declare const Prose: FC<ProseProps>;
export {};
//# sourceMappingURL=prose.d.ts.map