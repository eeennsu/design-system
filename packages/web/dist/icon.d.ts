import { type ControlSize, type IconName } from "@eeennsu/tokens";
import { type LucideIcon } from "lucide-react";
/**
 * `IconName` → lucide 컴포넌트. `Record<IconName, LucideIcon>` 이라 tokens 의 목록에
 * 이름을 추가하고 이 맵을 빠뜨리면 컴파일 에러가 난다(plan D-8).
 *
 * lucide 의 **정식 export 이름**만 쓴다 — 별칭(`AlertCircle` → `CircleAlert`)은
 * major 에서 사라질 수 있다(plan v2 F-6).
 */
declare const icons: Record<IconName, LucideIcon>;
type IconProps = {
    name: IconName;
    size?: ControlSize;
    spin?: boolean;
    className?: string;
};
/**
 * DS 내부 전용이다 — 공개 컴포넌트가 아니고 `Contracts` 에도 없다.
 * 크기는 클래스가 아니라 lucide `size` prop(JS 숫자)으로 준다 — 20px 는 spacing 열거
 * 밖이라 `size-5` 클래스가 생성되지 않기 때문이다(plan v2 F-8).
 * 색은 `currentColor` 상속이라 별도 prop 이 없다(§9 S-17).
 */
export declare function Icon({ name, size, spin, className }: IconProps): import("react").JSX.Element;
export { icons };
//# sourceMappingURL=icon.d.ts.map