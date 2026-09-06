import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
type ButtonProps = Contracts<"web">["Button"];
/**
 * 누름 버튼. `label` 이 가시 텍스트이자 접근성 이름이다 — `children` 이 없어
 * WCAG 2.5.3(Label in Name) 위반 경로가 사라진다(C-13).
 *
 * `label` 은 아이콘 전용 모드에서도 항상 렌더된다(알려진 동작 9).
 * `type="button"` 을 고정한다 — 기본값 `submit` 이면 `<form>` 안에서 Enter 가
 * 암묵적 제출을 일으켜 `onClick` 이 실행된다(C-21).
 *
 * `ref` 는 엘리먼트를 그대로 넘긴다. HTMLElement 가 `FocusHandle` 을 구조적으로 만족하므로
 * 계약 타입은 `Ref<FocusHandle>` 로 닫힌 채다(넓히는 방향은 스펙이 "추가적"이라 못박았다, C-17).
 * 구성한 핸들을 넘기면 Base UI Tooltip 이 이 Button 을 앵커로 쓸 때 floating-ui 가
 * `getBoundingClientRect` 를 찾지 못해 위치 계산이 깨진다.
 */
export declare const Button: FC<ButtonProps>;
export {};
//# sourceMappingURL=button.d.ts.map