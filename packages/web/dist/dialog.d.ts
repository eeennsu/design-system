import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
/**
 * 모달 대화상자. `label` 은 제목으로 렌더되고 Base UI 가 `aria-labelledby` 를 연결한다(plan D-10).
 *
 * `Dialog.Trigger` 는 쓰지 않는다 — v1 오버레이는 제어 API 만 노출하고(C-12),
 * 소비자가 Button 누름 이벤트로 `open` 을 토글한다.
 * Base UI `onOpenChange` 는 `(open, eventDetails)` 2인자라 DS 가 boolean 하나로 감싼다.
 */
export declare const Dialog: FC<Contracts<"web">["Dialog"]>;
//# sourceMappingURL=dialog.d.ts.map