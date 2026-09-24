import { type Contracts, type ControlSize, type IconName } from "@eeennsu/tokens";
import type { FC } from "react";
import { type LucideIcon } from "lucide-react";
/**
 * `IconName` → lucide 컴포넌트. `Record<IconName, LucideIcon>` 이라 tokens 의 목록에
 * 이름을 추가하고 이 맵을 빠뜨리면 컴파일 에러가 난다(plan D-8).
 *
 * lucide 의 **정식 export 이름**만 쓴다 — 별칭(`AlertCircle` → `CircleAlert`)은
 * major 에서 사라질 수 있다(plan v2 F-6).
 */
declare const icons: Record<IconName, LucideIcon>;
type GlyphProps = {
    name: IconName;
    size?: ControlSize;
    spin?: boolean;
    className?: string;
};
/**
 * 컴포넌트 안에 붙는 아이콘(Button 의 `icon` · `loading`). 공개 `Icon` 과 달리 `spin` 을 받고
 * 색은 `currentColor` 로 부모 글자색을 상속한다(§9 S-17). 가시 텍스트 옆이라 늘 보조 기술에서 숨긴다.
 * 크기는 클래스가 아니라 lucide `size` prop(JS 숫자)으로 준다 — 20px 는 spacing 열거
 * 밖이라 `size-5` 클래스가 생성되지 않기 때문이다(plan v2 F-8).
 */
export declare function Glyph({ name, size, spin, className }: GlyphProps): import("react").JSX.Element;
/**
 * 단독 아이콘(구현 노트 N-17). 색을 상속하지 않고 `tone` 으로 정한다 — RN 에는 글자색 상속이
 * 없으므로 두 플랫폼이 같은 결과를 내려면 색을 아이콘 자신이 가져야 한다(AC-25).
 * `label` 이 있으면 `role="img"` 과 이름을 갖는 그림이고, 없으면 꾸밈이라 `aria-hidden` 이다.
 */
export declare const Icon: FC<Contracts<"web">["Icon"]>;
export { icons };
//# sourceMappingURL=icon.d.ts.map