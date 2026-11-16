import type { ReactNode } from "react";
import "./surface.css";

/** AC-26 (e) 전용 CSS 진입점(R28). radius · 표면 관계를 재선언한 앱을 흉내 낸다. `(app)` 라우트와 섞이지 않게 분리했다. */
export default function SurfaceLayout({ children }: { children: ReactNode }) {
  return children;
}
