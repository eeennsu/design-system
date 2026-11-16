// 생성 파일. packages/tokens/scripts/build.ts 가 만든다. 직접 수정하지 않는다.
/**
 * 브랜드 bakery 의 semantic 색 해석값 (RN 런타임용, AC-4).
 * 별칭(fg.danger · border.focus)도 여기서는 해석값이다 — RN 은 var() 를 쓸 수 없다.
 * 소비자 로컬 오버라이드(C-5b)는 이 객체에 닿지 않는다(알려진 동작 11).
 */
export const colors = {
    "light": {
        "bg": {
            "canvas": "oklch(98.7% 0.022 95.277)",
            "surface": "oklch(100% 0 0)",
            "surface-muted": "oklch(96.2% 0.059 95.617)",
            "surface-hover": "oklch(92.4% 0.12 95.746)",
            "brand": "oklch(66.6% 0.179 58.318)",
            "brand-hover": "oklch(76.9% 0.188 70.08)",
            "danger": "oklch(57.7% 0.245 27.325)",
            "danger-hover": "oklch(50.5% 0.213 27.518)",
            "overlay": "oklch(0% 0 0 / 0.5)",
            "brand-subtle": "oklch(96.2% 0.059 95.617)",
            "success-subtle": "oklch(98.2% 0.018 155.826)",
            "warning-subtle": "oklch(98% 0.016 73.684)",
            "info-subtle": "oklch(97.7% 0.013 236.62)",
            "danger-subtle": "oklch(97.1% 0.013 17.38)"
        },
        "fg": {
            "default": "oklch(21% 0.034 264.665)",
            "muted": "oklch(44.6% 0.03 256.802)",
            "brand": "oklch(55.5% 0.163 48.998)",
            "danger": "oklch(50.5% 0.213 27.518)",
            "success": "oklch(52.7% 0.154 150.069)",
            "warning": "oklch(47% 0.157 37.304)",
            "info": "oklch(50% 0.134 242.749)",
            "on-brand": "oklch(13% 0.028 261.692)",
            "on-danger": "oklch(100% 0 0)"
        },
        "border": {
            "default": "oklch(87.9% 0.169 91.605)",
            "focus": "oklch(66.6% 0.179 58.318)",
            "surface": "oklch(0% 0 0 / 0)"
        }
    },
    "dark": {
        "bg": {
            "canvas": "oklch(13% 0.028 261.692)",
            "surface": "oklch(21% 0.034 264.665)",
            "surface-muted": "oklch(27.8% 0.033 256.848)",
            "surface-hover": "oklch(37.3% 0.034 259.733)",
            "brand": "oklch(76.9% 0.188 70.08)",
            "brand-hover": "oklch(82.8% 0.189 84.429)",
            "danger": "oklch(63.7% 0.237 25.331)",
            "danger-hover": "oklch(70.4% 0.191 22.216)",
            "overlay": "oklch(0% 0 0 / 0.6)",
            "brand-subtle": "oklch(27.9% 0.077 45.635)",
            "success-subtle": "oklch(26.6% 0.065 152.934)",
            "warning-subtle": "oklch(26.6% 0.079 36.259)",
            "info-subtle": "oklch(29.3% 0.066 243.157)",
            "danger-subtle": "oklch(25.8% 0.092 26.042)"
        },
        "fg": {
            "default": "oklch(98.5% 0.002 247.839)",
            "muted": "oklch(70.7% 0.022 261.325)",
            "brand": "oklch(82.8% 0.189 84.429)",
            "danger": "oklch(70.4% 0.191 22.216)",
            "success": "oklch(79.2% 0.209 151.711)",
            "warning": "oklch(75% 0.183 55.934)",
            "info": "oklch(74.6% 0.16 232.661)",
            "on-brand": "oklch(13% 0.028 261.692)",
            "on-danger": "oklch(13% 0.028 261.692)"
        },
        "border": {
            "default": "oklch(37.3% 0.034 259.733)",
            "focus": "oklch(76.9% 0.188 70.08)",
            "surface": "oklch(0% 0 0 / 0)"
        }
    }
};
//# sourceMappingURL=bakery.js.map