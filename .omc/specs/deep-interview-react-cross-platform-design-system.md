# Deep Interview Spec: React 웹/앱 공통 디자인 시스템

## Metadata
- Interview ID: di-ds-20260831
- Rounds: 19 (Round 0 토폴로지 + 18 라운드, R3·R5 재작성 및 R11~13 스펙 리뷰 포함)
- Final Ambiguity Score: 13%
- Type: greenfield (형제 프로젝트 6개에서 브라운필드 증거 수집)
- Generated: 2026-09-01 (R19까지 반영)
- Threshold: 0.2
- Threshold Source: default
- Initial Context Summarized: no
- Status: PASSED

## Clarity Breakdown

활성 컴포넌트 4개(tokens / components / distribution / platform-adapter) 기준 커버리지 가중 평균. 보류 2개는 모호도 계산에서 제외.

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Goal Clarity | 0.88 | 0.40 | 0.350 |
| Constraint Clarity | 0.88 | 0.30 | 0.263 |
| Success Criteria Clarity | 0.85 | 0.30 | 0.255 |
| **Total Clarity** | | | **0.868** |
| **Ambiguity** | | | **0.132 (13%)** |

라운드별 추이: 86% → 79% → 68% → 54% → 46% → 45% → 48%▲ → 43% → 36% → 30% → 22% → 18% → 16% → 30%▲ → 35%▲ → 22% → 17% → **19%▲ → 18% → 17% → 16% → 15% → 14% → 13%**

상승 구간 3회는 모두 범위 확장이나 과대평가 정정의 정직한 반영:
- R5: "레퍼런스 DS 재정의" 목표 추가 (45→48%)
- R11: RN을 v2 보류에서 v1 활성으로 복귀 (16→30%), R12: NativeWind 충돌 3건 발견 (30→35%)
- R14: tokens Constraints 과대평가 정정 — 3계층 "구조"만 있고 실제 값이 없었음 (17→19%)

## Topology

Round 0에서 6개 최상위 컴포넌트 확정. Round 6 Simplifier에서 3개 보류 → Round 11에서 platform-adapter가 축소 범위로 활성 복귀.

| Component | Status | Description | Coverage / Deferral Note |
|-----------|--------|-------------|--------------------------|
| **tokens** | active | primitive → semantic → component 3계층 토큰. 플랫폼 무관 소스에서 웹·RN 양쪽 빌드 | AC-1 ~ AC-6 |
| **components** | active | Base UI 위에 자체 API로 재설계한 웹 컴포넌트 13개 | AC-7 ~ AC-15 |
| **distribution** | active | npm 3패키지 배포. 새 프로젝트가 설치 즉시 화면 작성 시작 | AC-16 ~ AC-19 |
| **platform-adapter** | active (축소) | RN 토큰 빌드 + 핵심 컴포넌트 4개 | AC-20 ~ AC-23. RN 오버레이 컴포넌트는 v2 |
| docs | **deferred** | Storybook 등 문서·프리뷰 | v2 보류. 근거 — 사용자가 1인. Storybook 유지비가 편익을 초과 |
| agent-native | **deferred** | 클로드코드를 1순위 소비자로 삼는 MCP 조회·검증 레이어 | v2 보류. 근거 — npm 모델 채택으로 "생성 코드 교정" 역할이 사라지고 조회만 남았는데, 조회는 패키지의 `.d.ts`가 이미 수행 |

## Goal

React 프로젝트 전용 개인 디자인 시스템을 npm 패키지 3개로 만든다. 새 프로젝트를 시작할 때 shadcn 복붙·Tailwind 설정·테마 세팅을 전부 생략하고, 설치 직후 화면 작성을 시작할 수 있어야 한다.

토큰은 당근 Seed의 3계층 아키텍처(primitive → semantic → component)를 차용하되 브랜드는 자체 정의한다. 단일 토큰 소스에서 웹용(CSS 변수)과 RN용(JS 객체)을 각각 빌드한다.

컴포넌트는 Base UI 프리미티브 위에 자체 API 계약으로 재설계한다. 웹과 RN은 **토큰만 공유하고 구현은 분리**한다. `className`을 타입 레벨에서 차단해 소비 프로젝트가 스타일을 우회 수정할 경로를 없앤다 — 이것이 현재 5개 Next 프로젝트가 서로 드리프트한 원인이기 때문이다.

v1에서 RN은 토큰 전량 + 핵심 컴포넌트 4개까지. API 계약이 RN에서 실제로 성립하는지 검증하는 것이 목적이며, 오버레이 컴포넌트는 v2로 넘긴다.

## 패키지 구조

pnpm workspace 단일 레포. 공개 npm으로 publish.

```
design-system/                        pnpm workspace
└─ packages/
   ├─ tokens/    @ds/tokens
   │             ① JSON/DTCG 토큰 소스 (플랫폼 무관, 3계층)
   │             ② 컴포넌트 계약 타입 (prop 시그니처 단일 정의)
   │               ├─ build:web    → CSS 변수 + 컴파일된 CSS
   │               └─ build:native → JS 객체
   ├─ web/       @ds/web     Base UI + Tailwind(내부 빌드 도구) → 컴파일된 CSS 배포
   │                         소비 프로젝트는 Tailwind 불필요
   └─ native/    @ds/native  React Native + StyleSheet
```

`@ds/tokens`는 이름보다 넓은 책임을 갖는다 — 토큰 **및** 계약 타입. 별도 `@ds/core`를 만들지 않은 이유는 양쪽이 이미 tokens에 의존하므로 패키지를 늘릴 이유가 없기 때문. 웹·RN 중 한쪽이 계약을 어기면 컴파일 에러가 난다.

빌드 도구는 pnpm workspace만 사용한다. turborepo(빌드 캐시)·changesets(버전 자동화)는 실제로 아플 때 추가한다.

## Constraints

### 배포·소비
- C-1. 배포 형태는 **npm 패키지 3개**(`@ds/tokens`, `@ds/web`, `@ds/native`). shadcn식 코드 복사(CLI/레지스트리) 아님
- C-2. 소비 프로젝트는 컴포넌트 소스를 수정하지 않는다. 수정은 DS 레포에서만
- C-3. `@ds/web`은 **컴파일된 CSS + CSS 변수**를 배포한다. Tailwind는 DS 내부 빌드 도구로만 쓰고 소비 프로젝트에 요구하지 않는다. 소비 프로젝트가 자기 코드에 Tailwind를 쓰는 것은 무관
- C-4. **RSC 대응**: 인터랙티브 컴포넌트는 `"use client"` 지시어를 붙여 배포한다. Next.js App Router에서 동작해야 하며, Vite 환경에서는 무해
- C-4a. 레포는 **pnpm workspace** 단일 레포(`packages/{tokens,web,native}`). 배포는 **공개 npm** — 비공개 레지스트리는 소비 프로젝트에 `.npmrc` 토큰 설정을 요구해 AC-16을 깨뜨리므로 채택하지 않는다

### 토큰
- C-5. 3계층 고정: primitive(`blue-500`) → semantic(`bg.brand`) → component(`button.bg.primary`)
- C-5a. **브랜드 축**: `Theme = brand × (light | dark)`. semantic 계층이 브랜드 주입점이며 브랜드별로 교체 가능하다. primitive·component 계층과 간격·타이포 스케일은 전 브랜드 공유. 근거 — 소비 프로젝트들의 도메인이 전부 다름(빵집 / 운세 / 사진 / 블로그 / 이력서)
- C-6. 토큰 소스는 플랫폼 무관 포맷(JSON / DTCG) **1본**. 웹은 CSS 변수로, RN은 JS 객체로 빌드
- C-7. 컴포넌트 구현은 **semantic 이상 계층만 참조**. primitive 직접 참조 금지 — 테마 교체가 깨지지 않도록
- C-7a. **스케일 어휘**: 간격은 숫자 스케일(4px 배수 — `1,2,3,4,6,8,12`…), 컴포넌트 `size`는 t-shirt(`sm|md|lg`). 두 어휘를 의도적으로 분리한다 — 간격을 t-shirt로 두면 단계가 모자랄 때 `md-plus` 같은 이름이 생겨 무너지고, `size`를 숫자로 두면 무엇이 큰지 직관적이지 않다
- C-7b. **폰트는 이름·스케일만 소유.** `fontFamily` 토큰과 크기·행간·무게 스케일은 DS가 갖되 실제 폰트 로딩은 소비 프로젝트 책임(웹 `next/font`, RN `expo-font`). 폰트 파일을 패키지에 동봉하지 않는다 — 무게와 라이선스가 따라온다
- C-7c. **아이콘은 이름 문자열로만 받는다.** `<Button icon="trash">`. DS가 내부에서 `lucide-react`(웹) / `lucide-react-native`(RN)로 분기하고, 색·크기는 토큰으로 결정한다. 아이콘 노드를 그대로 받으면 C-15로 막은 드리프트 경로가 아이콘으로 다시 열린다

### 컴포넌트 API 계약 (8개 강제 규칙)
- C-8. **variant/size 어휘 전역 통일.** 모든 컴포넌트가 동일한 집합에서만 고름. 안 쓰는 값은 빼되 이름은 절대 다르게 짓지 않는다. 단 간격(spacing)은 C-7a에 따라 별도 숫자 어휘를 쓴다 — 통일 대상이 아니다
- C-9. **semantic 토큰만 참조** (C-7과 동일 규칙의 컴포넌트 측 표현)
- C-10. **다형성 prop 금지.** `as` / `render` / `asChild`를 core 계약에 노출하지 않는다. RN에 대응물이 없다. Base UI의 `render`는 `@ds/web` 내부 구현 디테일로만 사용
- C-11. **불리언 prop 대신 열거형.** `isPrimary`, `isDanger` 금지 → `variant`. 불리언은 조합 폭발을 만들고 두 플랫폼에서 우선순위가 갈린다
- C-12. **제어 API 네이밍 고정.** `value` / `defaultValue` / `onValueChange` 세트로 통일. `onChange`는 RN `TextInput`의 `onChangeText`와 혼동되므로 쓰지 않는다
- C-13. **접근성 라벨 필수 계약.** 인터랙티브 컴포넌트는 `label`을 필수로 받고, 어댑터에서 웹은 `aria-label`, RN은 `accessibilityLabel`로 변환. 타입 레벨에서 강제
- C-14. **원시 숫자·색상 값 금지.** `padding={16}`, `color="#333"` 을 타입으로 차단하고 토큰 키만 받는다 (C-13의 소비자 측 짝)
- C-15. **`className` 완전 차단.** prop을 타입에서 제거. 배치는 레이아웃 컴포넌트(Stack/Box)로만 표현. RN에는 원래 `className`이 없으므로 두 플랫폼이 자연히 일치

### 기반
- C-16. 헤드리스 프리미티브는 **Base UI** (Radix 아님). DOM 전용이므로 `@ds/web`에만 적용. shadcn 코드는 참고 자료로만 쓰고 API는 따르지 않는다
- C-17. `@ds/web`과 `@ds/native`는 **동일한 prop 시그니처**를 갖되 구현을 공유하지 않는다. 계약 타입은 `@ds/tokens`에 단일 정의로 두고 양쪽이 그것을 구현한다 — 한쪽이 어기면 컴파일 에러. 사람 규율에 맡기지 않는다
- C-18. 기존 5개 Next 프로젝트 마이그레이션은 성공 기준이 아니다. 부수 효과로만 취급

## Non-Goals

- **NativeWind로 컴포넌트 1본화** — R12에서 검토 후 기각. 근거 3건: (1) NativeWind 안정판 v4는 Tailwind v3만 지원하고 v4 지원은 preview 단계인 v5뿐인데 기존 웹 5개 프로젝트가 전부 Tailwind v4, (2) Base UI가 DOM 전용이라 오버레이 컴포넌트는 어차피 1본화 불가, (3) 클래스 문자열 런타임 변환이 필수라 컴파일된 CSS 배포가 막히고 AC-16이 깨짐
- v1에서 RN 오버레이 컴포넌트(Dialog / Drawer / Tooltip / Form) 구현 — 웹은 Portal + Floating UI, RN은 Modal + Reanimated로 동작이 근본적으로 다름. v2
- Storybook 등 문서 사이트
- MCP 서버 / 에이전트 전용 레이어
- 자체 CLI 또는 shadcn 호환 레지스트리 (Round 4 Contrarian에서 기각)
- 의도 기반 빌드타임 컴파일러 (Round 0 후속에서 기각 — 클로드코드가 이미 그 번역을 더 많은 컨텍스트로 수행)
- 레퍼런스 DS에서 API 규약·아이콘 시스템 차용 (토큰 아키텍처와 크로스플랫폼 분리 방식만 차용)
- 기존 5개 Next 프로젝트의 일괄 마이그레이션
- 웹 컴포넌트 30개 전량 이식 (실측상 반복 사용은 11개)
- 특정 프레임워크 종속 — Next.js는 검증 환경일 뿐 설계 기준이 아니며 Vite 프로젝트도 동일하게 지원

## Acceptance Criteria

### tokens
- [ ] AC-1. 토큰 소스가 단일 플랫폼 무관 파일(JSON/DTCG)로 존재한다
- [ ] AC-2. primitive / semantic / component 3계층이 파일 구조와 네이밍으로 구분된다
- [ ] AC-3. 빌드 스크립트가 소스에서 웹용 CSS 변수를 생성한다
- [ ] AC-4. 빌드 스크립트가 같은 소스에서 RN용 JS 객체를 생성한다
- [ ] AC-5. semantic 토큰 한 줄을 바꾸면 웹·RN 양쪽에 동시에 전파된다 (테스트로 검증)
- [ ] AC-6. 컴포넌트 소스 어디에도 primitive 토큰 직접 참조가 없다 (lint 규칙으로 강제)
- [ ] AC-6a. 브랜드를 교체하면 semantic 색 토큰만 바뀌고 간격·타이포·component 계층은 그대로다 (2개 이상 브랜드로 검증)
- [ ] AC-6b. 간격 토큰이 4px 배수 숫자 키로, 컴포넌트 `size`가 `sm|md|lg`로 정의된다
- [ ] AC-6c. `fontFamily` 토큰이 존재하고, 패키지에 폰트 파일이 동봉되지 않는다

### components (`@ds/web`)
- [ ] AC-7. 다음 11개가 구현된다: `Button` `Input` `Textarea` `Label` `Card` `Badge` `Tooltip` `Dialog` `Drawer` `Form` `ButtonGroup`
- [ ] AC-8. 레이아웃 프리미티브 `Stack` `Box`가 구현된다
- [ ] AC-9. 전 컴포넌트가 동일한 `variant` 어휘를 쓴다 (타입으로 강제)
- [ ] AC-10. 전 컴포넌트가 동일한 `size` 스케일을 쓴다 (타입으로 강제)
- [ ] AC-11. 어떤 컴포넌트도 `className` prop을 받지 않는다 (타입 테스트로 검증)
- [ ] AC-12. 어떤 컴포넌트도 `as` / `render` / `asChild`를 공개 prop으로 노출하지 않는다
- [ ] AC-13. 제어 컴포넌트가 `value` / `defaultValue` / `onValueChange`만 노출한다. `onChange` 없음
- [ ] AC-14. 인터랙티브 컴포넌트에서 `label` 누락 시 타입 에러가 난다
- [ ] AC-15. 원시 숫자·색상 리터럴을 스타일 prop에 넣으면 타입 에러가 난다
- [ ] AC-15a. 아이콘을 받는 컴포넌트가 `icon="이름"` 문자열만 받고, 잘못된 이름은 타입 에러가 난다. 아이콘 노드(`icon={<Trash />}`)는 타입에서 거부된다

### distribution
- [ ] AC-16. **부트스트랩 검증**: 빈 Next.js 프로젝트에 `@ds/web`을 설치하고, 설정 파일 편집 없이 로그인 화면 하나를 DS 컴포넌트만으로 작성해 정상 렌더된다
- [ ] AC-17. Vite 프로젝트에서도 동일 화면이 렌더된다 (프레임워크 비종속 검증)
- [ ] AC-18. 타입 정의(`.d.ts`)가 함께 배포되어 IDE·클로드코드가 prop 시그니처를 읽을 수 있다
- [ ] AC-19. 다크모드가 소비 프로젝트 설정 없이 동작한다

### platform-adapter (`@ds/native`)
- [ ] AC-20. `Button` `Input` `Card` `Stack` 4개가 RN으로 구현된다
- [ ] AC-21. 이 4개의 prop 시그니처가 `@ds/web`과 완전히 일치한다. `@ds/tokens`의 계약 타입을 양쪽이 구현하며, 한쪽에만 prop을 추가하면 컴파일이 깨진다 (실제로 깨지는지 테스트로 확인)
- [ ] AC-22. `label`이 RN에서 `accessibilityLabel`로 변환된다
- [ ] AC-23. **크로스플랫폼 검증**: `spot`(Expo)에 `@ds/native`를 설치해 화면 하나를 DS 컴포넌트만으로 작성하고, 웹 프로젝트와 같은 색·간격이 나온다

## Assumptions Exposed & Resolved

| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| AI 기능 = 코드를 생성해주는 것 | 프론트 화면을 전부 클로드코드가 쓰는데, 빌드타임 AI 번역기가 왜 또 필요한가? | 의도 기반 컴파일러(E) 기각. AI 레이어는 "에이전트가 1순위 소비자인 DS"로 재정의 → 이후 v2 보류 |
| 웹·앱 컴포넌트 코드를 공유해야 한다 | Tailwind와 RN StyleSheet 사이 공유 비용 vs 편익 | 토큰만 공유. 컴포넌트 구현은 플랫폼별 분리 |
| shadcn처럼 코드 복사 모델이 맞다 | shadcn이 복사를 택한 이유는 사용자가 백만 명의 낯선 사람이라서다. 사용자가 1인이면 그 장점이 안 살아남는다. 그리고 지금 5개 프로젝트 드리프트가 정확히 복사 모델의 결과물 | npm 패키지로 전환 |
| 자체 CLI가 필요하다 | 클로드코드는 파일 복사를 할 줄 안다. shadcn CLI는 이미 커스텀 레지스트리를 지원한다 | npm 채택으로 자연 소멸 |
| Seed를 따라가려면 vanilla-extract를 써야 한다 | 토큰 아키텍처와 구현 기반은 직교한다. 3계층은 CSS 변수로 그대로 구현된다 | 토큰 계층만 차용, 구현 기반은 독립 결정 |
| 6개 컴포넌트를 다 만들어야 한다 | 성공 기준이 "새 프로젝트 부트스트랩"인데 docs·agent-native가 거기 기여하는 바가 없다 | docs·agent-native만 v2 보류. platform-adapter는 R11에서 복귀 |
| shadcn 컴포넌트 30개가 필요하다 | 5개 프로젝트에 308개 파일이 설치됐는데 반복 import는 11개뿐 (실측) | v1 = 11개 + 레이아웃 2개 |
| `className`은 열어둬야 급할 때 때운다 | 열려 있으면 "모든 컴포넌트가 DS를 거쳐감"이 말뿐이 된다. 드리프트의 밸브 | 완전 차단. 배치는 Stack/Box로만 |
| Next.js가 설계 기준이다 | DS는 React 라이브러리이므로 프레임워크 무관이어야 한다. Next는 소비처 다수라 검증 환경으로 골랐을 뿐 | 프레임워크 비종속 명시(AC-17). 단 RSC `"use client"` 제약은 실재하므로 C-4로 추가 |
| NativeWind로 컴포넌트를 1본화할 수 있다 | NativeWind 안정판이 Tailwind v3만 지원하는데 기존 웹 5개가 v4. Base UI는 DOM 전용이라 오버레이는 어차피 분리. 클래스 런타임 변환 때문에 컴파일 CSS 배포가 막혀 AC-16이 깨짐 | 기각. R1의 "토큰만 공유"로 복귀 |
| RN은 v2로 미뤄도 된다 | 사용자가 v1 요구사항으로 명시 | platform-adapter 활성 복귀. 단 오버레이 4개는 v2로 분리 |
| 3계층 토큰 구조를 정했으니 tokens는 명확하다 | 구조만 있고 실제 값이 한 줄도 없다. 그리고 소비 프로젝트 도메인이 전부 다른데(빵집/운세/사진/블로그/이력서) `Theme` 엔티티에 브랜드 축이 없다 | 브랜드 축 추가 — `Theme = brand × (light\|dark)`. semantic 계층이 주입점 |
| 어휘를 하나로 통일하는 게 좋다 | 간격을 t-shirt 6단계로 두면 "8과 16 사이 12" 상황에서 `md-plus` 같은 이름이 생겨 무너진다. 레퍼런스 DS들도 spacing과 size 어휘를 분리해 운영한다 | 간격=숫자(4px 배수), size=t-shirt로 의도적 분리. C-8에 예외 명시 |
| 계약 일치는 규율로 지킬 수 있다 | 웹에만 prop 하나 추가하면 계약이 깨지고 아무도 모른다. AC-21이 검증 불가능한 AC였다 | 계약 타입을 `@ds/tokens`에 단일 정의. 어기면 컴파일 에러 |
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

### NativeWind 버전 조사 (R12)

- NativeWind 안정판 **v4** → Tailwind CSS **v3만** 지원
- Tailwind **v4** 지원은 NativeWind **v5**이며 2026년 9월 기준 **preview**
- 기존 웹 프로젝트 5개는 전부 Tailwind v4

출처: [nativewind/nativewind#1354](https://github.com/nativewind/nativewind/issues/1354), [NativeWind — Migrate from v4](https://www.nativewind.dev/v5/guides/migrate-from-v4)

### 크로스플랫폼 1본화 가능 여부 (R12 분석)

| 1본화 가능 (스타일만 다름) | 1본화 불가 (동작 자체가 다름) |
|---|---|
| Button, Input, Textarea, Label, Card, Badge, ButtonGroup, Stack, Box | Dialog, Drawer, Tooltip, Form |
| | 웹: Portal + Floating UI / RN: Modal + Reanimated |

이 분석은 NativeWind 기각 후에도 유효하다 — v1 RN 범위를 "스타일만 다른 것 중 핵심 4개"로 좁힌 근거.

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
| Component | core domain | name, variant, size, label, props | references DesignToken (semantic 이상만); conforms to ComponentContract |
| ComponentContract | core domain | variant 어휘, size 스케일, 제어 네이밍, a11y 필수, 금지 prop 목록 | governs all Components across both Platforms |
| Platform | supporting | web \| native | consumes DesignToken via platform build; hosts its own Component impl |
| Package | supporting | name, version, exports, types | `@ds/tokens` → `@ds/web`, `@ds/native` |
| Theme | supporting | brand × (light \| dark) | rebinds semantic DesignToken; composed of Brand and color scheme |
| Brand | core domain | name, semantic 색 오버라이드 | injects into semantic tier only; 간격·타이포·component 계층은 불변 |
| Icon | supporting | name (문자열), size 토큰, color 토큰 | referenced by Component via name only; DS가 플랫폼별 lucide 패키지로 분기 |
| DesignLanguage | supporting | 차용 층위(토큰 아키텍처, 크로스플랫폼 분리) | derived from Seed / WDS / Bezier |
| AgentContract | external system | 조회 인터페이스 | v2 보류. v1에서는 `.d.ts`가 대체 |

## Ontology Convergence

| Round | Entity Count | New | Changed | Stable | Stability Ratio |
|-------|-------------|-----|---------|--------|----------------|
| 0 | 6 | 6 | - | - | N/A |
| 1 | 6 | 0 | 0 | 6 | 100% |
| 2 | 6 | 0 | 0 | 6 | 100% |
| 3 | 7 | 1 (CLI) | 1 (Package → Registry) | 5 | 86% |
| 3-재 | 6 | 0 | 1 (Registry → Package) | 5 | 86% |
| 5 | 7 | 1 (DesignLanguage) | 0 | 6 | 86% |
| 5-재 | 8 | 1 (TokenTier) | 0 | 7 | 88% |
| 6 | 8 | 0 | 0 | 8 | 100% |
| 7 | 8 | 0 | 0 | 8 | 100% |
| 8 | 8 | 0 | 0 | 8 | 100% |
| 9 | 9 | 1 (ComponentContract) | 0 | 8 | 89% |
| 10 | 9 | 0 | 0 | 9 | 100% |
| 11 | 9 | 0 | 0 | 9 | 100% |
| 12 | 9 | 0 | 0 | 9 | 100% |
| 13 | 9 | 0 | 0 | 9 | 100% |
| 14 | 10 | 1 (Brand) | 0 | 9 | 90% |
| 15 | 10 | 0 | 0 | 10 | 100% |
| 16 | 10 | 0 | 0 | 10 | 100% |
| 17 | 10 | 0 | 0 | 10 | 100% |
| 18 | 10 | 0 | 0 | 10 | 100% |
| 19 | 11 | 1 (Icon) | 0 | 10 | 91% |

R3의 Registry/CLI 등장·소멸이 배포 모델 재검토 구간과 정확히 일치. R6 이후 도메인 모델이 안정화되고 R9의 ComponentContract 하나만 추가됨. R11~13의 RN 범위 확장은 기존 엔티티의 관계만 바꿨을 뿐 새 엔티티를 만들지 않음 — 도메인 모델이 확장을 흡수했다는 증거.

R14의 Brand와 R19의 Icon은 각각 스펙의 실제 구멍에서 발견됨 — 전자는 `Theme`에 브랜드 축이 없다는 것, 후자는 컴포넌트가 아이콘을 어떻게 받는지 정의가 없다는 것. 둘 다 기존 엔티티를 바꾸지 않고 추가만 됨.

## Interview Transcript

<details>
<summary>전체 Q&A (19 라운드)</summary>

### Round 0 — 토폴로지 확인
**Q:** 최상위 컴포넌트 5개(tokens / components / platform-adapter / distribution / docs)가 맞나?
**A:** 5개 다 맞음. 추가로 AI를 활용한 획기적 기능을 원함 — 아이디어를 달라
**결과:** 6개 컴포넌트로 확장. AI 레이어 후보 제시(MCP 서버 / drift 린터 / 테마 생성 / 스크린샷 조립) → "기존 기능 보완 성격"이라며 반려 → 생성형 후보 재제시(의도 컴파일러 / 자가성장 / 테마 진화 / 화면 합성) → **의도 기반 컴파일러(E)** 선택 → "클로드코드가 화면을 다 쓸 건데 E가 도움이 되나?" 역질문 → E 기각, **에이전트-네이티브 DS**로 재정의

### Round 1 — platform-adapter / Goal
**Q:** 웹(Next+Tailwind v4)과 앱(Expo, 스타일 라이브러리 없음)을 어느 수준까지 공유하나?
**A:** 토큰만 공유
**Ambiguity:** 79% → 68%

### Round 2 — 전 컴포넌트 / Criteria
**Q:** 이 DS가 "성공했다"고 말할 수 있는 첫 순간은?
**A:** 새 프로젝트 부트스트랩 — 설치하고 바로 화면 짜기 시작
**Ambiguity:** 68% → 54%

### Round 3 — distribution / Constraints
**Q:** 새 프로젝트가 이 DS를 어떻게 가져가나?
**A:** CLI로 코드 복사 (shadcn 방식)
**Ambiguity:** 54% → 46%

### Round 4 — distribution / Goal · **Contrarian 모드**
**Q:** "자체 CLI가 필요하다"는 가정이 맞나? 클로드코드는 파일 복사를 할 줄 알고, shadcn CLI는 이미 커스텀 레지스트리를 지원한다
**A:** 이전 질문으로 돌아가자
**결과:** Round 3 재개

### Round 3-재 — distribution / Constraints
**Q:** (유지보수 비용 비교표 제시 후) 다시 — 어떻게 가져가나?
**A:** **npm 패키지**
**Ambiguity:** 46% → 45%

### Round 5 — components / Goal
**Q:** 웹 컴포넌트의 기반을 무엇으로 하나?
**A:** 잠깐 — DS를 만드는 이유가 하나 더 있음. 당근 Seed, 원티드 WDS, Bezier 등 유명 DS의 장점만 빼고 단점은 제외해 재정의하고 싶음
**결과:** 질문 재작성. 모호도 45% → **48% 상승**(범위 확장). Bezier가 토스가 아니라 채널톡 DS임을 정정

### Round 5-재 — tokens + components / Goal
**Q:** 레퍼런스 DS들에서 어느 층위를 가져오나? (복수)
**A:** 토큰 아키텍처(Seed 3계층) + 크로스플랫폼 분리 방식(Seed)
**결과:** API 규약·아이콘 시스템은 차용 안 함(자체 설계). **Ambiguity:** 48% → 43%

### Round 6 — docs + agent-native / Goal · **Simplifier 모드**
**Q:** v1에 실제로 넣을 범위는?
**A:** tokens + web components + npm
**결과:** platform-adapter / docs / agent-native → v2 보류. **Ambiguity:** 43% → 36%

### Round 7 — components / Goal
**Q:** 웹 컴포넌트를 어떻게 세우나? (shadcn은 이미 semantic 토큰 기반이라 층 추가로 3계층 도달 가능함을 제시)
**A:** shadcn 참고하되 API는 재설계
**Ambiguity:** 36% → 30%

### Round 8 — components / Criteria
**Q:** (5개 프로젝트 308개 파일 / 실제 import 11개 실측 제시) v1 컴포넌트를 어디까지 만들면 "됐다"인가?
**A:** 실측 상위 11개 + 레이아웃
**Ambiguity:** 30% → 22%

### Round 9 — components / Constraints
**Q:** API 재설계에서 강제 규칙으로 못 박을 건? (복수)
**A:** variant/size 어휘 전역 통일 + semantic 토큰만 참조, 그리고 5개 추가 규칙 — 다형성 prop 금지(`as`/`render`/`asChild` 미노출, Base UI `render`는 내부 구현만), 불리언 대신 열거형, 제어 API `value`/`defaultValue`/`onValueChange` 고정(`onChange` 금지), a11y `label` 필수 계약(웹 `aria-label` / RN `accessibilityLabel` 변환), 원시 숫자·색상 값 타입 차단
**결과:** 헤드리스 기반이 **Base UI**임이 드러남. 규칙 3·4·5·6이 전부 RN 전제 설계. **Ambiguity:** 22% → 18% (임계선 통과)

### Round 10 — components / Constraints (확인)
**Q:** `className` 정책은? (규칙 7 원시값 금지의 짝)
**A:** **완전 차단**
**Ambiguity:** 18% → 16% — 1차 스펙 작성

### Round 11 — 스펙 리뷰 · platform-adapter 복귀
**Q(사용자):** ① Next.js에서 하는 이유 ② RN에서도 사용할 수 있어야 함 ③ 미결 1건
**답변:** ① DS는 프레임워크 무관이어야 하며 Next는 검증 환경일 뿐. 단 RSC `"use client"` 제약은 실재하므로 C-4로 추가 ③ 미결은 ②에 종속되므로 순서 역전
**Q:** "RN에서도 사용 가능"을 v1에서 어디까지 요구하나?
**A:** **NativeWind로 컴포넌트 1본화**
**결과:** platform-adapter 보류 해제. **Ambiguity:** 16% → **30%▲**

### Round 12 — platform-adapter / Constraints
**조사 결과 제시:** NativeWind 안정판 v4 = Tailwind v3만 지원, v4 지원은 preview인 v5뿐인데 웹 5개가 전부 v4. Base UI는 DOM 전용이라 오버레이 1본화 불가. 클래스 런타임 변환 때문에 컴파일 CSS 배포 막혀 AC-16 파기
**Q:** NativeWind↔Tailwind 버전 충돌을 어떻게 풀까?
**A:** **토큰만 공유로 되돌림**
**결과:** NativeWind 기각. 미결 1건(스타일 전달) 자동 확정 — 컴파일된 CSS. Base UI 충돌 소멸, AC-16 복구. **Ambiguity:** 30% → 35%▲ → 22%

### Round 13 — platform-adapter / Criteria
**Q:** v1에서 RN을 어디까지 만들면 "됐다"인가?
**A:** **핵심 4개** (Button / Input / Card / Stack)
**Ambiguity:** 22% → 17%

### Round 14 — tokens / Constraints
**과대평가 정정:** 3계층 "구조"만 확정됐을 뿐 실제 토큰 값이 한 줄도 없음. 더 파보니 소비 프로젝트 도메인이 전부 다른데(빵집 / 운세 / 사진 / 블로그 / 이력서) `Theme` 엔티티 축이 light\|dark 하나뿐 — 브랜드 축 누락
**Q:** 도메인이 다른 프로젝트들을 하나의 DS가 어떻게 덮나?
**A:** **브랜드 축 추가**
**Ambiguity:** 17% → 19%▲ → 18%

### Round 15 — tokens / Constraints
**Q(1차):** 간격·사이즈 스케일 키 체계를 뭐로 할까? → t-shirt 선택 후 사용자가 재질문 요청
**정정:** 1차 때 든 "RN에서 숫자 해석이 갈린다"는 논거가 약했음 — 토큰 키를 문자열로 강제하면 모호성이 사라짐. 실제 트레이드오프는 "간격 6단계로 버티나" vs "어휘 통일"
**Q(재):** 간격 스케일과 size 어휘를 어떻게 가져갈까?
**A:** **간격=숫자(4px 배수), size=t-shirt** — 의도적 분리
**Ambiguity:** 18% → 17%

### Round 16 — platform-adapter / Constraints
**Q:** C-17이 "동일 prop 시그니처"를 요구하는데 강제 수단이 없다. AC-21도 검증 불가능한 상태. 어떻게 강제하나?
**A:** **`@ds/tokens`에 계약 타입 동거**
**Ambiguity:** 17% → 16%

### Round 17 — distribution / Goal
**Q:** 레포 구조와 배포 인프라는? (비공개 레지스트리는 `.npmrc` 토큰 설정을 요구해 AC-16을 깨뜨림을 제시)
**A:** **pnpm workspace + 공개 npm**
**Ambiguity:** 16% → 15%

### Round 18 — tokens / Criteria
**실측 제시:** 웹 폰트가 Inter 68 / pretendard 11 / Geist 10 / Noto_Sans_KR 2로 혼재. Inter는 한글 글리프가 없어 시스템 폰트로 폴백 중
**Q:** 폰트를 DS가 어디까지 소유하나?
**A:** **이름·스케일만 소유** — 폰트 파일 미동봉, 로딩은 소비 프로젝트
**Ambiguity:** 15% → 14%

### Round 19 — components / Constraints
**Q:** 아이콘을 어떻게 받나? (`icon={<Trash />}`로 열어두면 C-15로 막은 드리프트 경로가 다시 열리고, lucide는 웹/RN 패키지가 갈림)
**A:** **이름 문자열로만** — DS가 내부에서 플랫폼 분기
**Ambiguity:** 14% → **13%**

</details>
