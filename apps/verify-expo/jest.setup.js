// jest-expo 에는 NativeAppearance TurboModule 이 없어 `Appearance.setColorScheme` 이
// no-op 이고 `getColorScheme()` 이 항상 null 이다. 다크 판정을 위해 최소 모킹한다.
// (jest.mock 팩토리는 `mock` 접두 변수만 참조할 수 있다.)
const mockAppearanceState = { colorScheme: null };

jest.mock("react-native/Libraries/Utilities/NativeAppearance", () => ({
  __esModule: true,
  default: {
    getColorScheme: () => mockAppearanceState.colorScheme,
    setColorScheme: (scheme) => {
      mockAppearanceState.colorScheme = scheme === "unspecified" ? null : scheme;
    },
    addListener: () => {},
    removeListeners: () => {},
  },
}));

beforeEach(() => {
  mockAppearanceState.colorScheme = null;
});
