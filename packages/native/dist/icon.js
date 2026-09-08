import { component } from "@eeennsu/tokens";
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, CircleAlert, ExternalLink, Eye, EyeOff, Info, Loader, Lock, Mail, Menu, Minus, Pencil, Plus, Search, Settings, Trash, User, X, } from "lucide-react-native";
import { useCssElement } from "react-native-css";
/**
 * `IconName` → lucide 컴포넌트. 웹(`@eeennsu/web`)의 맵과 같은 24개이며
 * `Record<IconName, LucideIcon>` 이라 tokens 목록에 이름을 추가하고 한쪽 맵을
 * 빠뜨리면 컴파일 에러가 난다(plan D-8).
 *
 * lucide 의 **정식 export 이름**만 쓴다 — 별칭(`AlertCircle` → `CircleAlert`)은
 * major 에서 사라질 수 있다(plan v2 F-6).
 */
const icons = {
    check: Check,
    x: X,
    plus: Plus,
    minus: Minus,
    trash: Trash,
    pencil: Pencil,
    search: Search,
    "chevron-down": ChevronDown,
    "chevron-up": ChevronUp,
    "chevron-left": ChevronLeft,
    "chevron-right": ChevronRight,
    "arrow-left": ArrowLeft,
    "arrow-right": ArrowRight,
    menu: Menu,
    settings: Settings,
    user: User,
    mail: Mail,
    lock: Lock,
    eye: Eye,
    "eye-off": EyeOff,
    info: Info,
    "alert-circle": CircleAlert,
    loader: Loader,
    "external-link": ExternalLink,
};
/**
 * 웹은 아이콘 색을 `currentColor` 로 상속하지만 RN 에는 `currentColor` 가 없다.
 * 그래서 `className` 의 색만 뽑아 lucide 의 `color` prop 으로 넘긴다 —
 * 호출부는 `text-fg-on-brand` 처럼 웹과 같은 클래스를 쓴다(§9 S-17, AC-25).
 * `target: false` 라 `style` 은 만들지 않는다 — svg 는 style 을 안 받는다.
 */
const mapping = {
    className: { target: false, nativeStyleMapping: { color: "color" } },
};
/**
 * DS 내부 전용이다 — 공개 컴포넌트가 아니고 `Contracts` 에도 없다.
 * 크기는 클래스가 아니라 lucide `size` prop(JS 숫자)으로 준다 — 20px 는 spacing 열거
 * 밖이라 `size-5` 클래스가 생성되지 않기 때문이다(plan v2 F-8).
 *
 * 웹 Icon 의 `spin` 은 없다 — RN 에서 `animate-spin` 은 Reanimated 경로가 필요하고
 * v1 범위 밖이다. Button 의 `loading` 은 회전 없이 아이콘만 바꾼다(알려진 동작 참조).
 */
export function Icon({ name, size = "md", className }) {
    const Glyph = icons[name];
    return useCssElement(Glyph, { className, size: component.icon.size[size] }, mapping);
}
export { icons };
//# sourceMappingURL=icon.js.map