import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "verify-next" };
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

/**
 * 루트 레이아웃은 CSS 를 import 하지 않는다 — 라우트마다 다른 CSS 진입점을 두어
 * AC-26 (d) 회귀 가드를 정상 경로와 분리하기 위해서다.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
