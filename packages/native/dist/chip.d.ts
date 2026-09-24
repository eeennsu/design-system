import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
type ChipProps = Contracts<"native">["Chip"];
/**
 * 고르는 칩(N-17). 웹 Chip 과 같은 클래스이고(AC-25), Button 처럼 표면(Pressable)과
 * 전경(라벨 Text)으로 쪼갠다(N-12). 고른 상태는 `accessibilityState.selected` 로 알린다.
 * 라벨은 글자 크기 설정을 1.5배까지만 따른다 — 칩 줄이 무너지지 않게 하는 크롬 글자다.
 */
export declare const Chip: FC<ChipProps>;
export {};
//# sourceMappingURL=chip.d.ts.map