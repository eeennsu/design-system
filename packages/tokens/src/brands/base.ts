// 생성 파일. packages/tokens/scripts/build.ts 가 만든다. 직접 수정하지 않는다.

/**
 * 브랜드 base 의 semantic 색 해석값 (RN 런타임용, AC-4).
 * 별칭(fg.danger · border.focus)도 여기서는 해석값이다 — RN 은 var() 를 쓸 수 없다.
 * 소비자 로컬 오버라이드(C-5b)는 이 객체에 닿지 않는다(알려진 동작 11).
 */
export const colors = {
  "light": {
    "bg": {
      "canvas": "oklch(96.7% 0.003 264.542)",
      "surface": "oklch(100% 0 0)",
      "surface-muted": "oklch(92.8% 0.006 264.531)",
      "surface-hover": "oklch(87.2% 0.01 258.338)",
      "brand": "oklch(56.8% 0.201 259.681)",
      "brand-hover": "oklch(53.2% 0.194 260.157)",
      "danger": "oklch(57.7% 0.245 27.325)",
      "danger-hover": "oklch(50.5% 0.213 27.518)",
      "overlay": "oklch(0% 0 0 / 0.5)",
      "brand-subtle": "oklch(97% 0.014 254.604)",
      "success-subtle": "oklch(98.2% 0.018 155.826)",
      "warning-subtle": "oklch(98.7% 0.022 95.277)",
      "info-subtle": "oklch(97.7% 0.013 236.62)",
      "danger-subtle": "oklch(97.1% 0.013 17.38)"
    },
    "fg": {
      "default": "oklch(21% 0.034 264.665)",
      "muted": "oklch(49.9% 0.029 260.583)",
      "brand": "oklch(53.2% 0.194 260.157)",
      "danger": "oklch(50.5% 0.213 27.518)",
      "on-brand": "oklch(100% 0 0)",
      "on-danger": "oklch(100% 0 0)",
      "success": "oklch(44.8% 0.119 151.328)",
      "warning": "oklch(47.3% 0.137 46.201)",
      "info": "oklch(50% 0.134 242.749)"
    },
    "border": {
      "default": "oklch(92.8% 0.006 264.531)",
      "focus": "oklch(56.8% 0.201 259.681)",
      "surface": "oklch(0% 0 0 / 0)"
    }
  },
  "dark": {
    "bg": {
      "canvas": "oklch(14.1% 0.005 285.823)",
      "surface": "oklch(21% 0.006 285.885)",
      "surface-muted": "oklch(27.4% 0.006 286.033)",
      "surface-hover": "oklch(37% 0.013 285.805)",
      "brand": "oklch(56.8% 0.201 259.681)",
      "brand-hover": "oklch(53.2% 0.194 260.157)",
      "danger": "oklch(57.7% 0.245 27.325)",
      "danger-hover": "oklch(50.5% 0.213 27.518)",
      "overlay": "oklch(0% 0 0 / 0.6)",
      "brand-subtle": "oklch(28.2% 0.091 267.935)",
      "success-subtle": "oklch(26.6% 0.065 152.934)",
      "warning-subtle": "oklch(27.9% 0.077 45.635)",
      "info-subtle": "oklch(29.3% 0.066 243.157)",
      "danger-subtle": "oklch(25.8% 0.092 26.042)"
    },
    "fg": {
      "default": "oklch(96.7% 0.001 286.375)",
      "muted": "oklch(70.5% 0.015 286.067)",
      "brand": "oklch(70.7% 0.165 254.624)",
      "danger": "oklch(70.4% 0.191 22.216)",
      "on-brand": "oklch(100% 0 0)",
      "on-danger": "oklch(100% 0 0)",
      "success": "oklch(79.2% 0.209 151.711)",
      "warning": "oklch(82.8% 0.189 84.429)",
      "info": "oklch(74.6% 0.16 232.661)"
    },
    "border": {
      "default": "oklch(27.4% 0.006 286.033)",
      "focus": "oklch(56.8% 0.201 259.681)",
      "surface": "oklch(0% 0 0 / 0)"
    }
  }
} as const;
