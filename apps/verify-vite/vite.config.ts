import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// C-3: 소비 프로젝트 설정은 전역 CSS import 한 줄까지다. 여기 있는 건 Tailwind v4 플러그인뿐이다.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
