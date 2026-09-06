/** 간격 스케일. 희소 열거이며 열거 밖 키는 클래스가 없다(C-7a). */
export declare const spacing: {
    readonly "0": "0px";
    readonly "1": "4px";
    readonly "2": "8px";
    readonly "3": "12px";
    readonly "4": "16px";
    readonly "6": "24px";
    readonly "8": "32px";
    readonly "12": "48px";
    readonly "16": "64px";
    readonly "20": "80px";
    readonly "24": "96px";
};
/** 모서리 반경 스케일. */
export declare const radius: {
    readonly sm: "4px";
    readonly md: "8px";
    readonly lg: "12px";
    readonly full: "9999px";
};
/** 그림자 스케일. */
export declare const shadow: {
    readonly sm: "0 1px 2px oklch(0% 0 0 / 0.05)";
    readonly md: "0 4px 8px oklch(0% 0 0 / 0.08)";
    readonly lg: "0 12px 24px oklch(0% 0 0 / 0.12)";
};
/** 타이포 스텝 해석값. RN Text 가 클래스 대신 style 로 넣어야 할 때 읽는다(C-19 (5) 분기). */
export declare const text: {
    readonly sm: {
        readonly fontSize: "14px";
        readonly lineHeight: "20px";
        readonly fontWeight: 400;
    };
    readonly md: {
        readonly fontSize: "16px";
        readonly lineHeight: "24px";
        readonly fontWeight: 400;
    };
    readonly lg: {
        readonly fontSize: "18px";
        readonly lineHeight: "28px";
        readonly fontWeight: 500;
    };
    readonly xl: {
        readonly fontSize: "20px";
        readonly lineHeight: "28px";
        readonly fontWeight: 600;
    };
    readonly "2xl": {
        readonly fontSize: "24px";
        readonly lineHeight: "32px";
        readonly fontWeight: 700;
    };
};
/** 폰트 패밀리. 폰트 파일은 동봉하지 않는다 — 로딩은 소비 프로젝트 책임(C-7b, AC-6c). */
export declare const fontFamily: {
    readonly sans: {
        readonly web: "\"Pretendard Variable\", Pretendard, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif";
        readonly native: "Pretendard";
    };
};
/**
 * tailwind-merge 설정. 웹·RN 이 extendTailwindMerge({ override: { theme: twMergeConfig } }) 로 쓴다.
 * override 여야 한다 — extend 는 기본 검증자에 concat 이라 spacing 의 기본 isNumber 가 남아
 * cn("mt-4", "mt-5") 가 mt-5 로 접히고 DS 기본 여백이 사라진다(plan v2 F-4).
 */
export declare const twMergeConfig: {
    color: string[];
    spacing: string[];
    radius: string[];
    shadow: string[];
    text: string[];
};
/** @theme inline 색 키 → :root 변수 이름. C-5b 공개 계약의 실체다. */
export declare const semanticVariables: {
    readonly canvas: "--bg-canvas";
    readonly surface: "--bg-surface";
    readonly "surface-muted": "--bg-surface-muted";
    readonly "surface-hover": "--bg-surface-hover";
    readonly brand: "--bg-brand";
    readonly "brand-hover": "--bg-brand-hover";
    readonly danger: "--bg-danger";
    readonly "danger-hover": "--bg-danger-hover";
    readonly overlay: "--bg-overlay";
    readonly fg: "--fg-default";
    readonly "fg-muted": "--fg-muted";
    readonly "fg-danger": "--fg-danger";
    readonly "fg-on-brand": "--fg-on-brand";
    readonly "fg-on-danger": "--fg-on-danger";
    readonly border: "--border-default";
    readonly "border-focus": "--border-focus";
};
/**
 * component 계층 recipe. 값은 스케일 키이며 클래스 조립은 컴포넌트 구현이 한다
 * (정적 리터럴이어야 @source 스캔이 잡는다 — C-4 (2)).
 */
export declare const component: {
    readonly badge: {
        readonly sm: {
            readonly paddingX: "2";
            readonly paddingY: "0";
            readonly text: "sm";
            readonly radius: "full";
        };
        readonly md: {
            readonly paddingX: "3";
            readonly paddingY: "1";
            readonly text: "sm";
            readonly radius: "full";
        };
    };
    readonly button: {
        readonly sm: {
            readonly paddingX: "3";
            readonly paddingY: "1";
            readonly text: "sm";
            readonly radius: "md";
            readonly gap: "1";
        };
        readonly md: {
            readonly paddingX: "4";
            readonly paddingY: "2";
            readonly text: "md";
            readonly radius: "md";
            readonly gap: "2";
        };
        readonly lg: {
            readonly paddingX: "6";
            readonly paddingY: "3";
            readonly text: "lg";
            readonly radius: "lg";
            readonly gap: "2";
        };
    };
    readonly card: {
        readonly padding: "4";
        readonly radius: "lg";
        readonly shadow: "sm";
    };
    readonly dialog: {
        readonly padding: "6";
        readonly radius: "lg";
        readonly shadow: "lg";
        readonly maxWidth: "max-w-md";
    };
    readonly drawer: {
        readonly padding: "6";
        readonly width: "max-w-sm w-full";
    };
    readonly icon: {
        readonly size: {
            readonly sm: 16;
            readonly md: 20;
            readonly lg: 24;
        };
    };
    readonly input: {
        readonly sm: {
            readonly paddingX: "3";
            readonly paddingY: "1";
            readonly text: "sm";
            readonly radius: "md";
        };
        readonly md: {
            readonly paddingX: "3";
            readonly paddingY: "2";
            readonly text: "md";
            readonly radius: "md";
        };
        readonly lg: {
            readonly paddingX: "4";
            readonly paddingY: "3";
            readonly text: "lg";
            readonly radius: "md";
        };
    };
    readonly textarea: {
        readonly rows: {
            readonly sm: 3;
            readonly md: 5;
            readonly lg: 8;
        };
    };
    readonly tooltip: {
        readonly paddingX: "2";
        readonly paddingY: "1";
        readonly text: "sm";
        readonly radius: "sm";
    };
};
//# sourceMappingURL=values.d.ts.map