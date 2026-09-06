import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
type DrawerProps = Contracts<"web">["Drawer"];
/**
 * 가장자리에서 열리는 패널. Base UI Dialog 파트를 그대로 쓰고 위치 클래스만 바꾼다 —
 * 별도 라이브러리를 들이지 않는다(plan D-12). 스와이프 닫기는 없다.
 */
export declare const Drawer: FC<DrawerProps>;
export {};
//# sourceMappingURL=drawer.d.ts.map