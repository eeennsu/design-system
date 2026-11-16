/**
 * 브랜드 bakery 의 semantic 색 해석값 (RN 런타임용, AC-4).
 * 별칭(fg.danger · border.focus)도 여기서는 해석값이다 — RN 은 var() 를 쓸 수 없다.
 * 소비자 로컬 오버라이드(C-5b)는 이 객체에 닿지 않는다(알려진 동작 11).
 */
export declare const colors: {
    readonly light: {
        readonly bg: {
            readonly canvas: "oklch(98.7% 0.022 95.277)";
            readonly surface: "oklch(100% 0 0)";
            readonly "surface-muted": "oklch(96.2% 0.059 95.617)";
            readonly "surface-hover": "oklch(92.4% 0.12 95.746)";
            readonly brand: "oklch(66.6% 0.179 58.318)";
            readonly "brand-hover": "oklch(76.9% 0.188 70.08)";
            readonly danger: "oklch(57.7% 0.245 27.325)";
            readonly "danger-hover": "oklch(50.5% 0.213 27.518)";
            readonly overlay: "oklch(0% 0 0 / 0.5)";
            readonly "brand-subtle": "oklch(96.2% 0.059 95.617)";
            readonly "success-subtle": "oklch(98.2% 0.018 155.826)";
            readonly "warning-subtle": "oklch(98% 0.016 73.684)";
            readonly "info-subtle": "oklch(97.7% 0.013 236.62)";
            readonly "danger-subtle": "oklch(97.1% 0.013 17.38)";
        };
        readonly fg: {
            readonly default: "oklch(21% 0.034 264.665)";
            readonly muted: "oklch(44.6% 0.03 256.802)";
            readonly brand: "oklch(55.5% 0.163 48.998)";
            readonly danger: "oklch(50.5% 0.213 27.518)";
            readonly success: "oklch(52.7% 0.154 150.069)";
            readonly warning: "oklch(47% 0.157 37.304)";
            readonly info: "oklch(50% 0.134 242.749)";
            readonly "on-brand": "oklch(13% 0.028 261.692)";
            readonly "on-danger": "oklch(100% 0 0)";
        };
        readonly border: {
            readonly default: "oklch(87.9% 0.169 91.605)";
            readonly focus: "oklch(66.6% 0.179 58.318)";
            readonly surface: "oklch(0% 0 0 / 0)";
        };
    };
    readonly dark: {
        readonly bg: {
            readonly canvas: "oklch(13% 0.028 261.692)";
            readonly surface: "oklch(21% 0.034 264.665)";
            readonly "surface-muted": "oklch(27.8% 0.033 256.848)";
            readonly "surface-hover": "oklch(37.3% 0.034 259.733)";
            readonly brand: "oklch(76.9% 0.188 70.08)";
            readonly "brand-hover": "oklch(82.8% 0.189 84.429)";
            readonly danger: "oklch(63.7% 0.237 25.331)";
            readonly "danger-hover": "oklch(70.4% 0.191 22.216)";
            readonly overlay: "oklch(0% 0 0 / 0.6)";
            readonly "brand-subtle": "oklch(27.9% 0.077 45.635)";
            readonly "success-subtle": "oklch(26.6% 0.065 152.934)";
            readonly "warning-subtle": "oklch(26.6% 0.079 36.259)";
            readonly "info-subtle": "oklch(29.3% 0.066 243.157)";
            readonly "danger-subtle": "oklch(25.8% 0.092 26.042)";
        };
        readonly fg: {
            readonly default: "oklch(98.5% 0.002 247.839)";
            readonly muted: "oklch(70.7% 0.022 261.325)";
            readonly brand: "oklch(82.8% 0.189 84.429)";
            readonly danger: "oklch(70.4% 0.191 22.216)";
            readonly success: "oklch(79.2% 0.209 151.711)";
            readonly warning: "oklch(75% 0.183 55.934)";
            readonly info: "oklch(74.6% 0.16 232.661)";
            readonly "on-brand": "oklch(13% 0.028 261.692)";
            readonly "on-danger": "oklch(13% 0.028 261.692)";
        };
        readonly border: {
            readonly default: "oklch(37.3% 0.034 259.733)";
            readonly focus: "oklch(76.9% 0.188 70.08)";
            readonly surface: "oklch(0% 0 0 / 0)";
        };
    };
};
//# sourceMappingURL=bakery.d.ts.map