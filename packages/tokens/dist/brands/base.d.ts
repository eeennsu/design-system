/**
 * 브랜드 base 의 semantic 색 해석값 (RN 런타임용, AC-4).
 * 별칭(fg.danger · border.focus)도 여기서는 해석값이다 — RN 은 var() 를 쓸 수 없다.
 * 소비자 로컬 오버라이드(C-5b)는 이 객체에 닿지 않는다(알려진 동작 11).
 */
export declare const colors: {
    readonly light: {
        readonly bg: {
            readonly canvas: "oklch(96.7% 0.003 264.542)";
            readonly surface: "oklch(100% 0 0)";
            readonly "surface-muted": "oklch(92.8% 0.006 264.531)";
            readonly "surface-hover": "oklch(87.2% 0.01 258.338)";
            readonly brand: "oklch(56.8% 0.201 259.681)";
            readonly "brand-hover": "oklch(53.2% 0.194 260.157)";
            readonly danger: "oklch(57.7% 0.245 27.325)";
            readonly "danger-hover": "oklch(50.5% 0.213 27.518)";
            readonly overlay: "oklch(0% 0 0 / 0.5)";
        };
        readonly fg: {
            readonly default: "oklch(21% 0.034 264.665)";
            readonly muted: "oklch(49.9% 0.029 260.583)";
            readonly brand: "oklch(53.2% 0.194 260.157)";
            readonly danger: "oklch(50.5% 0.213 27.518)";
            readonly "on-brand": "oklch(100% 0 0)";
            readonly "on-danger": "oklch(100% 0 0)";
        };
        readonly border: {
            readonly default: "oklch(92.8% 0.006 264.531)";
            readonly focus: "oklch(56.8% 0.201 259.681)";
        };
    };
    readonly dark: {
        readonly bg: {
            readonly canvas: "oklch(14.1% 0.005 285.823)";
            readonly surface: "oklch(21% 0.006 285.885)";
            readonly "surface-muted": "oklch(27.4% 0.006 286.033)";
            readonly "surface-hover": "oklch(37% 0.013 285.805)";
            readonly brand: "oklch(56.8% 0.201 259.681)";
            readonly "brand-hover": "oklch(53.2% 0.194 260.157)";
            readonly danger: "oklch(57.7% 0.245 27.325)";
            readonly "danger-hover": "oklch(50.5% 0.213 27.518)";
            readonly overlay: "oklch(0% 0 0 / 0.6)";
        };
        readonly fg: {
            readonly default: "oklch(96.7% 0.001 286.375)";
            readonly muted: "oklch(70.5% 0.015 286.067)";
            readonly brand: "oklch(70.7% 0.165 254.624)";
            readonly danger: "oklch(70.4% 0.191 22.216)";
            readonly "on-brand": "oklch(100% 0 0)";
            readonly "on-danger": "oklch(100% 0 0)";
        };
        readonly border: {
            readonly default: "oklch(27.4% 0.006 286.033)";
            readonly focus: "oklch(56.8% 0.201 259.681)";
        };
    };
};
//# sourceMappingURL=base.d.ts.map