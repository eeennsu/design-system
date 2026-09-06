import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

// vitest globals 를 켜지 않으므로 RTL 자동 cleanup 이 등록되지 않는다. 직접 건다.
afterEach(cleanup);

// jsdom 에는 레이아웃이 없어 offsetParent 가 구현돼 있지 않다. 그러면 Base UI 가 쓰는
// floating-ui 가 offsetParent 로 document 를 잡고 getBoundingClientRect 를 호출해 깨진다.
// 위치 계산 자체는 DS 로직이 아니므로 최소 형태만 채운다.
Object.defineProperty(HTMLElement.prototype, "offsetParent", {
  configurable: true,
  get() {
    return document.body;
  },
});
