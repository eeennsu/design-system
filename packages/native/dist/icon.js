import { jsx as _jsx } from "react/jsx-runtime";
import { component } from "@eeennsu/tokens";
// 아이콘마다 파일 경로로 import 한다. Metro 는 tree shaking 을 하지 않아 목록 파일("lucide-react-native")에서
// import 하면 아이콘 3,600여 개가 모두 번들에 들어간다(약 1.7MB, 구현 노트 F-22).
import ArrowLeft from "lucide-react-native/icons/arrow-left";
import ArrowRight from "lucide-react-native/icons/arrow-right";
import Calendar from "lucide-react-native/icons/calendar";
import ChartPie from "lucide-react-native/icons/chart-pie";
import Check from "lucide-react-native/icons/check";
import ChevronDown from "lucide-react-native/icons/chevron-down";
import ChevronLeft from "lucide-react-native/icons/chevron-left";
import ChevronRight from "lucide-react-native/icons/chevron-right";
import ChevronUp from "lucide-react-native/icons/chevron-up";
import CircleAlert from "lucide-react-native/icons/circle-alert";
import ExternalLink from "lucide-react-native/icons/external-link";
import Eye from "lucide-react-native/icons/eye";
import EyeOff from "lucide-react-native/icons/eye-off";
import House from "lucide-react-native/icons/house";
import Info from "lucide-react-native/icons/info";
import List from "lucide-react-native/icons/list";
import Loader from "lucide-react-native/icons/loader";
import Lock from "lucide-react-native/icons/lock";
import Mail from "lucide-react-native/icons/mail";
import Menu from "lucide-react-native/icons/menu";
import Minus from "lucide-react-native/icons/minus";
import Pencil from "lucide-react-native/icons/pencil";
import Plus from "lucide-react-native/icons/plus";
import Search from "lucide-react-native/icons/search";
import Settings from "lucide-react-native/icons/settings";
import Trash from "lucide-react-native/icons/trash";
import User from "lucide-react-native/icons/user";
import X from "lucide-react-native/icons/x";
import { View } from "react-native";
import { cn } from "./cn.js";
import { useCssElement } from "react-native-css";
/**
 * `IconName` → lucide 컴포넌트. 웹(`@eeennsu/web`)의 맵과 같은 28개이며
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
    home: House,
    list: List,
    "chart-pie": ChartPie,
    calendar: Calendar,
};
/**
 * 웹은 아이콘 색을 `currentColor` 로 상속하지만 RN 에는 `currentColor` 가 없다.
 * 그래서 `className` 의 색만 뽑아 lucide 의 `color` prop 으로 옮긴다 —
 * 호출부는 `text-fg-on-brand` 처럼 웹과 같은 클래스를 쓴다(§9 S-17, AC-25).
 * Button 안의 아이콘(`Glyph`)만 이 매핑을 쓴다. 호출부가 색 클래스만 주므로 남는 style 이 없다 —
 * lucide 는 남은 style 을 자식 도형마다 펼치므로 변형 · 투명도가 섞이면 겹쳐 걸린다(공개 Icon 은 Frame).
 */
const mapping = {
    className: { target: false, nativeStyleMapping: { color: "color" } },
};
/**
 * 컴포넌트 안에 붙는 아이콘(Button 의 `icon` · `loading`). 색은 호출부가 전경 클래스로 준다.
 * 크기는 클래스가 아니라 lucide `size` prop(JS 숫자)으로 준다 — 20px 는 spacing 열거
 * 밖이라 `size-5` 클래스가 생성되지 않기 때문이다(plan v2 F-8).
 *
 * 웹의 `spin` 은 없다 — RN 에서 `animate-spin` 은 Reanimated 경로가 필요하고
 * v1 범위 밖이다. Button 의 `loading` 은 회전 없이 아이콘만 바꾼다(알려진 동작 참조).
 */
export function Glyph({ name, size = "md", className }) {
    return useCssElement(icons[name], { className, size: component.icon.size[size] }, mapping);
}
/** `tone` 은 Text 와 같은 fg semantic 색이다(C-8). */
const tones = {
    default: "text-fg",
    muted: "text-fg-muted",
    danger: "text-fg-danger",
};
/**
 * 공개 Icon 의 뼈대. className 이 푼 style(여백 · 배치 · 변형 · 투명도)은 이 View 가 한 번만 받고,
 * lucide 에는 크기와 색만 넘긴다. lucide 는 받은 style 을 svg 와 자식 도형마다 펼치므로, svg 에 직접 주면
 * `rotate-180` 은 react-native-svg 의 transform 해석에서 던지고 `opacity-50` 은 세 번 곱해진다(N-17, DS-001 재검증).
 */
function Frame({ svg: Svg, size, color, style, accessible, accessibilityRole, accessibilityLabel, accessibilityElementsHidden, importantForAccessibility, }) {
    return (_jsx(View, { style: style, accessible: accessible, accessibilityRole: accessibilityRole, accessibilityLabel: accessibilityLabel, accessibilityElementsHidden: accessibilityElementsHidden, importantForAccessibility: importantForAccessibility, children: _jsx(Svg, { size: size, color: color }) }));
}
/** className 을 Frame 의 style 로 풀고, 색만 뽑아 `color` 로 옮긴다. */
const frameMapping = {
    className: { target: "style", nativeStyleMapping: { color: "color" } },
};
/**
 * 단독 아이콘(구현 노트 N-17). RN 에는 글자색 상속이 없어 색을 `tone` 으로 아이콘 자신이 갖는다 —
 * 웹도 같은 방식이라 같은 className 이 같은 결과를 낸다(AC-25).
 * `label` 이 있으면 이름을 가진 그림(`image`)이고, 없거나 빈 문자열이면 꾸밈이라 보조 기술에서 숨긴다.
 *
 * 배치 · 변형 · 투명도 클래스는 루트 View(Frame)에 한 번 붙는다. 그림 크기는 `size` prop 이 정한다 —
 * className 의 `size-*` 는 View 칸만 바꾼다(알려진 동작 20).
 */
export const Icon = ({ name, size = "md", tone = "default", label, className }) => {
    const named = Boolean(label);
    return useCssElement(Frame, {
        className: cn(tones[tone], className),
        svg: icons[name],
        size: component.icon.size[size],
        accessible: named,
        accessibilityRole: named ? "image" : undefined,
        accessibilityLabel: named ? label : undefined,
        accessibilityElementsHidden: !named,
        importantForAccessibility: named ? "yes" : "no-hide-descendants",
    }, frameMapping);
};
export { icons };
//# sourceMappingURL=icon.js.map