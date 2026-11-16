import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
type ProseProps = Contracts<"web">["Prose"];
/**
 * 마크다운식 원시 요소를 꾸미는 래퍼(R27). 선택자는 전부 `[:where(&)…]` 라 특이성이 요소 수준 이하다 —
 * Prose 안의 DS 컴포넌트 클래스와 소비자 `className` 이 이긴다(decisions-r27 13 · 15).
 * 예외는 링크 포커스 윤곽 선택자다 — `a:focus-visible` 이라 특이성이 (0,1,1)이다.
 * Tailwind 스캐너가 후보를 찾도록 클래스는 정적 리터럴로만 적는다.
 * `pre` · `th` · `td` 값은 CodeBlock · Table recipe 와 같고 recipe 테스트가 지킨다(decisions-r27 20).
 */
export declare const Prose: FC<ProseProps>;
export {};
//# sourceMappingURL=prose.d.ts.map