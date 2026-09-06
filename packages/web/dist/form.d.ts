import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
/**
 * 레이아웃 + Label 연결 + 오류 텍스트 표시까지가 v1 범위다(C-21).
 * submit 개념이 없고 계약에 `onSubmit` 도 없다 — 제출은 Button `onClick` 에서
 * 소비자 코드가 처리한다. Enter 는 아무 동작도 하지 않는다(알려진 동작 5).
 *
 * Base UI `Form` / `Field` 를 쓰지 않는다 — v1 에 submit·검증이 없어 기능이 쓰이지 않고,
 * `Field` 로 감싸면 Input 단독 사용과 DOM 이 달라진다(plan D-13, §9 S-4).
 */
export declare const Form: FC<Contracts<"web">["Form"]>;
//# sourceMappingURL=form.d.ts.map