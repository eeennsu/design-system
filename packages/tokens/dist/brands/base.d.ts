/**
 * 브랜드 base 의 semantic 색 해석값 (RN 런타임용, AC-4).
 * 별칭(fg.danger · border.focus)도 여기서는 해석값이다 — RN 은 var() 를 쓸 수 없다.
 * 소비자 로컬 오버라이드(C-5b)는 이 객체에 닿지 않는다(알려진 동작 11).
 */
export declare const colors: {
    readonly light: {
        readonly bg: {
            readonly canvas: "oklch(100% 0 0)";
            readonly surface: "oklch(100% 0 0)";
            readonly "surface-muted": "oklch(96.7% 0.003 264.542)";
            readonly "surface-hover": "oklch(92.8% 0.006 264.531)";
            readonly brand: "oklch(54.6% 0.245 262.881)";
            readonly "brand-hover": "oklch(48.8% 0.243 264.376)";
            readonly danger: "oklch(57.7% 0.245 27.325)";
            readonly "danger-hover": "oklch(50.5% 0.213 27.518)";
            readonly overlay: "oklch(0% 0 0 / 0.5)";
        };
        readonly fg: {
            readonly default: "oklch(21% 0.034 264.665)";
            readonly muted: "oklch(55.1% 0.027 264.364)";
            readonly danger: "oklch(57.7% 0.245 27.325)";
            readonly "on-brand": "oklch(100% 0 0)";
            readonly "on-danger": "oklch(100% 0 0)";
        };
        readonly border: {
            readonly default: "oklch(87.2% 0.01 258.338)";
            readonly focus: "oklch(54.6% 0.245 262.881)";
        };
    };
    readonly dark: {
        readonly bg: {
            readonly canvas: "oklch(13% 0.028 261.692)";
            readonly surface: "oklch(21% 0.034 264.665)";
            readonly "surface-muted": "oklch(27.8% 0.033 256.848)";
            readonly "surface-hover": "oklch(37.3% 0.034 259.733)";
            readonly brand: "oklch(62.3% 0.214 259.815)";
            readonly "brand-hover": "oklch(70.7% 0.165 254.624)";
            readonly danger: "oklch(63.7% 0.237 25.331)";
            readonly "danger-hover": "oklch(70.4% 0.191 22.216)";
            readonly overlay: "oklch(0% 0 0 / 0.6)";
        };
        readonly fg: {
            readonly default: "oklch(98.5% 0.002 247.839)";
            readonly muted: "oklch(70.7% 0.022 261.325)";
            readonly danger: "oklch(63.7% 0.237 25.331)";
            readonly "on-brand": "oklch(13% 0.028 261.692)";
            readonly "on-danger": "oklch(13% 0.028 261.692)";
        };
        readonly border: {
            readonly default: "oklch(37.3% 0.034 259.733)";
            readonly focus: "oklch(62.3% 0.214 259.815)";
        };
    };
};
//# sourceMappingURL=base.d.ts.map