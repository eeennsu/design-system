import { type Contracts, type ControlSize, type IconName } from "@eeennsu/tokens";
import type { LucideIcon } from "lucide-react-native";
import type { FC } from "react";
/**
 * `IconName` → lucide 컴포넌트. 웹(`@eeennsu/web`)의 맵과 같은 28개이며
 * `Record<IconName, LucideIcon>` 이라 tokens 목록에 이름을 추가하고 한쪽 맵을
 * 빠뜨리면 컴파일 에러가 난다(plan D-8).
 *
 * lucide 의 **정식 export 이름**만 쓴다 — 별칭(`AlertCircle` → `CircleAlert`)은
 * major 에서 사라질 수 있다(plan v2 F-6).
 */
declare const icons: Record<IconName, LucideIcon>;
type GlyphProps = {
    name: IconName;
    size?: ControlSize;
    className?: string;
};
/**
 * 컴포넌트 안에 붙는 아이콘(Button 의 `icon` · `loading`). 색은 호출부가 전경 클래스로 준다.
 * 크기는 클래스가 아니라 lucide `size` prop(JS 숫자)으로 준다 — 20px 는 spacing 열거
 * 밖이라 `size-5` 클래스가 생성되지 않기 때문이다(plan v2 F-8).
 *
 * 웹의 `spin` 은 없다 — RN 에서 `animate-spin` 은 Reanimated 경로가 필요하고
 * v1 범위 밖이다. Button 의 `loading` 은 회전 없이 아이콘만 바꾼다(알려진 동작 참조).
 */
export declare function Glyph({ name, size, className }: GlyphProps): import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
/**
 * 단독 아이콘(구현 노트 N-17). RN 에는 글자색 상속이 없어 색을 `tone` 으로 아이콘 자신이 갖는다 —
 * 웹도 같은 방식이라 같은 className 이 같은 결과를 낸다(AC-25).
 * `label` 이 있으면 이름을 가진 그림(`image`)이고, 없으면 꾸밈이라 보조 기술에서 숨긴다.
 */
export declare const Icon: FC<Contracts<"native">["Icon"]>;
export { icons };
//# sourceMappingURL=icon.d.ts.map