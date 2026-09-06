// 생성 파일. packages/tokens/scripts/build.ts 가 만든다. 직접 수정하지 않는다.

/**
 * 브랜드 base 의 semantic 색 해석값 (RN 런타임용, AC-4).
 * 별칭(fg.danger · border.focus)도 여기서는 해석값이다 — RN 은 var() 를 쓸 수 없다.
 * 소비자 로컬 오버라이드(C-5b)는 이 객체에 닿지 않는다(알려진 동작 11).
 */
export const colors = {
  "light": {
    "bg": {
      "canvas": "oklch(100% 0 0)",
      "surface": "oklch(100% 0 0)",
      "surface-muted": "oklch(96.7% 0.003 264.542)",
      "surface-hover": "oklch(92.8% 0.006 264.531)",
      "brand": "oklch(54.6% 0.245 262.881)",
      "brand-hover": "oklch(48.8% 0.243 264.376)",
      "danger": "oklch(57.7% 0.245 27.325)",
      "danger-hover": "oklch(50.5% 0.213 27.518)",
      "overlay": "oklch(0% 0 0 / 0.5)"
    },
    "fg": {
      "default": "oklch(21% 0.034 264.665)",
      "muted": "oklch(55.1% 0.027 264.364)",
      "danger": "oklch(57.7% 0.245 27.325)",
      "on-brand": "oklch(100% 0 0)",
      "on-danger": "oklch(100% 0 0)"
    },
    "border": {
      "default": "oklch(87.2% 0.01 258.338)",
      "focus": "oklch(54.6% 0.245 262.881)"
    }
  },
  "dark": {
    "bg": {
      "canvas": "oklch(13% 0.028 261.692)",
      "surface": "oklch(21% 0.034 264.665)",
      "surface-muted": "oklch(27.8% 0.033 256.848)",
      "surface-hover": "oklch(37.3% 0.034 259.733)",
      "brand": "oklch(62.3% 0.214 259.815)",
      "brand-hover": "oklch(70.7% 0.165 254.624)",
      "danger": "oklch(63.7% 0.237 25.331)",
      "danger-hover": "oklch(70.4% 0.191 22.216)",
      "overlay": "oklch(0% 0 0 / 0.6)"
    },
    "fg": {
      "default": "oklch(98.5% 0.002 247.839)",
      "muted": "oklch(70.7% 0.022 261.325)",
      "danger": "oklch(63.7% 0.237 25.331)",
      "on-brand": "oklch(100% 0 0)",
      "on-danger": "oklch(100% 0 0)"
    },
    "border": {
      "default": "oklch(37.3% 0.034 259.733)",
      "focus": "oklch(62.3% 0.214 259.815)"
    }
  }
} as const;
