# 구현 계획 검증 계획 · 결과

- 작성일: 2026-09-05. 검증 수행일: 2026-09-05
- 검증 대상: [plan.md](plan.md) (R23 스펙 기준 구현 계획). 기준 문서는 [design-system-spec.md](design-system-spec.md) R23과 [decisions-r21.md](decisions-r21.md) · [decisions-r22.md](decisions-r22.md) · [decisions-r23.md](decisions-r23.md), 그리고 [CLAUDE.md](../CLAUDE.md)
- 이 문서의 지위: T-0(레포 부트스트랩) 착수 전에 계획을 무엇으로·어떻게 검증하고, 무엇이 나오면 착수를 막는지 정한다. 검증 **결과**는 각 표 "결과" 열과 [§7 발견 목록](#7-발견-목록)에 있다. 계획 수정은 검증 뒤 한 번에 plan.md에 반영하고 상단에 개정 이력을 남긴다. 스펙은 고치지 않는다 — 스펙 결함은 plan.md §9에 추가한다
- 검증 원칙: **작성자와 검증자를 분리한다.** plan.md를 쓴 세션이 자기 문서를 승인하지 않는다. 기계 검사는 스크립트로, 의미 검사는 계획을 쓰지 않은 리뷰 에이전트로 돌린다

## 목차

1. [검증이 답해야 할 질문](#1-검증이-답해야-할-질문)
2. [V-1 스펙 추적성](#2-v-1-스펙-추적성)
3. [V-2 계획 내부 정합성](#3-v-2-계획-내부-정합성)
4. [V-3 외부 사실 확인](#4-v-3-외부-사실-확인)
5. [V-4 실행 가능성](#5-v-4-실행-가능성)
6. [실행 순서 · 판정 · 종료 조건](#6-실행-순서--판정--종료-조건)
7. [발견 목록](#7-발견-목록)
8. [초안 작성 중 발견한 후보](#8-초안-작성-중-발견한-후보)

---

## 1. 검증이 답해야 할 질문

계획이 "통과"라는 말은 아래 네 질문에 전부 예라는 뜻이다. 축 하나가 하나의 질문이다.

| 축 | 질문 | 실패하면 |
|---|---|---|
| V-1 추적성 | 스펙이 요구한 것을 빠짐없이, 닫힌 결정을 다시 열지 않고 계획에 옮겼는가 | AC를 못 닫거나 스펙 위반 구현이 나온다 |
| V-2 내부 정합성 | 계획 안의 이름·값·타입·산출물·태스크가 서로 맞는가 | 태스크 중간에 계획을 고치게 된다 |
| V-3 외부 사실 | 계획이 도구·라이브러리에 대해 단정한 것이 2026-09-05 시점에 참인가 | 태스크가 착수 후 성립하지 않는다 |
| V-4 실행 가능성 | 태스크가 순서대로, 자동 확인 가능한 완료 조건으로, Windows 환경에서 돌아가는가 | 완료를 선언할 수 없는 태스크가 생긴다 |

판정 등급은 세 개다. 항목마다 "실패 등급"을 미리 적어 두어 검증자가 등급을 즉석에서 정하지 않게 한다.

| 등급 | 뜻 | 처리 |
|---|---|---|
| **B** (blocker) | T-0 착수 불가. AC 누락, 계약 모순, 산출물 미생산, 태스크가 성립하지 않는 외부 사실 오류 | plan.md 수정 → 해당 항목 재검증 → 통과해야 착수 |
| **P** (계획 수정) | 태스크 문구·순서·완료 조건을 고쳐야 하나 구조는 유지 | plan.md 수정. 재검증은 수정 항목만 |
| **N** (기록) | 각주·알려진 동작 후보·§9 추가 | plan.md에 기록만 |

---

## 2. V-1 스펙 추적성

스펙 → 계획 방향의 누락과 왜곡을 잡는다. 기계 검사(스크립트)와 의미 검사(리뷰 에이전트)를 나눈다.

### 2.1 기계 검사

스크립트는 scratchpad에 두고 레포에 넣지 않는다. 입력은 두 문서의 현재 상태(§6.3 해시).

| # | 대상 | 방법 | 통과 기준 | 실패 등급 | 결과 |
|---|---|---|---|---|---|
| V1-1 | AC 커버리지 | 스펙 "Acceptance Criteria" 절에서 `AC-\d+[a-z]?` 집합 추출(31개) ↔ plan.md §7 표 1열 집합 비교. 하위 절(AC-3 웹/RN, AC-11 웹/RN, AC-13 RN, AC-19 a/b/c, AC-26 a~d/RN)도 스펙 원문에서 추출해 §7에 행이 있는지 확인 | 차집합 양방향 0 | B | **통과.** 31 = 31, 차집합 0. §7 행 36개(하위 절 포함) |
| V1-2 | 닫는 AC ↔ §7 양방향 | §6 각 태스크의 "닫는 AC:" 줄에서 AC id 추출 → (태스크, AC) 쌍. §7 "닫는 태스크" 열에서 (AC, 태스크) 쌍. 두 집합 비교. "일부"·"전제"·"최종" 같은 한정어는 무시하고 존재만 본다 | 불일치 쌍 0. 있으면 목록 출력 | P | **부분.** 기계 불일치 21쌍 중 20쌍은 표기(범위 `T-W3 ~ T-W7`, `AC-16 · 17`, "전제"·체인 `T-G2 → T-R1`)라 의미상 일치. 실질 1건: T-V1 닫는 AC에 AC-11 웹 통합 계층 누락(F-24) |
| V1-3 | Constraint 참조 | 스펙 Constraints 절의 `C-\d+[a-c]?` 전량(C-1 ~ C-21, 하위 C-4a·C-5a/b/c·C-7a/b/c) ↔ plan.md 전체 grep. 0회 참조 항목 나열 | 0회 참조가 C-2 · C-9 · C-18(비목표·중복 규칙)뿐. 그 외 0회는 리뷰 대상으로 V1-8에 넘김 | P | **통과.** 27개 전부 1회 이상 참조 |
| V1-4 | 알려진 동작 1~14 참조 | plan.md에서 "알려진 동작 N" grep | 14개 중 미참조 번호 나열. 미참조 자체는 실패가 아니고 V1-9 입력 | N | **통과.** 미참조 14번만(§3.7이 C-5c 트리거로 우회 참조) |
| V1-5 | C-19 게이트 항목 매핑 | 스펙 C-19 (1)~(6) + R20 미결 3 ↔ plan.md §2.2 (1)~(9). 스펙 6건이 계획 (1)~(6)과 같은 내용인지, 계획 (7)~(9)의 출처(R20 미결 3, §9 S-5, AC-25 격하 규칙)가 맞는지 | 스펙 6건 전부 계획에 있고 통과 기준이 스펙 문장과 모순 없음 | B | **통과.** (1)~(6) 1:1, (7) = R20 미결 3, (8) = S-5, (9) = AC-25 격하. 단 (2)의 API 이름 오류는 X-16(F-22) |

### 2.2 의미 검사 (리뷰 에이전트, 스펙 전문 + plan.md 전문 입력)

| # | 대상 | 방법 | 통과 기준 | 실패 등급 | 결과 |
|---|---|---|---|---|---|
| V1-6 | 스펙이 계획으로 넘긴 항목 전부 결정됐는가 | 스펙에서 "계획"이 언급된 문장 전량(line 59·71·152·162·188·304·305 등)과 plan.md 서두가 나열한 항목 10종 → 각각 plan.md §3/§4/§5/§8의 어느 D-번호가 답인지 표로 만든다 | 답 없는 항목 0 | B | **통과.** 17항목 전부 대응(§3 D-1~6 / §4.2~4.6 D-7~16 / §5 D-17~20 / §2.2 (7)). F-32 문구 1건 |
| V1-7 | 닫힌 결정 재개방 여부 | decisions-r21 B-1~B-11(B-9는 R21 후속 재개정본), r22 B-1·B-2, r23 B-1·B-2 각각에 대해 plan.md의 대응 문장을 찾고 결정 내용과 다른 점을 적는다. 특히 D-13(Form에 Base UI 미사용)이 B-10 원문과 충돌하는지 | 결정 내용과 다른 계획 문장 0. "구현 세부 선택"은 재개방이 아니다 | B | **실패(P).** 재개방 0. ButtonGroup에서 `size` 축 제거가 B-8·C-7a와 어긋나고 근거 미기록(F-18). D-13 출처는 B-10이 아니라 B-6·C-21(F-30) |
| V1-8 | Constraint별 계획 반영 | C-3 ~ C-21 각각을 한 줄로 요약하고 계획 어디가 그 의무를 구현하는지 적는다. 의무가 있는데 태스크가 없으면 표시 | 의무 있는 Constraint 전부에 태스크 있음 | B | **실패(P).** 태스크 없는 의무 3건 — native dist 정적 클래스 검사(F-19), CI `vitest --typecheck`(F-20), native 래퍼에 `@custom-variant dark` 제외 명시(F-21) |
| V1-9 | 알려진 동작과 계획의 충돌 | 알려진 동작 1~14 각각에 대해 계획이 그 동작을 뒤집는 문장이 있는지 | 충돌 0 | P | **통과.** 충돌 0 |
| V1-10 | §9 S-1 ~ S-10 실재 확인 | 각 S 항목이 인용한 스펙 위치를 열어 주장이 사실인지, 등급(보류/정합)이 맞는지, "영향 태스크"가 맞는지 | 사실 아님 0. 등급 오류는 P | P | **통과.** 사실 아님 0, 등급 오류 0. 문구 정정 3건(S-4 출처 B-6 미인용, S-9 절반 stale, S-10 위치는 AC-26 (b)·C-8) → F-30 |
| V1-11 | 스펙 내부 불일치 중 §9가 놓친 것 | 스펙의 같은 대상을 두 곳에서 다르게 쓴 문장을 찾는다 | 발견은 §9 추가 대상 | N | **통과(N 6건).** F-1(C-17↔AC-7 children), C-4↔C-13 Form "인터랙티브", l.45 "5건"↔C-19 6건, C-17 children 규칙에 ButtonGroup 누락, C-5b↔C-6 "1:1" 표현, C-7a↔C-13 ButtonGroup `size` → F-29 |
| V1-12 | CLAUDE.md 정합 | CLAUDE.md의 두 문장이 plan.md 이후에도 맞는지 | 갱신 필요 → CLAUDE.md 수정 항목으로 기록 | P | **실패(P).** "구현 착수 전 게이트"(실제는 native 착수 전), pnpm peer(T-W0 이동), 게이트 9건, "계획 문서 없음" 전부 stale → F-12 |

---

## 3. V-2 계획 내부 정합성

| # | 대상 | 방법 | 통과 기준 | 실패 등급 | 결과 |
|---|---|---|---|---|---|
| V2-1 | 이름 3종 일관성 | §3.3 표의 `@theme inline` 키 16개에서 클래스 접미를 만든다. §3.9 `color` 배열, §4.2·§4.6·T-W5의 `bg-*`/`text-*`/`border-*`/`outline-*`/`hover:bg-*`를 추출해 접미가 16개 집합 안에 있는지 | 집합 밖 접미 0. §3.9 배열이 정확히 16개 | B | **통과.** 16 = 16, 사용 접미 14종 전부 집합 안(집합 밖 4건은 T-T4 negative probe 문자열) |
| V2-2 | §3.8 component 값이 열거 안인가 | 값 ∈ 열거, 높이 재계산, `icon.size` 전달 경로, Input 테두리 높이 | 열거 밖 값 0. 높이 계산 일치. 아이콘 경로·테두리 처리가 기술돼 있음 | P | **실패(P 2).** 열거 밖 0, 높이 28/40/52 계산 일치. Input 1px 테두리 포함 30/42/54로 Button과 2px 차(F-7). `icon.size` 20px는 클래스 불가(probe `size-5` 미생성), 전달 경로 미기술(F-8) |
| V2-3 | §4.2 매트릭스 ↔ §4.8 `Contracts<P>` ↔ C-17 | 컴포넌트 14개 × prop 표. `ref`·`Press<P>`·`children`·`label` 규칙 | 불일치 0 | B | **실패(P 1).** 13개 일치. Box가 §4.2 "web · native"인데 `nativeComponents`·AC-20·T-N2에 없음(F-13). N: ButtonGroup children 타입 C-17 미분류, tokens peer `{}`이나 react 타입 import(F-31), T-W8 (3) `label` 누락 케이스 1건 vs §7 "7개" |
| V2-4 | 산출물 ↔ 소비 태스크 | T-T2 산출물·§3.10 export ↔ 이후 태스크 import | 생산되지 않는 소비 0 | B | **실패(B).** component 계층 JS 객체를 T-W8 (6)이 소비하나 §3.10·T-T2 (5)에 없음. `Contracts`·`IconName` re-export도 미기술(F-2) |
| V2-5 | §8 D 목록 ↔ 본문 | D-1 ~ D-23 본문 위치. D 없는 결정 나열 | D 없는 결정은 N | P | **통과.** 23개 본문 일치. D 없는 본문 결정 14건(F-33) |
| V2-6 | 단계 그래프 | 실제 의존 재구성. 미명시 앞당김 | 미명시 순환 0 | P | **실패(P 3).** T-W0가 T-W1의 package.json(exports·peer)을 전제(F-15). 게이트 (3)이 Phase 5 산출물 native dist를 전제(F-14). T-V3 `pnpm -r pack`이 빈 native 패키지 포함(F-16) |
| V2-7 | `@<scope>` 치환 가능성 | 스코프 문자열 위치 전부 | 수기 위치가 `package.json` name + 검증 앱뿐 | N | **통과(N).** 수기 위치가 web·native·테스트 TS 소스 import에도 있음. 치환 뒤 `pnpm install` 재실행 필요(F-37에 병기) |
| V2-8 | 버전 하한 정합 | §5.2 peer ↔ C-4a ↔ §2.1 | 스펙보다 낮은 하한 0 | N | **통과.** 낮은 하한 0. web `tailwindcss >=4.1` 근거가 NativeWind뿐(F-34) |

---

## 4. V-3 외부 사실 확인

probe 환경: scratchpad `probe/` — tailwindcss 4.3.3 · @tailwindcss/node 4.3.3 · tailwind-merge 3.6.0 · lucide-react 1.41.0 · lucide-react-native 1.41.0. 레지스트리 조회 2026-09-05.

| # | 계획의 단정 | 위치 | 확인 방법 | 통과 기준 | 실패 등급 | 결과 |
|---|---|---|---|---|---|---|
| X-1 | `@theme inline`은 유틸리티가 `var()` 참조값을 그대로 쓰고, 비-inline은 `:root`에 변수로 남는다 | §3.7 · §3.11 | probe | 문서·probe 일치 | B | **통과.** `.bg-brand { background-color: var(--bg-brand) }`, `--color-brand`는 theme 레이어에 미출력. 비-inline `--radius-md`·`--text-xl*`·`--spacing-4`는 `@layer theme { :root, :host }`에 출력(사용된 것만). 소비자 무레이어 `:root { --radius-md: 2px; --font-sans: X }`가 뒤에 오면 덮음 → R23 요구 (a) 답: **덮인다** |
| X-2 | `--spacing-*: initial`만으로는 `mt-5`가 안 지워지고 단독 `--spacing: initial`이 필요 | §3.4 · §3.11 · T-T4 (4) | probe 3조합 | 둘 다 리셋 + 명시 선언에서 `mt-4`만 출력 | B | **통과(전제는 틀림).** 4.3.3에서는 `--spacing-*: initial`만으로 `mt-5`·`mt-17`·`w-64` 미생성. 단독 `--spacing: initial`은 불필요하나 무해. 유지하고 각주(F-26) |
| X-3 | 복합 폰트 변수가 `text-xl` 하나로 세 속성 | §3.5 | 문서 + probe | 3속성 출력 | B | **통과.** font-size · line-height · font-weight 출력. 문서 원문 "provide default line-height, letter-spacing, and font-weight values for a font size" |
| X-4 | 리셋 네임스페이스 이름이 v4.1 실제 이름 | §3.4 · §3.11 · C-6 | tailwindcss.com/docs/theme 네임스페이스 표 | 전부 존재 | P | **통과.** 7종 전부 존재 |
| X-5 | `@tailwindcss/node` `compile()`이 브라우저 없이 출력 CSS를 만든다 | §5.5 · T-T4 | probe | probe가 이 API로 동작 | B | **통과.** `compile(css, { base, onDependency })` → `build(candidates)` |
| X-6 | `@custom-variant dark { … }` 문법 | C-20 · T-T2 | probe | 두 셀렉터 출력 | B | **통과.** `.dark\:bg-brand:where(.dark, .dark *)` + `@media … :where(:not(.light, .light *))` |
| X-7 | `extend.theme`로 넣으면 `mt-5`가 spacing으로 인식되지 않는다 | §3.9 · T-T5 | 문서 + probe | `cn("mt-4","mt-5")` = `"mt-4 mt-5"` | B | **실패(B).** `extend`는 concat(기본 `['px', isNumber]` 유지) → `"mt-5"`. `override`는 교체 → `"mt-4 mt-5"`, `rounded-xl`·`shadow-2xl`·`bg-red-500`도 DS 값 안 밈(F-4). 부작용: `text-base`는 font-size 스케일에 하드코딩돼 `cn("text-md","text-base")` = `"text-base"`(F-27) |
| X-8 | Base UI 패키지명 `@base-ui/react`, 파트·prop 이름 | §4.3 · §5.2 · T-W1 | npm + base-ui.com | 일치 | B | **통과.** `@base-ui/react` 1.8.0(2026-09-04), 구 패키지는 deprecated "renamed". 파트별 import ✓, `render: ReactElement | fn` ✓, `data-open` ✓, `onOpenChange(open, eventDetails)` **2인자**(T-W7 boolean 래핑 근거 성립), `Dialog.Title` → `aria-labelledby` 자동(소스 확인). peer `react ^17 || ^18 || ^19`. 새 파트 `Dialog.Viewport`·`Tooltip.Viewport` 존재(F-28). F-10 기각 |
| X-9 | `IconName` 24개가 양쪽 lucide에 export | §4.5 | 로컬 설치 후 d.ts 검사 | 24개 전부 존재 | P | **통과(N).** 양쪽 1.41.0, 24개 전부. `AlertCircle`은 `CircleAlert`의 별칭 export, RN도 `alert-circle`·`circle-alert` 둘 다. 맵은 정식명 권장(F-6) |
| X-10 | React 19 `ref` 일반 prop | §4.1 · C-4a | react.dev | 성립 | B | **통과.** "ref as a prop", `useImperativeHandle` 예시 `function MyInput({ ref })` |
| X-11 | Vitest typecheck + `vitest.workspace.ts` | §5.1 · §5.5 · T-W8 | vitest.dev | 성립 | P | **부분(P).** typecheck·`expectTypeOf`·`*.test-d.ts` ✓(Vitest 5.0.0). `workspace`는 3.2 deprecated, **4.0에서 제거**(에러 throw) → `test.projects`(F-5) |
| X-12 | `pnpm pack`이 `workspace:*` 치환, 타르볼 `file:` 설치 | §5.3 · §5.6 · T-V3 | pnpm.io + probe | 치환 확인, tokens 해석 절차 존재 | P | **부분(P).** 치환 ✓(`"@probe/tokens": "0.1.0"`). web 타르볼만 설치 시 `ERR_PNPM_FETCH_404`(tokens 미공개). 루트 `pnpm.overrides`로 tokens 타르볼 지정 시 성공하나 **워크스페이스 소스 `packages/web`의 `workspace:*`까지 타르볼로 바뀜**. 워크스페이스 밖(`--ignore-workspace`, 앱 자체 overrides)에서는 부작용 없음(F-11) |
| X-13 | Playwright `emulateMedia({ colorScheme })` | §5.5 · T-V1 | playwright.dev | 성립 | N | **통과.** 1.63.0 |
| X-14 | `create-next-app` Tailwind 템플릿 파일 목록 | T-V1 | 템플릿 실측 | 부재 검사 성립 여부 | P | **실패(P).** 16.3.4 `app-tw/ts` 템플릿이 `postcss.config.mjs`(`@tailwindcss/postcss`) 생성 → "부재" 불성립(F-3) |
| X-15 | Vite + `@tailwindcss/vite` 설정 | T-V2 | 문서 | 플러그인 1줄 인정 | N | **통과.** `vite.config.ts` 플러그인 1줄 + CSS `@import "tailwindcss"` |
| X-16 | NativeWind v5 요구 사양·설치·API | §2.1 · §2.2 · §5.2 | nativewind.dev/v5 + npm | 일치 | P | **부분(P).** (a) Tailwind 4.1+, RN 0.81+, New Architecture, Reanimated 4+ ✓. Expo SDK 54는 요구 목록이 아니라 `rn-new` 예시 문장 (b) 설치 명령 ✓, 추가 요구 `overrides.lightningcss: "1.30.1"`, `postcss.config.mjs`, `nativewind-env.d.ts`(F-23) (c) `withNativewind` ✓ (d) `babel-preset-expo`만 ✓ (e) **`colorScheme.set` 없음** → RN `Appearance.setColorScheme`(F-22) (f)(g)(h) ✓ (i) `preview` = 5.0.0-preview.4(2026-05-15), `latest` = 4.2.6, peer `tailwindcss >4.1.11`, `react-native-css ^3.0.1`(3.0.7, peer RN >=0.81, `@expo/metro-config >=54`) (j) `expo latest` 57.0.20(RN 0.86.3), `sdk-54` 54.0.37(RN 0.81.5). **문서 54, 기본 생성 57**(F-9) |
| X-17 | RNTL `toHaveStyle` 내장 | §2.1 · §5.5 | 문서 + npm | 성립 | N | **통과(N).** 13.0부터 기본 활성. 14.0.1: `render`가 **async**, peer `test-renderer ^1.0.0`(react-test-renderer 제거). jest-expo 57.0.5 / sdk-54 54.0.18(F-23) |
| X-18 | `@source` 상대경로 규칙 | C-3 · T-T2 | 문서 + 소스 | 성립 | N | **통과.** 문서 "relative to the stylesheet", node_modules 자동 스캔 없음. import된 파일 안의 `@source`는 소스(`at-import.ts` context base)로 그 파일 기준 확인 |

---

## 5. V-4 실행 가능성

| # | 대상 | 방법 | 통과 기준 | 실패 등급 | 결과 |
|---|---|---|---|---|---|
| V4-1 | 태스크 형식 | 26개 태스크의 3요소 | 누락 0 | P | **통과.** AC-7 분할 4+2+2+1+3 = 12 |
| V4-2 | 완료 조건 자동성 | 수동 조건 명시 여부 | 미명시 수동 0 | P | **실패(P 1).** T-N4 파괴 확인이 수동인데 미표기(F-17). N: T-G1 기동, T-G2 기기 화면, T-N1 oklch 확인 수단, T-W0 1회성 조사 |
| V4-3 | 앞당김·순환 | V2-6 재사용 | 숨은 앞당김 0 | P | **실패.** = V2-6 (F-14 · F-15 · F-16) |
| V4-4 | T-V3 타르볼 설치 절차 | X-12 결과 | 절차가 태스크 문장으로 존재 | P | **실패(P).** = F-11 · F-16 |
| V4-5 | Windows 제약 | 명시 여부 | 미해결 0 | N | **통과(P 1 승격).** Android만·iOS 없음 명시 ✓. 생성물 git 추적 + "두 번 실행 diff 0"이 `autocrlf`에 흔들림 → `.gitattributes` 필요(F-25). 루트 스크립트를 node로 명시(F-37) |
| V4-6 | C-19 손절 시작일 기록 위치 | — | 정해짐 | N | **실패(N).** 미정 → `docs/gate-c19.md`로 지정(F-36) |
| V4-7 | 검증자 분리 | §6.3 기록 | 기록됨 | P | **통과.** §6.3 |

---

## 6. 실행 순서 · 판정 · 종료 조건

### 6.1 순서

| 단계 | 내용 | 수단 | 산출 | 상태 |
|---|---|---|---|---|
| 0 | 대상 고정 | 파일 해시 기록(커밋 대신). 검증 중 plan.md를 고치지 않는다 | §6.3 | 완료 |
| 1 | 기계 검사 | V1-1~5, V2-1 · V2-2(열거) · V2-4(목록)를 scratchpad 스크립트(`mech.mjs`)로 | 불일치 목록 | 완료 |
| 2 | 의미 검사 | 리뷰 에이전트 2개 병렬 — (a) 스펙↔계획 V1-6~12, (b) 계획 내부 V2-3 · V2-5~8 · V4-1~3 · V4-5 · V4-6 | 발견 목록 | 완료 |
| 3 | 외부 사실 | X-1~18. 문서·npm은 에이전트 2개 병렬, probe는 scratchpad `probe/` | 표 "결과" 열 | 완료 |
| 4 | 판정 | 발견을 §7에 번호로 모으고 등급 확정. 설계 선택이 필요한 항목(F-1 · F-7 · F-9 · F-18)은 사용자에게 한 번에 묻는다 | §7 완성 | 완료. 4건 모두 추천안(A) 확정 |
| 5 | 반영 | plan.md 개정(상단 개정 이력 + 본문 + §9 추가). CLAUDE.md 두 문장 갱신. B·P 항목 재검증 | plan.md v2 | 완료. 재검증: 기계 검사 재실행 — V1-2 실질 불일치 0(T-V1 AC-11 반영 확인), V2-1 통과, V2-4 `component`·contracts export 확인. 의미 항목은 편집 지점에 `(v2 F-n)` 표기로 추적 |
| 6 | 착수 판정 | 종료 조건 확인 후 T-0 착수 | 착수 기록 | **착수 가능.** B 0 · P 반영 · N 기록 · probe 통과 · 사용자 결정 잔여 0. 남은 보류는 `@<scope>` 이름(T-0 직전 확정)뿐 |

### 6.2 종료 조건

- B 등급 0
- P 등급 전부 plan.md에 반영되고 해당 항목 재검증 통과
- N 등급 전부 plan.md 각주 또는 §9에 기록
- probe(X-1 · 2 · 3 · 5 · 6) 통과. 하나라도 실패하면 §3.11 구조 재설계이며 T-T1 착수 불가 — **전부 통과, §3.11 구조 유지**
- 사용자 결정 항목 0 (남으면 결정 대기로 착수 보류)

### 6.3 기록란

- 검증 대상(git hash-object, 2026-09-05 working tree, HEAD 2f98ebe): plan.md `9930070d` · design-system-spec.md `ac021dcc` · decisions-r21.md `0e3b8564` · decisions-r22.md `a285c88c` · decisions-r23.md `05979258` · CLAUDE.md `2ab2db6a`
- 검증 수행일: 2026-09-05
- 의미 검사 수행 에이전트: 스펙↔계획 리뷰 1개, 계획 내부 리뷰 1개(둘 다 plan.md 작성 세션과 다른 general-purpose 서브에이전트, 읽기 전용). 외부 사실 조회 에이전트 2개
- probe: scratchpad `probe/`(tailwindcss 4.3.3 · @tailwindcss/node 4.3.3 · tailwind-merge 3.6.0 · lucide 1.41.0), 에이전트 측 `twm-probe/` · `pnpm-probe/` · `standalone-verify/`(pnpm 10.28.1) · `cna/`(create-next-app 16.3.4) · `nw-probe/`(nativewind 5.0.0-preview.4, jest-expo 57.0.5). 레포 파일 수정 없음

---

## 7. 발견 목록

등급 집계: **B 2 · P 21 · N 13**, 기각 1. 사용자 결정 4건(F-1 · F-7 · F-9 · F-18)은 plan.md 반영 전에 닫는다.

| # | 위치 | 주장 | 근거 | 등급 | 조치 | 상태 |
|---|---|---|---|---|---|---|
| F-2 | plan §3.10 · T-T2 (5) | tokens export에 component 계층 JS 객체가 없는데 §3.8·T-W8 (6)이 소비. `Contracts`·`IconName`·`webComponents`·`nativeComponents`·`semanticVariables`의 index re-export도 미기술 | V2-4 | **B** | §3.10 export 목록에 `component`(button·input·textarea·badge·icon·card·dialog·drawer·tooltip)와 contracts re-export 추가. T-T2 (5) 동일 | 반영 완료 (plan.md v2) |
| F-4 | plan §3.9 · T-T5 | `extend.theme`는 기본 검증자에 concat → `cn("mt-4","mt-5")` = `"mt-5"`. `override.theme`여야 `"mt-4 mt-5"` | X-7 probe | **B** | §3.9를 `extendTailwindMerge({ override: { theme } })`로. T-T5 완료 조건에 `override` 명시 | 반영 완료 (plan.md v2) |
| F-1 | plan §4.8 Label · Badge `children: string` | 스펙 C-17(`string \| string[]`) ↔ AC-7(`string`) 불일치. 계획이 AC-7을 골랐고 근거·§9 없음 | V1-11 · V2-3 | P | **사용자 결정** — (A) `string \| string[]`로 C-17·Text와 통일 / (B) `string` 유지. 어느 쪽이든 §9 S-11 | 사용자 확정 (A) · 반영 완료 (plan.md v2) |
| F-3 | plan T-V1 완료 조건 | "PostCSS 편집 없음을 파일 부재 테스트로" — `create-next-app` 16.3.4 Tailwind 템플릿이 `postcss.config.mjs`를 생성 | X-14 | P | "생성기 출력 대비 diff 0"으로 변경 | 반영 완료 (plan.md v2) |
| F-5 | plan §5.1 `vitest.workspace.ts` | Vitest 4.0에서 `workspace` 제거(에러). 현재 5.0.0 | X-11 | P | `vitest.config.ts`의 `test.projects`로 | 반영 완료 (plan.md v2) |
| F-7 | plan §3.8 · D-6 | Input은 `border-default` 1px, Button은 테두리 없음 → 같은 `py + text`에서 Input이 2px 높음(30/42/54 vs 28/40/52). AC-16 로그인 화면에서 나란히 보임 | V2-2 | P | **사용자 결정** — (A) Button·Badge에 `border border-transparent`를 주고 컨트롤 높이를 30/42/54로 통일 / (B) 차이를 알려진 동작으로 기록 | 사용자 확정 (A) · 반영 완료 (plan.md v2) |
| F-8 | plan §3.8 `icon.size` · §4.5 | 20px는 spacing 열거 밖(키 5 없음)이라 `size-5` 클래스 불가(probe 확인). lucide `size` prop(JS 값)으로 넣어야 하며 계획에 경로 없음 | V2-2 · X-1 probe | P | §4.5에 "크기는 lucide `size` prop, C-4 (2) 정적 클래스 제약과 무관" 명시 | 반영 완료 (plan.md v2) |
| F-9 | plan §2.1 "Expo SDK 54" · T-G1 | NativeWind 문서는 SDK 54 예시, `create-expo-app@latest`는 SDK 57(RN 0.86). `react-native-css` peer(RN >=0.81, metro-config >=54)는 57을 배제하지 않음 | X-16 (j) | P | **사용자 결정** — (A) 문서 기준 SDK 54 고정(`--template blank@sdk-54`) / (B) 57로 먼저 시도, 게이트 실패 시 54로 재시도하고 기록 | 사용자 확정 (A) · 반영 완료 (plan.md v2) |
| F-11 | plan T-V3 | web 타르볼의 `@<scope>/tokens: 0.1.0`이 npm에 없어 `file:` 설치 실패. 루트 `pnpm.overrides`로 풀면 워크스페이스 소스 패키지의 `workspace:*`까지 타르볼로 바뀜 | X-12 probe | P | T-V3: 타르볼 설치 검증은 **워크스페이스 밖 임시 디렉터리**에 검증 앱을 복사해 앱 자체 `pnpm.overrides` + `--ignore-workspace`로 수행. `apps/*`는 `workspace:*` 유지 | 반영 완료 (plan.md v2) |
| F-12 | CLAUDE.md | "구현 착수 전 C-19 게이트"(실제는 native 착수 전), "+ pnpm peer"(T-W0 이동), 게이트 9건, "계획·구현 문서는 아직 없다" | V1-12 | P | CLAUDE.md 문서 절 갱신(plan.md·plan-verification.md 링크, 게이트 문장 정정) | 반영 완료 (plan.md v2) |
| F-13 | plan §4.2 Box 행 · §4.4 | Box가 "web · native"인데 `nativeComponents`·AC-20·T-N2에 없음. native가 Box를 export하면 맵 테스트 실패 | V2-3 | P | §4.2 Box를 web으로, §4.4 "RN `View`"를 v2 표기로 | 반영 완료 (plan.md v2) |
| F-14 | plan §2.2 (3) · §1 · §2.1 | 게이트 (3)이 `packages/native/dist` 컴포넌트를 전제하나 native dist는 Phase 5 산출물. §1 "토큰 파일만 있으면 돌릴 수 있다"와 모순 | V2-6 | P | T-G1이 `bg-brand`를 쓰는 **스텁 dist 파일 1개**를 만들어 (3)·(8)에 쓰고 T-N1이 대체한다고 명시 | 반영 완료 (plan.md v2) |
| F-15 | plan §1 · T-W0 · T-W1 | T-W0의 peer 해석 확인은 web `package.json`의 `exports`·`peerDependencies`(T-W1 할 일)를 전제 | V2-6 | P | 순서를 T-W1 → T-W0 → T-W2로 바꾸거나 T-0 스캐폴드에 3패키지 `package.json` exports·peer를 포함. 후자 채택(T-0 완료 조건에 추가) | 반영 완료 (plan.md v2) |
| F-16 | plan T-V3 | Phase 3 시점 native는 빈 스캐폴드라 `pnpm -r pack` + `.d.ts` 존재 검사가 native에서 실패 | V2-6 | P | T-V3 범위를 tokens·web으로 한정. native 타르볼은 T-R1 | 반영 완료 (plan.md v2) |
| F-17 | plan T-N4 | 의도적 파괴 1회는 수동 절차인데 "수동" 미표기 | V4-2 | P | 완료 조건에 "수동 1회, 기록" 명시 | 반영 완료 (plan.md v2) |
| F-18 | plan §4.2 · §4.8 ButtonGroup | r21 B-8·C-7a가 ButtonGroup을 `size` 컨트롤로 열거하나 계획은 `size` 없음. 근거·§9 없음. C-13·AC-7·AC-13에는 ButtonGroup `size` 언급 없음(스펙도 갈림) | V1-7 · V1-11 | P | **사용자 결정** — (A) `size` 없음 유지, §9에 스펙 불일치 기록(추가는 추가적) / (B) `size?: ControlSize` 추가, 자식 Button에 context로 전파 | 사용자 확정 (A) · 반영 완료 (plan.md v2) |
| F-19 | plan T-N4 · C-4 (2) | native dist에 대한 정적 클래스 검사(백틱 템플릿 정규식)가 없다. T-W8 (4)는 web dist만 | V1-8 | P | T-N4에 dist 검사 추가 | 반영 완료 (plan.md v2) |
| F-20 | plan T-0 · C-17 | 스펙 "CI에 `vitest --typecheck`"인데 CI 워크플로 태스크 없음 | V1-8 | P | T-0에 `.github/workflows/ci.yml`(`pnpm install` → `pnpm -r build` → `pnpm -r test`) 추가 | 반영 완료 (plan.md v2) |
| F-21 | plan T-T2 (3) | native 래퍼를 "(2)와 같은 형태"라 하면 `@custom-variant dark`가 포함되는 것으로 읽힘. 스펙은 웹 래퍼만 선언, RN은 NativeWind `dark:` 기본 | V1-8 | P | T-T2 (3)에 "`@custom-variant dark` 제외, 토큰 import + `@source`만" 명시 | 반영 완료 (plan.md v2) |
| F-22 | plan §2.2 (2) | `colorScheme.set("dark")`는 NativeWind v5 export에 없음. 수동 전환은 RN `Appearance.setColorScheme` | X-16 (e) | P | (2)와 AC-19 (c) 검증 문장을 `Appearance.setColorScheme`로 | 반영 완료 (plan.md v2) |
| F-23 | plan §2.1 · T-G1 | NativeWind 설치에 `overrides.lightningcss: "1.30.1"`, `postcss.config.mjs`, `nativewind-env.d.ts` 요구. RNTL 14는 `render`가 async이고 peer가 `test-renderer ^1.0.0` | X-16 (b) · X-17 | P | §2.1 설치 절차와 T-G1 jest 설정에 추가 | 반영 완료 (plan.md v2) |
| F-24 | plan T-V1 닫는 AC | AC-11 웹 통합 계층(Playwright computed style)이 §7에는 T-V1인데 T-V1 닫는 AC에 없음. 검사 자체는 (3) AC-24 항목이 겸함 | V1-2 | P | T-V1 닫는 AC에 "AC-11 웹 통합 계층" 추가, (3)에 AC-11 표기 | 반영 완료 (plan.md v2) |
| F-25 | plan T-0 | 생성물(dist·themes)을 git에 추적하면서 "두 번 실행 diff 0"·스냅샷을 쓰는데 Windows `autocrlf`면 흔들림 | V4-5 | P | T-0에 `.gitattributes`(`* text=auto eol=lf`) 추가 | 반영 완료 (plan.md v2) |
| F-6 | plan §4.5 맵 예시 | lucide 1.41.0에서 `AlertCircle`은 `CircleAlert`의 별칭. 24개 전부 양쪽 존재 | X-9 | N | 맵 예시를 정식명(`CircleAlert`)으로. 별칭 의존 금지 각주 | 반영 완료 (plan.md v2) |
| F-26 | plan §3.4 · §3.11 · T-T4 (4) | 4.3.3에서 단독 `--spacing: initial`은 불필요(`--spacing-*: initial`이 동적 spacing까지 지움). 하한 4.1과의 차이 가능성으로 유지 | X-2 probe | N | §3.4 비고를 "probe 결과 불필요, 하한 4.1 대비 유지"로. T-T4 (4)는 유지 | 반영 완료 (plan.md v2) |
| F-27 | plan §3.9 · 알려진 동작 | tailwind-merge font-size 스케일에 `base`가 하드코딩돼 `cn("text-md","text-base")` = `"text-base"`. `text-base`는 CSS가 없으므로 DS 크기가 사라진다 | X-7 probe | N | §9에 알려진 동작 후보 추가(소비자 `text-base` 금지) | 반영 완료 (plan.md v2) |
| F-28 | plan §4.3 | Base UI 1.8에 `Dialog.Viewport`·`Tooltip.Viewport` 파트가 있음. 필수 여부 미확인 | X-8 | N | §4.3에 "T-W7에서 Viewport 필수 여부 확인" 각주 | 반영 완료 (plan.md v2) |
| F-29 | plan §9 | 스펙 내부 불일치 5건 추가: C-4↔C-13 Form "인터랙티브" 집합, l.45 "5건"↔C-19 6건, C-17 children 규칙에 ButtonGroup 누락, C-5b↔C-6 "1:1"은 이름 동일이 아닌 대응, C-7a↔C-13 ButtonGroup `size`(F-18) | V1-11 | N | §9 S-11 ~ S-15 | 반영 완료 (plan.md v2) |
| F-30 | plan §9 S-4 · S-9 · S-10, 이 문서 §8 말미 | S-4 출처는 B-10이 아니라 r21 B-6·C-21. S-9는 r21 헤더가 B-9 재개정 각주를 이미 달아 A-4 문장만 해당. S-10 위치는 "알려진 동작 11"이 아니라 AC-26 (b)·C-8 | V1-10 | N | §9 문구 정정 | 반영 완료 (plan.md v2) |
| F-31 | plan §5.2 tokens `peerDependencies: {}` | `contracts.ts`가 `Ref`·`ReactElement`·`ReactNode`를 react에서 import → `.d.ts`가 `@types/react`를 요구 | V2-3 | N | `peerDependencies: { "@types/react": "*" }` optional 또는 주석 | 반영 완료 (plan.md v2) |
| F-32 | plan §5.5 | "DS 레포는 2개다"인데 `apps/`가 레포 안이라 레포 러너는 3개 | V1-6 | N | "패키지 러너 2개 + 검증 앱 jest-expo"로 문구 | 반영 완료 (plan.md v2) |
| F-33 | plan §8 | D 없는 본문 결정 14건(§3.11 레이어 미사용, §3.3 해석값 기입, §3.8 component CSS 미출력, §4.4 enum 값, §5.2 tokens 일반 의존성, §3.10 oklch, §4.1 닫힌 type, §4.2 disabled 클래스·Card variant 없음, §3.4·3.5 수치, §5.3 changesets 미사용·0.x major, T-W1 이중 export, §4.3 애니메이션·Tooltip.Provider, T-0 생성물 추적) | V2-5 | N | D-24 ~ D-27로 상위 4건(레이어 미사용 · 해석값 기입 · component CSS 미출력 · tokens 일반 의존성)만 추가, 나머지는 본문으로 충분 | 반영 완료 (plan.md v2) |
| F-34 | plan §5.7 · §5.2 web | web `tailwindcss >=4.1` 근거가 NativeWind뿐 | V2-8 | N | "web·native 하한을 하나로 유지하기 위해"로 근거 보강 | 반영 완료 (plan.md v2) |
| F-35 | plan §4.5 · C-7c | 스펙 "색·크기는 토큰으로" ↔ 계획 "색은 currentColor". 토큰 간접 상속 | V1-8 | N | §9 S-16 | 반영 완료 (plan.md v2) |
| F-36 | plan §1 | C-19 손절 시작일 기록 위치 미정 | V4-6 | N | `docs/gate-c19.md`에 "Phase 5 착수일" 항목 | 반영 완료 (plan.md v2) |
| F-37 | plan §5.3 · T-V3 · 서두 | `version:set`·`verify:pack` 구현 언어 미지정(Windows). `@<scope>` 치환 뒤 `pnpm install` 재실행 필요 | V4-5 · V2-7 | N | node 스크립트로 명시, 치환 절차에 재설치 추가 | 반영 완료 (plan.md v2) |
| F-10 | plan §4.3 `@base-ui/react` | 개명 주장 | X-8 | — | **기각.** 사실로 확인(1.8.0, 2025-12-11 개명) | 종결 |

---

## 8. 초안 작성 중 발견한 후보

전부 §7로 이관됐다. 후보 12건 중 확정 11건(F-1 ~ F-9, F-11, F-12), 기각 1건(F-10).

- 정정: 초안 말미의 "D-13은 B-10 원문에 Base UI 언급이 없어 재개방 아님"은 출처가 틀렸다. "Base UI `Form` / `Field`를 내부 기반으로" 문장은 r21 **B-6**과 스펙 C-21에 있다. 판정(재개방 아님, S-4 정합)은 유지한다 — B-6은 Form **범위**(레이아웃 + label + error, submit 제외)를 정한 결정이고 Base UI 사용은 구현 세부다(F-30)
