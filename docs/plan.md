# 구현 계획 (R23 스펙 기준)

- 작성일: 2026-09-05
- 개정 이력: **v2 (2026-09-05)** — [plan-verification.md](plan-verification.md) 검증 결과 반영. B 2건(F-2 tokens component export 누락, F-4 twMerge `override`), P 21건, N 13건. 사용자 결정 4건(F-1 children `string | string[]`, F-7 컨트롤 투명 테두리, F-9 Expo SDK 57 우선, F-18 ButtonGroup `size` 없음 유지). 각 변경 지점에 `(v2 F-n)` 표기
- 기준 문서: [design-system-spec.md](design-system-spec.md) R23 개정. 결정 근거는 [decisions-r21.md](decisions-r21.md) · [decisions-r22.md](decisions-r22.md) · [decisions-r23.md](decisions-r23.md)이며 이 계획은 닫힌 결정을 다시 열지 않는다
- 이 문서의 지위: 스펙이 "계획 단계"로 넘긴 항목(토큰 인벤토리·값, 컴포넌트별 축 매트릭스, 오버레이 세부, Stack/Box enum, focus ring 토큰, `IconName` 소스, exports·peer·lockstep 버전, 테스트 러너, 검증 앱 위치, R23 토큰 인벤토리 요구 2건)을 결정하고, 구현 태스크와 AC 매핑을 고정한다. 스펙과 충돌하는 내용이 발견되면 스펙을 고치지 않고 [§9 스펙 수정 필요](#9-스펙-수정-필요)에 모은다
- npm 스코프는 `@eeennsu`로 확정됐다(2026-09-05 사용자 결정, §8 D-21). 이 문서·코드·검증 앱은 전부 이 문자열을 그대로 쓴다. 자리표시자는 남아 있지 않다

## 목차

1. [전체 순서와 의존성](#1-전체-순서와-의존성)
2. [C-19 착수 게이트](#2-c-19-착수-게이트)
3. [토큰 인벤토리와 값](#3-토큰-인벤토리와-값)
4. [컴포넌트 API](#4-컴포넌트-api)
5. [패키지 구성](#5-패키지-구성)
6. [구현 태스크](#6-구현-태스크)
7. [AC 매핑](#7-ac-매핑)
8. [결정 사항 요약](#8-결정-사항-요약)
9. [스펙 수정 필요](#9-스펙-수정-필요)

---

## 1. 전체 순서와 의존성

```
Phase 0  T-0   레포 부트스트랩 (pnpm workspace, tsconfig, vitest, 패키지 스캐폴드)
           │
Phase 1  T-T1 → T-T2 → T-T3 → T-T4 → T-T5        tokens        (AC-1 ~ AC-6c)
           │
Phase 2  T-W0 → T-W1 → T-W2 → T-W3/T-W4/T-W5 → T-W6 → T-W7 → T-W8   web   (AC-7 ~ AC-15a, AC-18)
           │
Phase 3  T-V1 (Next) · T-V2 (Vite) → T-V3 (pack 설치)             웹 검증   (AC-16, AC-17, AC-19 웹, AC-24, AC-26 웹)
           │
Phase 4  T-G1 → T-G2                                             C-19 게이트 (통과해야 Phase 5 착수)
           │
Phase 5  T-N0 → T-N1 → T-N2 → T-N3 → T-N4                         native   (AC-20, AC-21, AC-22)   T-N0은 게이트 (2)·(4) 결과로 추가된 토큰 빌드 변경(§2.3)
           │
Phase 6  T-R1                                                    RN 검증   (AC-3 RN, AC-11 RN, AC-19 RN, AC-23, AC-25, AC-26 RN)
           │
Phase 7  T-P1                                                    publish 게이트 (AC-18 최종, lockstep 3패키지 동시 publish)
```

의존성 규칙:

- **Phase 1 → 2 → 3은 C-19 게이트와 무관하게 진행한다.** tokens와 web은 NativeWind에 의존하지 않는다. 단 Phase 1의 토큰 빌드는 native 래퍼 파일도 생성하므로, 게이트 결과에 따라 native 래퍼 내용만 나중에 바뀔 수 있다(§2 (3)·(8))
- **Phase 4는 Phase 3 완료 후가 아니라 Phase 1 완료 후 언제든 시작할 수 있다.** 게이트는 빈 Expo 프로젝트에서 토큰 빌드 산출물(`tokens/themes/base.css` + native 래퍼)과 **T-G1이 만드는 스텁 dist 파일 1개**(v2 F-14. `packages/native/dist`는 Phase 5 산출물이라 게이트 (3)·(8)의 `@source` 스캔 대상은 `bg-brand`를 쓰는 스텁 파일로 대신한다)만 있으면 돌릴 수 있다. 다만 웹 검증을 먼저 끝내는 것을 권장한다 — 웹 검증에서 토큰 산출물의 결함이 잡히면 게이트를 다시 돌려야 하기 때문이다
- **Phase 5·6은 게이트 통과 후에만 착수한다.** native 관련 AC(AC-20 ~ AC-23, AC-25, AC-3 RN절, AC-11 RN절, AC-19 (c), AC-26 RN절)는 전부 게이트 뒤에 있다
- C-19 손절 기준(native 착수 후 2주)은 Phase 5 시작일부터 센다. 시작일은 `docs/gate-c19.md` 말미 "Phase 5 착수일" 항목에 적는다(v2 F-36)
- Phase 7은 웹만 먼저 publish하지 않는다. lockstep 버전(§5.3)이라 3패키지를 함께 낸다. 웹 검증이 끝나고 RN이 진행 중인 기간에는 `workspace:*`로만 소비한다

---

## 2. C-19 착수 게이트

`@eeennsu/native` 구현(Phase 5) 착수 전에 아래 항목을 전부 확인한다. 결과는 `docs/gate-c19.md`에 항목별 통과/실패·확인 방법·고정한 버전을 기록한다(T-G2 산출물).

### 2.1 게이트 실행 환경 (T-G1)

- 새로 만든 빈 Expo 프로젝트 `apps/verify-expo`. NativeWind v5 문서(2026-09-05 조회) 기준 요구 사양은 **Tailwind CSS v4.1+, React Native 0.81+, New Architecture, Reanimated v4+**이며 설치 명령은 `npx expo install nativewind@preview react-native-css@latest react-native-reanimated react-native-safe-area-context` + `npx expo install --dev tailwindcss @tailwindcss/postcss postcss`. 추가로 문서가 요구하는 것(v2 F-23): `package.json`에 `"overrides": { "lightningcss": "1.30.1" }`(미고정 시 `global.css` 역직렬화 오류), `postcss.config.mjs`(`@tailwindcss/postcss`), `nativewind-env.d.ts` 삼중슬래시 참조. 2026-09-05 레지스트리: `nativewind@preview` = 5.0.0-preview.4(peer `tailwindcss >4.1.11`, `react-native-css ^3.0.1`), `react-native-css` 3.0.7(peer RN >=0.81, `@expo/metro-config >=54`), `latest`는 아직 4.2.6
- **Expo SDK(v2 F-9, 사용자 확정)**: 문서 예시는 SDK 54이나 `create-expo-app@latest`는 SDK 57(RN 0.86)을 만들고 peer 범위는 57을 배제하지 않는다. **57로 먼저 게이트를 돌리고**, (7)이 실패하면 `--template blank@sdk-54`로 재생성해 다시 돌린다. 어느 SDK로 통과했는지와 시도 이력을 `docs/gate-c19.md`에 적는다
- NativeWind 버전은 `^` 없이 정확한 버전으로 고정하고, 같은 문자열을 `packages/native/package.json`의 peer와 `apps/verify-expo/package.json`에 쓴다(C-19 고정 정책)
- Metro는 `withNativewind(getDefaultConfig(__dirname))`, PostCSS는 `@tailwindcss/postcss`, babel은 `babel-preset-expo`만(v5는 `nativewind/babel` 프리셋 제거)
- 게이트용 CSS는 Phase 1 산출물 `packages/tokens/themes/base.css`와 native 래퍼를 그대로 쓴다. 게이트에서 토큰 파일을 손대지 않는다. (3)·(8)의 `@source "../dist"` 스캔 대상은 T-G1이 `packages/native/dist/_gate-stub.js`(`className="bg-brand"` 문자열 1줄)로 만들고 T-N1이 실제 dist로 대체한다(v2 F-14)
- 판정 수단은 두 가지를 병행한다 — (a) `jest-expo` + `@testing-library/react-native`의 `toHaveStyle`(NativeWind가 테스트 환경에서 className을 style로 해석할 때), (b) 기기/에뮬레이터 화면 + `useUnstableNativeVariable("--변수")` 값 로그. (a)가 안 되면 (b)만으로 판정하고 그 사실을 기록한다. Windows 환경이므로 (b)는 Android 에뮬레이터 또는 Expo Go 기기. RNTL 14는 `render`가 async(`await render(...)`)이고 peer가 `test-renderer ^1.0.0`(`react-test-renderer` 제거)이므로 T-G1 jest 설정에 반영한다(v2 F-23)

### 2.2 확인 항목

| # | 항목 | 확인 방법 | 통과 기준 | 실패 시 수정할 스펙·AC | 실패 시 계획 변경 |
|---|---|---|---|---|---|
| (1) | `@theme inline` | 토큰 파일의 `@theme inline { --color-brand: var(--bg-brand) }`가 있는 상태에서 `<View className="bg-brand">` 렌더. 배경이 `:root`의 `--bg-brand` 값인지 확인 | 클래스 생성 + 값이 `:root` 변수 해석값 | C-6 산출물 1본 문구, C-5b RN 항목, AC-3 | native용 토큰 파일을 별도 생성(`@theme` 비-inline + 값 직접 기입). AC-5 "동시 전파"는 빌드 스냅샷으로 유지 |
| (2) | `.dark` 루트 셀렉터 | 토큰 파일의 `.dark { --bg-brand: … }` 블록이 있는 상태에서 RN `Appearance.setColorScheme("dark")`로 다크 전환 후 `bg-brand` 값 확인(v2 F-22: NativeWind v5는 자체 `colorScheme.set` API가 없고 `Appearance`를 쓰라고 안내한다. 자체 `useColorScheme`은 deprecated) | 다크 값으로 바뀜(또는 무시되되 `@media` 블록이 대신 동작) | C-20 RN 항목, AC-19 (c) | 무시되면 RN 다크는 (4)의 `@media` 블록만으로 동작하는지 확인하고 C-20 RN 문장을 "`.dark`는 무시, `@media`만 사용"으로 수정 |
| (3) | `@source` | `packages/native/themes/base.css`에 `@source "../dist"`가 있고 dist에 `bg-brand`를 쓰는 파일(T-G1 스텁, v2 F-14)이 있는 상태에서, 소비자 `global.css`에 래퍼 import 한 줄만 두고 클래스가 생성되는지 확인. 소비자 앱 소스에는 `bg-brand`를 쓰지 않는다(래퍼 스캔만으로 생성돼야 함) | 소비자 코드에 클래스 없이도 스타일 적용 | C-3 native 항목, AC-23 | 미지원이면 대안 2개 중 택일 — (a) 소비자 `global.css`에 `@source "../node_modules/@eeennsu/native/dist"` 한 줄 추가를 RN 규칙으로 문서화(C-3 "import 한 줄" RN 예외), (b) RN 컴포넌트 클래스를 빌드 시 CSS로 미리 컴파일해 래퍼에 동봉. (a) 권장 |
| (4) | `:root:not(.light)` | `@media (prefers-color-scheme: dark) { :root:not(.light) { --bg-brand: … } }` 상태에서 `Appearance` 다크로 값 확인. `.light` 클래스가 RN에 개념이 없으므로 `:not(.light)`이 항상 참으로 평가되는지도 확인 | OS 다크에서 다크 값 | C-20 RN 항목, C-6 산출물 | 미지원이면 native 토큰 파일에서 `:not(.light)`을 뺀 `:root` 셀렉터로 낸다(native 전용 산출물 분기). 웹 파일은 무변경 |
| (5) | 복합 폰트 변수 | `@theme { --text-xl: 20px; --text-xl--line-height: 28px; --text-xl--font-weight: 600 }` 상태에서 `<Text className="text-xl">`의 fontSize·lineHeight·fontWeight 확인 | 세 값 모두 적용 | 없음(스펙 C-19 (5)에 대체 경로가 이미 있음) | RN Text 어댑터가 `@eeennsu/tokens`의 `text` JS 객체에서 세 값을 읽어 `style`로 넣는다(T-N2 분기). 이 경우 소비자 `className="text-lg"`는 RN에서 fontSize만 적용될 수 있으므로 `docs/gate-c19.md`에 알려진 동작 후보로 기록 |
| (6) | 소비자 `:root` 재선언 last-wins | 소비자 `global.css`에 래퍼 import 다음 줄에 `:root { --bg-brand: X }` + `.dark` + `@media` 3블록을 쓰고, 라이트/다크 각각에서 `bg-brand` 값이 X/Y인지 확인 | 3블록 모두 last-wins | C-5b RN 항목, AC-26 RN절 | RN 로컬 오버라이드 채널을 `VariableContextProvider` 루트 래핑으로 재설계. 웹 채널 무영향 |
| (7) | Expo SDK · RN 버전 | `nativewind@preview`의 `package.json` peer와 문서 요구 사양을 읽고, `npx create-expo-app@latest`(SDK 57)로 만든 프로젝트에서 (1)~(6)이 도는지 확인. 안 돌면 `--template blank@sdk-54`로 재시도(§2.1, v2 F-9) | 빈 프로젝트가 생성되고 `npx expo start`가 뜬다(수동 확인) + (1)~(6)이 그 SDK에서 판정 가능 | C-19 손절 대체안 검토 → C-3, AC-3, AC-25 | 요구 사양이 현행 Expo SDK와 맞지 않으면 손절 기준과 무관하게 대체안(RN만 Tailwind v3 + NativeWind v4) 검토. 토큰 빌드를 `@theme` CSS + `tailwind.config.js` 두 갈래로 |
| (8) | native 래퍼 구성 | NativeWind v5 문서의 `global.css` 예시는 `@import "tailwindcss/theme.css" layer(theme)` · `preflight.css layer(base)` · `utilities.css` + `@import "nativewind/theme"` 형태다. 래퍼가 C-3대로 `@import "tailwindcss"`를 먼저 포함해도 되는지, `@import "nativewind/theme"`가 필수인지, 소비자 `global.css`에 이미 있는 tailwindcss import와 중복 시 문제가 없는지 확인 | 래퍼 import 한 줄로 RN 컴포넌트 클래스·다크·`:root` 변수가 모두 동작 | C-3 래퍼 규칙(native 항목) | 중복이 문제면 래퍼에서 `@import "tailwindcss"`를 빼고 "소비자 `global.css`에서 tailwindcss(및 `nativewind/theme`) 다음 줄에 래퍼 import"를 규칙으로 문서화(스펙 C-3이 이미 이 대체를 허용) |
| (9) | 테스트 환경 className 해석 | `jest-expo`에서 `<View className="bg-brand">`가 `toHaveStyle({ backgroundColor })`로 검증되는지 | 정보 항목. 통과/실패가 아니라 검증 계층을 정한다 | 없음(AC-25에 격하 규칙이 있음) | 안 되면 AC-11 RN절·AC-25·AC-26 RN절·AC-19 (c)를 className prop 스냅샷 + 수동 확인으로 격하하고 `docs/gate-c19.md`에 명시 |

- CLAUDE.md가 게이트에 포함한 "pnpm peer"(web 래퍼의 `@import "tailwindcss"` peer 해석, C-3)는 웹이 먼저 필요로 하므로 **T-W0에서 선확인**하고, 게이트에서는 (8)로 native 래퍼에 대해 재확인한다
- (1)~(4)·(6)·(7)·(8) 중 하나라도 실패하면 Phase 5를 착수하지 않고 "실패 시 수정할 스펙·AC" 열의 스펙 개정을 먼저 한다. 개정은 스펙 문서에 R24로 기록한다(이 계획이 스펙을 직접 고치지 않는다는 원칙과 별개로, 게이트 실패는 스펙이 예정한 개정 경로다)
- (5)·(9)는 실패해도 착수 가능하며 계획 분기만 바뀐다

### 2.3 게이트 결과 (2026-09-06 실행)

측정 전문은 [gate-c19.md](gate-c19.md), 스펙 개정은 design-system-spec.md "R24 개정 요약". 여기에는 **계획이 바뀐 것만** 적는다.

| # | 결과 | 계획 변경 |
|---|---|---|
| (1) | 통과 | 없음 |
| (2) | **실패** — `.dark`가 RN에서 죽는다 | 토큰 빌드가 native 래퍼에 `@media (prefers-color-scheme: dark) { :root { … } }` 블록을 추가로 낸다. T-T2 래퍼 템플릿 변경 → **T-N0**(아래) |
| (3) | 통과 | 없음. T-N1이 `_gate-stub.js`를 실제 dist로 대체 |
| (4) | **실패** — `:root:not(.light)`의 `:not`이 원인 | (2)와 같은 변경으로 함께 해결. 웹 산출물·`packages/tokens/themes/*.css`는 무변경 |
| (5) | 부분 — lineHeight만 틀린다 | T-N2에 결정 1건이 붙는다(아래 D-31) |
| (6) | 통과 | T-R1의 소비자 `global.css`가 3블록이 아니라 2블록 |
| (7) | **통과**(기기 확인 2026-09-08) | 없음. §5.7 "Expo SDK · RN · NativeWind · react-native-css" 행이 고정됐다 |
| (8) | 통과 — 래퍼 무변경 | §9 S-5(보류) 종결. T-N1의 보류가 풀렸다 |
| (9) | 통과(정보) | T-N1에 확인 1건 추가, T-R1은 `toHaveStyle`로 간다(격하 없음) |

**추가 태스크 T-N0 — native 래퍼 다크 블록 (Phase 5 첫 번째)**

- 읽을 파일: C-6 (R24) 산출물 항목, C-20 RN 항목, `docs/gate-c19.md` (2)·(4)
- 할 일 2건 (둘 다 `packages/tokens/scripts/build-outputs.ts`의 native 래퍼 템플릿):
  1. **다크 블록**(게이트 (2)·(4)) — semantic 다크 값을 `@media (prefers-color-scheme: dark) { :root { … } }` 한 블록으로 추가한다. 값 출처는 web·tokens와 같은 DTCG 소스 1본이고 셀렉터만 다르다
  2. **line-height 단위 없는 배수**(게이트 (5), D-31 (A)) — `@theme { --text-<step>--line-height: <배수> }`를 native 래퍼에서 다시 낸다. 배수 = px ÷ 같은 스텝 fontSize px
- web 래퍼·토큰 CSS는 손대지 않는다
- 완료 조건: `pnpm --filter @eeennsu/tokens build` 후 `packages/native/themes/{base,bakery}.css`에 블록이 있고, 기존 스냅샷 테스트가 갱신된다. 같은 값이 세 곳(토큰 `.dark` · 토큰 `@media` · native 래퍼 `@media`)에 나오므로 **세 블록의 값 동일성을 tokens 테스트가 단언한다**(AC-5 동시 전파)
- 검증: `apps/verify-expo/tests/gate.test.tsx`의 (2)·(4) 특성화 테스트를 "래퍼 다크 블록이 다크에서 적용된다"로 바꾼다
- 닫는 AC: 없음. AC-19 (c)·AC-26 RN절의 전제

**D-31 — (5) lineHeight 처리 경로: (A) native 산출물 분기 (사용자 확정 2026-09-06)**

- **(A) 채택.** native 래퍼가 `--text-<step>--line-height`를 **단위 없는 배수**로 다시 낸다(`28px` → `1.75`. 배수 = px 값 ÷ 같은 스텝의 `--text-<step>` px 값). T-N0이 이미 native 전용 블록을 만드므로 파일이 늘지 않고, Text 어댑터가 필요 없어 `text-<step>` 클래스 한 줄로 세 값이 다 맞는다. 소비자가 `className="text-lg"`를 써도 정상
- (B) 탈락: C-19 (5) 원안(RN Text 어댑터가 `@eeennsu/tokens` JS 객체에서 세 값을 읽어 `style`로 넣는다). 소비자 `className="text-lg"`가 RN에서 fontSize만 적용될 수 있어 AC-25 "웹·RN 클래스 어휘 일치"가 약해진다
- 실행 위치: **T-N0**. 다크 블록과 같은 `build-outputs.ts` native 래퍼 템플릿 변경이라 한 태스크로 묶는다. 값 5스텝 — `sm` 20/14 · `md` 24/16 · `lg` 28/18 · `xl` 28/20 · `2xl` 32/24
- 회귀 가드: `apps/verify-expo/tests/gate.test.tsx`의 (5) 특성화 테스트를 `lineHeight: 28`(정상값) 단언으로 바꾼다

---

## 3. 토큰 인벤토리와 값

토큰 소스는 DTCG JSON 1본(`packages/tokens/src/tokens/`)이며 3계층을 디렉터리로 나눈다. 아래 이름이 곧 인벤토리다. **semantic 색의 `:root` 변수 이름은 정해지는 순간 공개 계약(C-5b)이므로**, 이 절의 이름은 T-T1에서 그대로 파일에 옮기고 이후 변경은 major로 취급한다.

### 3.1 이름 규칙 (3종)

semantic 색 하나에 이름이 세 개 생긴다. 역할이 다르므로 혼동하지 않도록 먼저 고정한다.

| 층 | 예시 | 어디에 존재 | 누가 쓰나 |
|---|---|---|---|
| 토큰 경로 | `semantic.bg.brand` | JSON 소스, JS 객체 | 빌드 스크립트, RN 런타임 코드 |
| `:root` 변수 | `--bg-brand` | 토큰 CSS 파일 `:root` · `.dark` · `@media` 3블록 | **소비자 로컬 오버라이드(C-5b 공개 계약)** |
| `@theme inline` 키 → 클래스 | `--color-brand` → `bg-brand` · `text-brand` · `border-brand` | 토큰 CSS 파일 `@theme inline` 블록 | 컴포넌트 구현, 소비자 `className`, `twMergeConfig` 색 키 |

- `:root` 변수 이름은 `--<그룹>-<이름>` (그룹 = `bg` / `fg` / `border`). `@theme inline` 키는 Tailwind 색 네임스페이스 `--color-<이름>`이라 `bg` 그룹은 이름을 뺀다 — `bg-bg-brand` 같은 클래스를 만들지 않기 위해서다. `fg`·`border` 그룹은 클래스 이름에 그룹을 남긴다(`text-fg-muted`, `border-border-focus`)
- 빌드가 `semanticVariables` 맵(`{ brand: "--bg-brand", "fg-muted": "--fg-muted", … }`)을 JS로 내보낸다. C-5b가 말하는 "twMergeConfig 색 키와 1:1"의 실체가 이 맵이며 별도 문서를 두지 않는다

### 3.2 primitive (전 브랜드 공유, 계약 밖)

`:root` 변수로만 존재하고 `@theme`에 넣지 않는다(C-7). 이름 안정성을 보장하지 않는다(알려진 동작 13).

| 램프 | 키 | 값 |
|---|---|---|
| `gray` | 50 · 100 · 200 · 300 · 400 · 500 · 600 · 700 · 800 · 900 · 950 | Tailwind v4 `theme.css`의 `--color-gray-*` oklch 값을 복사 |
| `blue` | 동일 11단 | Tailwind v4 `--color-blue-*` 복사 |
| `red` | 동일 11단 | Tailwind v4 `--color-red-*` 복사 |
| `amber` | 동일 11단 | Tailwind v4 `--color-amber-*` 복사 |
| `zinc` | 동일 11단 | Tailwind v4 `--color-zinc-*` 복사 (R26, base 다크 중립색) |
| DS 반 단계 | `gray-550` · `blue-550` · `blue-650` | R26. `gray-550`은 gray-500 · 600의 oklch 중간값, `blue-550` = `#206FEA` · `blue-650` = `#1B64DA`(decisions-r26 4 · 6) |
| `white` · `black` | — | `oklch(100% 0 0)` · `oklch(0% 0 0)` |

- 5램프 + 반 단계 3개를 둔다(R26 전에는 4램프). `bakery`가 amber를 쓰고 `base`가 쓰지 않아도 primitive는 공유 계층이라 두 브랜드 파일에 똑같이 들어간다(AC-6a diff에서 primitive 블록은 동일해야 한다)
- 값은 Tailwind v4 기본 팔레트를 출발점으로 복사한다. 자체 팔레트 설계는 v1 범위 밖이며, 값 조정은 primitive라 minor다

### 3.3 semantic 색 (브랜드 주입점, 공개 계약)

17개(R26에서 `fg.brand` 추가). `:root` 변수 이름 열이 C-5b 계약이다. 빌드는 `:root`에 primitive 참조가 아니라 **해석된 값**을 쓴다 — 소비자가 primitive를 모른 채 값을 덮을 수 있어야 하고, RN JS 객체도 해석값이어야 하기 때문이다. 별칭 `border.focus` 하나만 `var()` 참조로 남긴다(R26 전에는 `fg.danger`도 별칭).

| 토큰 경로 | `:root` 변수 | `@theme inline` 키 | base light | base dark | bakery light | bakery dark | 용도 |
|---|---|---|---|---|---|---|---|
| `bg.canvas` | `--bg-canvas` | `--color-canvas` | gray-100 (R26, 이전 white) | zinc-950 (R26, 이전 gray-950) | amber-50 | gray-950 | 페이지 배경 |
| `bg.surface` | `--bg-surface` | `--color-surface` | white | zinc-900 (R26) | white | gray-900 | Card · Dialog · Drawer 배경 |
| `bg.surface-muted` | `--bg-surface-muted` | `--color-surface-muted` | gray-200 (R26) | zinc-800 (R26) | amber-100 | gray-800 | 채움 — Input · Textarea · 고르지 않은 Chip(R26), secondary Button · Badge |
| `bg.surface-hover` | `--bg-surface-hover` | `--color-surface-hover` | gray-300 (R26) | zinc-700 (R26) | amber-200 | gray-700 | secondary · ghost · Chip hover |
| `bg.brand` | `--bg-brand` | `--color-brand` | blue-550 (R26) | blue-550 (R26) | amber-600 | amber-500 | primary Button · Badge primary · 고른 Chip |
| `bg.brand-hover` | `--bg-brand-hover` | `--color-brand-hover` | blue-650 (R26) | blue-650 (R26) | amber-500 (R25, 이전 amber-700) | amber-400 | primary hover |
| `bg.danger` | `--bg-danger` | `--color-danger` | red-600 | red-600 (R26) | red-600 | red-500 | danger Button · Badge danger |
| `bg.danger-hover` | `--bg-danger-hover` | `--color-danger-hover` | red-700 | red-700 (R26) | red-700 | red-400 | danger hover |
| `bg.overlay` | `--bg-overlay` | `--color-overlay` | black / 50% | black / 60% | 동일 | 동일 | Dialog · Drawer 스크림 |
| `fg.default` | `--fg-default` | `--color-fg` | gray-900 | zinc-100 (R26) | gray-900 | gray-50 | `tone="default"` |
| `fg.muted` | `--fg-muted` | `--color-fg-muted` | gray-550 (R26) | zinc-400 (R26) | gray-600 | gray-400 | `tone="muted"`, placeholder |
| `fg.brand` | `--fg-brand` | `--color-fg-brand` | blue-650 (R26 신설) | blue-400 | amber-700 | amber-400 | 브랜드 색 글자(`text-fg-brand`) |
| `fg.danger` | `--fg-danger` | `--color-fg-danger` | red-700 (R26, 이전 `var(--bg-danger)`) | red-400 (R26) | red-600 | red-500 | `tone="danger"` |
| `fg.on-brand` | `--fg-on-brand` | `--color-fg-on-brand` | white | white (R26, 이전 gray-950) | gray-950 (R25, 이전 white) | gray-950 | primary Button 글자 |
| `fg.on-danger` | `--fg-on-danger` | `--color-fg-on-danger` | white | white (R26, 이전 gray-950) | white | gray-950 (R25, 이전 white) | danger Button 글자 |
| `border.default` | `--border-default` | `--color-border` | gray-200 (R26) | zinc-800 (R26) | amber-300 | gray-700 | 소비자 구분선 · Card 경계(DS 컴포넌트는 R26부터 쓰지 않는다) |
| `border.focus` | `--border-focus` | `--color-border-focus` | `var(--bg-brand)` | `var(--bg-brand)` | 동일 | 동일 | focus ring(§4.6) |

- **(R26) `fg.danger`는 더 이상 별칭이 아니다.** 진한 채움 위 흰 글자와 표면 위 글자를 한 값으로 맞출 수 없어 `fg.brand`와 함께 글자용 값을 따로 둔다(decisions-r26 5). 아래는 R26 전의 근거다.
- **(R26 전) `fg.danger`는 `bg.danger`의 별칭이다.** C-8은 "`variant`와 `tone`의 `danger`는 같은 semantic 색(`color.danger`)"이라고 못 박았고, 동시에 `tone`은 `fg.danger`와 1:1이라고 했다. 두 문장을 동시에 만족시키는 방법은 `--fg-danger: var(--bg-danger)`뿐이다. 소비자가 `--bg-danger`를 덮으면 `--fg-danger`가 따라가고, `--fg-danger`만 덮으면 글자색만 바뀐다. `border.focus`도 같은 이유로 `bg.brand` 별칭이다. 별칭 2개는 §9에 스펙 문구 보강 후보로 적었다
- 브랜드 간 차이는 이 표의 값뿐이다. `bakery`는 brand 램프를 amber로, canvas·surface-muted·surface-hover·border를 amber 계열 저채도로 바꾼다. `base`와 실제로 다른 값이 있어야 AC-6a diff가 의미를 가진다(B-3)
- 다크 값은 `.dark` 블록과 `@media (prefers-color-scheme: dark) { :root:not(.light) }` 블록에 **동일하게** 두 번 쓴다(C-20)
- **(R25)** 흰 on-brand · on-danger 가 base 다크(3.7 · 3.8:1)와 bakery 라이트(3.2:1)에서 4.5:1 이 안 돼 gray-950 으로 바꿨다. bakery 라이트 hover 는 어두운 글자와 맞게 밝은 amber-500 이다. tokens 대비 테스트가 두 브랜드 × 두 스킴의 글자 쌍을 본다(구현 노트 F-23)

### 3.4 간격 · radius · shadow (전 브랜드 공유, 비-inline `@theme`)

| 네임스페이스 | 키 | 값 | 비고 |
|---|---|---|---|
| `--spacing-*` | `0` · `1` · `2` · `3` · `4` · `6` · `8` · `12` · `16` · `20` · `24` | `0` · `4px` · `8px` · `12px` · `16px` · `24px` · `32px` · `48px` · `64px` · `80px` · `96px` | C-7a 희소 열거 + 영점. `--spacing-*: initial` 리셋 뒤 선언. 단독 `--spacing: initial`도 함께 쓴다 — 검증 probe(tailwindcss 4.3.3)에서는 `--spacing-*: initial`만으로 `mt-5`·`w-64`가 안 나와 불필요했으나 peer 하한 4.1과의 차이 가능성으로 유지하고 T-T4 (4)가 재확인한다(v2 F-26) |
| `--radius-*` | `sm` · `md` · `lg` · `xl` · `full` | `8px` · `12px` · `16px` · `20px` · `9999px` (R26, 이전 `4px` · `8px` · `12px`, `xl` 없음) | `--radius-*: initial` 리셋 뒤 선언. R23 요구 (b): 나중에 C-5c 계약이 돼도 되는 이름이라 Tailwind 관용 이름을 그대로 쓴다 |
| `--shadow-*` | `sm` · `md` · `lg` | `0 1px 2px oklch(0 0 0 / 0.05)` · `0 4px 8px oklch(0 0 0 / 0.08)` · `0 12px 24px oklch(0 0 0 / 0.12)` | `--shadow-*: initial` 리셋 뒤 선언. RN은 NativeWind가 `boxShadow`로 해석하며(RN 0.81+), 안 되면 Card·Dialog에서만 쓰므로 영향이 작다 |

### 3.5 타이포 (component 계층 `text.<step>`, 비-inline `@theme`)

| step | `--text-<step>` | `--text-<step>--line-height` | `--text-<step>--font-weight` |
|---|---|---|---|
| `sm` | `14px` | `20px` | `400` |
| `md` | `16px` | `24px` | `400` |
| `lg` | `18px` | `26px` (R26, 이전 28) | `600` (R26, 이전 500) |
| `xl` | `22px` (R26, 이전 20) | `30px` (R26, 이전 28) | `700` (R26, 이전 600) |
| `2xl` | `28px` (R26, 이전 24) | `36px` (R26, 이전 32) | `700` |

- `--text-*: initial`과 `--font-weight-*: initial` 리셋 뒤 선언. `text-base`·`font-bold`는 무효(알려진 동작 1)
- RN은 게이트 (5) 결과에 따라 `text-<step>` 클래스 또는 JS 객체 `text.<step>` 폴백(§2)

### 3.6 fontFamily (비-inline `@theme`, 이름·스케일만 소유)

| 키 | 웹 값 | RN 값 | 비고 |
|---|---|---|---|
| `--font-sans` | `"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` | `Pretendard` | **사용자 확정(2026-09-05, §8 D-1)**. 로딩은 소비자 책임(웹 `next/font/local` 또는 `@font-face`, RN `expo-font`). 폰트 파일 미동봉(AC-6c). RN 값은 `expo-font`로 등록하는 패밀리 이름과 일치해야 하며, RN에서 무게별 정적 폰트를 쓸 경우 무게별 이름 등록까지 소비자 책임. **(R26)** native 래퍼가 `--font-sans`를 RN 값 하나로 다시 내고 native 텍스트 컴포넌트가 `font-sans`를 쓴다 |

- `--font-*`는 리셋하지 않고 `--font-sans`만 덮어쓴다(C-6). `--font-mono`·`--font-serif`는 v1에서 선언하지 않으므로 Tailwind 기본값이 남는다. 어휘 봉쇄의 예외이며 §9에 적었다
- R23 요구 (b): 이름은 Tailwind 관용 `--font-sans` 그대로 둔다. 나중에 C-5c 계약이 돼도 바꿀 이유가 없다

### 3.7 `@theme inline` 적용 범위 (R23 요구 (a)의 답)

- **inline은 색 네임스페이스만.** `--color-*`가 `var(--bg-…)`를 참조해야 `:root` 재선언이 클래스와 컴포넌트에 함께 전파된다(C-5b 메커니즘)
- **spacing · radius · shadow · text · font는 비-inline `@theme`.** 값이 리터럴이고 참조할 `:root` 변수가 없다. 비-inline이면 Tailwind가 `:root`에 CSS 변수로 남기므로, `--radius-md`·`--font-sans`는 소비자 `:root` 재선언으로 **기술적으로 덮인다**. T-T4 probe가 이를 확인해 기록한다. 계약은 여전히 semantic 색뿐이며(C-5b), C-5c 트리거 충족 전까지 이름 안정성을 약속하지 않는다
- **T-T4 결과 (2026-09-05, tailwindcss 4.3.3, `packages/tokens/tests/probe.test.ts`)**: R23 요구 (a) 확인됨. `rounded-md`는 `border-radius: var(--radius-md)`, `font-sans`는 `font-family: var(--font-sans)`로 컴파일되므로 토큰 CSS 뒤에 온 소비자 `:root { --radius-md: 2px; --font-sans: X }`가 last-wins로 이긴다. 즉 **C-5c를 열 때 필요한 것은 빌드 변경이 아니라 이름을 계약으로 승격하는 결정뿐**이다. 같은 테스트 파일이 F-26도 재확인했다 — `--spacing: initial`을 빼도 4.3.3에서는 `mt-5`가 생성되지 않는다(즉 현재 버전에서는 불필요). peer 하한 4.1과의 차이 가능성 때문에 §3.11대로 유지한다

### 3.8 component 계층 (소스에는 있으나 CSS 변수로 내지 않음)

component 계층 토큰은 소스에 두되, CSS로 나가는 것은 타이포 스텝(§3.5)뿐이다. 나머지는 컴포넌트 구현이 **정적 클래스 문자열**로 옮겨 쓰고(C-4 (2)), 단위 테스트가 JS 객체와 클래스 문자열의 일치를 검사한다(T-W8). 그 JS 객체는 `@eeennsu/tokens`가 `component`로 export한다(§3.10, v2 F-2). 값은 전부 §3.4·3.5의 열거 키로만 구성한다 — 열거에 없는 40px 같은 높이는 고정 `h-*`가 아니라 `py-* + text-*` 조합으로 만든다.

**테두리와 높이(v2 F-7, 사용자 확정)**: Input은 `border border-border`(1px)를 갖고 Button·Badge는 `border border-transparent`를 갖는다. 컨트롤 셋이 같은 `py + text` 조합에서 같은 높이가 되게 하기 위해서다(테두리 없이 두면 Input이 2px 높다). 결과 높이는 `2 × py + line-height + 2` = **sm 30 / md 42 / lg 52**(R26, 이전 lg 54). **(R26)** Input · Textarea는 `border-transparent` + `bg-surface-muted` 채움이다 — 테두리 1px은 투명으로 남아 높이를 맞추고 포커스 · 오류 때만 색이 생긴다. `border`·`border-transparent`는 정적 유틸리티라 리셋 대상이 아니다.

| 컴포넌트 | 토큰 경로 | sm | md | lg |
|---|---|---|---|---|
| Button | `button.paddingX` / `paddingY` / `text` / `radius` / `gap` | `3` / `1` / `sm` / `md` / `1` (높이 30) | `4` / `2` / `md` / `md` / `2` (높이 42) | `6` / `3` / `lg` / `lg` / `2` (높이 52) |
| Input | `input.paddingX` / `paddingY` / `text` / `radius` | `3` / `1` / `sm` / `md` (높이 30) | `3` / `2` / `md` / `md` (높이 42) | `4` / `3` / `lg` / `md` (높이 52) |
| Textarea | `textarea.rows` (+ Input md 패딩·`md` 텍스트 고정) | `3` | `5` | `8` |
| Badge | `badge.paddingX` / `paddingY` / `text` / `radius` | `2` / `0` / `sm` / `full` | `3` / `1` / `sm` / `full` | — (Badge는 `sm` · `md`) |
| Icon | `icon.size` (px) | `16` | `20` | `24` |
| Card | `card.padding` / `radius` | `6` / `xl` (size 없음. R26, 이전 `4` / `lg` + `shadow` `sm` + 테두리) | | |
| Dialog | `dialog.padding` / `radius` / `shadow` / `maxWidth` | `6` / `xl`(R26, 이전 `lg`) / `lg` / `max-w-md`(container 네임스페이스, 리셋 대상 아님) | | |
| Drawer | `drawer.padding` / `width` | `6` / `max-w-sm w-full` | | |
| Tooltip | `tooltip.paddingX` / `paddingY` / `text` / `radius` | `2` / `1` / `sm` / `sm` | | |

- 색 매핑(variant → semantic)은 §4.2 표에 있다
- `icon.size`는 클래스가 아니라 lucide `size` prop(JS 값)으로 전달한다 — 20px는 spacing 열거 밖(키 5 없음)이라 `size-5` 클래스가 생성되지 않으며(검증 probe 확인), JS 값 전달은 C-4 (2) 정적 클래스 제약과 무관하다(v2 F-8)

### 3.9 `twMergeConfig` (빌드 생성)

```ts
{
  color:   ["canvas","surface","surface-muted","surface-hover","brand","brand-hover","danger","danger-hover","overlay",
            "fg","fg-muted","fg-brand","fg-danger","fg-on-brand","fg-on-danger","border","border-focus",
            "inherit","current","transparent"],   // R26: Tailwind 정적 색(구현 노트 F-28)
  spacing: ["0","1","2","3","4","6","8","12","16","20","24"],
  radius:  ["sm","md","lg","xl","full"],
  shadow:  ["sm","md","lg"],
  text:    ["sm","md","lg","xl","2xl"],
}
```

- 색 키와 text 크기 키가 겹치지 않는다(C-6). `fg`가 `text-fg`(색)와 `text-md`(크기)로 갈리는 것은 키 목록이 해소한다
- 웹·RN이 각자 `extendTailwindMerge({ override: { theme: twMergeConfig } })`로 `cn()`을 만든다. **`override`여야 한다(v2 F-4, B)** — `extend.theme`는 기본 검증자에 concat이라 spacing의 기본 `isNumber`가 남아 `cn("mt-4","mt-5")`가 `"mt-5"`가 되고(DS 기본값 소실, C-15가 막으려던 동작), `override`는 목록으로 교체해 `"mt-4 mt-5"`가 된다. tailwind-merge 3.6.0 probe로 확인했고 `radius`·`shadow`·`color`도 같은 이유로 `override`. 키 이름(`color` / `spacing` / `radius` / `shadow` / `text`)은 v3 theme 키와 일치
- 알려진 동작 후보(v2 F-27): tailwind-merge의 font-size 스케일에 `base`가 하드코딩돼 있어 `cn("text-md","text-base")`는 `"text-base"`가 된다. `text-base`는 리셋으로 CSS가 없으므로 DS 글자 크기가 사라진다. 소비자가 `text-base`를 쓰지 않는 것이 규칙이며 §9 S-18에 기록

### 3.10 JS 객체 (RN 런타임)

```ts
// @eeennsu/tokens                       브랜드 무관
export const spacing, radius, shadow, text, fontFamily, twMergeConfig, semanticVariables
export const component   // { button, input, textarea, badge, icon, card, dialog, drawer, tooltip } — §3.8 값. T-W8 (6)·T-N2가 읽는다 (v2 F-2)
export type { Contracts, Platform, Variant, Size, TypographyStep, ControlSize, BadgeSize, Tone, InputKind, FocusHandle, ElementChildren, IconName, WebKey, NativeKey }
export { webComponents, nativeComponents }   // contracts.ts re-export (v2 F-2)
// @eeennsu/tokens/brands/base, /brands/bakery   브랜드별 해석값
export const colors = { light: { bg: {…}, fg: {…}, border: {…} }, dark: {…} }
```

- RN 앱은 CSS 래퍼 import(`native/themes/base.css`)와 JS import(`tokens/brands/base`)를 같은 브랜드로 맞춘다. 두 경로가 갈려도 DS 컴포넌트는 JS 색 객체를 읽지 않으므로(알려진 동작 11) DS 렌더는 CSS 쪽을 따른다
- 값은 oklch 문자열 그대로 둔다. RN 0.81+가 oklch 색 문자열을 받는지 T-N1에서 확인하고, 안 되면 빌드가 JS 객체에만 hex를 병기한다(CSS 파일은 무변경)

### 3.11 토큰 CSS 파일 구조 (`packages/tokens/themes/<brand>.css`)

```css
/* 생성 파일. 직접 수정 금지 */
:root { /* primitive 전량 */ /* semantic light 해석값 */ }
.dark { /* semantic dark */ }
@media (prefers-color-scheme: dark) { :root:not(.light) { /* semantic dark, 동일 값 */ } }
@theme {
  --color-*: initial; --spacing-*: initial; --spacing: initial;
  --radius-*: initial; --shadow-*: initial; --text-*: initial; --font-weight-*: initial;
  /* spacing, radius, shadow, text, font-sans 선언 */
}
@theme inline { /* --color-<이름>: var(--<그룹>-<이름>) 17개(R26) */ }
```

- 레이어를 쓰지 않는다. 소비자 무레이어 `:root` 재선언이 "같은 셀렉터·같은 특이성·뒤가 이김"으로 덮인다(C-5b). Tailwind가 `@theme` 변수를 `@layer theme`에 넣는 것은 Tailwind 몫이고 semantic `:root` 블록은 DS가 레이어 밖에 직접 쓴다

---

## 4. 컴포넌트 API

### 4.1 공통 타입 (`@eeennsu/tokens/src/contracts.ts`)

```ts
export type Platform = "web" | "native";

export type Variant = "primary" | "secondary" | "ghost" | "danger";          // C-8, 4개 고정
export type Size = "sm" | "md" | "lg" | "xl" | "2xl";                        // C-7a 전역 5단
/** 글자 크기·행간·무게를 함께 바꾸는 타이포 스텝. Text 전용 의미 */
export type TypographyStep = Size;
export type ControlSize = Extract<Size, "sm" | "md" | "lg">;
export type BadgeSize = Extract<Size, "sm" | "md">;
export type Tone = "default" | "muted" | "danger";                           // C-8
export type InputKind = "text" | "password" | "email" | "number";            // C-11
export type FocusHandle = { focus(): void; blur(): void };                   // C-17 ref 핸들

/** 컨테이너 children: 문자열 제외 엘리먼트 노드 (C-17) */
export type ElementChildren = ReactElement | boolean | null | undefined | ElementChildren[];

type Press<P extends Platform> = P extends "web" ? { onClick?: () => void } : { onPress?: () => void };
```

- 공통 규칙: 모든 컴포넌트가 `className?: string`을 받고, `style`을 받지 않으며, `{...rest}` 스프레드가 없다(AC-11a). 계약 타입은 `interface`가 아니라 닫힌 `type` 리터럴로 정의해 AC-11a·AC-15 mapped type 테스트가 "선언된 키 전부"를 순회할 수 있게 한다
- 웹·RN이 구현하는 값은 `FC<Props>`다. React 19에서 `ref`는 일반 prop이므로 `ref?: Ref<FocusHandle>`을 Props에 포함한다(C-4a 최소 버전 근거)

### 4.2 컴포넌트별 축 매트릭스

| 컴포넌트 | 플랫폼 | `variant` | `size` | `tone` | `label` | 제어 API | `ref` | `children` | 그 외 prop |
|---|---|---|---|---|---|---|---|---|---|
| Button | web · native | `Variant` (기본 `primary`) | `ControlSize` (기본 `md`) | — | 필수 | 웹 `onClick` / RN `onPress` | `FocusHandle` | 없음 | `icon?: IconName`, `loading?: boolean`, `disabled?: boolean` |
| ButtonGroup | web | — | — | — | 필수 (`role="group"` + `aria-label`) | — | — | `ReactElement \| ReactElement[]` (Button 엘리먼트. 타입으로 Button만 강제하지는 않는다) | — |
| Input | web · native | — | `ControlSize` (기본 `md`) | — | 필수 (`aria-label` / `accessibilityLabel`) | `value?` / `defaultValue?` / `onValueChange?: (value: string) => void` | `FocusHandle` | 없음 | `kind?: InputKind` (기본 `text`), `id?: string`, `placeholder?: string`, `disabled?: boolean`, `invalid?: boolean` |
| Textarea | web | — | `ControlSize` (행수, 기본 `md`) | — | 필수 | Input과 동일 3종 | `FocusHandle` | 없음 | `id?`, `placeholder?`, `disabled?`, `invalid?` |
| Label | web | — | — | — | — | — | — | `string \| string[]` (v2 F-1) | `htmlFor?: string` |
| Card | web · native | — | — | — | — | — | — | `ElementChildren` | — |
| Badge | web | `Extract<Variant, "primary" \| "secondary" \| "danger">` (기본 `secondary`) | `BadgeSize` (기본 `sm`) | — | — | — | — | `string \| string[]` (v2 F-1) | — |
| Chip (R25) | web · native | — | — (한 크기, 높이 38) | — | 필수 (가시 텍스트 겸 접근성 이름) | 웹 `onClick` / RN `onPress` | `FocusHandle` | 없음 | `selected?: boolean`(제어 전용), `disabled?: boolean` |
| Icon (R25) | web · native | — | `ControlSize` (기본 `md`, 16 · 20 · 24) | `Tone` (기본 `default`) | 선택 (있으면 그림, 없으면 꾸밈) | — | — | 없음 | `name: IconName` |
| Text | web · native | — | `TypographyStep` (기본 `md`) | `Tone` (기본 `default`) | — | — | — | `string \| string[]` | `heading?: "1" \| "2" \| "3"` |
| Stack | web · native | — | — | — | — | — | — | `ElementChildren` | `direction?`, `align?`, `justify?`, `wrap?` (§4.4) |
| Box | web (RN은 v2. v2 F-13) | — | — | — | — | — | — | `ElementChildren` | — |
| Tooltip | web | — | — | — | 필수 (표시 내용 겸 접근성 설명) | `open?` / `defaultOpen?` / `onOpenChange?: (open: boolean) => void` | — | `ReactElement` (앵커 1개) | `side?: "top" \| "bottom" \| "left" \| "right"` (기본 `top`) |
| Dialog | web | — | — | — | 필수 (제목으로 렌더, `aria-labelledby`) | 오버레이 3종 | — | `ReactNode` | — |
| Drawer | web | — | — | — | 필수 (제목으로 렌더, `aria-labelledby`) | 오버레이 3종 | — | `ReactNode` | `side?: "left" \| "right" \| "bottom"` (기본 `right`) |
| Form | web | — | — | — | — | — | — | `ReactNode` | — |

- `invalid`는 `disabled`·`loading`과 같은 기능 불리언(C-11 예외)이다. Form v1의 오류 표시(C-21)에서 Input 테두리를 danger로 바꾸는 유일한 경로다
- `wrap`은 AC-8이 명시한 기능 불리언이다
- `side`는 열거형 prop이라 C-11에 맞고 RN 대응물이 없어도 웹 전용 컴포넌트라 C-17 "플랫폼 전용 prop 0개"에 걸리지 않는다(Tooltip · Drawer는 v1 웹 전용이며 계약은 tokens에 놓여 v2 RN이 같은 계약을 구현한다)
- Card에 `variant`를 두지 않는다. 표면 하나뿐이고 색을 바꾸려면 `className`이다
- ButtonGroup에 `size`를 두지 않는다(v2 F-18, 사용자 확정). r21 B-8·C-7a는 ButtonGroup을 `size` 컨트롤로 열거하지만 C-13·AC-7·AC-13에는 없다. 자식 Button이 각자 `size`를 가지며, 나중에 그룹 `size`(context 전파)를 추가하는 것은 추가적이다. §9 S-16
- Label·Badge `children`은 `string | string[]`(v2 F-1, 사용자 확정). 스펙 C-17(텍스트 3종 `string | string[]`)과 AC-7(`string`)이 갈리며 Text와 통일하는 쪽을 택했다. `<Badge>{n}개</Badge>` 같은 보간을 허용한다. §9 S-11

**variant → semantic 색 매핑** (Button · Badge 공통. Badge는 hover 없음)

| `variant` | 배경 | 글자 | hover 배경 | 테두리 |
|---|---|---|---|---|
| `primary` | `bg-brand` | `text-fg-on-brand` | `hover:bg-brand-hover` | `border-transparent` (v2 F-7, §3.8) |
| `secondary` | `bg-surface-muted` | `text-fg` | `hover:bg-surface-hover` | `border-transparent` |
| `ghost` | 투명 | `text-fg` | `hover:bg-surface-hover` | `border-transparent` |
| `danger` | `bg-danger` | `text-fg-on-danger` | `hover:bg-danger-hover` | `border-transparent` |

- **(R25)** 눌림 표시는 variant 와 무관하게 `active:opacity-80` 이다. hover 색을 눌림에 쓰면 소비자가 바꾼 배경(`className="bg-danger"`)을 무시하고 누를 때만 brand-hover 로 칠해진다. RN 은 여기에 누름 영역(세로 `hitSlop` sm 9 · md 3, 최소 폭 `min-w-12`)을 더한다(구현 노트 N-17)
- `disabled`는 `opacity-50 pointer-events-none`(정적 유틸리티, 리셋 대상 아님). `loading`은 `icon` 자리에 `loader` 아이콘을 회전시키고 `disabled`와 같은 상태로 만든다. `label`은 항상 렌더한다(알려진 동작 7·9)
- variant별 클래스는 `Record<Variant, string>` 객체 맵으로 둔다(C-4 (2) 정적 리터럴)

### 4.3 오버레이 세부 (웹, Base UI)

Base UI 패키지는 `@base-ui/react`(구 `@base-ui-components/react`에서 2025-12-11 v1.0.0 때 개명. 2026-09-05 최신 1.8.0, peer `react ^17 || ^18 || ^19`. T-W1에서 설치 시점의 stable 버전을 고정). 파트별 import(`@base-ui/react/dialog` 등)를 쓴다. `onOpenChange`는 `(open, eventDetails)` 2인자라 DS가 boolean 하나로 감싼다(T-W7). 1.8에는 `Dialog.Viewport`·`Tooltip.Viewport` 파트가 있으며 필수 여부는 T-W7에서 확인한다(v2 F-28).

| DS | Base UI 파트 | 처리 |
|---|---|---|
| Dialog | `Dialog.Root` (`open` · `defaultOpen` · `onOpenChange` 그대로 전달) → `Dialog.Portal` → `Dialog.Backdrop`(`bg-overlay`) → `Dialog.Popup`(§3.8 recipe + `className` 병합) → `Dialog.Title`(`label` 렌더, `text-xl`) + `children` + 닫기 버튼(`Dialog.Close`, 내부 아이콘 버튼, 공개 계약 아님 — 알려진 동작 9) | `Dialog.Trigger`는 쓰지 않는다(C-12: v1은 제어 API만). `aria-labelledby`는 Base UI가 `Title`로 자동 연결 |
| Drawer | Dialog와 같은 파트 구성. `Popup`에 `side`별 고정 위치 클래스(`fixed inset-y-0 right-0`, …) + `max-w-sm w-full` | 별도 라이브러리 없이 Dialog로 구현. 스와이프 닫기 없음 |
| Tooltip | `Tooltip.Provider`(패키지 내부에서 컴포넌트마다 감싼다 — 소비자 설정 0) → `Tooltip.Root`(제어 3종) → `Tooltip.Trigger render={children}`(앵커) → `Tooltip.Portal` → `Tooltip.Positioner side={side}` → `Tooltip.Popup`(`label` 렌더) | `render`는 내부 구현 디테일(C-10). 앵커 `children`은 `ReactElement` 1개 — Base UI `render`가 엘리먼트 하나를 요구하고, DS Button을 앵커로 쓸 때 Button이 `ref`를 일반 prop으로 받으므로 React 19에서 Base UI가 ref를 주입할 수 있다. Button 이외의 앵커는 소비자 책임(ref를 전달하는 엘리먼트여야 한다) |

- 세 컴포넌트 모두 `"use client"`. Portal 대상은 Base UI 기본(`document.body`)
- 애니메이션은 v1에서 Tailwind 정적 유틸리티(`transition-opacity`)만. Base UI의 `data-open` 속성에 `data-[open]:` 변형을 쓰며 이는 리셋 대상이 아니다
- Dialog 안의 Form은 별도 처리 없음(C-21)

### 4.4 Stack · Box

| | Stack | Box |
|---|---|---|
| 역할 | flex 컨테이너. 배치의 1순위 수단 | 아무 스타일 없는 블록 컨테이너(웹 `div`. RN `View` 구현은 v2 — AC-20의 5개에 없다, v2 F-13). `className`을 붙일 자리 |
| `direction` | `"row" \| "column"` (기본 `column`) | — |
| `align` | `"start" \| "center" \| "end" \| "stretch"` (기본 `stretch`) → `items-*` | — |
| `justify` | `"start" \| "center" \| "end" \| "between"` (기본 `start`) → `justify-*` | — |
| `wrap` | `boolean` (기본 `false`) → `flex-wrap` | — |
| 간격 | 없음. 소비자 `className="gap-4"` (C-14) | 없음 |
| `children` | `ElementChildren` | `ElementChildren` |

- AC-8은 두 컴포넌트를 묶어 "API는 `direction` / `align` / `justify` / `wrap`"이라고 썼고 역할 구분을 계획으로 넘겼다. 이 계획은 **Stack만 네 prop을 갖고 Box는 `children` + `className`뿐**으로 가른다. Box에 같은 네 prop을 주면 두 컴포넌트가 동일해져 둘 중 하나가 죽은 코드가 된다. `align`·`justify`는 `items-*` / `justify-*`의 Tailwind 이름을 따르되 `flex-start` 같은 CSS 원어는 쓰지 않는다(`start`·`end`가 웹·RN 어휘에서 같다)
- RN Stack은 `View`에 `flex-row` / `flex-col`. RN의 `View`는 기본이 column이라 웹도 기본을 `column`으로 맞춘다

### 4.5 `IconName`

- **소스: `@eeennsu/tokens`에 큐레이션한 문자열 리터럴 유니온.** lucide 전체 이름을 타입으로 파생하지 않는다 — 계약이 tokens에 있어 lucide 패키지에 의존할 수 없고, 1,500개 유니온은 타입 검사 비용만 늘리며, 웹·RN lucide 패키지 버전이 어긋나면 이름이 갈린다
- v1 목록 24개: `check` `x` `plus` `minus` `trash` `pencil` `search` `chevron-down` `chevron-up` `chevron-left` `chevron-right` `arrow-left` `arrow-right` `menu` `settings` `user` `mail` `lock` `eye` `eye-off` `info` `alert-circle` `loader` `external-link`
- **(R25)** 4개를 더해 28개: `home`(House) `list`(List) `chart-pie`(ChartPie) `calendar`(Calendar). 버튼 밖에서는 공개 `Icon`(`name` · `size` · `tone` · `label?`)으로 쓴다. 공개 Icon 은 색을 상속하지 않고 `tone` 으로 갖는다 — 아래 `currentColor` 는 Button 안의 아이콘(`Glyph`) 얘기다. RN 은 lucide 를 아이콘별 경로(`lucide-react-native/icons/<이름>`)로 import 한다(Metro 는 tree shaking 이 없다, 구현 노트 F-22)
- 웹 `packages/web/src/icon.tsx`: `const icons: Record<IconName, LucideIcon> = { check: Check, trash: Trash2, "alert-circle": CircleAlert, … }` — `Record<IconName, …>`이라 목록에 있는데 매핑이 빠지면 컴파일 에러. RN도 `lucide-react-native`로 동일 맵. 이름 추가는 tokens 목록 + 양쪽 맵 3곳이며 한쪽만 고치면 타입 에러가 잡는다. 맵에는 lucide **정식 export 이름**만 쓴다(v2 F-6: lucide 1.41.0에서 `AlertCircle`은 `CircleAlert`의 별칭이며 별칭은 major에서 사라질 수 있다). 24개 전부 `lucide-react`·`lucide-react-native` 1.41.0 양쪽에 존재함을 검증에서 확인
- 크기는 `icon.size`(§3.8)를 lucide `size` prop으로 전달(v2 F-8), 색은 `currentColor`(글자색 상속. C-7c "색은 토큰으로"의 간접 형태, §9 S-17). `size`·`color` prop 없음
- AC-15a: `icon="nope"`·`icon={<Trash />}` 모두 타입 에러. T-W8 타입 테스트

### 4.6 focus ring

- semantic `border.focus`(`--color-border-focus`, `bg.brand` 별칭) 하나로 통일한다. 별도 `ring` 토큰을 두지 않는다
- 웹: 포커스 가능 컴포넌트(Button · Chip(R25) · Input · Textarea · Dialog 닫기 버튼)에 `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus`. `outline-2`·`outline-offset-2`는 정적 유틸리티라 리셋과 무관하고, 색은 `--color-*` 네임스페이스라 DS 어휘 안이다. `ring-*`은 `--color-ring` 같은 별도 기본값에 기대므로 쓰지 않는다
- RN: Input에 NativeWind `focus:border-border-focus`(TextInput은 `focus:` 변형 지원). Button은 RN에서 키보드 포커스 개념이 약해 v1 무처리. **(R25)** 0.2.0 구현에서 Input · Textarea 의 이 클래스가 빠져 있었고 0.3.0 에서 넣었다(Chip 도 Button 처럼 무처리)

### 4.7 Input · Label · Form 연결

- `kind` → 속성 매핑은 C-11 표를 그대로 구현한다. 자동완성 힌트도 C-11대로 파생한다
- Label ↔ Input: `Label htmlFor` = `Input id`. Input이 `id`를 안 받으면 라벨 연결 없이 `aria-label`만 남는다
- Form: `<form onSubmit={e => e.preventDefault()} className={cn("flex flex-col gap-4", className)}>`. Base UI `Form`은 쓰지 않는다 — Base UI `Form`의 가치는 `errors` 전파인데 v1은 submit·검증 개념이 없고(C-21), Base UI `Field`에 Input을 묶으면 Input 단독 사용과 Form 안 사용의 DOM이 달라진다. 오류 텍스트는 소비자가 `Text tone="danger"`를 놓는다. C-21이 "Base UI `Form` / `Field`를 내부 기반으로 쓰되"라고 한 부분과의 차이는 §9에 적었다

### 4.8 `Contracts<P>` 초안

```ts
export type Contracts<P extends Platform> = {
  Button: { label: string; variant?: Variant; size?: ControlSize; icon?: IconName; loading?: boolean; disabled?: boolean;
            className?: string; ref?: Ref<FocusHandle> } & Press<P>;
  ButtonGroup: { label: string; children: ReactElement | ReactElement[]; className?: string };
  Input: { label: string; kind?: InputKind; size?: ControlSize; id?: string; placeholder?: string; disabled?: boolean; invalid?: boolean;
           value?: string; defaultValue?: string; onValueChange?: (value: string) => void; className?: string; ref?: Ref<FocusHandle> };
  Textarea: { label: string; size?: ControlSize; id?: string; placeholder?: string; disabled?: boolean; invalid?: boolean;
              value?: string; defaultValue?: string; onValueChange?: (value: string) => void; className?: string; ref?: Ref<FocusHandle> };
  Label: { children: string | string[]; htmlFor?: string; className?: string };                       // v2 F-1
  Card: { children: ElementChildren; className?: string };
  Badge: { children: string | string[]; variant?: Extract<Variant, "primary" | "secondary" | "danger">; size?: BadgeSize; className?: string };  // v2 F-1
  Text: { children: string | string[]; tone?: Tone; size?: TypographyStep; heading?: "1" | "2" | "3"; className?: string };
  Stack: { children: ElementChildren; direction?: "row" | "column"; align?: "start" | "center" | "end" | "stretch";
           justify?: "start" | "center" | "end" | "between"; wrap?: boolean; className?: string };
  Box: { children: ElementChildren; className?: string };
  Tooltip: { label: string; children: ReactElement; side?: "top" | "bottom" | "left" | "right";
             open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; className?: string };
  Dialog: { label: string; children: ReactNode; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; className?: string };
  Drawer: { label: string; children: ReactNode; side?: "left" | "right" | "bottom";
            open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; className?: string };
  Form: { children: ReactNode; className?: string };
};

export const webComponents = ["Button","ButtonGroup","Input","Textarea","Label","Card","Badge","Text","Stack","Box","Tooltip","Dialog","Drawer","Form"] as const;
export const nativeComponents = ["Button","Input","Card","Stack","Text"] as const;
export type WebKey = (typeof webComponents)[number];
export type NativeKey = (typeof nativeComponents)[number];
```

- 맵 테스트(C-17): web은 `expectTypeOf<typeof components>().toEqualTypeOf<{ [K in WebKey]: FC<Contracts<"web">[K]> }>()`, native는 `NativeKey` × `Contracts<"native">`
- 위 초안은 착수 전 모습이다. 지금 목록은 `packages/tokens/src/contracts.ts` 에 있다 — 웹 16개(Chip · Icon 추가, R25), RN 11개(N-16 의 4개와 Chip · Icon)
- 실제로 깨지는지 확인(AC-21): T-N4에서 native Button에 임시로 prop 하나를 추가하고 `vitest --typecheck`가 실패하는 것을 기록한 뒤 되돌린다. 컴포넌트 누락도 같은 방식으로 1회 확인

---

## 5. 패키지 구성

### 5.1 레포 구조

```
design-system/
├─ pnpm-workspace.yaml        packages: ["packages/*", "apps/*"]
├─ package.json               private. 루트 스크립트(build · test · verify · version:set)만. 스크립트는 전부 node(.mjs)로 — Windows PowerShell에서 셸 스크립트가 안 돈다 (v2 F-37)
├─ .gitattributes             `* text=auto eol=lf` — 생성물을 추적하면서 "두 번 실행 diff 0"·스냅샷을 쓰므로 autocrlf 흔들림 차단 (v2 F-25)
├─ .github/workflows/ci.yml   pnpm install → pnpm -r build → pnpm -r test(--typecheck 포함). C-17 "CI에 vitest --typecheck" (v2 F-20)
├─ tsconfig.base.json
├─ vitest.config.ts           test.projects: ["packages/*"] — `vitest.workspace`는 3.2 deprecated·4.0 제거, 현재 5.0 (v2 F-5)
├─ packages/
│  ├─ tokens/                 @eeennsu/tokens
│  │  ├─ src/tokens/{primitive,semantic,component}/*.json   DTCG 소스
│  │  ├─ src/contracts.ts     Contracts · 키 목록 · IconName
│  │  ├─ scripts/build.ts     CSS · JS · twMergeConfig · 래퍼 4개 생성
│  │  ├─ themes/{base,bakery}.css     생성. 내부 산출물
│  │  └─ dist/                tsc + 생성 JS
│  ├─ web/                    @eeennsu/web
│  │  ├─ src/{button,input,…}.tsx · src/cn.ts · src/icon.tsx · src/index.ts
│  │  ├─ themes/{base,bakery}.css     tokens 빌드가 생성
│  │  └─ dist/                tsc 출력(파일별, 번들 없음)
│  └─ native/                 @eeennsu/native (Phase 5)
│     ├─ src/…  themes/…  dist/
└─ apps/                      검증 앱. private. publish 대상 아님
   ├─ verify-next/            AC-16 · AC-19 (b) · AC-24 · AC-26 웹
   ├─ verify-vite/            AC-17 · AC-19 (a)
   └─ verify-expo/            게이트 · AC-23 · AC-19 (c) · AC-25 · AC-26 RN
```

### 5.2 exports · peer dependencies

**`@eeennsu/tokens`**

```jsonc
{
  "exports": {
    ".":               { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
    "./brands/base":   { "types": "./dist/brands/base.d.ts", "default": "./dist/brands/base.js" },
    "./brands/bakery": { "types": "./dist/brands/bakery.d.ts", "default": "./dist/brands/bakery.js" },
    "./themes/*.css":  "./themes/*.css"          // 내부 산출물. 래퍼가 import. 문서화하지 않는다
  },
  "sideEffects": false,
  "peerDependencies": { "@types/react": "*" },   // contracts.ts가 Ref·ReactElement·ReactNode를 react에서 import하므로 .d.ts 해석에 필요. peerDependenciesMeta optional (v2 F-31)
  "peerDependenciesMeta": { "@types/react": { "optional": true } }
}
```

**`@eeennsu/web`**

```jsonc
{
  "exports": {
    ".":              { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
    "./themes/*.css": "./themes/*.css"
  },
  "sideEffects": ["*.css"],
  "dependencies":     { "@eeennsu/tokens": "workspace:*", "@base-ui/react": "<T-W1 고정>", "lucide-react": "<T-W1 고정>", "tailwind-merge": "^3" },
  "peerDependencies": { "react": ">=19", "react-dom": ">=19", "tailwindcss": ">=4.1" }
}
```

**`@eeennsu/native`**

```jsonc
{
  "exports": {
    ".":              { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
    "./themes/*.css": "./themes/*.css"
  },
  "sideEffects": ["*.css"],
  "dependencies":     { "@eeennsu/tokens": "workspace:*", "lucide-react-native": "<T-N1 고정. lucide-react와 같은 버전>", "tailwind-merge": "^3" },
  "peerDependencies": { "react": ">=19", "react-native": ">=0.81", "react-native-svg": "*", "nativewind": "<게이트가 고정한 정확한 preview 버전>", "react-native-css": "<게이트 고정>", "tailwindcss": ">=4.1" }
}
```

- `@eeennsu/tokens`는 web·native의 **일반 의존성**이다. 소비자가 tokens를 직접 설치하지 않아도 래퍼 CSS의 `@import "@eeennsu/tokens/themes/base.css"`가 web 패키지의 `node_modules`에서 해석된다. RN 소비자가 JS 객체를 쓰려고 tokens를 직접 설치하면 버전이 두 벌이 될 수 있으므로 lockstep(§5.3)으로 항상 같은 버전만 존재하게 한다
- `tailwindcss`는 web·native 양쪽 peer다. 래퍼의 `@import "tailwindcss"`가 이 peer로 해석돼야 한다(T-W0 확인)
- `nativewind`는 peer이되 **정확한 버전**을 적는다(C-19 고정 정책). peer에 범위가 아닌 정확한 버전을 쓰는 것이 이례적이지만 스펙이 요구하는 바이며, 승격 후 한 번만 올린다
- `react-native-svg`는 `lucide-react-native`의 peer라 소비자에게 요구된다. Expo 기본 템플릿에 포함되는지 T-G1에서 확인하고 없으면 AC-23 설치 절차에 한 줄 추가한다

### 5.3 버전 · 릴리스

- **lockstep**: 세 패키지가 항상 같은 버전 문자열을 갖고 함께 publish한다. `workspace:*`는 publish 시 정확한 버전으로 치환된다. 한 패키지만 바뀌어도 셋을 같이 올린다 — 계약 타입이 tokens에 있어 web·native가 tokens의 특정 버전과만 맞기 때문이다
- 초기 버전 `0.1.0`. 계약 이름 변경(semantic 변수 · prop 이름)은 0.x에서도 minor 대신 **major 상당으로 CHANGELOG에 표시**한다
- changesets·turborepo는 쓰지 않는다(스펙 "실제로 아플 때 추가"). 버전 올리기는 루트 node 스크립트 `pnpm version:set <v>`가 세 `package.json`을 동시에 갱신한다(v2 F-37)
- publish는 `pnpm -r publish --access public`. T-P1 게이트를 통과한 뒤에만 실행한다

### 5.4 빌드 도구

| 패키지 | 도구 | 이유 |
|---|---|---|
| tokens | `tsx scripts/build.ts` + `tsc` | DTCG 파싱과 CSS 문자열 생성은 200줄 안팎이라 Style Dictionary를 들이지 않는다. 산출물은 CSS 2개 · 래퍼 4개 · JS 3개 · `twMergeConfig` · `semanticVariables` |
| web · native | `tsc`만 (번들러 없음) | (1) 파일별 `"use client"` 지시어를 그대로 보존한다 — 번들러가 지시어를 지우는 문제(C-4 (1))가 원천 차단된다. (2) dist가 파일별로 남아 래퍼의 `@source "../dist"` 스캔이 정적 클래스 문자열을 그대로 읽는다. (3) `.d.ts`가 같은 실행에서 나온다(AC-18). 소비자 번들러(Next · Vite · Metro)가 트리셰이킹을 맡는다 |

- `"use client"` 보존은 T-W8의 dist 검사 테스트가 확인한다(인터랙티브 컴포넌트 파일 첫 줄)
- ESM만 낸다. CJS 이중 출력은 하지 않는다(Next 15+ · Vite · Metro 전부 ESM 소비 가능. 안 되면 그때 추가)

### 5.5 테스트 러너

`packages/*` 러너는 **2개**(Vitest · Playwright)이고, RN 런타임 테스트만 검증 앱 `apps/verify-expo` 안의 `jest-expo`가 맡는다(레포 전체로는 3개. v2 F-32).

| 러너 | 위치 | 담당 |
|---|---|---|
| **Vitest** (`--typecheck` 포함) | `packages/*` | 빌드 스냅샷(AC-5) · diff(AC-6a) · probe 컴파일(AC-6, AC-6b) · 타입 테스트(AC-9 · 10 · 11a · 12 · 13 · 14 · 15 · 15a · 21) · 웹 단위(jsdom + `@testing-library/react`, AC-11 단위 · AC-22 웹 대응) · dist 검사(C-4, AC-18) |
| **Playwright** | `apps/verify-next` · `apps/verify-vite` | AC-16 · AC-17 · AC-19 (a)(b) · AC-24 · AC-26 웹 (a)~(d). computed style을 `@eeennsu/tokens/brands/base` JS 값과 비교 |
| `jest-expo` + `@testing-library/react-native` | `apps/verify-expo`만 | 게이트 (9) · AC-11 RN · AC-19 (c) · AC-22 · AC-25 · AC-26 RN. `packages/native`는 Vitest 타입 테스트만 갖는다 |

- `packages/native`에서 RN 런타임 테스트를 돌리지 않는 이유: RN 컴포넌트 렌더는 Metro 변환·`react-native` preset이 필요해 Vitest에 얹기 어렵고, `jest-expo`를 패키지에 넣으면 러너가 3개가 된다. 검증 앱이 어차피 `jest-expo`를 가지므로 RN 런타임 검증을 거기로 모은다
- probe 컴파일은 `@tailwindcss/node`의 `compile()`에 토큰 CSS와 후보 클래스 목록을 넣어 출력 CSS를 문자열로 검사한다. 브라우저 불필요

### 5.6 검증 앱 위치와 설치 방식

- **레포 안 `apps/`** (위 §5.1). 형제 프로젝트를 쓰지 않는다(C-4a). 새 빈 프로젝트 3개를 각 프레임워크 공식 생성기로 만든다 — `create-next-app`(Tailwind v4 옵션), `create-vite`(react-ts) + Tailwind v4 수동 설치, `create-expo-app`(게이트가 정한 SDK)
- 개발 중에는 `workspace:*`로 DS를 소비한다. **AC-16 · AC-17 · AC-23의 "설치" 판정은 T-V3 · T-R1에서 `pnpm pack` 타르볼을 `file:` 경로로 설치해 다시 돌린다** — `workspace:*`는 심링크라 exports 맵·`files` 필드·`.d.ts` 동봉(AC-18)을 검증하지 못하기 때문이다
- **타르볼 설치는 워크스페이스 밖에서 한다(v2 F-11).** `pnpm pack`은 `workspace:*`를 실제 버전으로 치환하므로 web 타르볼은 `@eeennsu/tokens@0.1.0`을 npm에서 찾다 실패한다(`ERR_PNPM_FETCH_404`, probe 확인). 루트 `pnpm.overrides`로 tokens 타르볼을 지정하면 풀리지만 워크스페이스 소스 `packages/web`의 `workspace:*`까지 타르볼 사본으로 바뀐다. 그래서 `pnpm verify:pack`(node 스크립트)은 (1) tokens·web(T-R1은 native 포함)을 pack, (2) `apps/verify-*`를 워크스페이스 밖 임시 디렉터리로 복사, (3) 그 앱 `package.json`에 `"@eeennsu/web": "file:…tgz"` + `pnpm.overrides: { "@eeennsu/tokens": "file:…tgz" }`, (4) `pnpm install --ignore-workspace`, (5) Playwright/jest 실행. `apps/*` 원본은 `workspace:*`를 유지한다
- 검증 앱은 `private: true`이고 publish 대상이 아니다. Playwright · jest 설정은 각 앱 안에 둔다
- Expo 검증은 Windows 환경이라 iOS 시뮬레이터가 없다. Android 에뮬레이터 또는 Expo Go 기기로 화면 확인을 하고, 기기 확인이 필요한 항목은 결과 문서에 "수동 확인(Android)"으로 적는다

### 5.7 T-0에서 고정할 버전 (기록 위치: 루트 `package.json` + `docs/gate-c19.md`)

| 항목 | 기준 | 비고 |
|---|---|---|
| Node · pnpm | LTS · 최신 9.x 이상 | `packageManager` 필드에 고정 |
| TypeScript | 5.x 최신 | `Extract`·mapped type 테스트만 필요 |
| React · React DOM | `>=19` peer, 개발 의존성은 최신 19.x | C-4a |
| Tailwind CSS | `>=4.1` peer, 개발 의존성은 최신 4.x(검증 시점 4.3.3) | NativeWind v5 요구 사양과 동일 하한. web도 4.1로 두는 이유는 web·native 하한을 하나로 유지해 소비자 안내를 한 줄로 하기 위해서다(v2 F-34). 스펙 C-4a `>= 4`보다 높은 쪽이라 위반 아님 |
| `@base-ui/react` | T-W1 설치 시점 stable | 파트별 import |
| `lucide-react` · `lucide-react-native` | 같은 버전 | 아이콘 이름 일치 |
| `tailwind-merge` | 3.x | `extendTailwindMerge` |
| Vitest · Playwright | 최신 | — |
| Expo SDK · RN · NativeWind · `react-native-css` | **고정 완료(2026-09-06)** — Expo SDK 57(`expo ~57.0.20`) · `react-native 0.86.3` · `nativewind 5.0.0-preview.4` · `react-native-css 3.0.7` | T-G1. `lightningcss 1.30.1`도 함께 고정(`react-native-css` peer). 전체 목록은 [gate-c19.md](gate-c19.md) |

---

## 6. 구현 태스크

각 태스크는 "읽을 파일 → 완료 조건 → 닫는 AC" 순으로 적는다. 완료 조건은 전부 자동 확인이 원칙이고, 수동 확인이 섞이면 명시한다. "읽을 파일"의 스펙 위치는 [design-system-spec.md](design-system-spec.md)의 절 이름이다.

### Phase 0

**T-0 레포 부트스트랩**
- 읽을 파일: 스펙 "패키지 구조", C-4a, [CLAUDE.md](../CLAUDE.md). 이 문서 §5.1 · §5.7
- 할 일: `pnpm-workspace.yaml`, 루트 `package.json`(private, `packageManager`, node 스크립트 `build` · `test` · `verify:pack` · `version:set`), `tsconfig.base.json`, `vitest.config.ts`(`test.projects`, v2 F-5), `.gitattributes`(`* text=auto eol=lf`, v2 F-25), `.github/workflows/ci.yml`(v2 F-20), `.gitignore`(dist · themes 생성물은 **추적한다** — 래퍼 CSS가 publish 대상이므로 `files`에 포함되고, diff 리뷰가 가능해야 AC-6a 검증이 눈에 보인다), `packages/{tokens,web,native}` 스캐폴드. 스캐폴드의 세 `package.json`은 §5.2의 `exports` · `peerDependencies` · `files`까지 포함한다 — T-W0의 peer 해석 확인이 web `package.json`을 전제하기 때문(v2 F-15). 세 `package.json`의 `name`은 `@eeennsu/tokens` · `@eeennsu/web` · `@eeennsu/native`다
- 완료 조건: `pnpm install` 성공. `pnpm -r build`·`pnpm -r test`가 빈 상태로 통과. 세 `package.json`의 `name`이 같은 스코프이고 §5.2 exports·peer가 들어 있다. CI 워크플로가 같은 명령을 돌린다
- 닫는 AC: 없음(C-4a 구조 성립)

### Phase 1 — tokens

**T-T1 토큰 소스**
- 읽을 파일: C-5 · C-5a · C-5b · C-6 · C-7a · C-7b · C-8, AC-1 · 2 · 6c. 이 문서 §3.1 ~ §3.8
- 할 일: `src/tokens/primitive/{color,spacing,radius,shadow,typography}.json`, `src/tokens/semantic/{base,bakery}.json`(light · dark 각각), `src/tokens/component/{text,button,input,textarea,badge,icon,card,dialog,drawer,tooltip}.json`. DTCG 형식(`$value` · `$type`, 참조는 `{primitive.color.blue.600}`). 폰트 패밀리 값은 §8 D-1 결과를 반영
- 완료 조건: JSON 파일이 3디렉터리로 나뉘고, semantic 파일이 primitive 참조만 담으며, 스키마 검증 테스트(참조 해석 가능, 브랜드 간 semantic 키 집합 동일)가 통과
- 닫는 AC: **AC-1**, **AC-2**, **AC-6c**(폰트 파일 부재는 `files` 필드 + T-V3 타르볼 검사로 최종 확인)

**T-T2 빌드 스크립트**
- 읽을 파일: C-3 · C-6 · C-20 · C-5b, AC-3 · 4 · 5. 이 문서 §3.7 · §3.9 ~ §3.11
- 할 일: `scripts/build.ts`가 (1) `themes/{base,bakery}.css`(§3.11 구조), (2) `packages/web/themes/{base,bakery}.css`(`@import "tailwindcss"; @import "@eeennsu/tokens/themes/<brand>.css"; @custom-variant dark {…}; @source "../dist";`), (3) `packages/native/themes/{base,bakery}.css`(`@import "tailwindcss"; @import "@eeennsu/tokens/themes/<brand>.css"; @source "../dist";` — **`@custom-variant dark`는 넣지 않는다.** 스펙 C-20은 웹 래퍼만 선언하고 RN은 NativeWind `dark:` 기본을 쓴다. v2 F-21. 게이트 (8) 결과로 `@import "tailwindcss"` 유무가 바뀔 수 있음), (4) `dist/brands/{base,bakery}.js`, (5) `dist/index.js`의 `spacing · radius · shadow · text · fontFamily · twMergeConfig · semanticVariables · component`(§3.8 값, v2 F-2)와 `contracts.ts` re-export를 생성. web·native의 `prebuild`가 tokens 빌드를 호출
- 완료 조건: 빌드가 결정적(두 번 실행해 diff 0). 스냅샷 테스트가 CSS 2개 + JS 3개를 고정. 웹 래퍼·native 래퍼가 같은 토큰 파일 경로를 import. `component` 객체가 §3.8 표와 일치하는 스냅샷
- 닫는 AC: **AC-3(웹 절)** — 래퍼가 토큰 파일을 import하고 웹 Tailwind가 읽는 것까지는 T-V1에서 최종 확인, **AC-4**, **AC-5**(semantic 한 줄 변경 → CSS 변수 + JS 객체 스냅샷이 함께 바뀌는 테스트)

**T-T3 계약 타입**
- 읽을 파일: C-8 · C-10 · C-11 · C-12 · C-13 · C-14 · C-17 · C-7c, AC-7 · 8 · 9 · 10 · 13 · 14 · 15 · 15a. 이 문서 §4 전체
- 할 일: `src/contracts.ts`에 §4.1 · §4.8을 그대로 옮긴다. JSDoc으로 `TypographyStep`·`ControlSize` 의미, `Press<P>` 매핑 근거(C-12)를 적는다
- 완료 조건: `tsc` 통과. `webComponents`·`nativeComponents` 키가 `Contracts` 키의 부분집합임을 타입으로 강제(`satisfies readonly (keyof Contracts<"web">)[]`)
- 닫는 AC: 단독으로 닫는 AC 없음. AC-9 · 10 · 13 · 14 · 15 · 15a · 21의 전제

**T-T4 probe · diff 테스트**
- 읽을 파일: C-7 · C-7a · C-15, AC-6 · 6a · 6b, 알려진 동작 1 · 2, decisions-r21 D. 이 문서 §3.7
- 할 일: `@tailwindcss/node` `compile()`로 (1) `bg-red-500 bg-blue-500 text-gray-900` → 출력 없음, (2) `mt-5 mt-17 w-64 font-bold text-base` → 출력 없음, (3) `mt-4 mt-6 bg-brand text-md rounded-md` → 출력 있음, (4) `--spacing: initial` 없이도 `mt-5`가 안 나오는지(검증 probe 4.3.3에서는 안 나왔다. 그래도 §3.11의 `--spacing: initial`은 유지하고 결과를 주석으로. v2 F-26), (5) `base.css`와 `bakery.css` diff의 변경 줄이 전부 `:root` · `.dark` · `@media` 안의 `--bg-*` · `--fg-*` · `--border-*`뿐, (6) R23 요구 (a): 토큰 CSS 뒤에 `:root { --radius-md: 2px; --font-sans: X }`를 붙여 컴파일하면 `rounded-md`·`font-sans` 출력이 그 값을 참조하는지 — 결과를 테스트 이름과 `docs/plan.md` §3.7 각주로 기록
- 완료 조건: 위 6개 테스트 통과
- 닫는 AC: **AC-6**, **AC-6a**, **AC-6b**(size 타입 부분은 T-T3)

**T-T5 `twMergeConfig` 검증**
- 읽을 파일: C-6 · C-15, 알려진 동작 1 · 4, decisions-r21 A-3
- 할 일: `extendTailwindMerge({ override: { theme: twMergeConfig } })`로 확정(v2 F-4. `extend`는 기본 검증자에 concat이라 실패한다 — 검증 probe로 확인). tokens 테스트에서 `cn("mt-4","mt-5")` → `"mt-4 mt-5"`(미등록 키가 DS 값을 밀지 않음), `cn("bg-brand","bg-danger")` → `"bg-danger"`, `cn("text-md","text-fg")` → 둘 다 유지, `cn("hover:bg-brand-hover","bg-danger")` → 둘 다 유지, `cn("rounded-md","rounded-xl")` → 둘 다 유지를 검사. `cn("text-md","text-base")` → `"text-base"`는 알려진 동작으로 테스트 이름에 남긴다(v2 F-27)
- 완료 조건: 6개 테스트 통과. 설정 객체가 빌드 산출물에서 나온다(수기 아님). `override`가 아니면 첫 테스트가 실패해야 한다
- 닫는 AC: AC-11 단위 계층의 전제. AC-24의 "열거 안의 키" 전제

### Phase 2 — web

**T-W0 웹 착수 전 확인 (C-3 2건)**
- 읽을 파일: C-3 래퍼 항목, decisions-r21 "확인할 것"
- 할 일: `apps/verify-vite`를 먼저 최소 생성해(T-V2와 공유. web `package.json`의 exports·peer는 T-0 스캐폴드에 이미 있다, v2 F-15) (1) `@import "@eeennsu/web/themes/base.css"` 한 줄만으로 `tailwindcss`가 web 패키지의 peer로 해석되는지, (2) 소비자 CSS에 `@import "tailwindcss"`가 이미 있을 때 preflight·유틸리티가 중복 출력되는지(출력 CSS에서 `*, ::before` 리셋 블록 개수 세기)
- 완료 조건: 결과를 `docs/gate-c19.md`의 "웹 선확인" 절에 기록. 중복이 문제면 래퍼에서 `@import "tailwindcss"`를 빼고 규칙을 문서화(스펙이 허용한 대체). T-T2 래퍼 템플릿 갱신
- 닫는 AC: 없음(AC-16 · 17의 전제)

**T-W1 web 패키지 스캐폴드**
- 읽을 파일: C-4 · C-4a · C-16, AC-18. 이 문서 §5.2 · §5.4
- 할 일: `package.json`(exports · peer · `files: ["dist","themes"]`), `tsconfig`(`jsx: react-jsx`, `declaration`), `@base-ui/react` · `lucide-react` · `tailwind-merge` 설치 및 버전 고정, `src/index.ts`가 `components` 객체와 개별 named export 둘 다 제공(맵 테스트는 `components` 객체를 본다)
- 완료 조건: 빈 컴포넌트 0개 상태에서 `pnpm build` 성공, `dist/index.d.ts` 생성
- 닫는 AC: **AC-18**(1차. 타르볼 동봉은 T-V3)

**T-W2 `cn` · Icon · Stack · Box**
- 읽을 파일: C-7c · C-15 · C-17 children 규칙, AC-8. 이 문서 §4.4 · §4.5
- 완료 조건: `cn`이 `twMergeConfig`로 확장됨. `icons: Record<IconName, LucideIcon>` 컴파일. Stack이 4 prop을 클래스로 매핑하고 Box는 `div` + `className`. 단위 테스트: `direction="row"` → `flex-row`, 소비자 `className="gap-4"` 유지
- 닫는 AC: **AC-8**

**T-W3 Text · Label · Badge · Card**
- 읽을 파일: AC-7 Text · Label · Badge 계약, C-7b · C-8 · C-13(비인터랙티브 목록). 이 문서 §3.8 · §4.2
- 완료 조건: Text `heading`이 `h1~h3`/`span`, `tone`이 `text-fg*`, `size`가 `text-<step>`. Label이 `<label htmlFor>`. Badge variant 3개. Card recipe. 단위 테스트 `toHaveClass`
- 닫는 AC: AC-7 일부(4개)

**T-W4 Button · ButtonGroup**
- 읽을 파일: C-12 · C-13 · C-21(Button `type="button"`), 알려진 동작 7 · 9. 이 문서 §4.2 · §4.6
- 완료 조건: Base UI `Button`에 `type="button"` 고정, `onClick` → `() => void`, `label` 렌더, `icon`·`loading`·`disabled`, `ref`가 `{focus, blur}` 핸들(`useImperativeHandle`). ButtonGroup `role="group"` + `aria-label`. `"use client"` 첫 줄
- 닫는 AC: AC-7 일부(2개). AC-14 · AC-15a의 대상

**T-W5 Input · Textarea**
- 읽을 파일: C-11 매핑표, C-12, C-13 Input · Textarea 항목, 알려진 동작 8 · 10. 이 문서 §4.7
- 완료 조건: `kind` → `type` · `inputMode` · `autoComplete` 매핑 테스트 4건. `value` 3종. `invalid` → `border-danger` · `aria-invalid`. Textarea `size` → `rows` 3/5/8. `ref` 핸들. `"use client"`
- 닫는 AC: AC-7 일부(2개). AC-13 · AC-16의 자동완성 속성 전제

**T-W6 Form**
- 읽을 파일: C-21, 알려진 동작 5. 이 문서 §4.7
- 완료 조건: `<form onSubmit={preventDefault}>` 렌더, 단위 테스트에서 submit 이벤트 후 `defaultPrevented === true`. `"use client"`
- 닫는 AC: AC-7 일부(1개)

**T-W7 Tooltip · Dialog · Drawer**
- 읽을 파일: C-12 오버레이 항목, C-13 Dialog · Drawer · Tooltip 항목, decisions-r21 B-11. 이 문서 §4.3
- 완료 조건: 제어 3종이 Base UI Root로 전달되고 `onOpenChange`가 boolean 하나만 받는다. Dialog `label`이 `Title`로 렌더돼 `aria-labelledby` 연결. Tooltip 앵커에 DS Button을 넣은 테스트. Drawer `side` 3값 클래스. 전부 `"use client"`
- 닫는 AC: AC-7 완료(12개 전부)

**T-W8 웹 타입 · dist 테스트**
- 읽을 파일: C-4 (1)(2) · C-17, AC-9 · 10 · 11 · 11a · 12 · 13 · 14 · 15 · 15a · 18
- 할 일: (1) 맵 동등성 `expectTypeOf`, (2) mapped type 테스트 — 모든 Props 키를 순회해 `number` 타입 값이 없고, `style`·`as`·`render`·`asChild`·`onChange`·`onToggle`·`onPress`(웹) 키가 없고, `variant`·`tone`·`size`가 리터럴 유니온이며, `label`이 인터랙티브 7개에서 필수, `icon`이 `IconName`, (3) `// @ts-expect-error` 케이스 — `tone="#333"`, `icon="nope"`, `icon={<Trash />}`, `onClick={(e) => …}`, 인터랙티브 7개(Button · ButtonGroup · Input · Textarea · Tooltip · Dialog · Drawer) 각각의 `label` 누락(AC-14, 7건), (4) dist 검사 — 인터랙티브 파일 첫 줄 `"use client"`, dist 소스에 백틱 템플릿 클래스 조합 없음(정규식 `` `[^`]*\$\{ `` 검색), (5) 단위: `variant="primary"` + `className="bg-danger"` → 병합 문자열에 `bg-brand` 없음 · `bg-danger` 있음, (6) 컴포넌트 recipe 클래스가 `@eeennsu/tokens` component JS 객체 값과 일치
- 완료 조건: `vitest --typecheck` 포함 전부 통과
- 닫는 AC: **AC-9**, **AC-10**, **AC-11(단위 계층)**, **AC-11a**, **AC-12**, **AC-13**, **AC-14**, **AC-15**, **AC-15a**, C-4 산출물 제약

### Phase 3 — 웹 검증

**T-V1 `apps/verify-next`**
- 읽을 파일: AC-16 · AC-19 (b) · AC-24 · AC-26, C-20 · C-21 · C-5b, 알려진 동작 5 · 12
- 할 일: `create-next-app`(App Router, Tailwind v4)로 생성. 전역 CSS에 `@import "@eeennsu/web/themes/base.css"` 한 줄 + AC-26용 `:root`/`.dark`/`@media` 3블록(`--bg-brand`를 X/Y로, `base`·`bakery` 어느 값과도 다르게). `next-themes`로 루트 클래스. 로그인 화면(AC-16 구성 그대로) + AC-24용 버튼 2개(하나만 `className="bg-danger mt-6"`) + AC-26용 `className="bg-brand"` 요소. Playwright: (1) 렌더 + `<form>` 존재 + `autocomplete="current-password"`/`"email"`, (2) 4조합(`emulateMedia colorScheme` × 루트 클래스 `dark`/`light`/없음)에서 primary Button 배경·`bg-brand` 요소 배경이 X/Y, `--bg-danger` 요소가 `brands/base` JS 값, (3) AC-24 버튼 하나만 danger, 다른 버튼 brand — 이 항목이 AC-11 웹 통합 계층(computed style을 `brands/base` JS 값과 비교)을 겸한다(v2 F-24), (4) AC-26 (d) 회귀 가드 — `:root`만 재선언한 별도 CSS 진입점 페이지에서 `.dark` 조합은 X, 클래스 없는 OS 다크는 base 다크 값
- 완료 조건: Playwright 전부 통과. `tailwind.config` 부재 + `postcss.config.mjs`·`next.config.ts`가 **`create-next-app` 생성 원본과 diff 0**(AC-26 (c). v2 F-3: create-next-app 16.3.4 Tailwind 템플릿이 `postcss.config.mjs`를 스스로 만들므로 "부재"가 아니라 "미편집"을 검사한다. 생성 직후 사본을 테스트 픽스처로 보관). 비밀번호 자동완성 제안 UI는 수동 확인 1회 기록
- 닫는 AC: **AC-16**, **AC-11 웹 통합 계층**, **AC-19 (b) 웹**, **AC-24**, **AC-26 웹 (a)(b)(c)(d)**, AC-3 웹 절 최종

**T-V2 `apps/verify-vite`**
- 읽을 파일: AC-17 · AC-19 (a)
- 할 일: `create-vite` react-ts + `@tailwindcss/vite`. 같은 import 한 줄, 같은 로그인 화면(코드 공유 없이 복사 — 프레임워크 비종속 검증이 목적). 다크 코드 0줄. Playwright `emulateMedia` 2조합
- 완료 조건: 렌더 통과, OS 다크에서 `--bg-canvas` 다크 값
- 닫는 AC: **AC-17**, **AC-19 (a) 웹**

**T-V3 pack 설치 검증**
- 읽을 파일: AC-16 · AC-18 · AC-6c, 이 문서 §5.6
- 할 일: **tokens·web만** pack(native는 Phase 3 시점에 빈 스캐폴드라 제외. native 타르볼은 T-R1. v2 F-16) → §5.6 절차대로 `apps/verify-next`·`verify-vite`를 **워크스페이스 밖 임시 디렉터리에 복사**해 `file:` + 앱 자체 `pnpm.overrides`(tokens 타르볼) + `pnpm install --ignore-workspace`로 설치하는 node 스크립트(`pnpm verify:pack`. v2 F-11). 타르볼 내용 검사: `dist/**/*.d.ts` 존재, `themes/*.css` 존재, 폰트 파일(`*.woff2` · `*.ttf` · `*.otf`) 부재, web 타르볼 `package.json`의 `@eeennsu/tokens`가 `workspace:`가 아닌 버전 문자열. 설치 후 T-V1 · T-V2 Playwright 재실행
- 완료 조건: 타르볼 설치 상태에서 전부 통과. `apps/*` 원본의 `workspace:*`와 루트 lockfile이 변하지 않음
- 닫는 AC: **AC-18** 최종, **AC-6c** 최종, AC-16 · 17의 "설치" 의미 충족

### Phase 4 — C-19 게이트

**상태: T-G1 · T-G2 완료(2026-09-06).** 결과와 계획 변경은 §2.3, 측정은 [gate-c19.md](gate-c19.md). 남은 것은 게이트 (7)의 기기 화면 확인 1회이며 그것이 Phase 5 착수 조건이다.

**T-G1 `apps/verify-expo` 생성**
- 읽을 파일: C-19 착수 게이트 · 손절 기준, AC-23. 이 문서 §2.1
- 할 일: `create-expo-app@latest`(SDK 57)로 생성, §2.1 설치 절차(NativeWind preview 정확 버전, `lightningcss` override, postcss, `nativewind-env.d.ts`), `jest-expo` + RNTL 14(async `render`, `test-renderer` peer) 설정, 게이트 (3)·(8)용 스텁 `packages/native/dist/_gate-stub.js` 생성(v2 F-14 · F-23). (7) 실패 시 `--template blank@sdk-54`로 재생성(v2 F-9)
- 완료 조건: 빈 Expo 프로젝트가 뜨고(수동 확인, Android), `nativewind` 정확 버전이 `package.json`에 고정. `jest-expo` 설정 완료(빈 테스트 1개 통과). 어느 SDK를 썼는지 `docs/gate-c19.md`에 기록
- 닫는 AC: 없음(게이트 (7)의 절반)

**T-G2 게이트 실행**
- 읽을 파일: 이 문서 §2.2 전체, decisions-r22 2절
- 할 일: (1)~(9)를 순서대로 돌리고 `docs/gate-c19.md`에 기록. 실패 항목은 "실패 시 수정할 스펙·AC"에 따라 스펙 R24 개정을 **먼저** 하고 이 계획의 해당 태스크를 갱신한다
- 완료 조건: (1)(2)(3)(4)(6)(7)(8) 통과 또는 개정 완료. (5)(9) 결과 기록
- 닫는 AC: 없음. Phase 5 착수 조건

### Phase 5 — native (게이트 후)

**T-N0 native 래퍼 다크 블록** — 게이트 (2)·(4) 결과로 추가. 상세는 §2.3

**T-N1 native 패키지 스캐폴드**
- 읽을 파일: C-3 native 항목 · C-19, `docs/gate-c19.md`. 이 문서 §5.2
- 완료 조건: `package.json` peer에 게이트가 고정한 버전(`nativewind` `5.0.0-preview.4`는 T-G1이 이미 넣었다). 래퍼 내용은 게이트 (8) 결과대로 **무변경**(`@import "tailwindcss"` 유지, `nativewind/theme` 넣지 않음 — §9 S-5 종결). `cn` · `icons: Record<IconName, LucideIcon>`(`lucide-react-native`). oklch 문자열 수용 여부 확인(§3.10)
- **(게이트 (9)) 컴포넌트가 `react-native`가 아니라 `react-native-css/components`에서 `View`·`Text`·`Pressable`·`TextInput`을 import하는지 확인한다.** Metro 빌드는 둘 다 되지만 jest에는 Metro가 없어 `react-native` 직접 import는 T-R1의 `toHaveStyle` 단언이 성립하지 않는다
- `packages/native/dist/_gate-stub.js`를 실제 dist로 대체한다(T-G1 산출물)
- 닫는 AC: 없음

**T-N2 Stack · Card · Text**
- 읽을 파일: AC-20 · C-19 (5) 분기, `docs/gate-c19.md` (5), 이 문서 §2.3 D-31
- 완료 조건: `View` 기반 Stack(`flex-row`/`flex-col`) · Card. **Text는 `text-<step>` 클래스 그대로다** — D-31이 (A)로 확정돼 line-height 보정이 T-N0의 토큰 빌드에서 끝난다. JS 객체 `style` 폴백을 넣지 않는다. `heading` → `accessibilityRole="header"`
- 닫는 AC: AC-20 일부

**T-N3 Button · Input**
- 읽을 파일: C-11 RN 매핑, C-13 RN 항목, AC-22
- 완료 조건: `Pressable` 기반 Button — `onPress`, `label` 가시 텍스트 + `accessibilityLabel`, `accessibilityRole="button"`, `ref` 핸들. `TextInput` 기반 Input — `kind` → `secureTextEntry` · `keyboardType` · `autoCapitalize` · `autoComplete` · `textContentType`, `accessibilityLabel`, `onChangeText` → `onValueChange`, `ref` 핸들
- 닫는 AC: **AC-20**(5개 완료)

**T-N4 native 타입 테스트**
- 읽을 파일: C-17, AC-21
- 할 일: 맵 동등성(`NativeKey` × `Contracts<"native">`), `onClick` 부재 · `onPress` 존재 타입 테스트, native dist 검사 — dist 소스에 백틱 템플릿 클래스 조합 없음(T-W8 (4)와 같은 정규식. C-4 (2)는 native 래퍼 `@source "../dist"`에도 걸린다. v2 F-19), **의도적 파괴 1회(수동 절차, v2 F-17)** — Button에 prop 추가 → 실패 확인 → 되돌림, 컴포넌트 하나 export 누락 → 실패 확인 → 되돌림. 결과를 테스트 파일 주석과 `docs/gate-c19.md` 말미에 기록
- 완료 조건: `vitest --typecheck` 통과 + dist 검사 통과 + 파괴 확인 기록(수동 1회)
- 닫는 AC: **AC-21**, AC-13 RN 절

### Phase 6 — RN 검증

**T-R1 `apps/verify-expo` 화면 · 테스트**
- 읽을 파일: AC-23 · AC-25 · AC-26 RN절 · AC-19 (c) · AC-22 · AC-11 RN절, `docs/gate-c19.md` (9)
- 할 일: `global.css`에 `@import "@eeennsu/native/themes/base.css"` + AC-26 **2블록**(`:root` + `@media (prefers-color-scheme: dark) { :root }`. 웹 3블록을 그대로 쓰면 다크가 라이트 값에 머문다 — 게이트 (6), 알려진 동작 15). 화면: Text(제목) + Input × 2 + Text tone danger + Button primary + AC-25용 Button(`className="bg-danger mt-6"`) + Stack/Card. jest-expo: (1) `Appearance` 모킹 2조합에서 primary Button 배경 X/Y, (2) AC-25 className 버튼 — **`toHaveStyle`**(게이트 (9) 통과라 스냅샷 격하를 쓰지 않는다), (3) `accessibilityLabel` 단언(Button · Input), (4) `bg-danger` 병합 결과. 게이트가 만든 `tests/gate-css.ts` · `tests/color-scheme.ts` · `jest.setup.js`를 그대로 쓴다 — `Appearance` 모킹 없이는 다크 조합이 판정되지 않는다. 웹과 같은 색·간격은 Android 에뮬레이터 스크린샷과 verify-next 스크린샷을 나란히 두고 수동 확인 1회. 타르볼(`pnpm pack`) 설치로 재실행(`pnpm verify:pack verify-expo`)
- 완료 조건: jest 통과 + 수동 확인 기록(`docs/gate-c19.md` 또는 `docs/verify-rn.md`)
- 닫는 AC: **AC-3 RN절**, **AC-11 RN절**, **AC-19 (c) RN**, **AC-22**, **AC-23**, **AC-25**, **AC-26 RN절**

### v1 이후 (구현 노트 N-16 · N-17)

- **T-N5** RN Textarea · Label · Badge · Box — N-16. `0.2.0` publish(2026-09-24)
- **T-N6** Chip · Icon(웹 · RN), `IconName` 28개 — N-17, 스펙 R25. 닫는 AC: AC-7 · AC-20 목록 추가분
- **T-N7** RN 보정 — 눌림 `active:opacity-80`, 누름 영역(hitSlop · `min-w-12`), Input · Textarea 포커스 테두리(D-9)와 placeholder 색, native 래퍼 `tabular-nums`, 아이콘별 lucide import — N-17
- **T-T6** 글자 대비 — base 다크 · bakery 의 on-brand · on-danger, tokens 대비 테스트 — N-17, F-23
- **T-P2** `0.3.0` publish — `pnpm version:set 0.3.0` → `pnpm -r build` · `pnpm -r test` · `pnpm verify:pack` → main 에 합친 뒤 `npm login` → `pnpm -r publish --access public`

### Phase 7 — publish

**T-P1 publish 게이트**
- 읽을 파일: C-1 · C-4a, 이 문서 §5.3
- 할 일: 전체 테스트 · T-V3 · T-R1 타르볼 재실행 → `pnpm -r publish --dry-run` → publish
- 완료 조건: npm에 세 패키지가 같은 버전으로 존재. 새 빈 프로젝트에서 npm 설치로 AC-16 화면이 뜬다(수동 1회)
- 닫는 AC: AC-16 · 17 · 18 · 23의 "npm 설치" 의미 최종 충족

---

## 7. AC 매핑

스펙의 AC 전부(접미 번호 포함 31개 항목)를 태스크에 매핑한다. "게이트 전/후" 열이 C-19 게이트 기준 위치다.

| AC | 내용 요약 | 검증 수단 | 닫는 태스크 | 게이트 전/후 |
|---|---|---|---|---|
| AC-1 | 토큰 소스 단일 DTCG 파일군 | 스키마 테스트 | T-T1 | 전 |
| AC-2 | 3계층이 파일 구조·네이밍으로 구분 | 디렉터리 + 참조 방향 테스트 | T-T1 | 전 |
| AC-3 (웹 절) | 빌드가 토큰 CSS 생성, web 래퍼가 import, 웹 Tailwind가 읽음 | 스냅샷 + T-V1 렌더 | T-T2 → T-V1 | 전 |
| AC-3 (RN 절) | native 래퍼가 같은 토큰 파일 import, NativeWind가 읽음 | 게이트 (1)(3)(8) + T-R1 렌더 | T-G2 → T-R1 | **후** |
| AC-4 | 같은 소스에서 RN JS 객체 생성 | 스냅샷 | T-T2 | 전 |
| AC-5 | semantic 한 줄 변경이 CSS + JS에 동시 전파 | 빌드 스냅샷 테스트 | T-T2 | 전 |
| AC-6 | primitive 직접 참조 없음 | probe 컴파일(`bg-red-500` 출력 없음) | T-T4 | 전 |
| AC-6a | 브랜드 교체 시 semantic 색만 변경 | `base` vs `bakery` diff 테스트 | T-T4 | 전 |
| AC-6b | spacing 희소 열거 + 열거 외 무효 + size 타입 | probe(`mt-5 mt-17 w-64 font-bold`) + 계약 타입 | T-T4 + T-T3 | 전 |
| AC-6c | `fontFamily` 토큰 존재, 폰트 파일 미동봉 | 토큰 존재 테스트 + 타르볼 검사 | T-T1 → T-V3 | 전 |
| AC-7 | 웹 12개 구현 + Text · Textarea · Label · Badge 계약 | 단위 + 맵 테스트 | T-W3 ~ T-W7 → T-W8 | 전 |
| AC-8 | Stack · Box, 4 prop, 간격 prop 없음 | 단위 + 타입 | T-W2 → T-W8 | 전 |
| AC-9 | `variant` · `tone` 전역 집합 | 맵 동등성 테스트 | T-W8 | 전 |
| AC-10 | `Size` 전역 + 부분집합 타입 고정 | 맵 동등성 테스트 | T-W8 | 전 |
| AC-11 (웹 절) | `className` 병합, 소비자 승리 | 단위 병합 문자열 · `toHaveClass` + Playwright computed style | T-W8 + T-V1 | 전 |
| AC-11 (RN 절) | 같은 병합이 RN에서도 | `toHaveStyle` 또는 className 스냅샷(게이트 (9)) | T-R1 | **후** |
| AC-11a | `style` 없음, `{...rest}` 없음 | mapped type 테스트 | T-W8 | 전 |
| AC-12 | `as` · `render` · `asChild` 미노출 | mapped type 테스트 | T-W8 | 전 |
| AC-13 | 제어 API 두 갈래, 웹 `onClick`만 | 맵 테스트 + `@ts-expect-error` | T-W8 (RN 절은 T-N4) | 전 / RN 절 **후** |
| AC-14 | `label` 누락 시 타입 에러 | `@ts-expect-error` 7개 | T-W8 | 전 |
| AC-15 | `number` prop 없음, 색 의도 prop은 enum만 | mapped type 테스트 1개 | T-W8 | 전 |
| AC-15a | `icon` 문자열만, 잘못된 이름·노드 거부 | `@ts-expect-error` | T-W8 | 전 |
| AC-16 | Next.js 부트스트랩 + 로그인 화면 + 자동완성 속성 | Playwright + 수동 1회 | T-V1 → T-V3 → T-P1 | 전 |
| AC-17 | Vite 동일 경로 렌더 | Playwright | T-V2 → T-V3 | 전 |
| AC-18 | `.d.ts` 배포 | dist 생성 + 타르볼 검사 | T-W1 → T-V3 → T-P1 | 전 |
| AC-19 (a) 웹 | 루트 클래스 없으면 OS 추종 | Vite Playwright `emulateMedia` 2조합 | T-V2 | 전 |
| AC-19 (b) 웹 | 루트 클래스가 OS보다 우선 | Next Playwright 4조합 | T-V1 | 전 |
| AC-19 (c) RN | 시스템 색 구성표 + 수동 전환 | 게이트 (2)(4) + jest `Appearance` 2조합 | T-G2 → T-R1 | **후** |
| AC-20 | RN 5개 구현 | 렌더 테스트 | T-N2 · T-N3 | **후** |
| AC-21 | prop 시그니처 일치 + 실제로 깨짐 확인 | 맵 테스트 + 의도적 파괴 기록 | T-N4 | **후** |
| AC-22 | `label` → RN 접근성 이름 | jest `accessibilityLabel` 단언 | T-N3 → T-R1 | **후** |
| AC-23 | Expo 크로스플랫폼 화면 | 렌더 + 스크린샷 수동 비교 | T-R1 | **후** |
| AC-24 | 버튼 하나만 `className`으로 변경 | Playwright | T-V1 | 전 |
| AC-25 | 같은 `className`이 RN에서 같은 결과 | `toHaveStyle` 또는 스냅샷 + 수동 | T-R1 | **후** |
| AC-26 웹 (a)(b)(c)(d) | 로컬 오버라이드 4조합 · 격리 · 설정 부재 · 회귀 가드 | Playwright | T-V1 | 전 |
| AC-26 RN 절 | 같은 3블록이 RN에서 X/Y | 게이트 (6) + jest 2조합 | T-G2 → T-R1 | **후** |

- 게이트 후 항목: AC-3 RN절, AC-11 RN절, AC-13 RN절, AC-19 (c), AC-20, AC-21, AC-22, AC-23, AC-25, AC-26 RN절. 나머지는 전부 게이트 전에 닫힌다
- AC-16 · 17 · 18 · 23은 "설치"의 의미를 세 단계로 닫는다 — `workspace:*`(개발) → 타르볼 `file:`(T-V3 · T-R1) → npm(T-P1)

---

## 8. 결정 사항 요약

스펙이 계획으로 넘긴 항목의 결정이다. D-1은 사용자가 2026-09-05에 확정했고 나머지는 추천안대로 확정한다(이 문서가 근거 문서). 되돌리기 난이도를 함께 적는다.

| # | 항목 | 결정 | 근거 | 되돌리기 |
|---|---|---|---|---|
| **D-1** | **`fontFamily.sans` 값** | **사용자 확정(2026-09-05): Pretendard**(웹 `"Pretendard Variable", Pretendard, …`, RN `Pretendard`) | 스펙 R18 실측에서 Inter가 다수였으나 한글 글리프가 없어 라틴·한글이 섞여 렌더된다. 소비 프로젝트 도메인이 전부 한국어 UI(빵집 · 운세 · 사진 · 블로그 · 이력서)다. Pretendard는 한글·라틴을 한 패밀리로 덮고 가변 폰트 배포가 있어 웹 `@font-face` 1개로 끝난다. 폰트 파일은 동봉하지 않으므로(C-7b) DS가 갖는 건 이름뿐이다 | 중. 이름만 바꾸면 DS는 minor지만 소비자는 로딩 코드를 바꿔야 한다 |
| D-2 | semantic 변수 이름 체계 | §3.1 · §3.3 (`--<그룹>-<이름>`, 16개) | 스펙 예시 `--bg-brand` · `fg.default`와 일치. `@theme` 키에서 `bg` 그룹만 생략해 `bg-brand` 클래스 유지 | 상(공개 계약, major) |
| D-3 | `border.focus`는 별칭 | `var(--bg-brand)`. **(R26)** `fg.danger`는 별칭을 풀고 자기 값을 갖는다(이전 `var(--bg-danger)`) | 채움 위 흰 글자와 표면 위 글자를 한 값으로 맞출 수 없다(decisions-r26 5) | 하(별칭 해제는 값 변경) |
| D-4 | `@theme inline` 범위 | 색만 inline, 나머지 비-inline | C-5b 메커니즘에 필요한 최소. R23 요구 (a) 답을 T-T4가 기록 | 하 |
| D-5 | primitive 팔레트 | Tailwind v4 gray · blue · red · amber 4램프 복사 | 자체 팔레트는 v1 범위 밖. primitive는 계약 밖 | 하 |
| D-6 | 컨트롤 높이 | 고정 `h-*` 없이 `py-* + text-*` 조합. Input은 `border-border` 1px, Button·Badge는 `border-transparent`로 테두리 두께를 맞춰 **30 / 42 / 54**(v2 F-7, 사용자 확정). **(R26)** lg 스텝 line-height 26으로 **30 / 42 / 52**, Input 테두리는 투명 + 채움 | spacing 열거에 40px(키 10)이 없다. 열거를 넓히지 않고 조합으로 만든다. 투명 테두리가 없으면 Input이 Button보다 2px 높다 | 하 |
| D-7 | Stack · Box 역할 | Stack만 4 prop, Box는 `children` + `className` | 둘 다 같은 prop이면 하나가 죽은 코드 | 하(Box에 prop 추가는 추가적) |
| D-8 | `IconName` 소스 | tokens의 큐레이션 유니온 24개 + 플랫폼별 `Record` 맵 | 계약이 tokens에 있어 lucide 의존 불가. 이름 추가는 추가적 | 하 |
| D-9 | focus ring | `border.focus` 하나, 웹 `outline-*`, RN `focus:border-*` | 별도 ring 토큰은 유지보수 표면만 늘림 | 하 |
| D-10 | Dialog · Drawer `label` | 제목으로 렌더 + `aria-labelledby` | C-13 "aria-labelledby 또는 aria-label" 중 가시 제목 쪽. Button `label`과 같은 원칙 | 중(숨김 옵션 추가는 추가적) |
| D-11 | Tooltip 앵커 | `children: ReactElement` 1개, Base UI `Trigger render` 내부 사용 | B-11이 계획으로 넘긴 항목 | 하 |
| D-12 | Drawer 구현 | Base UI Dialog + `side` 클래스 | 별도 라이브러리 불필요 | 하 |
| D-13 | Form 내부 | 순수 `<form>` + Tailwind, Base UI `Form` · `Field` 미사용 | v1은 submit · 검증 개념이 없어 Base UI Form의 가치가 0. Input DOM이 Form 안팎에서 같아야 한다. §9 S-4 참조 | 하(나중에 Field 도입은 내부 변경) |
| D-14 | Textarea `size` → 행수 | 3 / 5 / 8 | 스펙 "매핑값은 계획" | 하 |
| D-15 | Badge 부분집합 | variant `primary \| secondary \| danger`, size `sm \| md` | AC-9 예시대로 `ghost` 제외. `lg` 이상은 Badge 용도 밖 | 하(추가는 추가적) |
| D-16 | Input `invalid` prop | 기능 불리언으로 추가 | C-21 오류 표시에 테두리 상태가 필요. `disabled`와 같은 부류 | 하 |
| D-17 | exports · peer · lockstep | §5.2 · §5.3 | — | 중(exports 경로는 소비자 import에 박힘) |
| D-18 | 빌드 도구 | tokens `tsx` 스크립트, web · native `tsc`만 | `"use client"` 보존 · 파일별 dist · `.d.ts` 동시 생성 | 하 |
| D-19 | 테스트 러너 | Vitest + Playwright(레포), `jest-expo`(verify-expo만) | RN 런타임 테스트를 검증 앱으로 몰아 레포 러너 2개 유지 | 하 |
| D-20 | 검증 앱 위치 | 레포 `apps/*`, `workspace:*` + 타르볼 재검증 | 형제 프로젝트 사용 금지(C-4a). 타르볼이 없으면 exports · `.d.ts` 동봉을 검증하지 못한다 | 하 |
| D-21 | npm 스코프 이름 | `@eeennsu` 확정(2026-09-05 사용자 결정) | `package.json` `name`에 리터럴이 필요. 보류 항목이 없어졌다 | 하 |
| D-22 | ESM 단일 출력 | CJS 미출력 | 소비처 3개 전부 ESM | 하 |
| D-23 | 게이트 실패 시 개정 절차 | 스펙 R24로 기록 후 계획 갱신 | 게이트 실패는 스펙이 예정한 개정 경로 | — |
| **D-24** (v2) | 토큰 CSS 레이어 | 토큰 파일은 `@layer`를 쓰지 않는다(§3.11) | 소비자 무레이어 `:root` 재선언이 "같은 셀렉터·뒤가 이김"으로 덮여야 한다(C-5b). probe에서 Tailwind가 비-inline `@theme` 변수를 `@layer theme`에 넣어도 무레이어 소비자 선언이 이기는 것을 확인 | 하 |
| **D-25** (v2) | `:root` semantic 값 형태 | primitive `var()` 참조가 아니라 해석값 기입. 별칭 2개만 `var()`(§3.3) | 소비자가 primitive를 모른 채 덮을 수 있어야 하고 RN JS 객체도 해석값이어야 한다 | 하 |
| **D-26** (v2) | component 계층 산출물 | CSS 변수로는 타이포 스텝만, 나머지는 JS `component` 객체 + 정적 클래스(§3.8 · §3.10) | C-6 산출물 범위를 좁힌다. 클래스가 정적 문자열이어야 `@source` 스캔이 잡는다(C-4 (2)) | 하 |
| **D-27** (v2) | tokens 의존 형태 | web·native의 **일반 의존성**(peer 아님) + lockstep(§5.2 · §5.3) | 소비자가 tokens를 직접 설치하지 않아도 래퍼 import가 해석돼야 한다. 중복 설치는 lockstep으로 막는다 | 중 |
| **D-28** (v2 F-9) | 게이트 Expo SDK | `create-expo-app@latest`(57) 우선, (7) 실패 시 54 재시도 | 새 소비 프로젝트가 받는 기본 SDK로 검증한다. NativeWind 문서 예시는 54이나 peer는 57을 배제하지 않는다. 사용자 확정 | 하 |
| **D-29** (v2 F-1) | Label·Badge `children` | `string \| string[]` | C-17·Text와 통일. AC-7의 `string`은 §9 S-11. 사용자 확정 | 하(좁히면 파괴) |
| **D-30** (v2 F-18) | ButtonGroup `size` | 없음 | 자식 Button이 각자 가진다. 추가는 추가적. §9 S-16. 사용자 확정 | 하 |
| **D-31** (v2 F-11) | 타르볼 설치 검증 위치 | 워크스페이스 밖 임시 디렉터리 + 앱 자체 `pnpm.overrides` | 루트 overrides는 워크스페이스 소스 패키지까지 타르볼로 바꾼다(probe) | 하 |

---

## 9. 스펙 수정 필요

계획 작성 중 발견한 스펙 내부의 불일치·빈틈이다. **스펙을 고치지 않았다.** 두 등급으로 나눈다 — "보류"는 해당 태스크를 스펙 정정 전에 착수하지 않는 것이고, "정합"은 태스크 진행에 지장이 없어 다음 개정에서 문구만 맞추면 되는 것이다.

| # | 위치 | 내용 | 등급 | 영향 태스크 |
|---|---|---|---|---|
| S-1 | C-8 | `tone`의 danger를 `fg.danger`와 1:1이라 하고, 같은 문단에서 `variant`·`tone`의 danger가 "같은 semantic 색(`color.danger`)"이라 한다. 토큰 이름 표기가 `fg.danger` / `color.danger` / `bg.brand` 세 가지로 갈린다 | 정합 | 없음. D-3 별칭으로 두 문장을 동시에 만족시켰다. 개정 시 §3.3 이름으로 통일하고 별칭 2개를 명시 |
| S-2 | C-17 children 규칙 | "웹 전용(Dialog · Drawer · Tooltip · Form)만 `ReactNode`"인데 C-12 · B-11은 Tooltip `children`을 앵커로 정의한다. 앵커는 `ReactElement` 1개여야 한다(Base UI `render`) | 정합 | 없음. D-11대로 `ReactElement`. 개정 시 C-17 문장에서 Tooltip 제외 |
| S-3 | C-3 · B-7 | "토큰 파일 직접 import 경로는 공개하지 않는다"이나 래퍼의 `@import "@eeennsu/tokens/themes/<brand>.css"`가 해석되려면 tokens `exports`에 `./themes/*.css`가 있어야 한다. 기술적으로는 소비자도 import 가능 | 정합 | 없음. "공개하지 않는다 = 문서화하지 않는다"로 읽고 §5.2에 주석 |
| S-4 | C-21 (출처 decisions-r21 B-6, v2 F-30) | "Base UI `Form` / `Field`를 내부 기반으로 쓰되"라고 했으나 v1 범위(submit 없음, 오류 표시는 `Text tone="danger"`)에서 Base UI Form의 기능이 쓰이지 않고, `Field`로 Input을 감싸면 Input 단독 사용과 DOM이 달라진다. D-13은 순수 `<form>`을 택했다 | 정합 | T-W6. B-6은 Form **범위**를 정한 결정이고 Base UI 사용은 구현 세부라 재개방이 아니다. 계약·AC 영향 없음. 개정 시 "Base UI Form은 v1에서 쓰지 않는다"로 |
| S-5 | C-3 native 항목 ↔ NativeWind v5 문서 | 스펙은 래퍼가 `@import "tailwindcss"`를 먼저 포함한다고 하나, NativeWind v5 문서의 `global.css`는 `tailwindcss/theme.css layer(theme)` · `preflight.css layer(base)` · `utilities.css` 분리 import + `@import "nativewind/theme"`를 요구한다 | **종결(2026-09-06)** | 게이트 (8) 통과. 래퍼를 그대로 둔다 — C-3 문장 개정 없음. `@import "nativewind/theme"`는 **넣을 수 없다**(DS의 `--spacing: initial` 리셋과 충돌해 컴파일이 깨진다). 그것 없이 v1 어휘가 전부 동작한다. T-N1 보류 해제 |
| S-6 | AC-19 (c) | RN 검증이 "`Appearance` 모킹 2조합"인데 NativeWind가 테스트 환경에서 className을 style로 해석하지 못할 때의 격하 규칙이 AC-25 · AC-26 RN절에는 있고 AC-19 (c)에는 없다 | 정합 | T-R1. AC-25 격하 규칙을 준용하고 `docs/gate-c19.md`에 명시. 개정 시 AC-19 (c)에 같은 문장 추가 |
| S-7 | C-6 리셋 범위 · C-15 어휘 봉쇄 | `--font-*`(패밀리)를 리셋하지 않고 `--font-sans`만 덮어쓰므로 Tailwind 기본 `--font-mono` · `--font-serif`가 남아 `font-mono` · `font-serif` 클래스가 생성된다. "className에 쓸 수 있는 클래스는 DS 토큰 어휘뿐"의 예외 | 정합 | 없음. v1 알려진 동작 후보(R24가 15·16을 썼으므로 다음 번호)로 개정 시 추가. 리셋하면 소비자가 모노스페이스를 쓸 길이 없어져 유지 |
| S-8 | CLAUDE.md "C-19 게이트(… + pnpm peer)" | pnpm peer 해석 확인(C-3)은 웹이 먼저 필요로 하며 스펙은 이를 C-3 "착수 전 기술 확인"으로 둔다. 게이트 항목으로 두면 웹 착수가 게이트에 묶인다 | 정합 | 없음. T-W0에서 선확인, 게이트 (8)에서 native 재확인. CLAUDE.md 문구는 "C-3 선확인 + C-19 게이트"로 |
| S-9 | decisions-r21 A-4 | "아이콘 전용일 때만 `aria-label`"은 R21 후속에서 뒤집혔고 스펙은 갱신됐으나 근거 문서 원문은 그대로다(B-9는 r21 헤더가 재개정 각주를 이미 달고 있어 제외. v2 F-30) | 정합 | 없음. 근거 문서는 이력이며 스펙이 우선. 개정 시 A-4에 "R21 후속으로 대체" 각주 |
| S-10 | AC-26 (b) · C-8 (v2 F-30 위치 정정) | D-3 별칭 때문에 소비자가 `--bg-danger`를 덮으면 `--fg-danger`도 따라간다. AC-26 (b) "변수 단위로 격리"와 표면상 어긋나 보이나, 별칭은 스펙 C-8이 요구한 "같은 색"의 구현이다 | 정합 | T-V1의 AC-26 (b) 테스트는 별칭이 아닌 변수(`--bg-danger` 자체를 재선언하지 않은 상태)로 격리를 검사한다. 개정 시 알려진 동작에 "별칭 변수는 원본을 따라간다" 추가 |
| S-11 (v2) | C-17 ↔ AC-7 | C-17은 텍스트 컴포넌트 3종(Text · Badge · Label) `children`을 `string \| string[]`로, AC-7은 Label · Badge를 `string`으로 쓴다 | 정합 | D-29가 `string \| string[]`를 택했다(사용자 확정). 개정 시 AC-7을 C-17에 맞춘다 |
| S-12 (v2) | C-4 ↔ C-13 | C-4는 Form을 "인터랙티브 컴포넌트"(`"use client"` 대상)에 넣고 C-13은 Form을 "비인터랙티브"(`label` 대상 아님)로 둔다. 같은 용어, 다른 집합 | 정합 | 계획은 각각 맞게 처리(T-W6 `"use client"`, `label` 없음). 개정 시 C-4는 "클라이언트 컴포넌트", C-13은 "접근성 이름 대상"으로 용어 분리 |
| S-13 (v2) | R21 개정 요약 l.45 ↔ C-19 | 요약은 "NativeWind v5 확인 항목 5건"인데 R22가 (6)을 추가해 6건이다(CLAUDE.md도 6건) | 정합 | 없음. 개정 시 요약 갱신 |
| S-14 (v2) | C-17 children 규칙 | 텍스트 3 · 컨테이너 3 · 웹 전용 4 = 10에 ButtonGroup(children 있음)이 빠졌다 | 정합 | 계획 §4.8은 `ReactElement \| ReactElement[]`로 정했다(Button 엘리먼트만. `boolean \| null` 미포함이라 조건부 자식은 소비자가 배열 필터로 처리). 개정 시 C-17에 ButtonGroup 항목 추가 |
| S-15 (v2) | C-5b ↔ C-6 | "semantic 변수 이름은 twMergeConfig 색 키와 1:1"은 이름이 같다는 뜻이 아니라 대응 관계다(변수 `--bg-brand` ↔ 키 `brand`) | 정합 | 계획 §3.1 `semanticVariables` 맵이 그 대응의 실체. 개정 시 "1:1 대응(이름은 다름)"으로 |
| S-16 (v2) | C-7a · decisions-r21 B-8 ↔ C-13 · AC-7 · AC-13 | C-7a와 B-8은 ButtonGroup을 `size` 컨트롤로 열거하나 C-13 · AC-7 · AC-13에는 ButtonGroup `size`가 없다 | 정합 | D-30이 `size` 없음을 택했다(사용자 확정). 개정 시 C-7a 열거에서 ButtonGroup 제거 |
| S-17 (v2) | C-7c · Ontology Icon | "색·크기는 토큰으로 결정"인데 계획은 색을 `currentColor`(글자색 상속)로 둔다. 글자색이 `tone`/variant 토큰에서 오므로 간접 토큰 결정이다 | 정합 | 없음. 개정 시 "색은 글자색 상속" 명시. **(R25)** 공개 Icon 은 `tone` 으로 색을 직접 가진다 — 상속은 Button 안 아이콘에만 남는다 |
| S-18 (v2) | 알려진 동작 후보 | tailwind-merge의 font-size 스케일에 `base`가 하드코딩돼 소비자 `className="text-base"`가 DS `text-md`를 밀어내고 CSS도 없어 글자 크기가 사라진다(F-27). 리셋 네임스페이스 no-op(알려진 동작 1)의 특수 사례 | 정합 | T-T5 테스트 이름에 기록. 개정 시 알려진 동작 1에 "`text-base`는 twMerge에서도 크기 그룹으로 분류돼 DS 값을 밀어낸다" 추가 |

- **보류 항목 S-5는 게이트 (8)로 종결됐다(2026-09-06).** 남은 보류 태스크는 없다. 게이트 (2)·(4) 실패로 발생한 스펙 개정은 이 절과 별개이며 R24로 반영했다
- 게이트 (1)~(8) 실패 시 개정 대상은 §2.2 표에 있다. 이 절과 별개로 취급한다
