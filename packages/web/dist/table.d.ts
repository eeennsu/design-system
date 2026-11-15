import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
type TableProps = Contracts<"web">["Table"];
/**
 * 데이터 표(R27). 루트는 스크롤 영역이라 넘치지 않아도 Tab 정지점이다(decisions-r27 10, 알려진 동작 29).
 * R28 부터 가로 · 세로 모두 스크롤한다(`overflow-auto`) — 소비자가 `className="max-h-96"` 처럼 높이를 주면 세로로도 넘긴다.
 * `label` 이 있으면 보이는 `<caption>` 이고, 포커스 받는 영역이 이름 없는 덩어리로 읽히지 않게 `region` 도 겸한다.
 * 행 key 는 인덱스다 — 표는 표시용이라 행 안에 상태를 두지 않는다.
 */
export declare const Table: FC<TableProps>;
export {};
//# sourceMappingURL=table.d.ts.map