# React 웹/앱 공통 디자인 시스템 스펙

## 이력

- 2026-09-01 작성. 19라운드 인터뷰 결과. 형제 프로젝트 6개에서 브라운필드 증거 수집
- 2026-09-05 R20 개정. C-3·C-15 반전, 관련 AC 재검증 필요
- 2026-09-05 R21 개정. 구현 전 검증 결과 반영. C-20·C-21 신설, AC-19 재작성, "알려진 동작(v1)" 신설. 결정 근거는 [decisions-r21.md](decisions-r21.md)
- 본문의 `R{n}`은 인터뷰 라운드 번호. 결정 근거는 문서 끝 트랜스크립트에서 추적
- 패키지명의 `@<scope>`는 npm 스코프 변수. 스코프 이름은 R21 보류 항목이며 확정 후 문자열 치환한다

### R20 개정 요약 (2026-09-05)

인터뷰 종료 후 스펙 리뷰 중 사용자가 R10의 `className` 완전 차단을 철회함. "이 버튼 하나만 배경색·크기·여백을 다르게" 같은 커스텀이 소비 프로젝트에서 가능해야 한다는 요구. 이에 따라:

- **C-15 반전**: `className` 허용. 웹은 Tailwind v4, RN은 NativeWind v5. 두 플랫폼이 같은 클래스 어휘를 씀
- **C-3 폐기·재작성**: "소비 프로젝트 Tailwind 불필요"는 성립 불가. 소비 프로젝트에 Tailwind v4 필수. DS는 토큰을 Tailwind `@theme`으로 배포
- **NativeWind 채택**: R12 기각 근거 3건 중 (3) 컴파일 CSS 배포는 className 허용으로 소멸, (1) preview 리스크는 감수, (2) 오버레이 분리는 유지. 컴포넌트 1본화는 여전히 하지 않음
- **AC-11·AC-15·AC-16·AC-17·AC-19·AC-20·AC-23 수정**, AC-24·AC-25 추가
- R12에서 닫힌 "스타일 전달 방식"이 다시 열림. 구현 착수 전 아래 미결 항목을 닫아야 함

R20 미결 (R21에서 처리):
1. DS 컴포넌트 기본 스타일과 소비자 `className` 병합 규칙 — `tailwind-merge` 사용 여부, RN에서의 대응물. **종결(R21)**: 웹·RN 양쪽 `tailwind-merge`, 설정은 토큰 빌드가 DS 키 목록으로 생성. C-15 참조
2. `@<scope>/web` 스타일 배포 형태 — 컴파일된 CSS + `@theme` 파일 vs 소비 프로젝트가 `@source`로 DS 패키지 스캔. **종결(R21)**: web 래퍼의 `@source "../dist"`. 컴파일된 CSS는 동봉하지 않는다. C-3 참조
3. `spot`의 Expo SDK 버전이 NativeWind v5 preview 요구 사양과 맞는지 확인. 안 맞으면 C-19 손절 기준과 무관하게 대체안 검토. **C-19 착수 게이트로 유지(R21)**

### R21 개정 요약 (2026-09-05)

R20 개정 스펙을 구현 전에 검증한 결과 모순·검증 불가·누락이 나와, 기술 확정안 5건(A-1~A-5)과 사람 결정 11건(B-1~B-11)을 확정함. 결정 근거·대안 비교·조합 검증 전문은 [decisions-r21.md](decisions-r21.md)에 있고 본문은 결과만 싣는다. 이에 따라:

- **C-3 종결**: 소비자 import 경로는 플랫폼 래퍼 `@<scope>/web/themes/<brand>.css`(웹) / `@<scope>/native/themes/<brand>.css`(RN). 래퍼가 내부 산출물 `@<scope>/tokens/themes/<brand>.css`를 import하고, web 래퍼는 `@source "../dist"`로 컴포넌트 클래스를 스캔. 컴파일된 CSS는 동봉하지 않음
- **C-15 병합 규칙 확정**: `tailwind-merge`를 웹·RN 양쪽에서 사용, 설정은 토큰 빌드가 DS 키 목록으로 생성. 승리 범위는 같은 유틸리티 그룹·같은 변형
- **어휘 봉쇄**: primitive는 `:root` 변수로만 존재하고 `@theme`에 넣지 않음. Tailwind 기본 팔레트·동적 spacing은 리셋. spacing은 희소 열거 `1,2,3,4,6,8,12,16,20,24` + `0`. 열거 외 키는 에러가 아닌 무효 — "알려진 동작(v1)" 소절 신설
- **계약 강제 수단 확정(C-17)**: export 맵 타입 동등성 테스트. `ref`는 `{ focus(); blur() }` 핸들. 플랫폼 전용 prop 0개, 콜백은 플랫폼 이벤트 인자 없음
- **Text 컴포넌트 추가**: 웹 12개(AC-7), RN 5개(AC-20). Button은 `label`이 가시 텍스트, `children` 없음. 전역 축 `variant` / `size` / `tone` 3개(C-8). `size`는 5단, 컨트롤은 `sm | md | lg` 부분집합
- **간격 prop 폐지(C-14)**: 토큰 값을 받는 prop이 없다. 간격은 `className` 전용. Stack/Box는 `direction` / `align` / `justify` / `wrap`만
- **제어 API 두 갈래(C-12)**: 값 입력은 `value` 3종, 오버레이는 `open` / `defaultOpen` / `onOpenChange`. 누름은 `onPress`, `onClick` 미노출
- **C-20 신설** 다크모드 hybrid. **C-21 신설** Form v1 범위(`<form>` + `preventDefault`, Enter 무동작). AC-19는 hybrid 기준으로 재작성
- **브랜드 실체**: v1 `base` + `bakery`, 앱당 1개 빌드타임 선택(C-5a)
- C-1·C-3·C-4·C-4a·C-5a·C-6·C-7·C-7a·C-7b·C-8·C-11·C-12·C-13·C-14·C-15·C-17·C-19 수정, C-20·C-21 신설. AC-3·5·6·6a·6b·7·8·9·10·11·11a·13·15·16·17·19·20·21·22·23·24·25 수정. 번호 유지, 삭제·재번호 없음
- R20 미결 1·2 종결, 3은 C-19 착수 게이트

R21 보류: npm 스코프 이름 1건(`@<scope>` 변수 유지). 착수 전 기술 확인(결정 아님): NativeWind v5 확인 항목 5건과 R20 미결 3은 C-19 게이트, web 래퍼 `@import "tailwindcss"`의 pnpm peer 해석은 C-3 참조

## Topology

최상위 컴포넌트 6개 중 4개 활성. docs·agent-native는 v2 보류. platform-adapter는 R6에서 보류됐다가 R11에서 축소 범위로 복귀.

| Component | Status | Description | Coverage / Deferral Note |
|-----------|--------|-------------|--------------------------|
| **tokens** | active | primitive → semantic → component 3계층 토큰. 플랫폼 무관 소스에서 웹·RN 양쪽 빌드 | AC-1 ~ AC-6 |
| **components** | active | Base UI 위에 자체 API로 재설계한 웹 컴포넌트 14개(R21: Text 추가) | AC-7 ~ AC-15 |
| **distribution** | active | npm 3패키지 배포. 새 프로젝트가 설치 즉시 화면 작성 시작 | AC-16 ~ AC-19, AC-24 |
| **platform-adapter** | active (축소) | RN 토큰 빌드 + NativeWind v5 + 핵심 컴포넌트 5개(R21: Text 추가) | AC-20 ~ AC-23, AC-25. RN 오버레이 컴포넌트는 v2 |
| docs | **deferred** | Storybook 등 문서·프리뷰 | v2 보류. 근거 — 사용자가 1인. Storybook 유지비가 편익을 초과 |
| agent-native | **deferred** | 클로드코드를 1순위 소비자로 삼는 MCP 조회·검증 레이어 | v2 보류. 근거 — npm 모델 채택으로 "생성 코드 교정" 역할이 사라지고 조회만 남았는데, 조회는 패키지의 `.d.ts`가 이미 수행 |

## Goal

React 프로젝트 전용 개인 디자인 시스템을 npm 패키지 3개로 만든다. 새 프로젝트를 시작할 때 shadcn 복붙·테마 세팅을 생략하고, Tailwind v4 설치와 CSS import 한 줄만으로 화면 작성을 시작할 수 있어야 한다.

토큰은 당근 Seed의 3계층 아키텍처(primitive → semantic → component)를 차용하되 브랜드는 자체 정의한다. 단일 토큰 소스에서 웹·NativeWind 공용 Tailwind `@theme`과 RN 런타임용 JS 객체를 각각 빌드한다.

컴포넌트는 Base UI 프리미티브 위에 자체 API 계약으로 재설계한다. 웹과 RN은 **토큰·계약 타입·클래스 어휘를 공유하고 구현은 분리**한다. 소비 프로젝트는 `className`으로 커스텀할 수 있다(웹 Tailwind / RN NativeWind). 드리프트 방지는 `className` 차단이 아니라 다음 두 가지로 한다 — (1) 컴포넌트 소스는 DS 레포에만 있어 복사본이 생기지 않고, (2) `className`에 쓰는 어휘가 DS 토큰에서 나온 Tailwind 테마이므로 커스텀도 토큰 범위 안에서 이뤄진다. 기존 5개 Next 프로젝트의 드리프트는 shadcn 코드 복사에서 왔지 `className` 자체에서 온 것이 아니라는 판단(R20).

v1에서 RN은 토큰 전량 + 핵심 컴포넌트 5개(Button / Input / Card / Stack / Text)까지. API 계약이 RN에서 실제로 성립하는지 검증하는 것이 목적이며, 오버레이 컴포넌트는 v2로 넘긴다.

## 패키지 구조

pnpm workspace 단일 레포. 공개 npm으로 publish.

```
design-system/                        pnpm workspace
└─ packages/
   ├─ tokens/    @<scope>/tokens
   │             ① JSON/DTCG 토큰 소스 (플랫폼 무관, 3계층)
   │             ② 컴포넌트 계약 타입 — `Contracts` 타입 맵 + `webComponents` / `nativeComponents` 키 목록
   │             ③ 빌드 산출물
   │               ├─ themes/<brand>.css   내부 산출물. `:root` 변수 + 다크 2셀렉터 + `@theme inline` + 리셋.
   │               │                       소비자가 직접 import하지 않는다
   │               ├─ JS 객체              RN 런타임 값 (Reanimated 등 className 밖에서 쓸 때)
   │               └─ twMergeConfig        DS 키 목록. 웹·RN 양쪽 `cn()` 설정
   ├─ web/       @<scope>/web     Base UI + Tailwind v4. 소비 프로젝트에 Tailwind v4 필수
   │             themes/<brand>.css   공개 경로. 토큰 파일 import + `@custom-variant dark` + `@source "../dist"`
   └─ native/    @<scope>/native  React Native + NativeWind v5. 소비 프로젝트에 NativeWind v5 필수
                 themes/<brand>.css   공개 경로. 토큰 파일 import
```

`@<scope>/tokens`는 이름보다 넓은 책임을 갖는다 — 토큰 **및** 계약 타입. 별도 `@<scope>/core`를 만들지 않은 이유는 양쪽이 이미 tokens에 의존하므로 패키지를 늘릴 이유가 없기 때문. 웹·RN 중 한쪽이 계약을 어기면 export 맵 타입 동등성 테스트가 깨진다(C-17).

Tailwind v4가 CSS-first 설정(`@theme`)이고 NativeWind v5가 같은 방식을 따르므로, 토큰 빌드 산출물 하나가 두 플랫폼의 클래스 어휘를 동시에 정의한다. `bg-brand` 같은 클래스가 웹과 RN에서 같은 semantic 토큰을 가리킨다. 소비자는 토큰 파일이 아니라 플랫폼 래퍼(`web/themes/`, `native/themes/`)를 import한다 — `@source`가 선언한 CSS 파일 기준 상대경로라 web 패키지 안에서만 web dist를 가리킬 수 있기 때문(C-3).

빌드 도구는 pnpm workspace만 사용한다. turborepo(빌드 캐시)·changesets(버전 자동화)는 실제로 아플 때 추가한다.

## Constraints

### 배포·소비
- C-1. 배포 형태는 **npm 패키지 3개**(`@<scope>/tokens`, `@<scope>/web`, `@<scope>/native`). shadcn식 코드 복사(CLI/레지스트리) 아님. 스코프 이름은 R21 보류 항목 — 확인 후 `@<scope>`를 문자열 치환
- C-2. 소비 프로젝트는 컴포넌트 소스를 수정하지 않는다. 수정은 DS 레포에서만
- C-3. **(R20 재작성, R21 종결)** 소비 프로젝트는 **Tailwind v4**(웹) / **NativeWind v5**(RN)를 갖춘다. DS는 토큰을 Tailwind `@theme` CSS로 배포하고, 소비 프로젝트는 이를 전역 CSS에서 import한다. 소비 프로젝트 측 설정은 이 import 한 줄까지로 제한한다 — `tailwind.config`나 PostCSS 설정 편집을 요구하지 않는다
  - import 대상은 플랫폼 래퍼다 — 웹 `@<scope>/web/themes/<brand>.css`, RN `@<scope>/native/themes/<brand>.css`. 래퍼가 `@<scope>/tokens/themes/<brand>.css`를 import한다. 토큰 파일 직접 import 경로는 공개하지 않는다(R21 B-7)
  - 컴포넌트 스타일 배포 형태(R20 미결 2, 종결): web 래퍼가 `@source "../dist"`로 web 패키지 자신의 컴포넌트를 스캔한다. 컴파일된 컴포넌트 CSS는 동봉하지 않는다. 근거 — `@source`는 선언한 CSS 파일 기준 상대경로이고 pnpm은 realpath로 해석하므로, 토큰 패키지 안의 파일에서는 web dist를 찾을 수 없다
  - 래퍼는 `@import "tailwindcss"`를 먼저 포함해 리셋 순서 실수를 원천 차단한다. 이 import가 pnpm에서 peer로 해석되는지는 착수 전 기술 확인(조건부)
  - 이전(R12): "컴파일된 CSS 배포, 소비 프로젝트 Tailwind 불필요". `className` 허용으로 성립 불가해져 폐기
- C-4. **RSC 대응**: 인터랙티브 컴포넌트는 `"use client"` 지시어를 붙여 배포한다. Next.js App Router에서 동작해야 하며, Vite 환경에서는 무해. Form도 대상이다 — `<form>`의 `onSubmit` 핸들러(`preventDefault`)를 갖는 인터랙티브 컴포넌트(R21, C-21)
- C-4a. 레포는 **pnpm workspace** 단일 레포(`packages/{tokens,web,native}`, 패키지명 `@<scope>/{tokens,web,native}`). 배포는 **공개 npm** — 비공개 레지스트리는 소비 프로젝트에 `.npmrc` 토큰 설정을 요구해 AC-16을 깨뜨리므로 채택하지 않는다. 스코프 이름은 미확정이며 `@<scope>` 변수로 표기한다

### 토큰
- C-5. 3계층 고정: primitive(`blue-500`) → semantic(`bg.brand`) → component(`button.bg.primary`)
- C-5a. **브랜드 축**: `Theme = brand × (light | dark)`. semantic 계층이 브랜드 주입점이며 브랜드별로 교체 가능하다. primitive·component 계층과 간격·타이포 스케일은 전 브랜드 공유. 근거 — 소비 프로젝트들의 도메인이 전부 다름(빵집 / 운세 / 사진 / 블로그 / 이력서)
  - **(R21)** 브랜드는 앱당 1개이며 빌드타임에 import 파일(`themes/<brand>.css`)로 선택한다. 런타임 브랜드 전환은 요구사항에 없고 범위 밖. v1 브랜드는 `base`(중립 기본. AC-16 / AC-17 / AC-19 / AC-23 검증 프로젝트가 import) + `bakery`(AC-6a 비교 대상. `base`와 semantic 색 토큰 값이 실제로 달라야 diff 검증이 의미를 가짐). 공개 계약은 브랜드명이 아니라 경로 규칙이다 — 브랜드 추가는 파일 추가라 소비자 무영향, 브랜드 이름 변경은 소비자 import 한 줄 수정
- C-6. **(R21 확장)** 토큰 소스는 플랫폼 무관 포맷(JSON / DTCG) **1본**. 빌드 산출물:
  - `@<scope>/tokens/themes/<brand>.css` — `:root` 변수(primitive 포함) + semantic 다크 오버라이드 2셀렉터(`.dark`, `@media (prefers-color-scheme: dark) { :root:not(.light) }`) + `@theme inline` 매핑 + 네임스페이스 리셋(`--color-*: initial`, `--spacing-*: initial`, radius·shadow·text 동일) + `--spacing-0: 0`. 내부 산출물이며 소비자가 직접 import하지 않는다
  - 플랫폼 래퍼 `@<scope>/web/themes/<brand>.css`, `@<scope>/native/themes/<brand>.css` — 빌드가 생성한다(브랜드당 2개). 소비자 공개 경로(C-3)
  - RN 런타임용 JS 객체
  - `twMergeConfig` — 색 키, spacing 키(열거 10개 + `0`), radius 키, text 크기 키, shadow 키. 웹·RN 양쪽이 `extendTailwindMerge(twMergeConfig)`로 병합한다(C-15). text 크기 키와 색 키 이름은 겹치면 안 된다
  - `Contracts` 타입 맵(`Size` / `TypographyStep` / `ControlSize` / `Tone` / `Variant` 포함)과 `webComponents` / `nativeComponents` 키 목록(C-17)
  - 타이포 스텝은 Tailwind v4 복합 폰트 크기 변수로 낸다 — `--text-<step>`, `--text-<step>--line-height`, `--text-<step>--font-weight`. `text-xl` 유틸리티 하나가 세 속성을 함께 적용한다. Tailwind 기본 `text-base`는 DS에서 `text-md`다
- C-7. 컴포넌트 구현은 **semantic 이상 계층만 참조**. primitive 직접 참조 금지 — 테마 교체가 깨지지 않도록. **(R21) 구조 강제**: primitive는 `:root` 변수로만 존재하고 `@theme`에 넣지 않는다. `bg-blue-500` 같은 클래스가 애초에 생성되지 않으므로 lint 없이 구조로 강제된다(AC-6)
- C-7a. **(R21 재작성) 스케일 어휘**: 간격은 4px 배수 숫자 키의 **희소 열거** `1,2,3,4,6,8,12,16,20,24`(= `4,8,12,16,24,32,48,64,80,96px`) + 영점 `0`. 간격 키는 `className` 어휘 전용이며 간격 값을 받는 prop은 없다(C-14). 열거 외 키는 클래스가 생성되지 않는 무효다(알려진 동작 1). 좁게 시작하고 밀집 단계는 나중에 추가한다. 컴포넌트 `size`는 t-shirt — 전역 `sm | md | lg | xl | 2xl`, 컨트롤(Button · Input · Textarea · Badge · ButtonGroup 등)은 `sm | md | lg` 부분집합, Text는 5단 전부를 타이포 스텝으로 쓴다(C-7b). 두 어휘를 의도적으로 분리한다 — 간격을 t-shirt로 두면 단계가 모자랄 때 `md-plus` 같은 이름이 생겨 무너지고, `size`를 숫자로 두면 무엇이 큰지 직관적이지 않다
  - 이전: "숫자 스케일(`1,2,3,4,6,8,12`…)". 열린 스케일을 희소 열거로 닫음(R21 B-2)
- C-7b. **폰트는 이름·스케일만 소유.** `fontFamily` 토큰과 크기·행간·무게 스케일은 DS가 갖되 실제 폰트 로딩은 소비 프로젝트 책임(웹 `next/font`, RN `expo-font`). 폰트 파일을 패키지에 동봉하지 않는다 — 무게와 라이선스가 따라온다. **(R21)** 크기·행간·무게 스케일은 Text의 타이포 스텝 하나로 묶여 소비된다 — component 계층 토큰 `text.<step> = { fontSize, lineHeight, fontWeight }`, `step = sm | md | lg | xl | 2xl`. 독립 `weight` prop은 없다. 소비자 `className="text-lg"`도 같은 스텝 의미를 갖는다
- C-7c. **아이콘은 이름 문자열로만 받는다.** `<Button icon="trash">`. DS가 내부에서 `lucide-react`(웹) / `lucide-react-native`(RN)로 분기하고, 색·크기는 토큰으로 결정한다. 아이콘 노드를 받으면 웹·RN 패키지 분기가 소비자에게 새어 나가고 계약 타입이 플랫폼별로 갈린다. R20에서 `className`을 열었지만 이 규칙은 유지 — 근거가 드리프트가 아니라 플랫폼 분기 은닉이기 때문

### 컴포넌트 API 계약 (8개 강제 규칙)
- C-8. **(R21 확장) variant / size / tone 어휘 전역 통일.** 전역 축은 3개 — `variant = primary | secondary | ghost | danger`(4개 고정), `size = sm | md | lg | xl | 2xl`, `tone = default | muted | danger`(Text의 강조 위계 축. 전역 어휘이며 값은 R21 제안. semantic 전경색 토큰 `fg.default` / `fg.muted` / `fg.danger`와 1:1). 모든 컴포넌트가 동일한 집합에서만 고름. 안 쓰는 값은 빼되 이름은 절대 다르게 짓지 않는다 — 부분집합은 `Extract`로 타입 고정한다(`ControlSize = Extract<Size, 'sm' | 'md' | 'lg'>`, `TypographyStep = Size`). 반대로 **다른 개념에 같은 이름을 강요하지 않는다**. `variant`와 `tone`의 `danger`는 같은 semantic 색(`color.danger`)을 가리키는 같은 개념이라 의도적으로 이름을 공유한다. 비활성 텍스트는 `tone`이 아니라 상태(`disabled`)다. 단 간격(spacing)은 C-7a에 따라 별도 숫자 어휘를 쓴다 — 통일 대상이 아니다
- C-9. **semantic 토큰만 참조** (C-7과 동일 규칙의 컴포넌트 측 표현)
- C-10. **다형성 prop 금지.** `as` / `render` / `asChild`를 core 계약에 노출하지 않는다. RN에 대응물이 없다. Base UI의 `render`는 `@<scope>/web` 내부 구현 디테일로만 사용
- C-11. **불리언 prop 대신 열거형.** `isPrimary`, `isDanger` 금지 → `variant`. 불리언은 조합 폭발을 만들고 두 플랫폼에서 우선순위가 갈린다. **(R21)** 예외는 `disabled` / `loading` 같은 기능 불리언뿐. 웹·RN 교차 어휘는 열거형으로 은닉하며, 열거형이라 예외가 아니다 — Input `kind = text | password | email | number`. 어댑터 매핑:
  - `text` → 웹 `type="text"` / RN 기본
  - `password` → 웹 `type="password"` / RN `secureTextEntry`
  - `email` → 웹 `type="email"` / RN `keyboardType="email-address"` + `autoCapitalize="none"`
  - `number` → 웹 `type="text"` + `inputMode="numeric"`(스피너 없는 쪽) / RN `keyboardType="numeric"`
  - 자동완성 힌트도 `kind`에서 파생한다(어댑터 세부, 계약 변경 없음) — 웹 `password` → `autoComplete="current-password"`, `email` → `autoComplete="email"`. RN `password` → `autoComplete="password"` + `textContentType="password"`, `email` → `autoComplete="email"` + `textContentType="emailAddress"`. `new-password`는 구분하지 않는다(알려진 동작 8)
- C-12. **(R21 확장) 제어 API 네이밍 고정.** 두 갈래 — 값 입력(Input · Textarea)은 `value` / `defaultValue` / `onValueChange`, 오버레이(Dialog · Drawer · Tooltip)는 `open` / `defaultOpen` / `onOpenChange`. 같은 3종 패턴이라 규칙 취지가 같고 Base UI 이름과 일치한다. `open`이 있으면 제어, 없으면 `defaultOpen`으로 시작. 누름 이벤트는 `onPress?: () => void`로 고정하고 `onClick`은 공개 prop에 없다 — 웹 어댑터가 `onClick`으로 매핑. `onChange`는 RN `TextInput`의 `onChangeText`와 혼동되므로 쓰지 않는다. `onChange` / `onClick` / `onToggle` 같은 DOM 이름은 계약 어디에도 없다. Input `value`는 `kind`와 무관하게 항상 `string`(RN `TextInput`이 문자열만 다루므로 `number`도 문자열). Form은 값이 없어 제어 컴포넌트가 아니다. 오버레이는 v1에 별도 `trigger` prop 없이 제어 API만 둔다 — 소비자가 `Button onPress`로 `open`을 토글. Tooltip은 앵커가 본질이라 `children`으로 앵커를 받는다(앵커 타입, Base UI `Trigger`의 `render` 내부 사용은 계획 단계)
- C-13. **(R21 재작성) 접근성 이름 보장 계약.** 인터랙티브 컴포넌트는 `label: string`을 필수로 받고, 어댑터가 접근성 이름을 보장한다. 타입 레벨에서 강제. 매핑:
  - Button: `label`이 가시 텍스트 겸 접근성 이름. `children` 없음. 아이콘 전용일 때만 `aria-label` / `accessibilityLabel`을 쓴다. WCAG 2.5.3(Label in Name) 위반 경로가 사라진다
  - Input: `label`은 `aria-label` / `accessibilityLabel`로만 간다. 가시 라벨은 `Label` 컴포넌트 조합. Input이 가시 라벨을 자동 렌더하는 변경은 나중에 추가적으로 가능
  - Dialog · Drawer: `aria-labelledby` 또는 `aria-label`
  - Tooltip: `label`이 표시 내용이자 접근성 설명
  - Text · Form은 비인터랙티브라 대상이 아니다
  - 이전: "웹은 `aria-label`, RN은 `accessibilityLabel`로 변환". Button 가시 텍스트를 `label`로 통합하며 "변환"에서 "보장"으로(R21 A-4)
- C-14. **(R21 재작성) 토큰 값을 받는 prop이 없다.** 계약 전체에 `number` 타입 prop이 없고(`padding={16}` 같은 prop 자체가 존재하지 않는다), 색 의도를 받는 prop(`variant`, `tone`)은 enum 키만 받는다(`tone="#333"`은 타입 에러). 간격은 `className` 전용(C-7a) — Stack / Box에 `gap` · `padding` prop 없음. `className` 안의 임의값(`bg-[#333]`, `mt-[13px]`)은 타입·구조 어느 쪽으로도 막지 못한다 — 이는 C-15의 의도된 탈출구
  - 이전: "`padding={16}`, `color="#333"`을 타입으로 차단하고 토큰 키만 받는다". 숫자 키 prop은 `padding={16}`이 64px가 되는 혼동을 낳고, 문자열 리터럴 키 `gap="4"`는 채널이 2개가 되어 나중에 제거하면 소비자 파괴. prop 자체를 두지 않는 쪽으로 재작성(R21 A-5)
- C-15. **(R20 반전, R21 확정) `className` 허용.** 전 컴포넌트가 `className?: string`을 받는다. 웹은 Tailwind v4, RN은 NativeWind v5로 해석하며 어휘는 `@<scope>/tokens`가 빌드한 `@theme`에서 나온다. 규칙:
  - `className`이 **유일한** 커스텀 채널. 웹 `style`, RN `style` prop은 열지 않는다 — 두 플랫폼 어휘를 하나로 유지하기 위해. **어휘 봉쇄**로 "유일"이 문자 그대로 성립한다: Tailwind 기본 팔레트(`--color-*: initial`)와 동적 spacing(`--spacing-*: initial`)을 리셋하고 primitive는 `@theme`에 넣지 않으므로(C-7), `className`에 쓸 수 있는 클래스는 DS 토큰 어휘뿐이다(임의값 제외, C-14)
  - 소비자 `className`은 DS 기본 스타일과 **병합**되며 충돌 시 소비자가 이긴다. 병합은 웹·RN 양쪽 `tailwind-merge`이며 설정은 토큰 빌드가 DS 키 목록으로 생성한다(C-6 `twMergeConfig`). 양쪽이 `extendTailwindMerge(twMergeConfig)`로 `cn(base, className)` 한다. spacing 검증자를 DS 키 목록으로 두는 이유 — 기본 `isNumber`면 `cn('mt-4', 'mt-5')`에서 존재하지 않는 `mt-5`가 `mt-4`를 밀어내 DS 기본 여백까지 사라진다. 키 목록이면 `mt-5`는 spacing 그룹으로 인식되지 않아 둘 다 남고 `mt-4`가 적용된다. `text-*`의 크기/색 모호성은 크기 키 목록으로 해소된다
  - 승리 범위는 **같은 유틸리티 그룹·같은 변형**에 한정한다. `hover:bg-*`는 `bg-danger`로 덮이지 않는다. RN에는 hover가 없으므로 "웹·RN 동일 동작"은 정지 상태에 한정한다
  - 탈락: 웹 캐스케이드 레이어(RN은 어차피 twMerge라 메커니즘이 2개), `!important` 자동 부여(중첩 합성 파괴)
  - 간격 값을 받는 prop이 없으므로(C-14) "prop은 유한, className은 무한" 불일치 자체가 없다. 간격 어휘는 `@theme` 한 곳
  - 레이아웃 컴포넌트(Stack/Box)는 유지. 배치의 1순위 수단이나 강제는 아니다. API는 `direction` / `align` / `justify` / `wrap`뿐
  - 이전(R10): "완전 차단, 배치는 Stack/Box로만". 사용자가 "버튼 하나만 배경색·크기·여백 다르게"가 불가능한 것을 확인하고 철회

### 기반
- C-16. 헤드리스 프리미티브는 **Base UI** (Radix 아님). DOM 전용이므로 `@<scope>/web`에만 적용. shadcn 코드는 참고 자료로만 쓰고 API는 따르지 않는다
- C-17. **(R21 강제 수단 확정)** `@<scope>/web`과 `@<scope>/native`는 **동일한 prop 시그니처**를 갖되 구현을 공유하지 않는다. 계약 타입은 `@<scope>/tokens`에 단일 정의(`Contracts` 타입 맵 + `webComponents` / `nativeComponents` 키 목록)로 두고 양쪽이 그것을 구현한다. 사람 규율에 맡기지 않는다. 강제 수단:
  - 각 패키지가 export 맵 전체를 타입 동등성 테스트 1개로 검사한다 — `expectTypeOf<typeof components>().toEqualTypeOf<{ [K in NativeKeys]: FC<Contracts[K]> }>()`. 추가·제거·누락 컴포넌트가 전부 걸린다. CI에 `vitest --typecheck`
  - `ref`는 플랫폼별 엘리먼트 대신 `Ref<{ focus(): void; blur(): void }>` 핸들로 계약에 포함한다. 핸들에서 DOM 노출로 넓히는 변경은 소비자 무영향(추가적)이고 반대는 파괴적이다
  - 플랫폼 전용 prop은 0개. 웹·RN 차이는 계약의 열거형 교차 어휘로 흡수한다(Input `kind`, C-11)
  - 콜백은 플랫폼 이벤트 인자를 받지 않는다 — `onPress: () => void`, `onOpenChange: (open: boolean) => void`. 웹 `MouseEvent`와 RN `GestureResponderEvent`가 달라 계약에 넣을 수 없다. 나중에 교차 인자를 추가하는 변경은 소비자 콜백이 인자를 무시해도 할당 가능하므로 추가적이다
  - 계약은 tokens에 놓이고 웹 전용 컴포넌트(오버레이 · Form)의 v1 구현자는 web뿐. RN v2가 같은 계약을 구현하면 맵 테스트가 그대로 대칭을 검사한다
  - 탈락: `implement<Contract>()` 래퍼 — 감지가 아니라 은닉이고 우회를 막으려면 custom lint가 추가된다. `satisfies` + 생성 `.d.ts` — 레포 안에서는 안 걸리고 codegen 단계가 늘어난다
- C-18. 기존 5개 Next 프로젝트 마이그레이션은 성공 기준이 아니다. 부수 효과로만 취급
- C-19. **(R20 신설) RN 스타일 엔진은 NativeWind v5.** 2026-09-05 기준 preview이며 latest 승격 진행 중. 승격 전까지는 검증된 preview 버전을 `@<scope>/native`와 `spot`에 동일하게 정확한 버전으로 고정(`^` 없이)하고, 승격 후 한 번만 올린다. StyleSheet 직접 사용은 NativeWind로 표현 불가한 경우(Reanimated 값 등)에 한정하며, 그때도 색·간격은 `@<scope>/tokens`의 JS 객체에서 읽는다
  - **선택 근거**: 웹 소비처가 전부 Tailwind v4이고, v4·NativeWind v5가 같은 `@theme` CSS를 읽으므로 토큰 빌드 산출물이 1본이 된다. NativeWind v4(Tailwind v3)를 쓰면 지금은 안전하나 승격 시점에 RN 재작성이 확정 비용으로 남는다
  - **손절 기준**: `@<scope>/native` 구현 착수 후 2주 안에 preview 버그로 AC-20의 5개 컴포넌트 중 하나라도 완성 불가하면 대체안으로 전환한다. 대체안 — 웹은 Tailwind v4 유지, RN만 Tailwind v3 + NativeWind v4. 토큰 빌드를 `@theme` CSS와 `tailwind.config.js` 두 갈래로 내고, 내장 유틸리티 차이(shadow·ring·border 기본값 등)를 문서화한다. 전환 시 C-3·AC-3·AC-25 수정 필요
  - **(R21) 착수 게이트**: `@<scope>/native` 구현 착수 전에 NativeWind v5에서 다음 5건을 확인한다 — (1) `@theme inline`, (2) `.dark` 루트 셀렉터, (3) `@source`, (4) `:root:not(.light)`, (5) `--text-*--line-height` / `--text-*--font-weight` 복합 폰트 변수. R20 미결 3(`spot`의 Expo SDK 버전이 NativeWind v5 preview 요구 사양과 맞는지)도 이 게이트에 편입한다. 안 맞으면 손절 기준과 무관하게 대체안 검토
  - (5) 복합 폰트 변수 미지원 시 RN Text 어댑터가 `@<scope>/tokens` JS 객체에서 fontSize · lineHeight · fontWeight 세 값을 읽어 `style`로 넣는다 — 위 "NativeWind로 표현 불가한 경우" 예외에 해당
- C-20. **(R21 신설) 다크모드 전략 hybrid.** 루트 엘리먼트에 `.dark` / `.light` 클래스가 있으면 클래스가 OS 설정보다 우선하고, 없으면 OS `prefers-color-scheme`을 따른다
  - 웹 래퍼(`@<scope>/web/themes/<brand>.css`)가 `@custom-variant dark`를 선언한다:
    ```css
    @custom-variant dark {
      &:where(.dark, .dark *) { @slot; }
      @media (prefers-color-scheme: dark) {
        &:where(:not(.light, .light *)) { @slot; }
      }
    }
    ```
  - 토큰 파일(`tokens/themes/<brand>.css`)의 semantic 다크 오버라이드도 같은 두 셀렉터로 낸다 — `.dark { … }`와 `@media (prefers-color-scheme: dark) { :root:not(.light) { … } }`(동일 값). 두 브랜드 파일 모두 이 블록을 갖는다
  - next-themes는 해석된 테마를 `light` / `dark` 클래스로 루트에 쓴다. 클래스가 있으면 클래스가 이기고, 없으면(Vite 검증 프로젝트, 코드 0줄) OS를 따른다
  - RN은 NativeWind `dark:`가 기본으로 시스템 색 구성표를 따르고 수동 전환 API로 덮을 수 있으므로 본질적으로 hybrid다. 토큰 파일의 `.dark` / `:root:not(.light)` 셀렉터를 NativeWind v5가 무시하거나 지원하는지는 C-19 게이트 (2)·(4)
  - class 단독 대비 hybrid는 상위집합이라 되돌리기는 쉽다. 검증은 AC-19
- C-21. **(R21 신설) Form v1 범위.** 레이아웃 + `Label` 연결 + 오류 텍스트 표시(`Text tone="danger"` 또는 Base UI `Field.Error`). 계약은 `children: ReactNode`(웹 전용이라 허용) + `className`. submit 개념 없음. react-hook-form 미도입 — RN Form이 v2라 계약 대칭을 v1에서 검증할 수 없다
  - 웹은 `<form onSubmit={e => e.preventDefault()}>`를 렌더한다. 계약에 `onSubmit` prop은 없다. `div` + `role="form"` 불채택 — 브라우저 비밀번호 자동완성·저장 제안은 `<form>` 안의 `type="password"` 기준으로 동작하고, AC-16 검증 화면이 로그인이라 `div`는 검증 자체를 약화시킨다
  - 웹 Button은 `<button type="button">`을 항상 명시한다. 기본값 `submit`이면 `<form>` 안의 Button이 Enter 키 암묵적 제출 대상이 되어 `onPress`가 실행된다. Button에 `type="submit"` 개념은 없다
  - **v1에서 Enter는 아무 동작도 하지 않는다**(알려진 동작 5). 로그인 폼은 텍스트 필드가 2개이고 submit 버튼이 없어 HTML 암묵적 제출 규칙상 Enter가 제출을 일으키지 않고, 필드가 1개인 폼은 암묵적 제출이 일어나지만 `preventDefault`로 막힌다. 제출은 `Button onPress`에서 소비자 코드가 처리한다
  - Base UI `Form` / `Field`를 내부 기반으로 쓰되 submit 경로는 열지 않는다. Dialog 안의 Form도 동일
  - `"use client"` 대상이다(C-4)
  - RN Form은 v2. 착수 시 같은 계약으로 대칭을 검증한다(C-17 맵 테스트)

### 알려진 동작(v1)

R21에서 수용한 동작이다. 나중에 버그로 재발견되지 않게 여기 남긴다. 근거는 [decisions-r21.md](decisions-r21.md) D · G.

1. 리셋된 네임스페이스(spacing·color·text·radius·shadow)에서 열거 외 키(`mt-5`, `mt-17`, `text-base`, `bg-red-500`)는 클래스가 생성되지 않는다. 에러가 아니라 무효다. DS 기본값은 twMerge가 DS 키 목록으로 동작하므로 미등록 키에 밀려나지 않는다.
2. 96px을 넘는 고정 폭·높이 유틸리티(`w-64` 등)는 없다. `w-full`, `max-w-*`, 임의값 `w-[320px]`을 쓴다.
3. 임의값 `bg-[#333]`, `mt-[13px]`은 타입·구조 어느 쪽으로도 막지 않는다. 의도된 탈출구다(C-14).
4. 소비자 `className`은 같은 유틸리티 그룹·같은 변형만 덮는다. `hover:bg-*` 같은 상태 변형은 `bg-danger`로 덮이지 않는다. RN에는 hover가 없다.
5. Form v1은 submit을 다루지 않는다. `<form>`을 렌더하되 `onSubmit`은 항상 `preventDefault`이고, 웹 Button은 `type="button"`이다. **v1에서 Enter는 아무 동작도 하지 않는다.** 제출은 Button `onPress`에서 소비자가 처리한다.
6. Text는 문자열만 받는다. 문장 중간 서식(부분 굵게, 인라인 링크)은 v1 범위 밖이다. 무게는 `size` 스텝이 정하며 독립 `weight` prop은 없다.
7. Button은 `label` 문자열만 렌더한다. 아이콘은 `icon` prop, 로딩은 `loading` prop으로만 표현한다.
8. Input의 자동완성 힌트는 `kind`에서 파생된다(`password` → `current-password`). 가입 화면의 `new-password`는 v1에서 구분하지 않는다.

## Non-Goals

- **웹·RN 컴포넌트 코드 1본화** — NativeWind v5는 R20에서 채택했으나 1본화는 여전히 하지 않는다. 근거: (1) Base UI가 DOM 전용이라 오버레이 컴포넌트는 1본화 불가, (2) 스타일만 다른 10개(R21: Text 추가)도 v1에서는 분리 구현으로 계약 타입 강제(C-17)가 실제로 작동하는지 먼저 검증. 1본화는 v2 후보
  - R12 기각 근거였던 "컴파일된 CSS 배포가 막힌다"는 `className` 허용으로 소멸. "Tailwind v3/v4 충돌"은 NativeWind v5 채택으로 해소(단 preview 리스크 감수)
- v1에서 RN 오버레이 컴포넌트(Dialog / Drawer / Tooltip / Form) 구현 — 웹은 Portal + Floating UI, RN은 Modal + Reanimated로 동작이 근본적으로 다름. v2
- Storybook 등 문서 사이트
- MCP 서버 / 에이전트 전용 레이어
- 자체 CLI 또는 shadcn 호환 레지스트리 (R4에서 기각)
- 의도 기반 빌드타임 컴파일러 (Round 0 후속에서 기각 — 클로드코드가 이미 그 번역을 더 많은 컨텍스트로 수행)
- 레퍼런스 DS에서 API 규약·아이콘 시스템 차용 (토큰 아키텍처와 크로스플랫폼 분리 방식만 차용)
- 기존 5개 Next 프로젝트의 일괄 마이그레이션
- 웹 컴포넌트 30개 전량 이식 (실측상 반복 사용은 11개)
- 특정 프레임워크 종속 — Next.js는 검증 환경일 뿐 설계 기준이 아니며 Vite 프로젝트도 동일하게 지원

## Acceptance Criteria

### tokens
- [ ] AC-1. 토큰 소스가 단일 플랫폼 무관 파일(JSON/DTCG)로 존재한다
- [ ] AC-2. primitive / semantic / component 3계층이 파일 구조와 네이밍으로 구분된다
- [ ] AC-3. **(R21 수정)** 빌드 스크립트가 소스에서 Tailwind v4 `@theme` CSS(`@<scope>/tokens/themes/<brand>.css`)를 생성하고, web 래퍼(`@<scope>/web/themes/<brand>.css`)와 native 래퍼(`@<scope>/native/themes/<brand>.css`)가 같은 토큰 파일을 import한다. 웹 Tailwind와 NativeWind v5는 각자의 래퍼를 통해 같은 어휘를 읽는다
- [ ] AC-4. 빌드 스크립트가 같은 소스에서 RN 런타임용 JS 객체를 생성한다
- [ ] AC-5. **(R21 수정)** semantic 토큰 한 줄을 바꾸면 웹·RN 양쪽에 동시에 전파된다. 검증 = 빌드 스냅샷(CSS 변수 + JS 객체). `className`으로 쓴 커스텀 클래스에도 전파된다 — `@theme inline`이 `var()`를 참조하므로 구조로 보장되며 별도 테스트 대상이 아니다
- [ ] AC-6. **(R21 수정)** 컴포넌트 소스 어디에도 primitive 토큰 직접 참조가 없다. 강제 = primitive가 `@theme`에 없어 `bg-blue-500` 같은 클래스가 생성되지 않는 구조(C-7) + probe 컴파일 테스트(`bg-red-500` 등 primitive 클래스를 DS 테마로 컴파일해 출력이 비어 있음을 확인)
  - 이전: "lint 규칙으로 강제". DS 레포 내부 미등록 클래스 lint는 운영 사항이며 AC가 아니다. 소비 프로젝트용 lint는 선택 사항으로 문서화(C-3 "import 한 줄까지" 유지)
- [ ] AC-6a. **(R21 수정)** 브랜드를 교체하면 semantic 색 토큰만 바뀌고 간격·타이포·component 계층은 그대로다. 검증 = `base` vs `bakery` 빌드 결과 diff에서 semantic 색 변수만 다름을 확인
- [ ] AC-6b. **(R21 수정)** 간격 토큰이 4px 배수 숫자 키의 열거 `1,2,3,4,6,8,12,16,20,24` + 영점 `0`으로 정의된다. 열거 외 키는 클래스가 생성되지 않는다(probe 테스트: `mt-5`, `mt-17`, `w-64`가 출력 없음). 이는 에러가 아닌 무효이며 v1 알려진 동작이다. 컴포넌트 `size`는 전역 `sm|md|lg|xl|2xl`, 컨트롤은 `sm|md|lg` 부분집합으로 정의된다
- [ ] AC-6c. `fontFamily` 토큰이 존재하고, 패키지에 폰트 파일이 동봉되지 않는다

### components (`@<scope>/web`)
- [ ] AC-7. **(R21 수정)** 다음 12개가 구현된다: `Button` `Input` `Textarea` `Label` `Card` `Badge` `Tooltip` `Dialog` `Drawer` `Form` `ButtonGroup` `Text`
  - `Text` 계약: `children: string`(string 전용, RN 안전), `tone?: Tone`, `size?: TypographyStep`, `className?`. 비인터랙티브라 `label` 없음. `children: ReactNode`는 계약이 같아도 런타임이 갈려(`<span>`이 RN에서 크래시) 타입으로 못 막으므로 불채택. string에서 node로 넓히는 변경은 추가적
- [ ] AC-8. **(R21 수정)** 레이아웃 프리미티브 `Stack` `Box`가 구현된다. API는 `direction` / `align` / `justify` / `wrap`. `gap` · `padding` 등 간격 prop 없음 — 간격은 `className`(C-14)
- [ ] AC-9. **(R21 수정)** 전 컴포넌트가 동일한 `variant` 집합(`primary | secondary | ghost | danger`)과 `tone` 집합(`default | muted | danger`)에서만 고른다 (타입으로 강제). 컴포넌트별 부분집합은 빼되 이름은 바꾸지 않는다(Badge가 `ghost`를 안 쓰면 뺌). 검증 = C-17 export 맵 타입 동등성 테스트
- [ ] AC-10. **(R21 수정)** 전 컴포넌트가 전역 `Size`(`sm | md | lg | xl | 2xl`)에서 고르고, 컴포넌트별 부분집합이 타입으로 고정된다(`ControlSize = sm | md | lg`). Text만 5단 전부(`TypographyStep`). 검증 = C-17 맵 테스트
- [ ] AC-11. **(R20 반전, R21 수정)** 전 컴포넌트가 `className?: string`을 받고, 소비자 클래스가 DS 기본 클래스와 충돌하면 소비자가 이긴다 (예: `variant="primary"`에 `className="bg-danger"`를 주면 배경이 danger). 승리 범위는 같은 유틸리티 그룹·같은 변형(C-15). 웹·RN 동일 동작은 정지 상태에 한정. 검증 3계층 — 단위: 병합 문자열 · `toHaveClass`. 웹 통합: Playwright computed style을 토큰 JS 값과 비교. RN: NativeWind가 테스트 환경에서 className을 style로 해석하면 `toHaveStyle`, 안 되면 className prop 스냅샷으로 격하(AC-25)
- [ ] AC-11a. **(R21 수정)** 어떤 컴포넌트도 `style` prop을 받지 않고, `{...rest}` 스프레드로 미지 prop을 통과시키지 않는다 (타입 테스트로 검증). `className`이 유일한 커스텀 채널
- [ ] AC-12. 어떤 컴포넌트도 `as` / `render` / `asChild`를 공개 prop으로 노출하지 않는다
- [ ] AC-13. **(R21 재작성)** 제어 API가 두 갈래로 고정된다. 값 입력 컴포넌트(Input · Textarea)는 `value` / `defaultValue` / `onValueChange`만, 오버레이(Dialog · Drawer · Tooltip)는 `open` / `defaultOpen` / `onOpenChange`만 노출한다. Button · ButtonGroup은 `onPress`만, `onClick` 없음. `onChange` / `onToggle` 같은 DOM 이름은 어디에도 없다. Form은 값이 없어 대상 밖. 검증 = C-17 맵 테스트
- [ ] AC-14. 인터랙티브 컴포넌트에서 `label` 누락 시 타입 에러가 난다
- [ ] AC-15. **(R21 재정의)** 계약 전체에 `number` 타입 prop이 없고, 색 의도를 받는 prop(`variant`, `tone`)은 enum 키만 받는다 (`tone="#333"`은 타입 에러). mapped type 테스트 1개로 검증. `className` 문자열 내부는 검사 대상이 아니다
  - 이전: "`padding={16}`, `color="#333"`이 타입 에러". 해당 prop이 존재하지 않는 쪽으로 재정의(C-14)
- [ ] AC-15a. 아이콘을 받는 컴포넌트가 `icon="이름"` 문자열만 받고, 잘못된 이름은 타입 에러가 난다. 아이콘 노드(`icon={<Trash />}`)는 타입에서 거부된다

### distribution
- [ ] AC-16. **(R20 수정, R21 구체화) 부트스트랩 검증**: Tailwind v4가 설치된 빈 Next.js 프로젝트에 `@<scope>/web`을 설치하고, 전역 CSS에 `@import "@<scope>/web/themes/base.css"` 한 줄을 추가한 뒤, 로그인 화면 하나를 DS 컴포넌트만으로 작성해 정상 렌더된다. `tailwind.config`·PostCSS 설정 편집은 없어야 한다
  - 화면 구성: `Form` > (`Label` + `Input kind="email"`), (`Label` + `Input kind="password"`), `Text tone="danger"`(오류), `Button variant="primary"`. 제출은 Button `onPress`에서 소비자 코드가 처리. Enter는 무동작(알려진 동작 5)
  - 확인 항목: 렌더 + 비밀번호 필드에 브라우저 자동완성 제안이 뜬다(`<form>` + `kind` 파생 힌트, C-21)
  - 이전: "설정 파일 편집 없이". Tailwind v4 필수화로 import 한 줄까지 허용
- [ ] AC-17. **(R21 수정)** Vite + Tailwind v4 프로젝트에서도 AC-16과 같은 경로·브랜드(`@<scope>/web/themes/base.css`)로 동일 화면이 렌더된다 (프레임워크 비종속 검증). 다크는 코드 0줄로 OS 추종을 확인(AC-19 a)
- [ ] AC-18. 타입 정의(`.d.ts`)가 함께 배포되어 IDE·클로드코드가 prop 시그니처를 읽을 수 있다
- [ ] AC-19. **(R21 재작성)** 다크모드가 AC-16의 import 한 줄 외 추가 설정 없이 hybrid로 동작한다.
  - (a) 루트 엘리먼트에 `.dark` / `.light` 클래스가 없으면 OS `prefers-color-scheme`을 따른다. Vite 검증 프로젝트에서 코드 0줄로 확인.
  - (b) 루트에 `.dark` 또는 `.light` 클래스가 있으면 클래스가 OS 설정보다 우선한다. Next.js 검증 프로젝트에서 next-themes로 확인.
  - (c) RN은 시스템 색 구성표를 따르며 NativeWind의 수동 전환 API로 덮을 수 있다.
  - 검증: 웹은 Playwright `emulateMedia({ colorScheme })` × 루트 클래스 유무 4조합에서 semantic 배경색 computed style을 토큰 값과 비교. RN은 `Appearance` 모킹 2조합. 브랜드는 `base`.
- [ ] AC-24. **(R20 신설, R21 수정) 커스텀 검증**: AC-16 화면에서 버튼 하나에 `className`으로 배경색·여백을 바꾸면 그 버튼만 바뀌고 다른 버튼은 그대로다. 사용한 클래스는 DS `@theme` 어휘(`bg-danger`, `mt-6` 등 — `mt-6`은 열거 안의 키)여야 한다. 전제: 어휘 봉쇄(C-15)로 `@theme` 밖의 클래스는 애초에 생성되지 않는다

### platform-adapter (`@<scope>/native`)
- [ ] AC-20. **(R21 수정)** `Button` `Input` `Card` `Stack` `Text` 5개가 RN + NativeWind v5로 구현된다
- [ ] AC-21. **(R21 수정)** 이 5개의 prop 시그니처가 `@<scope>/web`과 완전히 일치한다. `@<scope>/tokens`의 계약 타입을 양쪽이 구현하며, `ref` 핸들(`{ focus(); blur() }`)도 계약에 포함된다. 검증 = export 맵 타입 동등성 테스트(C-17). 한쪽에만 prop을 추가하거나 컴포넌트를 빠뜨리면 테스트가 깨진다 (실제로 깨지는지 확인)
- [ ] AC-22. **(R21 수정)** `label`이 RN에서 접근성 이름이 된다 — Button은 `label`이 가시 텍스트이자 `accessibilityLabel`, Input은 `accessibilityLabel`만(가시 라벨은 `Label` 조합)
- [ ] AC-23. **(R20 수정, R21 수정) 크로스플랫폼 검증**: `spot`(Expo)에 NativeWind v5와 `@<scope>/native`를 설치하고 `@<scope>/native/themes/base.css`를 import해 화면 하나를 DS 컴포넌트만으로 작성한다(제목·오류 텍스트는 `Text`). 웹 프로젝트와 같은 색·간격이 나온다
- [ ] AC-25. **(R20 신설, R21 수정)** AC-24와 같은 `className` 문자열을 RN 버튼에 주면 같은 시각 결과가 나온다. 웹·RN 클래스 어휘 일치 검증. NativeWind가 테스트 환경에서 className을 style로 해석하지 못하면 className prop 스냅샷으로 격하하고, 시각 결과는 수동 확인으로 명시한다

## Assumptions Exposed & Resolved

| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| AI 기능 = 코드를 생성해주는 것 | 프론트 화면을 전부 클로드코드가 쓰는데, 빌드타임 AI 번역기가 왜 또 필요한가? | 의도 기반 컴파일러(E) 기각. AI 레이어는 "에이전트가 1순위 소비자인 DS"로 재정의 → 이후 v2 보류 |
| 웹·앱 컴포넌트 코드를 공유해야 한다 | Tailwind와 RN StyleSheet 사이 공유 비용 vs 편익 | 토큰만 공유. 컴포넌트 구현은 플랫폼별 분리. R20에서 클래스 어휘도 공유 대상에 추가됐으나 구현 분리는 유지 |
| shadcn처럼 코드 복사 모델이 맞다 | shadcn이 복사를 택한 이유는 사용자가 백만 명의 낯선 사람이라서다. 사용자가 1인이면 그 장점이 안 살아남는다. 그리고 지금 5개 프로젝트 드리프트가 정확히 복사 모델의 결과물 | npm 패키지로 전환 |
| 자체 CLI가 필요하다 | 클로드코드는 파일 복사를 할 줄 안다. shadcn CLI는 이미 커스텀 레지스트리를 지원한다 | npm 채택으로 자연 소멸 |
| Seed를 따라가려면 vanilla-extract를 써야 한다 | 토큰 아키텍처와 구현 기반은 직교한다. 3계층은 CSS 변수로 그대로 구현된다 | 토큰 계층만 차용, 구현 기반은 독립 결정 |
| 6개 컴포넌트를 다 만들어야 한다 | 성공 기준이 "새 프로젝트 부트스트랩"인데 docs·agent-native가 거기 기여하는 바가 없다 | docs·agent-native만 v2 보류. platform-adapter는 R11에서 복귀 |
| shadcn 컴포넌트 30개가 필요하다 | 5개 프로젝트에 308개 파일이 설치됐는데 반복 import는 11개뿐 (실측) | v1 = 11개 + 레이아웃 2개 |
| `className`은 열어둬야 급할 때 때운다 | 열려 있으면 "모든 컴포넌트가 DS를 거쳐감"이 말뿐이 된다. 드리프트의 밸브 | R10: 완전 차단. **R20: 반전** — 사용자가 "버튼 하나만 배경·크기·여백 다르게"가 불가능함을 확인하고 철회. 드리프트 원인은 shadcn 코드 복사였지 `className`이 아니라고 재판단. 허용하되 어휘는 DS `@theme`에서 나오게 함 |
| `className`을 열면 컴파일된 CSS 배포가 가능하다 | 소비자가 Tailwind 클래스를 쓰려면 소비 프로젝트에 Tailwind가 있어야 하고, DS 기본 클래스와 병합하려면 어휘가 같아야 한다 | C-3 폐기. 소비 프로젝트 Tailwind v4 필수. DS는 `@theme`을 배포해 어휘를 통일 (R20) |
| Next.js가 설계 기준이다 | DS는 React 라이브러리이므로 프레임워크 무관이어야 한다. Next는 소비처 다수라 검증 환경으로 골랐을 뿐 | 프레임워크 비종속 명시(AC-17). 단 RSC `"use client"` 제약은 실재하므로 C-4로 추가 |
| NativeWind로 컴포넌트를 1본화할 수 있다 | NativeWind 안정판이 Tailwind v3만 지원하는데 기존 웹 5개가 v4. Base UI는 DOM 전용이라 오버레이는 어차피 분리. 클래스 런타임 변환 때문에 컴파일 CSS 배포가 막혀 AC-16이 깨짐 | R12: 기각. **R20: NativeWind v5 채택** — `className` 허용으로 컴파일 CSS 근거 소멸, preview 리스크 감수. 단 1본화는 여전히 안 함(오버레이 분리 + 계약 강제 검증 우선) |
| RN은 v2로 미뤄도 된다 | 사용자가 v1 요구사항으로 명시 | platform-adapter 활성 복귀. 단 오버레이 4개는 v2로 분리 |
| 3계층 토큰 구조를 정했으니 tokens는 명확하다 | 구조만 있고 실제 값이 한 줄도 없다. 그리고 소비 프로젝트 도메인이 전부 다른데(빵집/운세/사진/블로그/이력서) `Theme` 엔티티에 브랜드 축이 없다 | 브랜드 축 추가 — `Theme = brand × (light\|dark)`. semantic 계층이 주입점 |
| 어휘를 하나로 통일하는 게 좋다 | 간격을 t-shirt 6단계로 두면 "8과 16 사이 12" 상황에서 `md-plus` 같은 이름이 생겨 무너진다. 레퍼런스 DS들도 spacing과 size 어휘를 분리해 운영한다 | 간격=숫자(4px 배수), size=t-shirt로 의도적 분리. C-8에 예외 명시 |
| 계약 일치는 규율로 지킬 수 있다 | 웹에만 prop 하나 추가하면 계약이 깨지고 아무도 모른다. AC-21이 검증 불가능한 AC였다 | 계약 타입을 `@<scope>/tokens`에 단일 정의. 어기면 컴파일 에러. R21: 강제 수단을 export 맵 타입 동등성 테스트로 확정(C-17) |
| 아이콘은 노드로 받으면 된다 | `icon={<Trash />}`는 아무 노드나 통과시켜 C-15로 막은 드리프트 경로를 다시 연다. 게다가 lucide는 웹/RN 패키지가 갈린다 | 이름 문자열로만 받고 DS가 내부에서 플랫폼 분기 |

## Technical Context

### 형제 프로젝트 실측 (`/Users/wonderround/Documents/Git/porfolio`)

| 프로젝트 | 스택 |
|---|---|
| bns, eeennsu-resume, eunstory, fortune, photo_top | Next.js + Tailwind v4(`@tailwindcss/postcss`) + Radix + `tailwind-merge` + zustand + next-themes — shadcn 패턴 5중 복붙 |
| vite-react-template | Vite + Tailwind v4 + zustand |
| spot | Expo + expo-router + React Native + reanimated + `lucide-react-native` + zustand — **스타일 라이브러리 없음** |
| review-collector, eunsu-hub, rn-upgrade-kit | 관련 의존성 없음 / package.json 없음 |

### shadcn 컴포넌트 실측

설치된 파일 수: bns 91, fortune 89, photo_top 53, eunstory 51, eeennsu-resume 24 — **총 308개**

실제 import 빈도 (5개 프로젝트 합산):

```
button 38 │ tooltip 11 │ card 9 │ badge 8 │ input 7 │ button-group 6
textarea 5 │ label 4 │ dialog 4 │ form 3 │ drawer 3
── 이하 1~2회: tabs, separator, popover, accordion, select, checkbox,
   calendar, toast, skeleton, sonner, pagination, radio-group, toggle …
```

측정 방법: `from '.../ui/x'` 및 `shadcn/x` import 패턴 grep. 다른 import 형태는 누락 가능. **정밀도 중간** — v1 목록의 근거로는 충분하나 절대 수치로 인용하지 말 것.

### NativeWind 버전 조사 (R12 → R20 갱신)

- NativeWind 안정판 **v4** → Tailwind CSS **v3만** 지원
- Tailwind **v4** 지원은 NativeWind **v5**. CSS-first 설정(`@theme`) 채택으로 Tailwind v4와 설정 방식 동일
- 기존 웹 프로젝트 5개는 전부 Tailwind v4
- **R20 재조사 (2026-09-05)**: v5는 여전히 preview. 메인테이너가 latest 승격 계획을 공개하고 진행 중(2026-07-17 발표, 2026-08-20 PR 29건 병합). 승격 완료는 미확인. "v5 stability" 라벨 이슈가 잔존

출처: [nativewind/nativewind#1354](https://github.com/nativewind/nativewind/issues/1354), [NativeWind — Migrate from v4](https://www.nativewind.dev/v5/guides/migrate-from-v4), [NativeWind 5.0 → latest: release plan (Discussion #1818)](https://github.com/nativewind/nativewind/discussions/1818), [NativeWind v5 — Built on Tailwind CSS](https://www.nativewind.dev/v5/core-concepts/tailwindcss)

### 크로스플랫폼 1본화 가능 여부 (R12 분석)

| 1본화 가능 (스타일만 다름) | 1본화 불가 (동작 자체가 다름) |
|---|---|
| Button, Input, Textarea, Label, Card, Badge, ButtonGroup, Stack, Box, Text(R21 추가) | Dialog, Drawer, Tooltip, Form |
| | 웹: Portal + Floating UI / RN: Modal + Reanimated |

이 분석은 R20의 NativeWind 채택 후에도 유효하다 — 오버레이 4개는 여전히 분리, v1 RN 범위는 "스타일만 다른 것 중 핵심 5개"(R21: Text 추가). 왼쪽 10개의 1본화는 v2 후보로 승격.

### 폰트 실측 (R18)

웹 5개 프로젝트 grep 결과: `Inter` 68회 / `pretendard` 11 / `Geist` 10 / `Noto_Sans_KR` 2 — 통일 안 됨. `spot`은 `@expo-google-fonts/inter`.

Inter가 양쪽 공통이지만 **한글 글리프가 없어** 현재 웹 프로젝트들은 한글이 시스템 폰트로 폴백되어 라틴/한글이 섞여 렌더된다. 폰트 통일은 DS의 부수 효과가 될 수 있으나 v1 성공 기준은 아니다.

### 아이콘 현황

웹 5개 → `lucide-react`, `spot` → `lucide-react-native`. 같은 아이콘 세트가 플랫폼별로 다른 패키지. C-7c의 이름 문자열 방식은 이 분기를 DS 내부로 숨긴다.

## Ontology (Key Entities)

| Entity | Type | Fields | Relationships |
|--------|------|--------|---------------|
| DesignToken | core domain | name, tier, value, platform | belongs to TokenTier; consumed by Component |
| TokenTier | core domain | primitive \| semantic \| component | ordered 3-level hierarchy; primitive ← semantic ← component |
| Component | core domain | name, variant, size, tone(Text), label, props | references DesignToken (semantic 이상만); conforms to ComponentContract |
| ComponentContract | core domain | variant 어휘, size 스케일(전역 5단 + 컨트롤 부분집합), `tone` 축 (R21), 제어 네이밍(`value` 3종 / `open` 3종 / `onPress`), 교차 어휘 열거형 `kind` (R21), a11y 필수, 금지 prop 목록, `className` 허용 (R20), `ref` 핸들 | governs all Components across both Platforms; enforced by export-map type equality test (C-17) |
| Platform | supporting | web \| native | consumes DesignToken via platform build; hosts its own Component impl; both resolve className against shared ClassVocabulary |
| ClassVocabulary | supporting (R20) | `@theme` 산출물 — 토큰에서 파생된 Tailwind 클래스 집합. **봉쇄** (R21): Tailwind 기본 팔레트·동적 spacing 리셋, primitive 미노출. 열거 외 키는 무효 | built from DesignToken; consumed by web Tailwind and NativeWind identically via platform wrapper; the only customization channel; merged by tailwind-merge with DS key config |
| Package | supporting | name, version, exports, types | `@<scope>/tokens` → `@<scope>/web`, `@<scope>/native`. 스코프 이름 미확정(R21 보류). 공개 경로는 `web/themes/<brand>.css`, `native/themes/<brand>.css` |
| Theme | supporting | brand × (light \| dark) | rebinds semantic DesignToken; composed of Brand and color scheme; dark resolved by hybrid rule (C-20) |
| Brand | core domain | name, semantic 색 오버라이드. v1: `base`, `bakery` (R21) | injects into semantic tier only; 간격·타이포·component 계층은 불변; selected at build time by import path, one per app |
| Icon | supporting | name (문자열), size 토큰, color 토큰 | referenced by Component via name only; DS가 플랫폼별 lucide 패키지로 분기 |
| DesignLanguage | supporting | 차용 층위(토큰 아키텍처, 크로스플랫폼 분리) | derived from Seed / WDS / Bezier |
| AgentContract | external system | 조회 인터페이스 | v2 보류. v1에서는 `.d.ts`가 대체 |

## Interview Transcript

<details>
<summary>전체 Q&A (19 라운드 + R20·R21 사후 개정)</summary>

### Round 0 — 토폴로지 확인
**Q:** 최상위 컴포넌트 5개(tokens / components / platform-adapter / distribution / docs)가 맞나?
**A:** 5개 다 맞음. 추가로 AI를 활용한 획기적 기능을 원함 — 아이디어를 달라
**결과:** 6개 컴포넌트로 확장. AI 레이어 후보 제시(MCP 서버 / drift 린터 / 테마 생성 / 스크린샷 조립) → "기존 기능 보완 성격"이라며 반려 → 생성형 후보 재제시(의도 컴파일러 / 자가성장 / 테마 진화 / 화면 합성) → **의도 기반 컴파일러(E)** 선택 → "클로드코드가 화면을 다 쓸 건데 E가 도움이 되나?" 역질문 → E 기각, **에이전트-네이티브 DS**로 재정의

### Round 1 — platform-adapter / Goal
**Q:** 웹(Next+Tailwind v4)과 앱(Expo, 스타일 라이브러리 없음)을 어느 수준까지 공유하나?
**A:** 토큰만 공유

### Round 2 — 전 컴포넌트 / Criteria
**Q:** 이 DS가 "성공했다"고 말할 수 있는 첫 순간은?
**A:** 새 프로젝트 부트스트랩 — 설치하고 바로 화면 짜기 시작

### Round 3 — distribution / Constraints
**Q:** 새 프로젝트가 이 DS를 어떻게 가져가나?
**A:** CLI로 코드 복사 (shadcn 방식)

### Round 4 — distribution / Goal · 가정 반박
**Q:** "자체 CLI가 필요하다"는 가정이 맞나? 클로드코드는 파일 복사를 할 줄 알고, shadcn CLI는 이미 커스텀 레지스트리를 지원한다
**A:** 이전 질문으로 돌아가자
**결과:** Round 3 재개

### Round 3-재 — distribution / Constraints
**Q:** (유지보수 비용 비교표 제시 후) 다시 — 어떻게 가져가나?
**A:** **npm 패키지**

### Round 5 — components / Goal
**Q:** 웹 컴포넌트의 기반을 무엇으로 하나?
**A:** 잠깐 — DS를 만드는 이유가 하나 더 있음. 당근 Seed, 원티드 WDS, Bezier 등 유명 DS의 장점만 빼고 단점은 제외해 재정의하고 싶음
**결과:** 질문 재작성. Bezier가 토스가 아니라 채널톡 DS임을 정정

### Round 5-재 — tokens + components / Goal
**Q:** 레퍼런스 DS들에서 어느 층위를 가져오나? (복수)
**A:** 토큰 아키텍처(Seed 3계층) + 크로스플랫폼 분리 방식(Seed)
**결과:** API 규약·아이콘 시스템은 차용 안 함(자체 설계).

### Round 6 — docs + agent-native / Goal · 범위 축소
**Q:** v1에 실제로 넣을 범위는?
**A:** tokens + web components + npm
**결과:** platform-adapter / docs / agent-native → v2 보류.

### Round 7 — components / Goal
**Q:** 웹 컴포넌트를 어떻게 세우나? (shadcn은 이미 semantic 토큰 기반이라 층 추가로 3계층 도달 가능함을 제시)
**A:** shadcn 참고하되 API는 재설계

### Round 8 — components / Criteria
**Q:** (5개 프로젝트 308개 파일 / 실제 import 11개 실측 제시) v1 컴포넌트를 어디까지 만들면 "됐다"인가?
**A:** 실측 상위 11개 + 레이아웃

### Round 9 — components / Constraints
**Q:** API 재설계에서 강제 규칙으로 못 박을 건? (복수)
**A:** variant/size 어휘 전역 통일 + semantic 토큰만 참조, 그리고 5개 추가 규칙 — 다형성 prop 금지(`as`/`render`/`asChild` 미노출, Base UI `render`는 내부 구현만), 불리언 대신 열거형, 제어 API `value`/`defaultValue`/`onValueChange` 고정(`onChange` 금지), a11y `label` 필수 계약(웹 `aria-label` / RN `accessibilityLabel` 변환), 원시 숫자·색상 값 타입 차단
**결과:** 헤드리스 기반이 **Base UI**임이 드러남. 규칙 3·4·5·6이 전부 RN 전제 설계.

### Round 10 — components / Constraints (확인)
**Q:** `className` 정책은? (규칙 7 원시값 금지의 짝)
**A:** **완전 차단**

### Round 11 — 스펙 리뷰 · platform-adapter 복귀
**Q(사용자):** ① Next.js에서 하는 이유 ② RN에서도 사용할 수 있어야 함 ③ 미결 1건
**답변:** ① DS는 프레임워크 무관이어야 하며 Next는 검증 환경일 뿐. 단 RSC `"use client"` 제약은 실재하므로 C-4로 추가 ③ 미결은 ②에 종속되므로 순서 역전
**Q:** "RN에서도 사용 가능"을 v1에서 어디까지 요구하나?
**A:** **NativeWind로 컴포넌트 1본화**
**결과:** platform-adapter 보류 해제.

### Round 12 — platform-adapter / Constraints
**조사 결과 제시:** NativeWind 안정판 v4 = Tailwind v3만 지원, v4 지원은 preview인 v5뿐인데 웹 5개가 전부 v4. Base UI는 DOM 전용이라 오버레이 1본화 불가. 클래스 런타임 변환 때문에 컴파일 CSS 배포 막혀 AC-16 파기
**Q:** NativeWind↔Tailwind 버전 충돌을 어떻게 풀까?
**A:** **토큰만 공유로 되돌림**
**결과:** NativeWind 기각. 미결 1건(스타일 전달) 자동 확정 — 컴파일된 CSS. Base UI 충돌 소멸, AC-16 복구.

### Round 13 — platform-adapter / Criteria
**Q:** v1에서 RN을 어디까지 만들면 "됐다"인가?
**A:** **핵심 4개** (Button / Input / Card / Stack)

### Round 14 — tokens / Constraints
**과대평가 정정:** 3계층 "구조"만 확정됐을 뿐 실제 토큰 값이 한 줄도 없음. 더 파보니 소비 프로젝트 도메인이 전부 다른데(빵집 / 운세 / 사진 / 블로그 / 이력서) `Theme` 엔티티 축이 light\|dark 하나뿐 — 브랜드 축 누락
**Q:** 도메인이 다른 프로젝트들을 하나의 DS가 어떻게 덮나?
**A:** **브랜드 축 추가**

### Round 15 — tokens / Constraints
**Q(1차):** 간격·사이즈 스케일 키 체계를 뭐로 할까? → t-shirt 선택 후 사용자가 재질문 요청
**정정:** 1차 때 든 "RN에서 숫자 해석이 갈린다"는 논거가 약했음 — 토큰 키를 문자열로 강제하면 모호성이 사라짐. 실제 트레이드오프는 "간격 6단계로 버티나" vs "어휘 통일"
**Q(재):** 간격 스케일과 size 어휘를 어떻게 가져갈까?
**A:** **간격=숫자(4px 배수), size=t-shirt** — 의도적 분리

### Round 16 — platform-adapter / Constraints
**Q:** C-17이 "동일 prop 시그니처"를 요구하는데 강제 수단이 없다. AC-21도 검증 불가능한 상태. 어떻게 강제하나?
**A:** **`@<scope>/tokens`에 계약 타입 동거**

### Round 17 — distribution / Goal
**Q:** 레포 구조와 배포 인프라는? (비공개 레지스트리는 `.npmrc` 토큰 설정을 요구해 AC-16을 깨뜨림을 제시)
**A:** **pnpm workspace + 공개 npm**

### Round 18 — tokens / Criteria
**실측 제시:** 웹 폰트가 Inter 68 / pretendard 11 / Geist 10 / Noto_Sans_KR 2로 혼재. Inter는 한글 글리프가 없어 시스템 폰트로 폴백 중
**Q:** 폰트를 DS가 어디까지 소유하나?
**A:** **이름·스케일만 소유** — 폰트 파일 미동봉, 로딩은 소비 프로젝트

### Round 19 — components / Constraints
**Q:** 아이콘을 어떻게 받나? (`icon={<Trash />}`로 열어두면 C-15로 막은 드리프트 경로가 다시 열리고, lucide는 웹/RN 패키지가 갈림)
**A:** **이름 문자열로만** — DS가 내부에서 플랫폼 분기

### Round 20 — components + distribution / Constraints · **사후 개정** (2026-09-05)
**배경:** 스펙 리뷰 중 사용자가 "`<Button variant="primary" size="lg">`에 배경색·size 밖 크기·여백을 다르게 주려면?"을 물음. 답은 C-15에 따라 "불가, DS 레포에서 variant 추가". 사용자가 이를 거부 — "요즘 식으로 `className`에 Tailwind·NativeWind처럼 커스텀도 가능해야 한다"
**조사:** NativeWind v5 2026-09-05 기준 여전히 preview, latest 승격 진행 중(8월 20일 PR 29건 병합)
**Q:** RN 커스텀 채널을 뭘로? ① NativeWind v5 preview, className 양쪽 통일, 구현 분리 유지 ② 웹 className + RN `style` prop ③ NativeWind + 비오버레이 9개 1본화
**A:** **① NativeWind v5**
**결과:** C-15 반전(`className` 허용, `style`은 닫음), C-3 폐기·재작성(소비 프로젝트 Tailwind v4 필수, DS는 `@theme` 배포), C-19 신설(NativeWind v5 버전 고정 정책), AC-11·15·16·17·19·20·23 수정, AC-11a·24·25 신설, Non-Goal "NativeWind 1본화"를 "코드 1본화"로 축소. R20 미결 3건은 계획 단계로 이월

### Round 21 — 전 컴포넌트 / Constraints · **구현 전 검증 개정** (2026-09-05)
**배경:** R20 개정 스펙을 구현 전에 검증한 결과 모순·검증 불가·누락이 나옴. 4차에 걸쳐 기술 확정안 5건(A-1 계약 강제 / A-2 `@theme` 산출물 / A-3 병합 / A-4 Text 부재·Button 콘텐츠 / A-5 숫자 키)과 사람 결정 11건(B-1 전역 `variant`·`tone` / B-2 spacing 열거 / B-3 브랜드 / B-4 RN Text / B-5 다크모드 / B-6 Input `kind`·Form 범위 / B-7 npm 스코프·경로 / B-8 Text `size` / B-9 `onPress` / B-10 Form `<form>` / B-11 오버레이 제어 API)을 확정. 판단 기준 — R20 확정 사항 불변, AC-16 부트스트랩 유지, 되돌리기 쉬운 쪽, 유지보수 표면 작은 쪽, 타입·테스트로 자동 강제되는 쪽
**결과:** C-1·3·4·4a·5a·6·7·7a·7b·8·11·12·13·14·15·17·19 수정, C-20(다크모드 hybrid)·C-21(Form v1 범위) 신설, "알려진 동작(v1)" 8건 신설. AC-3·5·6·6a·6b·7·8·9·10·11·11a·13·15·16·17·20·21·22·23·24·25 수정, AC-19 재작성. R20 미결 1·2 종결, 3은 C-19 착수 게이트. 조합 검증 충돌 없음. 보류는 npm 스코프 이름 1건. 결정 근거·대안 비교·조합 검증 전문은 [decisions-r21.md](decisions-r21.md)

</details>
