import { jsx as _jsx } from "react/jsx-runtime";
import { component } from "@eeennsu/tokens";
import { cn } from "./cn.js";
import { ArrowLeft, ArrowRight, Calendar, ChartPie, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, CircleAlert, ExternalLink, Eye, EyeOff, House, Info, List, Loader, Lock, Mail, Menu, Minus, Pencil, Plus, Search, Settings, Trash, User, X, } from "lucide-react";
/**
 * `IconName` → lucide 컴포넌트. `Record<IconName, LucideIcon>` 이라 tokens 의 목록에
 * 이름을 추가하고 이 맵을 빠뜨리면 컴파일 에러가 난다(plan D-8).
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
 * 컴포넌트 안에 붙는 아이콘(Button 의 `icon` · `loading`). 공개 `Icon` 과 달리 `spin` 을 받고
 * 색은 `currentColor` 로 부모 글자색을 상속한다(§9 S-17). 가시 텍스트 옆이라 늘 보조 기술에서 숨긴다.
 * 크기는 클래스가 아니라 lucide `size` prop(JS 숫자)으로 준다 — 20px 는 spacing 열거
 * 밖이라 `size-5` 클래스가 생성되지 않기 때문이다(plan v2 F-8).
 */
export function Glyph({ name, size = "md", spin = false, className }) {
    const Svg = icons[name];
    return (_jsx(Svg, { size: component.icon.size[size], "aria-hidden": "true", className: spin ? cn("animate-spin", className) : className }));
}
/** `tone` 은 Text 와 같은 fg semantic 색이다(C-8). */
const tones = {
    default: "text-fg",
    muted: "text-fg-muted",
    danger: "text-fg-danger",
};
/**
 * 단독 아이콘(구현 노트 N-17). 색을 상속하지 않고 `tone` 으로 정한다 — RN 에는 글자색 상속이
 * 없으므로 두 플랫폼이 같은 결과를 내려면 색을 아이콘 자신이 가져야 한다(AC-25).
 * `label` 이 있으면 `role="img"` 과 이름을 갖는 그림이고, 없거나 빈 문자열이면 꾸밈이라 `aria-hidden` 이다.
 */
export const Icon = ({ name, size = "md", tone = "default", label, className }) => {
    const Svg = icons[name];
    // 빈 문자열도 꾸밈으로 본다 — 이름 없는 그림을 보조 기술에 내놓지 않는다.
    const named = Boolean(label);
    return (_jsx(Svg, { size: component.icon.size[size], role: named ? "img" : undefined, "aria-label": named ? label : undefined, "aria-hidden": named ? undefined : "true", className: cn("shrink-0", tones[tone], className) }));
};
export { icons };
//# sourceMappingURL=icon.js.map