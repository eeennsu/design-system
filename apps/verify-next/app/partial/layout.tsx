import type { ReactNode } from "react";
import "./partial.css";

/** AC-26 (d) 회귀 가드 전용 CSS 진입점. 정상 경로와 섞이지 않게 라우트를 분리했다. */
export default function PartialLayout({ children }: { children: ReactNode }) {
  return children;
}
