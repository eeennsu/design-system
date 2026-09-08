import { type ControlSize, type IconName } from "@eeennsu/tokens";
import { type LucideIcon } from "lucide-react-native";
/**
 * `IconName` → lucide 컴포넌트. 웹(`@eeennsu/web`)의 맵과 같은 24개이며
 * `Record<IconName, LucideIcon>` 이라 tokens 목록에 이름을 추가하고 한쪽 맵을
 * 빠뜨리면 컴파일 에러가 난다(plan D-8).
 *
 * lucide 의 **정식 export 이름**만 쓴다 — 별칭(`AlertCircle` → `CircleAlert`)은
 * major 에서 사라질 수 있다(plan v2 F-6).
 */
declare const icons: Record<IconName, LucideIcon>;
type IconProps = {
    name: IconName;
    size?: ControlSize;
    className?: string;
};
/**
 * DS 내부 전용이다 — 공개 컴포넌트가 아니고 `Contracts` 에도 없다.
 * 크기는 클래스가 아니라 lucide `size` prop(JS 숫자)으로 준다 — 20px 는 spacing 열거
 * 밖이라 `size-5` 클래스가 생성되지 않기 때문이다(plan v2 F-8).
 *
 * 웹 Icon 의 `spin` 은 없다 — RN 에서 `animate-spin` 은 Reanimated 경로가 필요하고
 * v1 범위 밖이다. Button 의 `loading` 은 회전 없이 아이콘만 바꾼다(알려진 동작 참조).
 */
export declare function Icon({ name, size, className }: IconProps): import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
export { icons };
//# sourceMappingURL=icon.d.ts.map