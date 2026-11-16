import type { ReactNode } from "react";
import "./surface.css";

/** R28 소비자 재선언(모서리 · canvas · 테두리) 확인 전용 CSS 진입점. 정상 경로와 섞이지 않게 라우트를 분리했다. */
export default function SurfaceLayout({ children }: { children: ReactNode }) {
  return children;
}
