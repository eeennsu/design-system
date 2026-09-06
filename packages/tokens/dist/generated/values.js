// 생성 파일. packages/tokens/scripts/build.ts 가 만든다. 직접 수정하지 않는다.
/** 간격 스케일. 희소 열거이며 열거 밖 키는 클래스가 없다(C-7a). */
export const spacing = {
    "0": "0px",
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "6": "24px",
    "8": "32px",
    "12": "48px",
    "16": "64px",
    "20": "80px",
    "24": "96px"
};
/** 모서리 반경 스케일. */
export const radius = {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "full": "9999px"
};
/** 그림자 스케일. */
export const shadow = {
    "sm": "0 1px 2px oklch(0% 0 0 / 0.05)",
    "md": "0 4px 8px oklch(0% 0 0 / 0.08)",
    "lg": "0 12px 24px oklch(0% 0 0 / 0.12)"
};
/** 타이포 스텝 해석값. RN Text 가 클래스 대신 style 로 넣어야 할 때 읽는다(C-19 (5) 분기). */
export const text = {
    "sm": {
        "fontSize": "14px",
        "lineHeight": "20px",
        "fontWeight": 400
    },
    "md": {
        "fontSize": "16px",
        "lineHeight": "24px",
        "fontWeight": 400
    },
    "lg": {
        "fontSize": "18px",
        "lineHeight": "28px",
        "fontWeight": 500
    },
    "xl": {
        "fontSize": "20px",
        "lineHeight": "28px",
        "fontWeight": 600
    },
    "2xl": {
        "fontSize": "24px",
        "lineHeight": "32px",
        "fontWeight": 700
    }
};
/** 폰트 패밀리. 폰트 파일은 동봉하지 않는다 — 로딩은 소비 프로젝트 책임(C-7b, AC-6c). */
export const fontFamily = {
    "sans": {
        "web": "\"Pretendard Variable\", Pretendard, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
        "native": "Pretendard"
    }
};
/**
 * tailwind-merge 설정. 웹·RN 이 extendTailwindMerge({ override: { theme: twMergeConfig } }) 로 쓴다.
 * override 여야 한다 — extend 는 기본 검증자에 concat 이라 spacing 의 기본 isNumber 가 남아
 * cn("mt-4", "mt-5") 가 mt-5 로 접히고 DS 기본 여백이 사라진다(plan v2 F-4).
 */
export const twMergeConfig = {
    "color": [
        "canvas",
        "surface",
        "surface-muted",
        "surface-hover",
        "brand",
        "brand-hover",
        "danger",
        "danger-hover",
        "overlay",
        "fg",
        "fg-muted",
        "fg-danger",
        "fg-on-brand",
        "fg-on-danger",
        "border",
        "border-focus"
    ],
    "spacing": [
        "0",
        "1",
        "2",
        "3",
        "4",
        "6",
        "8",
        "12",
        "16",
        "20",
        "24"
    ],
    "radius": [
        "sm",
        "md",
        "lg",
        "full"
    ],
    "shadow": [
        "sm",
        "md",
        "lg"
    ],
    "text": [
        "sm",
        "md",
        "lg",
        "xl",
        "2xl"
    ]
};
/** @theme inline 색 키 → :root 변수 이름. C-5b 공개 계약의 실체다. */
export const semanticVariables = {
    "canvas": "--bg-canvas",
    "surface": "--bg-surface",
    "surface-muted": "--bg-surface-muted",
    "surface-hover": "--bg-surface-hover",
    "brand": "--bg-brand",
    "brand-hover": "--bg-brand-hover",
    "danger": "--bg-danger",
    "danger-hover": "--bg-danger-hover",
    "overlay": "--bg-overlay",
    "fg": "--fg-default",
    "fg-muted": "--fg-muted",
    "fg-danger": "--fg-danger",
    "fg-on-brand": "--fg-on-brand",
    "fg-on-danger": "--fg-on-danger",
    "border": "--border-default",
    "border-focus": "--border-focus"
};
/**
 * component 계층 recipe. 값은 스케일 키이며 클래스 조립은 컴포넌트 구현이 한다
 * (정적 리터럴이어야 @source 스캔이 잡는다 — C-4 (2)).
 */
export const component = {
    "badge": {
        "sm": {
            "paddingX": "2",
            "paddingY": "0",
            "text": "sm",
            "radius": "full"
        },
        "md": {
            "paddingX": "3",
            "paddingY": "1",
            "text": "sm",
            "radius": "full"
        }
    },
    "button": {
        "sm": {
            "paddingX": "3",
            "paddingY": "1",
            "text": "sm",
            "radius": "md",
            "gap": "1"
        },
        "md": {
            "paddingX": "4",
            "paddingY": "2",
            "text": "md",
            "radius": "md",
            "gap": "2"
        },
        "lg": {
            "paddingX": "6",
            "paddingY": "3",
            "text": "lg",
            "radius": "lg",
            "gap": "2"
        }
    },
    "card": {
        "padding": "4",
        "radius": "lg",
        "shadow": "sm"
    },
    "dialog": {
        "padding": "6",
        "radius": "lg",
        "shadow": "lg",
        "maxWidth": "max-w-md"
    },
    "drawer": {
        "padding": "6",
        "width": "max-w-sm w-full"
    },
    "icon": {
        "size": {
            "sm": 16,
            "md": 20,
            "lg": 24
        }
    },
    "input": {
        "sm": {
            "paddingX": "3",
            "paddingY": "1",
            "text": "sm",
            "radius": "md"
        },
        "md": {
            "paddingX": "3",
            "paddingY": "2",
            "text": "md",
            "radius": "md"
        },
        "lg": {
            "paddingX": "4",
            "paddingY": "3",
            "text": "lg",
            "radius": "md"
        }
    },
    "textarea": {
        "rows": {
            "sm": 3,
            "md": 5,
            "lg": 8
        }
    },
    "tooltip": {
        "paddingX": "2",
        "paddingY": "1",
        "text": "sm",
        "radius": "sm"
    }
};
//# sourceMappingURL=values.js.map