import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "./cn.js";
/**
 * 마크다운식 원시 요소를 꾸미는 래퍼(R27). 선택자는 전부 `[:where(&)…]` 라 특이성이 요소 수준 이하다 —
 * Prose 안의 DS 컴포넌트 클래스와 소비자 `className` 이 이긴다(decisions-r27 13 · 15).
 * Tailwind 스캐너가 후보를 찾도록 클래스는 정적 리터럴로만 적는다.
 * `pre` · `th` · `td` 값은 CodeBlock · Table recipe 와 같고 recipe 테스트가 지킨다(decisions-r27 20).
 */
export const Prose = ({ children, className }) => (_jsx("div", { className: cn("text-md text-fg", "[:where(&)>*+*]:mt-4", "[:where(&)_h1]:text-2xl [:where(&)_h2]:text-xl [:where(&)_h3]:text-lg", "[:where(&)>*+h1]:mt-8 [:where(&)>*+h2]:mt-8 [:where(&)>*+h3]:mt-6", "[:where(&)_ul]:list-disc [:where(&)_ol]:list-decimal [:where(&)_ul]:ps-6 [:where(&)_ol]:ps-6", "[:where(&)_li+li]:mt-1", "[:where(&)_a]:text-fg-brand [:where(&)_a]:underline", "[:where(&)_:not(pre)>code]:font-mono [:where(&)_:not(pre)>code]:text-sm [:where(&)_:not(pre)>code]:bg-surface-muted [:where(&)_:not(pre)>code]:rounded-sm [:where(&)_:not(pre)>code]:px-1", "[:where(&)_pre]:p-4 [:where(&)_pre]:overflow-x-auto [:where(&)_pre]:text-sm [:where(&)_pre]:font-mono [:where(&)_pre]:text-fg [:where(&)_pre]:bg-surface-muted [:where(&)_pre]:rounded-lg", "[:where(&)_blockquote]:border-s-4 [:where(&)_blockquote]:border-border [:where(&)_blockquote]:ps-4 [:where(&)_blockquote]:text-fg-muted", "[:where(&)_hr]:border-border", "[:where(&)_th]:px-3 [:where(&)_th]:py-2 [:where(&)_th]:text-sm [:where(&)_th]:text-start [:where(&)_th]:text-fg-muted [:where(&)_th]:border-b [:where(&)_th]:border-border", "[:where(&)_td]:px-3 [:where(&)_td]:py-2 [:where(&)_td]:text-sm [:where(&)_td]:text-fg [:where(&)_td]:border-b [:where(&)_td]:border-border", "[:where(&)_img]:max-w-full", className), children: children }));
//# sourceMappingURL=prose.js.map