import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
type StepperProps = Contracts<"native">["Stepper"];
/**
 * 세로 단계 목록(R28). 제어 전용이고 펼친 단계만 `content` 를 마운트한다(알려진 동작 36). 웹과 같은 구조를
 * `View` · `Pressable` · `Text` 로 옮겼다 — 줄은 표시 열(`w-4`) + 내용 열이고, 지난 단계는 체크(muted),
 * 펼친 단계는 `border-l-2 border-brand` 막대, 남은 단계는 표시가 없다(decisions-r28 17).
 *
 * 접근성(C-13) — 목록 View 가 `label` 을 이름으로 갖는다. 줄마다 읽히는 단위는 줄 글이다.
 * 지난 단계 글은 `label + ", 완료"` 라벨로(dist 검사가 템플릿 리터럴을 막는다) 읽히고 `onValueChange` 가 있을 때만 `button` 이다(콜백은 값 하나, C-12).
 * 펼친 단계 글은 `accessibilityState.selected` 를 갖는다 — 줄 View 는 접근성 요소가 아니라(묶으면 `content` 안의
 * 컨트롤이 하나로 합쳐진다) 상태를 글에 붙였다. 남은 단계 글은 누를 수 없다.
 * `className` 은 목록 View 에 붙고 줄 글자에 닿지 않는다(알려진 동작 22).
 */
export declare const Stepper: FC<StepperProps>;
export {};
//# sourceMappingURL=stepper.d.ts.map