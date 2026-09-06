import { Appearance, DeviceEventEmitter } from "react-native";

/**
 * jest-expo 에서 `Appearance.setColorScheme` 는 no-op 이다 — NativeAppearance
 * TurboModule 이 없어 `getColorScheme()` 이 항상 null 이고 change 이벤트도 없다.
 * `jest.setup.js` 가 NativeAppearance 를 모킹하고, 여기서 RN 이 네이티브 쪽에서
 * 받는 것과 같은 `appearanceChanged` 이벤트를 직접 쏜다.
 */
export function setColorScheme(scheme: "light" | "dark" | null) {
  // RN 타입에서 "스킴 없음" 은 null 이 아니라 "unspecified" 다.
  Appearance.setColorScheme(scheme ?? "unspecified");
  DeviceEventEmitter.emit("appearanceChanged", { colorScheme: scheme });
}
