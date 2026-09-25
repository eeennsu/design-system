# React 웹/앱 공통 디자인 시스템 스펙

## 이력

- 2026-09-01 작성. 19라운드 인터뷰 결과. 형제 프로젝트 6개에서 브라운필드 증거 수집
- 2026-09-05 R20 개정. C-3·C-15 반전, 관련 AC 재검증 필요
- 2026-09-05 R21 개정. 구현 전 검증 결과 반영. C-20·C-21 신설, AC-19 재작성, "알려진 동작(v1)" 신설. 결정 근거는 [decisions-r21.md](decisions-r21.md)
- 2026-09-05 R22 개정. 소비 프로젝트 로컬 semantic 오버라이드 통로 신설(C-5b). C-19 게이트 (6) 추가, AC-26 신설, 알려진 동작 11~13 추가. 결정 근거는 [decisions-r22.md](decisions-r22.md)
- 2026-09-05 R23 개정. 오버라이드 대상 확대(C-5c)를 트리거 조건부로 연기. C-5b에 트리거 기록, 알려진 동작 14 추가, Non-Goal 문구 구분. 계약·동작 변경 없음. 결정 근거는 [decisions-r23.md](decisions-r23.md)
- 2026-09-06 R24 개정. C-19 착수 게이트 실행 결과 반영. 게이트 (2)·(4) 실패에 따라 RN 다크 경로를 `@media` 단일 셀렉터로 확정 — C-20 RN 항목, C-6 산출물, C-5b RN 항목, AC-19 (c), AC-26 RN절 수정, 알려진 동작 15~16 추가. 웹은 무변경. 측정 기록은 [gate-c19.md](gate-c19.md)
- 2026-09-25 R25 개정. v1 이후 첫 RN 소비 앱(spendback) 반영. Chip · Icon 신설, `IconName` 28개, RN 눌림 표시 · 누름 영역 · 입력 포커스 · placeholder 색 · 고정폭 숫자, 글자 대비(base 다크 · bakery). C-5b · C-6 · C-7c · C-11 · C-12 · C-13 · C-17 보강, AC-7 · AC-13 · AC-20, Ontology `Icon`, 알려진 동작 17~23 추가. 결정 근거는 [decisions-r25.md](decisions-r25.md)
- 2026-09-25 R26 개정. base를 토스 앱 인상을 참고한 값으로 바꿨다(회색 canvas · 흰 surface · 채움 입력 칸 · 글자 스텝 · 모서리 · RN 글꼴). `fg.brand` 신설, `fg.danger` 별칭 해제, radius `xl` 추가. C-5b · C-6 · C-7b · C-8 보강, 알려진 동작 24~27 추가. 결정 근거는 [decisions-r26.md](decisions-r26.md)
- 본문의 `R{n}`은 인터뷰 라운드 번호. 결정 근거는 문서 끝 트랜스크립트에서 추적
- 패키지명의 npm 스코프는 `@eeennsu`로 확정됐다(2026-09-05). R21 보류 항목이었고 문자열 치환을 마쳤다

### R20 개정 요약 (2026-09-05)

인터뷰 종료 후 스펙 리뷰 중 사용자가 R10의 `className` 완전 차단을 철회함. "이 버튼 하나만 배경색·크기·여백을 다르게" 같은 커스텀이 소비 프로젝트에서 가능해야 한다는 요구. 이에 따라:

- **C-15 반전**: `className` 허용. 웹은 Tailwind v4, RN은 NativeWind v5. 두 플랫폼이 같은 클래스 어휘를 씀
- **C-3 폐기·재작성**: "소비 프로젝트 Tailwind 불필요"는 성립 불가. 소비 프로젝트에 Tailwind v4 필수. DS는 토큰을 Tailwind `@theme`으로 배포
- **NativeWind 채택**: R12 기각 근거 3건 중 (3) 컴파일 CSS 배포는 className 허용으로 소멸, (1) preview 리스크는 감수, (2) 오버레이 분리는 유지. 컴포넌트 1본화는 여전히 하지 않음
- **AC-11·AC-15·AC-16·AC-17·AC-19·AC-20·AC-23 수정**, AC-24·AC-25 추가
- R12에서 닫힌 "스타일 전달 방식"이 다시 열림. 구현 착수 전 아래 미결 항목을 닫아야 함

R20 미결 (R21에서 처리):
1. DS 컴포넌트 기본 스타일과 소비자 `className` 병합 규칙 — `tailwind-merge` 사용 여부, RN에서의 대응물. **종결(R21)**: 웹·RN 양쪽 `tailwind-merge`, 설정은 토큰 빌드가 DS 키 목록으로 생성. C-15 참조
2. `@eeennsu/web` 스타일 배포 형태 — 컴파일된 CSS + `@theme` 파일 vs 소비 프로젝트가 `@source`로 DS 패키지 스캔. **종결(R21)**: web 래퍼의 `@source "../dist"`. 컴파일된 CSS는 동봉하지 않는다. C-3 참조
3. `spot`의 Expo SDK 버전이 NativeWind v5 preview 요구 사양과 맞는지 확인. 안 맞으면 C-19 손절 기준과 무관하게 대체안 검토. **C-19 착수 게이트로 유지(R21)**. R21 후속: `spot`은 개발 중단. 검증 대상을 빈 Expo 프로젝트로 바꿔, 게이트는 "NativeWind v5가 요구하는 Expo SDK를 확인해 검증 프로젝트를 그 SDK로 만든다"로 단순화

### R21 개정 요약 (2026-09-05)

R20 개정 스펙을 구현 전에 검증한 결과 모순·검증 불가·누락이 나와, 기술 확정안 5건(A-1~A-5)과 사람 결정 11건(B-1~B-11)을 확정함. 결정 근거·대안 비교·조합 검증 전문은 [decisions-r21.md](decisions-r21.md)에 있고 본문은 결과만 싣는다. 이에 따라:

- **C-3 종결**: 소비자 import 경로는 플랫폼 래퍼 `@eeennsu/web/themes/<brand>.css`(웹) / `@eeennsu/native/themes/<brand>.css`(RN). 래퍼가 내부 산출물 `@eeennsu/tokens/themes/<brand>.css`를 import하고, web 래퍼는 `@source "../dist"`로 컴포넌트 클래스를 스캔. 컴파일된 CSS는 동봉하지 않음
- **C-15 병합 규칙 확정**: `tailwind-merge`를 웹·RN 양쪽에서 사용, 설정은 토큰 빌드가 DS 키 목록으로 생성. 승리 범위는 같은 유틸리티 그룹·같은 변형
- **어휘 봉쇄**: primitive는 `:root` 변수로만 존재하고 `@theme`에 넣지 않음. Tailwind 기본 팔레트·동적 spacing은 리셋. spacing은 희소 열거 `1,2,3,4,6,8,12,16,20,24` + `0`. 열거 외 키는 에러가 아닌 무효 — "알려진 동작(v1)" 소절 신설
- **계약 강제 수단 확정(C-17)**: export 맵 타입 동등성 테스트. `ref`는 `{ focus(); blur() }` 핸들. 플랫폼 전용 prop 0개, 콜백은 플랫폼 이벤트 인자 없음
- **Text 컴포넌트 추가**: 웹 12개(AC-7), RN 5개(AC-20). Button은 `label`이 가시 텍스트, `children` 없음. 전역 축 `variant` / `size` / `tone` 3개(C-8). `size`는 5단, 컨트롤은 `sm | md | lg` 부분집합
- **간격 prop 폐지(C-14)**: 토큰 값을 받는 prop이 없다. 간격은 `className` 전용. Stack/Box는 `direction` / `align` / `justify` / `wrap`만
- **제어 API 두 갈래(C-12)**: 값 입력은 `value` 3종, 오버레이는 `open` / `defaultOpen` / `onOpenChange`. 누름은 플랫폼 관용 이름 — 웹 `onClick` / RN `onPress`, 시그니처 `() => void` 동일(R21 후속, B-9 재개정)
- **C-20 신설** 다크모드 hybrid. **C-21 신설** Form v1 범위(`<form>` + `preventDefault`, Enter 무동작). AC-19는 hybrid 기준으로 재작성
- **브랜드 실체**: v1 `base` + `bakery`, 앱당 1개 빌드타임 선택(C-5a)
- C-1·C-3·C-4·C-4a·C-5a·C-6·C-7·C-7a·C-7b·C-8·C-11·C-12·C-13·C-14·C-15·C-17·C-19 수정, C-20·C-21 신설. AC-3·5·6·6a·6b·7·8·9·10·11·11a·13·15·16·17·19·20·21·22·23·24·25 수정. 번호 유지, 삭제·재번호 없음
- R20 미결 1·2 종결, 3은 C-19 착수 게이트
- **R21 후속(같은 날, decisions-r21.md 밖)**: 계획 착수 전 누락 점검으로 닫은 것 — B-9 재개정(웹 `onClick` / RN `onPress`, `Contracts<P>`), Label ↔ Input `id` / `htmlFor`, 컨테이너 `children` 문자열 제외, Button 아이콘 전용 모드 v1 제외, Text `heading` enum, Textarea `size` → 행수, 리셋 범위에 `--font-weight-*` 추가, native 래퍼 `@source`, `"use client"` 보존 + 정적 클래스 제약, peer `react >= 19`, 검증 대상은 전부 새 빈 프로젝트(`spot` 개발 중단). 전문은 트랜스크립트 Round 21 "후속 확정"

R21 보류: 없음. npm 스코프 이름 1건은 2026-09-05 `@eeennsu`로 확정됐다. 착수 전 기술 확인(결정 아님): NativeWind v5 확인 항목 5건과 R20 미결 3은 C-19 게이트, web 래퍼 `@import "tailwindcss"`의 pnpm peer 해석은 C-3 참조

### R22 개정 요약 (2026-09-05)

스펙 리뷰 중 사용자가 "소비 프로젝트만의 특화된 디자인이 필요하면 그 통로를 열어놔야 하지 않나"를 물음. R21까지 브랜드 주입은 DS 레포의 브랜드 파일(`themes/<brand>.css`)뿐이라, 앱 하나의 색을 바꾸려면 DS 레포에 파일을 추가하고 배포해야 했다. 통로 후보 3개(A 소비자 로컬 semantic 오버라이드 / B 소비자 `@theme` 확장 / C 간격·타이포 브랜드별 분리) 중 **A만 연다**. 결정 근거·대안 비교·NativeWind v5 확인 결과는 [decisions-r22.md](decisions-r22.md)에 있고 본문은 결과만 싣는다. 이에 따라:

- **C-5b 신설**: 소비 프로젝트가 전역 CSS에서 DS 래퍼 import 다음 줄에 `:root` semantic 변수를 재선언하면 캐스케이드로 덮인다. DS 코드 변경 0 — 구조상 이미 되는 것을 공개 계약으로 승격. 대상은 semantic 색 변수뿐, 다크는 3블록(`:root` / `.dark` / `@media … :root:not(.light)`) 모두 재선언
- **C-5a 보강**: 브랜드 주입 위치 2곳 — DS 레포 브랜드 파일(이름 있는 프리셋) + 소비자 로컬 오버라이드(앱 전용). 간격·타이포·component 계층 불변은 그대로
- **어휘 봉쇄 유지**: 새 클래스 생성 0. 소비자 `@theme` 확장(B)과 간격·타이포 브랜드 분리(C)는 Non-Goal에 명시
- **C-19 게이트 (6) 추가**: NativeWind v5에서 소비자 `:root` 재선언이 DS 토큰 파일의 `:root`를 last-wins로 덮는지
- **알려진 동작 11~13 추가**: 오버라이드가 RN JS 토큰 객체에 닿지 않음(11) / 다크 3블록 미재선언 시 스킴별 불일치(12) / primitive 변수 재선언은 계약 밖(13)
- **AC-26 신설**(distribution): 로컬 오버라이드 검증. AC-19 4조합 매트릭스 재사용, RN은 AC-23 화면
- Ontology `Brand` 수정, `SemanticVariable` 추가. 번호 유지, 삭제·재번호 없음

R22 보류: 없음. semantic 변수 실제 이름은 계획 태스크 "토큰 인벤토리"가 정하며, 정해지는 순간 공개 계약이 된다(C-5b)

### R23 개정 요약 (2026-09-05)

R22 반영 직후 사용자가 이어서 물음 — ① "통로가 소비 프로젝트에서 DS 규약을 수정하게 하는 것이냐"(아니다. C-5b는 CSS 변수 **값** 재선언만이고 계약·어휘·컴포넌트 API는 불변) ② "어차피 화면은 클로드코드가 DESIGN.md를 보고 만드는데 그 걱정이 필요한가". ②의 검토 결과 사용자의 실제 걱정(같은 DS를 여러 앱에 쓰면 디자인 방향이 한 축으로 귀결)은 **유효하되 범위가 좁다** — 화면 구조·간격 리듬·색은 클로드코드와 C-5b가 이미 가르고, 안 갈리는 것은 컴포넌트 내부 형태(radius·컨트롤 높이·테두리)와 폰트 패밀리다. 결정 근거·대안 비교는 [decisions-r23.md](decisions-r23.md). 이에 따라:

- **C-5c(오버라이드 대상 확대: 색 + `--radius-*` + 폰트 패밀리)를 지금 열지 않고 트리거 조건부로 연기**. 근거는 비대칭 — 나중에 대상을 넓히는 것은 추가적(minor)이고, 지금 열면 이름 안정성 의무가 3종으로 늘고 AC-6a 문구가 바뀐다. 앱을 0개 만든 상태의 추측으로 계약 표면을 늘리지 않는다. 기다리는 비용 0
- **C-5b에 (R23) 확대 트리거 기록**: DS v1 완료 후 도메인이 다른 소비 프로젝트 2개를 구축한 시점에 색 이외의 인상이 구분되지 않으면 연다. 판단은 사용자 1인, 자동 기준 없음
- **알려진 동작 14 추가**: 컴포넌트 내부 형태·폰트 패밀리는 앱 단위 통로가 없어 `className` 임의값을 호출 지점마다 반복하게 된다
- **Non-Goal 문구 구분**: R22가 닫은 후보 C(간격·타이포 **스케일 구조**의 브랜드별 분리)와 연기된 C-5c(오버라이드 **대상** 확대)는 다른 것. 후보 C는 트리거와 무관하게 유지
- 계약·타입·클래스 어휘·AC 변경 없음. 번호 유지, 삭제·재번호 없음

R23 보류: 없음. 열린 항목 1건은 C-5c이며 **결정 대기가 아니라** 트리거 충족 시 열리는 조건부 항목이다. 계획 태스크 "토큰 인벤토리"에 요구 2건 추가 — (a) `--radius-*`와 폰트 패밀리 변수가 소비자 `:root` 재선언으로 덮이는지 확인(토큰 빌드가 `@theme inline`을 쓰는 범위에 달림) (b) 두 변수군의 이름을 나중에 공개 계약이 돼도 되는 이름으로 짓는다

### R24 개정 요약 (2026-09-06)

C-19 착수 게이트(T-G1 · T-G2)를 실행했다. 9항목 중 (1)(3)(6)(8)(9) 통과, **(2)(4) 실패**, (5) 부분 실패, (7)은 기기 확인만 남았다. 측정·근거는 전부 [gate-c19.md](gate-c19.md)에 있고 이 절은 결과만 싣는다.

실패 2건은 같은 뿌리다 — **NativeWind v5(react-native-css)는 루트 클래스 셀렉터를 해석하지 않는다.** `.dark { … }`가 어떤 노드에도 안 걸리고(게이트 (2)), `@media (prefers-color-scheme: dark)` 자체는 동작하는데 `:root:not(.light)`의 `:not(.light)`이 매칭을 깨뜨린다(게이트 (4)). `:not(.light)`을 뺀 `:root`는 동작한다.

- **C-20 RN 항목 재작성**: RN 다크는 hybrid가 아니라 **OS 단독**이다. 루트 클래스 우선 규칙은 웹 전용이며, RN 토큰 경로는 `@media (prefers-color-scheme: dark) { :root { … } }` 한 셀렉터만 쓴다. 웹의 `@custom-variant dark`와 2셀렉터 출력은 무변경
- **C-6 산출물에 native 래퍼 다크 블록 추가**: 공유 토큰 파일(`@eeennsu/tokens/themes/<brand>.css`)은 그대로 두고, **native 래퍼가** 토큰 import 뒤에 `@media (prefers-color-scheme: dark) { :root { … } }`를 추가로 낸다. 값은 같은 DTCG 소스에서 나오므로 AC-5 동시 전파는 유지된다. 토큰 파일의 `.dark` 블록은 RN에서 무해하게 죽는다
- **C-5b RN 항목 수정**: 소비자 로컬 오버라이드는 성립한다(게이트 (6) 통과). 다만 RN에서 쓰는 블록은 웹의 3블록이 아니라 **2블록**(`:root` + `@media (prefers-color-scheme: dark) { :root }`)이다
- **AC-19 (c) · AC-26 RN절 수정**: 위 2블록 기준으로 바꾸고, RN 검증이 `toHaveStyle`로 가능함을 명시(게이트 (9)). AC-25의 className prop 스냅샷 격하 규칙은 **쓰지 않는다**
- **알려진 동작 15 · 16 추가**: RN 다크 블록 형태가 웹과 다름(15), RN line-height가 `px`를 배수로 읽음(16)
- 계약 타입·클래스 어휘·컴포넌트 API 변경 없음. 웹 산출물·웹 AC 무변경. 번호 유지, 삭제·재번호 없음

R24 보류: 게이트 (7)의 기기 화면 확인 1회가 남았다. 이것이 Phase 5 착수의 마지막 조건이며 스펙 개정 대상은 아니다. 게이트 (5)(lineHeight)는 C-19가 이미 대체 경로를 갖고 있어 스펙 변경이 없고, 두 구현 경로 중 **native 산출물이 배수로 내는 쪽**으로 확정했다(2026-09-06 사용자 확정, 계획 §2.3 D-31).

### R25 개정 요약 (2026-09-25)

v1 이후 첫 RN 소비 앱(spendback)을 연동하고 디자인을 검증하면서 나온 DS 쪽 요구를 반영했다. 인터뷰 라운드가 아니라 소비 앱의 요구와 측정, 검증 에이전트의 지적이 입력이다. 대안 비교는 [decisions-r25.md](decisions-r25.md)이고 이 절은 결과만 싣는다. 닫힌 결정(R21~R24)과 C-5c는 열지 않았다.

- **Chip 신설(웹 · RN)**: 고르는 칩. `label` 필수(가시 텍스트 겸 접근성 이름), `selected`는 상태 불리언(C-11 예외), 누름은 Button과 같은 플랫폼 갈래(`Press<P>`), `ref`는 `FocusHandle`. 고른 상태는 소비자가 누름 이벤트에서 바꾼다(제어 전용, C-12 보강). 웹 `aria-pressed`, RN `accessibilityState.selected`
- **Icon 공개(웹 · RN)**: `name` · `size`(컨트롤 3단) · `tone` · `label?`. 색은 상속하지 않고 `tone`으로 갖는다(RN에 상속이 없다). `label`이 있으면 이름 있는 그림, 없거나 빈 문자열이면 꾸밈이라 숨긴다. 누름 이벤트는 없다(C-7c 보강)
- **`IconName` 28개**: `home` · `list` · `chart-pie` · `calendar` 추가
- **눌림 표시**: Button · Chip이 누르는 동안 `active:opacity-80`이다(웹 · RN 같은 클래스). 색이 아니라 투명도라 소비자가 `bg-*`로 바꾼 배경을 따라간다(알려진 동작 21)
- **RN 보정(계약 무변경)**: Button sm · md와 Chip의 누름 영역 48dp(세로 `hitSlop` + 최소 폭 `min-w-12`), Input · Textarea 포커스 테두리(계획 D-9 구현), placeholder 색 `fg-muted`(0.2.0까지 플랫폼 기본색, 흰 표면 위 약 2.7:1), native 래퍼의 `tabular-nums` RN 선언, native Icon의 아이콘별 lucide import(목록 import는 Metro가 아이콘 전체를 번들에 넣는다)
- **글자 대비**: base 다크 `fg.on-brand` · `fg.on-danger`, bakery 다크 `fg.on-danger`를 gray-950으로(흰 글자 3.7 · 3.8:1 → 5.4 · 5.3:1). bakery 라이트는 `fg.on-brand`를 gray-950(3.2 → 6.3:1), `bg.brand-hover`를 amber-500으로 바꿨다. 변수 이름은 그대로라 C-5b 계약 변경이 아니다. tokens 테스트가 브랜드 × 스킴마다 글자 쌍 4.5:1 · 포커스 표시 3:1을 확인한다
- C-5b(재선언할 때 짝 대비), C-6(native 래퍼 산출물), C-7c, C-11, C-12, C-13, C-17 보강, AC-7 · AC-20 목록, AC-13 문구, Ontology `Icon`, 알려진 동작 17~23 추가. 번호 유지, 삭제·재번호 없음

R25 보류: 사용률 막대(Progress)와 텍스트 줄 수(`numberOfLines`)는 number prop을 받아야 해 C-14 · AC-15와 부딪힌다. 데이터 값 prop을 열지는 사용자 판단으로 남긴다([decisions-r25.md](decisions-r25.md) "열지 않은 것").

### R26 개정 요약 (2026-09-25)

spendback을 에뮬레이터로 본 사용자가 인상이 애매하다고 했고, 앱 실험 브랜치에서 토스 앱의 인상을 참고해 바꾼 결과를 채택했다. 그 실험을 base로 옮긴다. 토스는 인상의 참고일 뿐 API · 컴포넌트 · 이름을 가져오지 않는다(Non-Goals). 대안 비교는 [decisions-r26.md](decisions-r26.md)이고 이 절은 결과만 싣는다. 닫힌 결정(R21~R25)과 C-5c는 열지 않았다. 스케일 **구조**(간격 열거, `size` 5단)는 그대로이고 **값**만 바뀐다.

- **토스풍은 base 자체에 넣는다(사용자 결정).** 앱은 메인 색(brand 짝)만 C-5b로 지정한다. 새 계약 채널은 없다
- **색**: 라이트 canvas gray-100 · surface 흰색 · surface-muted gray-200(입력 칸 · 칩 채움) · brand `blue-550`(흰 글자 4.64:1) · muted `gray-550`. 다크 중립색은 zinc 램프, brand는 라이트와 같은 진한 파랑 + 흰 글자(사용자 결정). primitive에 `blue-550` · `blue-650` · `gray-550`(DS 반 단계)과 zinc 램프(Tailwind 복사)를 더했다
- **`fg.brand` 신설 · `fg.danger` 별칭 해제**: 진한 채움 위 흰 글자 4.5:1과 어두운 · 회색 표면 위 글자 4.5:1을 한 값으로 맞출 수 없다. 글자는 `text-fg-brand` · `tone="danger"`가 채움과 다른 값을 쓴다. `@theme inline` 색 17개. C-8 문구 보강(같은 개념, 두 값)
- **글자 스텝 값**: lg 18/26/600 · xl 22/30/700 · 2xl 28/36/700(sm · md 그대로). 컨트롤 높이 lg 54 → 52
- **모서리**: sm 8 · md 12 · lg 16, `xl` 20 추가(twMerge radius 키 포함). Card · Dialog가 xl
- **모양**: Card는 테두리 · 그림자 없이 `bg-surface rounded-xl p-6`. Input · Textarea · 고르지 않은 Chip은 테두리를 투명으로 두고 `surface-muted` 채움(높이 유지)
- **RN 글꼴**: native 텍스트 컴포넌트가 `font-sans`를 갖고, native 래퍼가 `--font-sans`를 RN 패밀리 이름 하나(`Pretendard`)로 다시 낸다. 소비 앱이 그 이름으로 글꼴을 등록해야 한다(C-7b)
- **twMerge 정적 색**: 색 키 끝에 Tailwind 정적 색 `inherit` · `current` · `transparent`를 둔다. 입력 칸이 `border-transparent`가 되자 `invalid`의 `border-danger`가 병합되지 않고 사라지는 결함이 드러났다(구현 노트 F-28)
- C-5b(짝 대비에 `fg.brand` · `fg.danger`), C-6(native 래퍼 산출물, twMerge 정적 색), C-7b(RN 글꼴 적용), C-8(danger 두 값) 보강, 알려진 동작 24~27 추가. 번호 유지, 삭제 · 재번호 없음. 계약 타입 · 컴포넌트 API 변경 없음

R26 보류: 없음.

## Topology

최상위 컴포넌트 6개 중 4개 활성. docs·agent-native는 v2 보류. platform-adapter는 R6에서 보류됐다가 R11에서 축소 범위로 복귀.

| Component | Status | Description | Coverage / Deferral Note |
|-----------|--------|-------------|--------------------------|
| **tokens** | active | primitive → semantic → component 3계층 토큰. 플랫폼 무관 소스에서 웹·RN 양쪽 빌드 | AC-1 ~ AC-6 |
| **components** | active | Base UI 위에 자체 API로 재설계한 웹 컴포넌트 14개(R21: Text 추가). R25에서 Chip · Icon을 더해 16개 | AC-7 ~ AC-15 |
| **distribution** | active | npm 3패키지 배포. 새 프로젝트가 설치 즉시 화면 작성 시작 | AC-16 ~ AC-19, AC-24, AC-26 |
| **platform-adapter** | active (축소) | RN 토큰 빌드 + NativeWind v5 + 핵심 컴포넌트 5개(R21: Text 추가). v1 이후 Textarea · Label · Badge · Box(구현 노트 N-16), Chip · Icon(R25)을 더해 11개 | AC-20 ~ AC-23, AC-25. RN 오버레이 컴포넌트는 v2 |
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
   ├─ tokens/    @eeennsu/tokens
   │             ① JSON/DTCG 토큰 소스 (플랫폼 무관, 3계층)
   │             ② 컴포넌트 계약 타입 — `Contracts` 타입 맵 + `webComponents` / `nativeComponents` 키 목록
   │             ③ 빌드 산출물
   │               ├─ themes/<brand>.css   내부 산출물. `:root` 변수 + 다크 2셀렉터 + `@theme inline` + 리셋.
   │               │                       소비자가 직접 import하지 않는다
   │               ├─ JS 객체              RN 런타임 값 (Reanimated 등 className 밖에서 쓸 때)
   │               └─ twMergeConfig        DS 키 목록. 웹·RN 양쪽 `cn()` 설정
   ├─ web/       @eeennsu/web     Base UI + Tailwind v4. 소비 프로젝트에 Tailwind v4 필수
   │             themes/<brand>.css   공개 경로. 토큰 파일 import + `@custom-variant dark` + `@source "../dist"`
   └─ native/    @eeennsu/native  React Native + NativeWind v5. 소비 프로젝트에 NativeWind v5 필수
                 themes/<brand>.css   공개 경로. 토큰 파일 import + `@source "../dist"` (C-19 게이트 (3) 조건부)
```

`@eeennsu/tokens`는 이름보다 넓은 책임을 갖는다 — 토큰 **및** 계약 타입. 별도 `@eeennsu/core`를 만들지 않은 이유는 양쪽이 이미 tokens에 의존하므로 패키지를 늘릴 이유가 없기 때문. 웹·RN 중 한쪽이 계약을 어기면 export 맵 타입 동등성 테스트가 깨진다(C-17).

Tailwind v4가 CSS-first 설정(`@theme`)이고 NativeWind v5가 같은 방식을 따르므로, 토큰 빌드 산출물 하나가 두 플랫폼의 클래스 어휘를 동시에 정의한다. `bg-brand` 같은 클래스가 웹과 RN에서 같은 semantic 토큰을 가리킨다. 소비자는 토큰 파일이 아니라 플랫폼 래퍼(`web/themes/`, `native/themes/`)를 import한다 — `@source`가 선언한 CSS 파일 기준 상대경로라 web 패키지 안에서만 web dist를 가리킬 수 있기 때문(C-3).

빌드 도구는 pnpm workspace만 사용한다. turborepo(빌드 캐시)·changesets(버전 자동화)는 실제로 아플 때 추가한다.

## Constraints

### 배포·소비
- C-1. 배포 형태는 **npm 패키지 3개**(`@eeennsu/tokens`, `@eeennsu/web`, `@eeennsu/native`). shadcn식 코드 복사(CLI/레지스트리) 아님. 스코프 이름은 `@eeennsu`로 확정(2026-09-05)
- C-2. 소비 프로젝트는 컴포넌트 소스를 수정하지 않는다. 수정은 DS 레포에서만
- C-3. **(R20 재작성, R21 종결)** 소비 프로젝트는 **Tailwind v4**(웹) / **NativeWind v5**(RN)를 갖춘다. DS는 토큰을 Tailwind `@theme` CSS로 배포하고, 소비 프로젝트는 이를 전역 CSS에서 import한다. 소비 프로젝트 측 설정은 이 import 한 줄까지로 제한한다 — `tailwind.config`나 PostCSS 설정 편집을 요구하지 않는다
  - import 대상은 플랫폼 래퍼다 — 웹 `@eeennsu/web/themes/<brand>.css`, RN `@eeennsu/native/themes/<brand>.css`. 래퍼가 `@eeennsu/tokens/themes/<brand>.css`를 import한다. 토큰 파일 직접 import 경로는 공개하지 않는다(R21 B-7)
  - 컴포넌트 스타일 배포 형태(R20 미결 2, 종결): web 래퍼가 `@source "../dist"`로 web 패키지 자신의 컴포넌트를 스캔한다. 컴파일된 컴포넌트 CSS는 동봉하지 않는다. 근거 — `@source`는 선언한 CSS 파일 기준 상대경로이고 pnpm은 realpath로 해석하므로, 토큰 패키지 안의 파일에서는 web dist를 찾을 수 없다
  - native 래퍼도 같은 이유로 `@source "../dist"`를 갖는다(R21 후속). Tailwind v4는 `node_modules`를 자동 스캔하지 않으므로 없으면 `@eeennsu/native` 컴포넌트의 클래스가 생성되지 않는다. NativeWind v5의 `@source` 지원은 C-19 게이트 (3)
  - 래퍼는 `@import "tailwindcss"`를 먼저 포함해 리셋 순서 실수를 원천 차단한다. 착수 전 기술 확인 2건(조건부): 이 import가 pnpm에서 peer로 해석되는지, 소비자 전역 CSS에 이미 있는 `@import "tailwindcss"`와 중복될 때 preflight·유틸리티가 중복 출력되지 않는지. 중복이 문제면 래퍼에서 `@import "tailwindcss"`를 빼고 "소비자 CSS에서 tailwindcss 다음 줄에 import"를 규칙으로 문서화한다
  - 이전(R12): "컴파일된 CSS 배포, 소비 프로젝트 Tailwind 불필요". `className` 허용으로 성립 불가해져 폐기
- C-4. **RSC 대응**: 인터랙티브 컴포넌트는 `"use client"` 지시어를 붙여 배포한다. Next.js App Router에서 동작해야 하며, Vite 환경에서는 무해. Form도 대상이다 — `<form>`의 `onSubmit` 핸들러(`preventDefault`)를 갖는 인터랙티브 컴포넌트(R21, C-21)
  - **(R21 후속) 산출물 제약 2건**: (1) 번들러가 파일별 `"use client"` 지시어를 dist에 보존해야 한다 — 번들러 다수가 기본 설정에서 지시어를 삭제하므로 빌드 설정과 dist 검사 테스트가 필요. (2) 컴포넌트의 클래스는 **정적 문자열 리터럴**로만 쓴다. `` `bg-${variant}` `` 같은 동적 조합은 `@source "../dist"` 스캔이 찾지 못해 CSS가 생성되지 않는다. variant별 클래스는 객체 맵으로 둔다
- C-4a. 레포는 **pnpm workspace** 단일 레포(`packages/{tokens,web,native}`, 패키지명 `@eeennsu/{tokens,web,native}`). 배포는 **공개 npm** — 비공개 레지스트리는 소비 프로젝트에 `.npmrc` 토큰 설정을 요구해 AC-16을 깨뜨리므로 채택하지 않는다. 스코프 이름은 `@eeennsu`로 확정됐다(2026-09-05)
  - **(R21 후속) 최소 버전**: peer `react >= 19` — 계약의 `ref`가 일반 prop이라 `forwardRef` 없이 성립하는 조건. `tailwindcss >= 4`. `react-native` · `nativewind` 버전은 C-19 고정 정책. 검증 프로젝트는 전부 새로 만든 빈 프로젝트이며 형제 프로젝트를 검증 대상으로 쓰지 않는다

### 토큰
- C-5. 3계층 고정: primitive(`blue-500`) → semantic(`bg.brand`) → component(`button.bg.primary`)
- C-5a. **브랜드 축**: `Theme = brand × (light | dark)`. semantic 계층이 브랜드 주입점이며 브랜드별로 교체 가능하다. primitive·component 계층과 간격·타이포 스케일은 전 브랜드 공유. 근거 — 소비 프로젝트들의 도메인이 전부 다름(빵집 / 운세 / 사진 / 블로그 / 이력서)
  - **(R21)** 브랜드는 앱당 1개이며 빌드타임에 import 파일(`themes/<brand>.css`)로 선택한다. 런타임 브랜드 전환은 요구사항에 없고 범위 밖. v1 브랜드는 `base`(중립 기본. AC-16 / AC-17 / AC-19 / AC-23 검증 프로젝트가 import) + `bakery`(AC-6a 비교 대상. `base`와 semantic 색 토큰 값이 실제로 달라야 diff 검증이 의미를 가짐). 공개 계약은 브랜드명이 아니라 경로 규칙이다 — 브랜드 추가는 파일 추가라 소비자 무영향, 브랜드 이름 변경은 소비자 import 한 줄 수정
  - **(R22) 주입 위치 2곳.** DS 레포 브랜드 파일은 "이름 있는 프리셋"이고, 소비 프로젝트 로컬 오버라이드(C-5b)는 "앱 전용 브랜드"다. 둘 다 semantic 계층에만 주입하며 불변 계층(primitive·component·간격·타이포)은 같다. 앱 하나의 색을 바꾸기 위해 DS 레포에 브랜드 파일을 추가·배포할 필요가 없어진다. `bakery`는 AC-6a 검증용으로 유지
- C-5b. **(R22 신설) 소비 프로젝트 로컬 semantic 오버라이드.** 소비 프로젝트가 전역 CSS에서 DS 래퍼 import **다음 줄**, **레이어 밖**에 `:root` semantic 변수를 재선언하면 캐스케이드(같은 셀렉터·같은 특이성이면 뒤가 이김. DS 토큰 파일이 레이어를 쓰면 무레이어 선언이 무조건 이김)로 덮인다. `@theme inline`이 그 변수를 `var()`로 참조하므로 클래스(`bg-brand`)와 컴포넌트(`variant="primary"`)가 함께 따라간다 — AC-5가 보장하는 구조 그대로이며 DS 코드 변경은 0이다. 구조상 이미 되는 것을 **공개 계약으로 승격**한다는 것이 이 항목의 실체다
  ```css
  @import "@eeennsu/web/themes/base.css";

  :root { --bg-brand: oklch(…); }
  .dark { --bg-brand: oklch(…); }
  @media (prefers-color-scheme: dark) { :root:not(.light) { --bg-brand: oklch(…); } }
  ```
  - **대상**: `:root`의 semantic 색 변수만(`@theme inline`이 `var()`로 참조하는 그 변수. 위 `--bg-brand`는 예시 이름이며 실제 이름은 계획 태스크 "토큰 인벤토리"가 정한다). 간격·타이포·radius·shadow는 대상이 아니다 — C-5a 불변 계층. `@theme` 네임스페이스 변수(`--color-brand` 등)는 `inline`이라 CSS 변수로 남지 않으므로 오버라이드 대상이 아니다. primitive 변수 재선언은 기술적으로 동작하나 계약 밖(알려진 동작 13)
  - **다크**: 3블록 전부 재선언한다 — `:root`, `.dark`, `@media (prefers-color-scheme: dark) { :root:not(.light) }`. 하나만 쓰면 hybrid 4조합 중 일부만 바뀐다(알려진 동작 12)
  - **공개 계약은 semantic 변수 이름**이다. 지원 목록은 토큰 빌드가 내는 semantic 색 키(C-6 `twMergeConfig` 색 키와 1:1. **(R26)** 색 키 끝의 Tailwind 정적 색 `inherit` · `current` · `transparent` 3개는 변수가 아니라 병합용이다)이며 별도 문서를 두지 않는다. 이름 변경·삭제는 소비자 CSS를 무효화하므로 파괴적 변경(major)이다. 추가는 추가적
  - **RN**: 같은 채널이며 게이트 (6)이 last-wins를 확인했다. **(R24) 다만 블록이 웹과 다르다 — `:root` + `@media (prefers-color-scheme: dark) { :root { … } }` 2블록**이다. `.dark`와 `:root:not(.light)`은 RN에서 죽으므로 쓰지 않는다(C-20 RN 항목, 알려진 동작 15). 값은 빌드 시점 캐스케이드로 굳으며 런타임 CSS 변수로 남지 않는다. NativeWind의 런타임 오버라이드(`VariableContextProvider`, `vars()`)는 DS 채널이 아니다 — 런타임 브랜드 전환은 범위 밖(C-5a). 소비자가 직접 써도 막지 않지만 지원하지 않는다. import 뒤 `:root` 재선언이 last-wins인지는 C-19 게이트 (6)
  - **(R25) 짝 대비**: `--bg-brand`를 덮으면 그 위 글자인 `--fg-on-brand`도 함께 본다(`--bg-danger` · `--fg-on-danger`도 같다). DS는 자기 브랜드의 짝만 4.5:1을 보장한다(tokens 대비 테스트). R25에서 base 다크의 on-brand · on-danger가 흰색에서 gray-950으로 바뀌었으므로, 흰 글자를 전제로 다크 brand를 어둡게 재선언한 소비자는 on-brand도 재선언한다
  - **(R26) 글자용 색이 따로 있다.** `--fg-brand`(신설)와 `--fg-danger`(별칭 해제)는 채움 색과 다른 값이다. 앱의 메인 색은 `--bg-brand` · `--bg-brand-hover` · `--fg-on-brand` · `--fg-brand` 네 개를 짝으로 재선언한다. `--bg-danger`만 덮으면 글자 빨강(`tone="danger"`)은 따라가지 않는다. R26에서 base 다크의 on-brand · on-danger가 다시 흰색이 됐다(진한 채움)
  - **JS 토큰 객체에는 닿지 않는다**(알려진 동작 11). v1 DS 코드가 JS 객체를 읽는 곳은 RN Text 폰트 폴백(C-19 (5), 타이포라 오버라이드 대상 아님)뿐이므로 DS 컴포넌트에는 영향 없음
  - **어휘 봉쇄 유지**: 이 채널은 값만 바꾸고 클래스를 만들지 않는다. C-15 "className이 유일한 커스텀 채널"은 컴포넌트 단위 커스텀에 대한 말이고, C-5b는 앱 단위 브랜드 주입이라 층위가 다르다. 소비자 `@theme` 확장으로 새 클래스를 만드는 것은 Non-Goal
  - **되돌리기**: 채널 자체는 CSS 캐스케이드라 닫을 수 없고, 계약에서 빼는 것만 가능하다. 그래서 여는 비용은 "이름 안정성 의무" 하나다. 탈락한 대안(B 소비자 `@theme` 확장, C 간격·타이포 브랜드 분리)은 [decisions-r22.md](decisions-r22.md)
  - **(R23) 확대 트리거 — C-5c.** 계약 대상을 색 + `--radius-*` + 폰트 패밀리로 넓히는 안을 **연기**한다. 지금 열지 않는 이유는 비대칭이다 — 대상 추가는 추가적(minor. 변수는 이미 존재하고 계약에 넣기 전까지 아무도 이름 안정성에 기대지 않으므로 깨질 소비자가 없다)이고, 넣었다 빼는 것은 파괴적이다. 기다리는 비용은 0, 지금 여는 비용은 이름 안정성 의무 1종 → 3종 + AC-6a 문구 수정 + AC-26 확장이다. 앱을 0개 만든 상태의 추측으로 계약 표면을 늘리지 않는다
    - **트리거**: DS v1 완료 후 도메인이 다른 소비 프로젝트를 2개 구축한 시점에, 두 앱이 **색 이외의 인상에서 구분되지 않는다**고 사용자가 판단하면 연다. 판단 주체는 사용자 1인이며 자동 기준·검증 AC를 두지 않는다("얼마나 다른가"의 수치화는 유지보수 표면만 늘린다)
    - **트리거가 충족돼도 열지 않는 것**: 간격·타이포 스케일 **구조**의 브랜드별 분리(R22 후보 C). 그건 `size` 5단 계약·C-7a 열거 재설계라 별개 사안이며 Non-Goal 유지. C-5c는 스케일 열거를 그대로 두고 값만 앱별로 다르게 한다
    - **선행 확인**: `--radius-*`·폰트 패밀리 변수가 소비자 `:root` 재선언으로 덮이는지는 토큰 빌드가 `@theme inline`을 쓰는 범위에 달렸고 아직 안 정해졌다. 계획 태스크 "토큰 인벤토리"의 확인 항목이며, 같은 태스크에서 두 변수군 이름을 나중에 공개 계약이 돼도 되는 이름으로 짓는다. RN은 게이트 (6)이 같은 질문을 담고 있다. 근거는 [decisions-r23.md](decisions-r23.md)
- C-6. **(R21 확장)** 토큰 소스는 플랫폼 무관 포맷(JSON / DTCG) **1본**. 빌드 산출물:
  - `@eeennsu/tokens/themes/<brand>.css` — `:root` 변수(primitive 포함) + semantic 다크 오버라이드 2셀렉터(`.dark`, `@media (prefers-color-scheme: dark) { :root:not(.light) }`) + `@theme inline` 매핑 + 네임스페이스 리셋 + `--spacing-0: 0`. 내부 산출물이며 소비자가 직접 import하지 않는다
  - **리셋 범위(R21 후속 확정)**: 리셋 = `--color-*`, `--spacing-*`(단독 `--spacing` 포함 여부는 probe로 확인), `--radius-*`, `--shadow-*`, `--text-*`, `--font-weight-*`. 무게는 타이포 스텝만이 정하므로 `font-bold`는 무효(알려진 동작 1). `--font-*`(패밀리)는 리셋이 아니라 DS `fontFamily` 토큰으로 덮어쓴다. **유지** = `--breakpoint-*`(`sm:` 등 반응형), `--container-*`(`max-w-*`), 그 외 Tailwind 정적 유틸리티(`flex`, `w-full`, `px`)
  - 플랫폼 래퍼 `@eeennsu/web/themes/<brand>.css`, `@eeennsu/native/themes/<brand>.css` — 빌드가 생성한다(브랜드당 2개). 소비자 공개 경로(C-3)
  - **(R24) native 래퍼만 다크 블록을 하나 더 낸다** — 토큰 파일 import 뒤에 `@media (prefers-color-scheme: dark) { :root { … } }`. semantic 다크 값을 `:not(.light)` 없이 다시 낸 것이며 값은 같은 DTCG 소스에서 나온다(AC-5 동시 전파 유지). 게이트 (4)의 귀결이고, 토큰 파일과 web 래퍼는 무변경이다. native 래퍼는 이 밖에 타이포 줄 높이를 배수로 다시 내고(R24, 계획 D-31), **(R25)** `.tabular-nums`에 RN 선언(`-rn-font-variant`)을 더한다(알려진 동작 17). **(R26)** `--font-sans`를 토큰 소스의 RN 패밀리 이름 하나(`Pretendard`)로 다시 낸다 — react-native-css가 목록의 첫 이름만 쓰기 때문이다(C-7b)
  - RN 런타임용 JS 객체
  - `twMergeConfig` — 색 키(**(R26)** semantic 키 + Tailwind 정적 색 `inherit` · `current` · `transparent`. 정적 색이 없으면 `border-transparent`가 `border-danger`와 병합되지 않는다), spacing 키(열거 10개 + `0`), radius 키, text 크기 키, shadow 키. 웹·RN 양쪽이 `extendTailwindMerge(twMergeConfig)`로 병합한다(C-15). text 크기 키와 색 키 이름은 겹치면 안 된다
  - `Contracts` 타입 맵(`Size` / `TypographyStep` / `ControlSize` / `Tone` / `Variant` 포함)과 `webComponents` / `nativeComponents` 키 목록(C-17)
  - 타이포 스텝은 Tailwind v4 복합 폰트 크기 변수로 낸다 — `--text-<step>`, `--text-<step>--line-height`, `--text-<step>--font-weight`. `text-xl` 유틸리티 하나가 세 속성을 함께 적용한다. Tailwind 기본 `text-base`는 DS에서 `text-md`다
- C-7. 컴포넌트 구현은 **semantic 이상 계층만 참조**. primitive 직접 참조 금지 — 테마 교체가 깨지지 않도록. **(R21) 구조 강제**: primitive는 `:root` 변수로만 존재하고 `@theme`에 넣지 않는다. `bg-blue-500` 같은 클래스가 애초에 생성되지 않으므로 lint 없이 구조로 강제된다(AC-6)
- C-7a. **(R21 재작성) 스케일 어휘**: 간격은 4px 배수 숫자 키의 **희소 열거** `1,2,3,4,6,8,12,16,20,24`(= `4,8,12,16,24,32,48,64,80,96px`) + 영점 `0`. 간격 키는 `className` 어휘 전용이며 간격 값을 받는 prop은 없다(C-14). 열거 외 키는 클래스가 생성되지 않는 무효다(알려진 동작 1). 좁게 시작하고 밀집 단계는 나중에 추가한다. 컴포넌트 `size`는 t-shirt — 전역 `sm | md | lg | xl | 2xl`, 컨트롤(Button · Input · Textarea · Badge · ButtonGroup 등)은 `sm | md | lg` 부분집합, Text는 5단 전부를 타이포 스텝으로 쓴다(C-7b). 두 어휘를 의도적으로 분리한다 — 간격을 t-shirt로 두면 단계가 모자랄 때 `md-plus` 같은 이름이 생겨 무너지고, `size`를 숫자로 두면 무엇이 큰지 직관적이지 않다
  - 이전: "숫자 스케일(`1,2,3,4,6,8,12`…)". 열린 스케일을 희소 열거로 닫음(R21 B-2)
- C-7b. **폰트는 이름·스케일만 소유.** `fontFamily` 토큰과 크기·행간·무게 스케일은 DS가 갖되 실제 폰트 로딩은 소비 프로젝트 책임(웹 `next/font`, RN `expo-font`). 폰트 파일을 패키지에 동봉하지 않는다 — 무게와 라이선스가 따라온다. **(R21)** 크기·행간·무게 스케일은 Text의 타이포 스텝 하나로 묶여 소비된다 — component 계층 토큰 `text.<step> = { fontSize, lineHeight, fontWeight }`, `step = sm | md | lg | xl | 2xl`. 독립 `weight` prop은 없다. 소비자 `className="text-lg"`도 같은 스텝 의미를 갖는다
  - **(R26) RN 컴포넌트가 글꼴을 쓴다.** 웹은 preflight가 `html`에 `--font-sans`를 걸어 상속되지만 RN에는 상속이 없다. native 텍스트 컴포넌트(Text · Button 라벨 · Chip 라벨 · Badge · Label · Input · Textarea)가 `font-sans`를 갖는다. 소비 앱은 native 래퍼가 내는 패밀리 이름(`Pretendard`)으로 글꼴을 등록한다 — 무게는 글자 스텝이 쓰는 400 · 600 · 700. 등록 절차는 구현 노트에 있다. 등록하지 않으면 플랫폼 기본 글꼴로 떨어진다(알려진 동작 26)
- C-7c. **아이콘은 이름 문자열로만 받는다.** `<Button icon="trash">`. DS가 내부에서 `lucide-react`(웹) / `lucide-react-native`(RN)로 분기하고, 색·크기는 토큰으로 결정한다. 아이콘 노드를 받으면 웹·RN 패키지 분기가 소비자에게 새어 나가고 계약 타입이 플랫폼별로 갈린다. R20에서 `className`을 열었지만 이 규칙은 유지 — 근거가 드리프트가 아니라 플랫폼 분기 은닉이기 때문. **(R25)** 버튼 밖의 아이콘은 공개 `Icon`(`name` 문자열)으로 쓴다. 색은 `tone`(Text와 같은 축)이고 상속하지 않는다 — RN에 글자색 상속이 없어 두 플랫폼이 같은 결과를 내려면 아이콘이 색을 가져야 한다

### 컴포넌트 API 계약 (8개 강제 규칙)
- C-8. **(R21 확장) variant / size / tone 어휘 전역 통일.** 전역 축은 3개 — `variant = primary | secondary | ghost | danger`(4개 고정), `size = sm | md | lg | xl | 2xl`, `tone = default | muted | danger`(3개 확정, R21 후속. Text의 강조 위계 축이자 전역 어휘. semantic 전경색 토큰 `fg.default` / `fg.muted` / `fg.danger`와 1:1라 매핑표가 필요 없다. `subtle` · `success` · `brand`는 넣지 않는다 — 추가는 추가적이고, 지금 넣으면 semantic 토큰이 늘어 `bakery`에서 값을 전부 정해야 한다). 모든 컴포넌트가 동일한 집합에서만 고름. 안 쓰는 값은 빼되 이름은 절대 다르게 짓지 않는다 — 부분집합은 `Extract`로 타입 고정한다(`ControlSize = Extract<Size, 'sm' | 'md' | 'lg'>`, `TypographyStep = Size`). 반대로 **다른 개념에 같은 이름을 강요하지 않는다**. `variant`와 `tone`의 `danger`는 같은 semantic 색(`color.danger`)을 가리키는 같은 개념이라 의도적으로 이름을 공유한다. **(R26)** 같은 개념이되 값은 둘이다 — 채움(`bg.danger`, 흰 글자를 얹는다)과 글자(`fg.danger`, 표면 위에 쓴다). 진한 채움 위 흰 글자와 표면 위 글자를 한 값으로 동시에 4.5:1로 맞출 수 없어 별칭을 풀었다(decisions-r26 5). 비활성 텍스트는 `tone`이 아니라 상태(`disabled`)다. 단 간격(spacing)은 C-7a에 따라 별도 숫자 어휘를 쓴다 — 통일 대상이 아니다
- C-9. **semantic 토큰만 참조** (C-7과 동일 규칙의 컴포넌트 측 표현)
- C-10. **다형성 prop 금지.** `as` / `render` / `asChild`를 core 계약에 노출하지 않는다. RN에 대응물이 없다. Base UI의 `render`는 `@eeennsu/web` 내부 구현 디테일로만 사용
- C-11. **불리언 prop 대신 열거형.** `isPrimary`, `isDanger` 금지 → `variant`. 불리언은 조합 폭발을 만들고 두 플랫폼에서 우선순위가 갈린다. **(R21)** 예외는 `disabled` / `loading` 같은 기능 불리언뿐(`invalid` 계획 D-16, Chip `selected` R25가 같은 부류다). 웹·RN 교차 어휘는 열거형으로 은닉하며, 열거형이라 예외가 아니다 — Input `kind = text | password | email | number`. 계약은 이 열거형 4값뿐이고 아래 매핑은 어댑터 구현 세부다. 스펙에 두는 이유(R21 후속) — AC-16 자동완성 확인 항목과 알려진 동작 8이 이 파생 규칙을 참조하므로 계획 문서로 내리면 AC 근거가 사라진다:
  - `text` → 웹 `type="text"` / RN 기본
  - `password` → 웹 `type="password"` / RN `secureTextEntry`
  - `email` → 웹 `type="email"` / RN `keyboardType="email-address"` + `autoCapitalize="none"`
  - `number` → 웹 `type="text"` + `inputMode="numeric"`(스피너 없는 쪽) / RN `keyboardType="numeric"`
  - 자동완성 힌트도 `kind`에서 파생한다(어댑터 세부, 계약 변경 없음) — 웹 `password` → `autoComplete="current-password"`, `email` → `autoComplete="email"`. RN `password` → `autoComplete="password"` + `textContentType="password"`, `email` → `autoComplete="email"` + `textContentType="emailAddress"`. `new-password`는 구분하지 않는다(알려진 동작 8)
- C-12. **(R21 확장) 제어 API 네이밍 고정.** 두 갈래 — 값 입력(Input · Textarea)은 `value` / `defaultValue` / `onValueChange`, 오버레이(Dialog · Drawer · Tooltip)는 `open` / `defaultOpen` / `onOpenChange`. 같은 3종 패턴이라 규칙 취지가 같고 Base UI 이름과 일치한다. `open`이 있으면 제어, 없으면 `defaultOpen`으로 시작. 누름 이벤트는 **플랫폼 관용 이름**을 쓴다(R21 후속, B-9 재개정) — 웹 `onClick?: () => void`, RN `onPress?: () => void`. 시그니처는 양쪽 동일하고 이름만 다르며, 매핑은 계약 타입의 플랫폼 매개변수 한 곳에서 정의한다(C-17). 웹에서 `onClick={(e) => …}`는 타입 에러. 원칙: 웹은 Base UI · DOM 관용, RN은 RN 관용을 따르고, 둘이 같으면 이름 하나(`onValueChange`, `onOpenChange`), 다르면 계약이 플랫폼별 이름을 정한다. v1에서 갈리는 건 누름 하나뿐. `onChange`는 RN `TextInput`의 `onChangeText`와 혼동되고 시그니처도 다르므로(이벤트 vs 값) 쓰지 않는다. `onChange` / `onToggle` 같은 이름은 계약 어디에도 없다. Input `value`는 `kind`와 무관하게 항상 `string`(RN `TextInput`이 문자열만 다루므로 `number`도 문자열). Form은 값이 없어 제어 컴포넌트가 아니다. 오버레이는 v1에 별도 `trigger` prop 없이 제어 API만 둔다 — 소비자가 Button 누름 이벤트로 `open`을 토글.
  - **(R25)** Chip `selected`는 제어 전용 상태다 — `defaultSelected`와 변경 콜백이 없고, 소비자가 누름 이벤트에서 바꾼다. 오버레이의 `open`을 Button 누름으로 토글하는 것과 같은 방식이며, 값 3종 · 오버레이 3종에 이은 세 번째 제어 형태가 아니라 누름 이벤트 하나다
  - 이전(R21 4차, B-9): "`onPress`로 고정, `onClick` 미노출". 웹에서 `onPress`가 어색하다는 사용자 판단으로 재개정. 되돌리기 — 나중에 웹에 `onPress`를 추가하는 건 추가적이고, 반대(`onPress` 확정 후 `onClick`으로 변경)는 소비자 파괴라 지금이 바꿀 시점 Tooltip은 앵커가 본질이라 `children`으로 앵커를 받는다(앵커 타입, Base UI `Trigger`의 `render` 내부 사용은 계획 단계)
- C-13. **(R21 재작성) 접근성 이름 보장 계약.** 인터랙티브 컴포넌트는 `label: string`을 필수로 받고, 어댑터가 접근성 이름을 보장한다. 타입 레벨에서 강제. 매핑:
  - Button: `label`이 가시 텍스트 겸 접근성 이름. `children` 없음. WCAG 2.5.3(Label in Name) 위반 경로가 사라진다. **v1에 아이콘 전용 모드는 없다** — `label`은 항상 렌더된다(알려진 동작 9, R21 후속). 숨김 prop 추가는 나중에 추가적
  - Input · Textarea(R21 후속): `label`은 `aria-label` / `accessibilityLabel`로만 간다. 가시 라벨은 `Label` 컴포넌트 조합 — Input · Textarea `id?: string` + Label `htmlFor?: string`으로 연결한다(R21 후속). RN v2는 같은 계약을 `nativeID` / `accessibilityLabelledBy`로 매핑. Input이 가시 라벨을 자동 렌더하는 변경은 나중에 추가적으로 가능
  - ButtonGroup(R21 후속): `label` 필수. 웹 어댑터가 `role="group"` + `aria-label`로 매핑한다. 자식 Button은 각자 `label`을 갖는다. 필수 → 선택은 추가적이고 반대는 파괴적이라 필수로 시작한다. v1은 웹 전용
  - Dialog · Drawer: `aria-labelledby` 또는 `aria-label`
  - Tooltip: `label`이 표시 내용이자 접근성 설명
  - Chip(R25): Button과 같다 — `label`이 가시 텍스트 겸 접근성 이름이다. 고른 상태는 웹 `aria-pressed`, RN `accessibilityState.selected`로 알린다
  - Icon(R25): 비인터랙티브라 `label`이 선택이다. 있으면 이름 있는 그림(웹 `role="img"` + `aria-label`, RN `accessibilityRole="image"`), 없으면 꾸밈이라 보조 기술에서 숨긴다
  - Text · Form · Badge · Card · Label은 비인터랙티브라 대상이 아니다(Badge · Card · Label은 R21 후속. Label은 가시 텍스트가 곧 내용이고 `htmlFor`로 Input에 연결된다)
  - 이전: "웹은 `aria-label`, RN은 `accessibilityLabel`로 변환". Button 가시 텍스트를 `label`로 통합하며 "변환"에서 "보장"으로(R21 A-4)
- C-14. **(R21 재작성) 토큰 값을 받는 prop이 없다.** 계약 전체에 `number` 타입 prop이 없고(`padding={16}` 같은 prop 자체가 존재하지 않는다), 색 의도를 받는 prop(`variant`, `tone`)은 enum 키만 받는다(`tone="#333"`은 타입 에러). 간격은 `className` 전용(C-7a) — Stack / Box에 `gap` · `padding` prop 없음. `className` 안의 임의값(`bg-[#333]`, `mt-[13px]`)은 타입·구조 어느 쪽으로도 막지 못한다 — 이는 C-15의 의도된 탈출구
  - 이전: "`padding={16}`, `color="#333"`을 타입으로 차단하고 토큰 키만 받는다". 숫자 키 prop은 `padding={16}`이 64px가 되는 혼동을 낳고, 문자열 리터럴 키 `gap="4"`는 채널이 2개가 되어 나중에 제거하면 소비자 파괴. prop 자체를 두지 않는 쪽으로 재작성(R21 A-5)
- C-15. **(R20 반전, R21 확정) `className` 허용.** 전 컴포넌트가 `className?: string`을 받는다. 웹은 Tailwind v4, RN은 NativeWind v5로 해석하며 어휘는 `@eeennsu/tokens`가 빌드한 `@theme`에서 나온다. 규칙:
  - `className`이 **유일한** 커스텀 채널. 웹 `style`, RN `style` prop은 열지 않는다 — 두 플랫폼 어휘를 하나로 유지하기 위해. **어휘 봉쇄**로 "유일"이 문자 그대로 성립한다: Tailwind 기본 팔레트(`--color-*: initial`)와 동적 spacing(`--spacing-*: initial`)을 리셋하고 primitive는 `@theme`에 넣지 않으므로(C-7), `className`에 쓸 수 있는 클래스는 DS 토큰 어휘뿐이다(임의값 제외, C-14)
  - 소비자 `className`은 DS 기본 스타일과 **병합**되며 충돌 시 소비자가 이긴다. 병합은 웹·RN 양쪽 `tailwind-merge`이며 설정은 토큰 빌드가 DS 키 목록으로 생성한다(C-6 `twMergeConfig`). 양쪽이 `extendTailwindMerge(twMergeConfig)`로 `cn(base, className)` 한다. spacing 검증자를 DS 키 목록으로 두는 이유 — 기본 `isNumber`면 `cn('mt-4', 'mt-5')`에서 존재하지 않는 `mt-5`가 `mt-4`를 밀어내 DS 기본 여백까지 사라진다. 키 목록이면 `mt-5`는 spacing 그룹으로 인식되지 않아 둘 다 남고 `mt-4`가 적용된다. `text-*`의 크기/색 모호성은 크기 키 목록으로 해소된다
  - 승리 범위는 **같은 유틸리티 그룹·같은 변형**에 한정한다. `hover:bg-*`는 `bg-danger`로 덮이지 않는다. RN에는 hover가 없으므로 "웹·RN 동일 동작"은 정지 상태에 한정한다
  - 탈락: 웹 캐스케이드 레이어(RN은 어차피 twMerge라 메커니즘이 2개), `!important` 자동 부여(중첩 합성 파괴)
  - 간격 값을 받는 prop이 없으므로(C-14) "prop은 유한, className은 무한" 불일치 자체가 없다. 간격 어휘는 `@theme` 한 곳
  - 레이아웃 컴포넌트(Stack/Box)는 유지. 배치의 1순위 수단이나 강제는 아니다. API는 `direction` / `align` / `justify` / `wrap`뿐
  - 이전(R10): "완전 차단, 배치는 Stack/Box로만". 사용자가 "버튼 하나만 배경색·크기·여백 다르게"가 불가능한 것을 확인하고 철회

### 기반
- C-16. 헤드리스 프리미티브는 **Base UI** (Radix 아님). DOM 전용이므로 `@eeennsu/web`에만 적용. shadcn 코드는 참고 자료로만 쓰고 API는 따르지 않는다
- C-17. **(R21 강제 수단 확정)** `@eeennsu/web`과 `@eeennsu/native`는 **동일한 prop 시그니처**를 갖되 구현을 공유하지 않는다. 계약 타입은 `@eeennsu/tokens`에 단일 정의(`Contracts<P>` 타입 맵 + `webComponents` / `nativeComponents` 키 목록)로 두고 양쪽이 그것을 구현한다. 사람 규율에 맡기지 않는다. 강제 수단:
  - 각 패키지가 export 맵 전체를 타입 동등성 테스트 1개로 검사한다 — web은 `expectTypeOf<typeof components>().toEqualTypeOf<{ [K in WebKeys]: FC<Contracts<'web'>[K]> }>()`, native는 `Contracts<'native'>`와 `NativeKeys`. 추가·제거·누락 컴포넌트가 전부 걸린다. CI에 `vitest --typecheck`
  - **플랫폼 매개변수(R21 후속)**: `Contracts<P extends 'web' | 'native'>`. 대부분의 prop은 `P`와 무관하게 동일하고, 플랫폼 관용 이름이 갈리는 prop만 `P`로 분기한다 — v1에서는 Button 누름 이벤트 하나(`P extends 'web' ? { onClick?: () => void } : { onPress?: () => void }`, C-12)이고, R25에서 Chip이 같은 분기(`Press<P>`)를 쓴다. 이름 매핑은 계약 파일 이 한 곳에만 존재하고 어댑터가 자체 별칭을 두지 않는다. "동일한 prop 시그니처"는 "계약이 정의한 매핑 제외 동일"로 읽는다
  - `ref`는 플랫폼별 엘리먼트 대신 `Ref<{ focus(): void; blur(): void }>` 핸들로 계약에 포함한다. 핸들에서 DOM 노출로 넓히는 변경은 소비자 무영향(추가적)이고 반대는 파괴적이다. 대상은 포커스 가능한 Button · Input · Textarea뿐(R21 후속)이고 R25에서 Chip이 더해졌다. Card · Stack · Box · Text · Badge · Label · Icon엔 `ref` 없음
  - **`children` 타입 규칙(R21 후속)**: 텍스트 컴포넌트(Text · Badge · Label)는 `string | string[]`. 컨테이너(Card · Stack · Box)는 **문자열을 제외한 엘리먼트 노드** — `ReactElement | boolean | null | undefined | 그 배열`. RN `View` 안의 원시 문자열 자식은 크래시하므로 타입으로 막는다. 웹 전용(Dialog · Drawer · Tooltip · Form)만 `ReactNode`. ReactNode로 넓히는 변경은 추가적. Chip · Icon(R25)은 `children`이 없다
  - 플랫폼 전용 prop은 0개. 웹·RN 차이는 계약의 열거형 교차 어휘로 흡수한다(Input `kind`, C-11). 플랫폼 매개변수 분기는 같은 prop의 이름 차이일 뿐 전용 prop이 아니다
  - 콜백은 플랫폼 이벤트 인자를 받지 않는다 — `onClick` / `onPress: () => void`, `onOpenChange: (open: boolean) => void`. 웹 `MouseEvent`와 RN `GestureResponderEvent`가 달라 계약에 넣을 수 없다. 나중에 교차 인자를 추가하는 변경은 소비자 콜백이 인자를 무시해도 할당 가능하므로 추가적이다
  - 계약은 tokens에 놓이고 웹 전용 컴포넌트(오버레이 · Form)의 v1 구현자는 web뿐. RN v2가 같은 계약을 구현하면 맵 테스트가 그대로 대칭을 검사한다
  - 탈락: `implement<Contract>()` 래퍼 — 감지가 아니라 은닉이고 우회를 막으려면 custom lint가 추가된다. `satisfies` + 생성 `.d.ts` — 레포 안에서는 안 걸리고 codegen 단계가 늘어난다
- C-18. 기존 5개 Next 프로젝트 마이그레이션은 성공 기준이 아니다. 부수 효과로만 취급
- C-19. **(R20 신설) RN 스타일 엔진은 NativeWind v5.** 2026-09-05 기준 preview이며 latest 승격 진행 중. 승격 전까지는 검증된 preview 버전을 `@eeennsu/native`와 검증 Expo 프로젝트에 동일하게 정확한 버전으로 고정(`^` 없이)하고, 승격 후 한 번만 올린다(R21 후속: `spot`은 개발 중단, 검증 대상은 빈 Expo 프로젝트). StyleSheet 직접 사용은 NativeWind로 표현 불가한 경우(Reanimated 값 등)에 한정하며, 그때도 색·간격은 `@eeennsu/tokens`의 JS 객체에서 읽는다
  - **선택 근거**: 웹 소비처가 전부 Tailwind v4이고, v4·NativeWind v5가 같은 `@theme` CSS를 읽으므로 토큰 빌드 산출물이 1본이 된다. NativeWind v4(Tailwind v3)를 쓰면 지금은 안전하나 승격 시점에 RN 재작성이 확정 비용으로 남는다
  - **손절 기준**: `@eeennsu/native` 구현 착수 후 2주 안에 preview 버그로 AC-20의 5개 컴포넌트 중 하나라도 완성 불가하면 대체안으로 전환한다. 대체안 — 웹은 Tailwind v4 유지, RN만 Tailwind v3 + NativeWind v4. 토큰 빌드를 `@theme` CSS와 `tailwind.config.js` 두 갈래로 내고, 내장 유틸리티 차이(shadow·ring·border 기본값 등)를 문서화한다. 전환 시 C-3·AC-3·AC-25 수정 필요
  - **(R21) 착수 게이트**: `@eeennsu/native` 구현 착수 전에 NativeWind v5에서 다음 5건을 확인한다 — (1) `@theme inline`, (2) `.dark` 루트 셀렉터, (3) `@source`, (4) `:root:not(.light)`, (5) `--text-*--line-height` / `--text-*--font-weight` 복합 폰트 변수. R20 미결 3도 이 게이트에 편입한다 — R21 후속으로 단순화: NativeWind v5 preview가 요구하는 Expo SDK · RN 버전을 확인하고 검증 Expo 프로젝트를 그 버전으로 만든다(`spot` 호환 확인은 소멸). 요구 사양이 현행 Expo SDK와 안 맞으면 손절 기준과 무관하게 대체안 검토. (3) `@source`는 native 래퍼의 `@source "../dist"`(C-3)가 걸려 있어 미지원이면 RN 컴포넌트 클래스 생성 경로를 다시 정해야 한다
  - (5) 복합 폰트 변수 미지원 시 RN Text 어댑터가 `@eeennsu/tokens` JS 객체에서 fontSize · lineHeight · fontWeight 세 값을 읽어 `style`로 넣는다 — 위 "NativeWind로 표현 불가한 경우" 예외에 해당
  - **(R24) 게이트 실행 완료(2026-09-06).** 결과는 [gate-c19.md](gate-c19.md), 개정은 위 "R24 개정 요약". 고정한 버전 — `nativewind` `5.0.0-preview.4`, `react-native-css` `3.0.7`, Expo SDK 57(RN 0.86.3). `--template blank@sdk-54` 재시도는 필요 없었다. 손절 기준(착수 후 2주)의 기산점인 Phase 5 착수일은 게이트 (7) 기기 확인 뒤에 정한다
  - **(R22) (6) 소비자 `:root` 재선언 캐스케이드** — 소비자 `global.css`에서 native 래퍼 import 뒤에 쓴 `:root { --bg-brand: … }`(및 `.dark` / `@media` 블록)가 DS 토큰 파일의 같은 변수를 last-wins로 덮는지. C-5b의 RN 성립 조건. v5 테마 가이드는 `:root`를 런타임 기본값으로 읽는다고만 하고 import 순서 캐스케이드는 명시하지 않는다. 미지원이면 RN 로컬 오버라이드 채널을 `VariableContextProvider` 루트 래핑으로 재설계하고 C-5b RN 항목·AC-26 RN 절을 수정한다(웹 채널은 무영향)
- C-20. **(R21 신설) 다크모드 전략 hybrid.** 루트 엘리먼트에 `.dark` / `.light` 클래스가 있으면 클래스가 OS 설정보다 우선하고, 없으면 OS `prefers-color-scheme`을 따른다
  - 웹 래퍼(`@eeennsu/web/themes/<brand>.css`)가 `@custom-variant dark`를 선언한다:
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
  - **(R24 재작성) RN은 hybrid가 아니라 OS 단독이다.** 게이트 (2)·(4) 실측 — NativeWind v5(react-native-css)는 루트 클래스 셀렉터를 해석하지 않는다. `.dark { … }`는 어떤 노드에도 걸리지 않고, `@media (prefers-color-scheme: dark)`는 동작하지만 `:root:not(.light)`의 `:not(.light)`이 매칭을 깨뜨린다. `:not`을 뺀 `:root`는 동작한다
    - 따라서 RN 다크는 **`@media (prefers-color-scheme: dark) { :root { … } }` 한 셀렉터**로 낸다. 이 블록은 native 래퍼가 낸다(C-6). 토큰 파일의 `.dark` 블록은 RN에서 무해하게 죽는다
    - 클래스로 OS를 덮는 경로는 RN에 없다. 앱이 색 구성표를 바꾸려면 `Appearance.setColorScheme`(RN API)을 쓰며, 그러면 `@media` 블록이 따라간다. NativeWind v5는 자체 `colorScheme.set` API가 없고 `Appearance`를 쓰라고 안내한다
    - 유틸리티 변형 `dark:`는 정상 동작한다(Tailwind 기본 `dark` 변형 = `@media (prefers-color-scheme: dark)`). DS 컴포넌트는 semantic 변수로 색을 내므로 `dark:`를 쓰지 않지만, 소비자 `className`에서는 쓸 수 있다
    - 웹은 무변경 — `@custom-variant dark`와 토큰 파일의 2셀렉터 출력을 그대로 둔다. hybrid는 **웹 전용 규칙**이다
  - class 단독 대비 hybrid는 상위집합이라 되돌리기는 쉽다. 검증은 AC-19
- C-21. **(R21 신설) Form v1 범위.** 레이아웃 + `Label` 연결 + 오류 텍스트 표시(`Text tone="danger"` 또는 Base UI `Field.Error`). 계약은 `children: ReactNode`(웹 전용이라 허용) + `className`. submit 개념 없음. react-hook-form 미도입 — RN Form이 v2라 계약 대칭을 v1에서 검증할 수 없다
  - 웹은 `<form onSubmit={e => e.preventDefault()}>`를 렌더한다. 계약에 `onSubmit` prop은 없다. `div` + `role="form"` 불채택 — 브라우저 비밀번호 자동완성·저장 제안은 `<form>` 안의 `type="password"` 기준으로 동작하고, AC-16 검증 화면이 로그인이라 `div`는 검증 자체를 약화시킨다
  - 웹 Button은 `<button type="button">`을 항상 명시한다. 기본값 `submit`이면 `<form>` 안의 Button이 Enter 키 암묵적 제출 대상이 되어 `onClick`이 실행된다. Button에 `type="submit"` 개념은 없다
  - **v1에서 Enter는 아무 동작도 하지 않는다**(알려진 동작 5). 로그인 폼은 텍스트 필드가 2개이고 submit 버튼이 없어 HTML 암묵적 제출 규칙상 Enter가 제출을 일으키지 않고, 필드가 1개인 폼은 암묵적 제출이 일어나지만 `preventDefault`로 막힌다. 제출은 Button 누름 이벤트(웹 `onClick`)에서 소비자 코드가 처리한다
  - Base UI `Form` / `Field`를 내부 기반으로 쓰되 submit 경로는 열지 않는다. Dialog 안의 Form도 동일
  - `"use client"` 대상이다(C-4)
  - RN Form은 v2. 착수 시 같은 계약으로 대칭을 검증한다(C-17 맵 테스트)

### 알려진 동작(v1)

R21에서 수용한 동작이다. 나중에 버그로 재발견되지 않게 여기 남긴다. 근거는 [decisions-r21.md](decisions-r21.md) D · G. 1~8이 G 원문이며, 1번의 네임스페이스 목록(font-weight 추가)과 5번의 누름 이벤트 이름(B-9 재개정)은 R21 후속에 맞춰 원문에서 고쳤다. 9~10은 R21 후속 추가. 11~13은 R22 추가(C-5b 로컬 오버라이드), 근거는 [decisions-r22.md](decisions-r22.md).

1. 리셋된 네임스페이스(spacing·color·text·radius·shadow·font-weight)에서 열거 외 키(`mt-5`, `mt-17`, `text-base`, `bg-red-500`, `font-bold`)는 클래스가 생성되지 않는다. 에러가 아니라 무효다. DS 기본값은 twMerge가 DS 키 목록으로 동작하므로 미등록 키에 밀려나지 않는다.
2. 96px을 넘는 고정 폭·높이 유틸리티(`w-64` 등)는 없다. `w-full`, `max-w-*`, 임의값 `w-[320px]`을 쓴다.
3. 임의값 `bg-[#333]`, `mt-[13px]`은 타입·구조 어느 쪽으로도 막지 않는다. 의도된 탈출구다(C-14).
4. 소비자 `className`은 같은 유틸리티 그룹·같은 변형만 덮는다. `hover:bg-*` 같은 상태 변형은 `bg-danger`로 덮이지 않는다. RN에는 hover가 없다.
5. Form v1은 submit을 다루지 않는다. `<form>`을 렌더하되 `onSubmit`은 항상 `preventDefault`이고, 웹 Button은 `type="button"`이다. **v1에서 Enter는 아무 동작도 하지 않는다.** 제출은 Button 누름 이벤트(웹 `onClick` / RN `onPress`)에서 소비자가 처리한다.
6. Text는 문자열만 받는다. 문장 중간 서식(부분 굵게, 인라인 링크)은 v1 범위 밖이다. 무게는 `size` 스텝이 정하며 독립 `weight` prop은 없다.
7. Button은 `label` 문자열만 렌더한다. 아이콘은 `icon` prop, 로딩은 `loading` prop으로만 표현한다.
8. Input의 자동완성 힌트는 `kind`에서 파생된다(`password` → `current-password`). 가입 화면의 `new-password`는 v1에서 구분하지 않는다.
9. Button 아이콘 전용 모드는 v1에 없다. `label`은 항상 렌더된다. Dialog 닫기 버튼 같은 내부 아이콘 버튼은 구현 세부이며 공개 계약이 아니다.
10. Textarea에 `rows` · `maxLength` prop이 없다(AC-15). 높이는 `size`(sm / md / lg → 행수 매핑)로 정하고, 더 큰 높이는 `min-h-[…]` 임의값을 쓴다. 글자 수 제한은 소비자 코드가 `onValueChange`에서 처리한다.
11. 소비자 로컬 semantic 오버라이드(C-5b)는 `@eeennsu/tokens`의 RN JS 토큰 객체에 닿지 않는다. JS 객체는 항상 import한 브랜드 파일의 값이다. v1 DS 코드가 JS 객체를 읽는 곳은 RN Text 폰트 폴백(C-19 (5))뿐이고 타이포는 오버라이드 대상이 아니므로 DS 컴포넌트는 영향이 없다. 소비자 자기 코드(Reanimated 등)가 JS 객체에서 색을 읽으면 오버라이드 전 값이 나온다. 런타임 해석값이 필요하면 소비자가 NativeWind `useUnstableNativeVariable`을 직접 쓴다 — DS 공개 계약이 아니며 DS는 래핑 훅을 제공하지 않는다.
12. 로컬 오버라이드에서 다크 3블록(`:root` / `.dark` / `@media … :root:not(.light)`) 중 일부만 재선언하면 hybrid 4조합(AC-19)이 갈린다. 예: `:root`만 재선언하면 `.dark` 클래스가 있을 때는 소비자 라이트 값이 DS 다크 값을 덮고(같은 특이성, 뒤가 이김), 클래스 없이 OS 다크일 때는 DS 다크 값이 남는다(`:root:not(.light)`이 더 특이함). 버그가 아니라 CSS 특이성이며, 3블록 전부 쓰는 것이 계약이다.
13. primitive 변수(`--blue-500` 등)도 `:root`에 있어 재선언하면 기술적으로 덮이지만 계약 밖이다. 이름 안정성을 보장하지 않으며 minor 버전에서 바뀔 수 있다. 오버라이드 대상은 semantic 색 변수뿐이다.
14. **(R23)** 컴포넌트 내부 형태(Button 높이·패딩, Card radius, Input 테두리)와 폰트 패밀리는 앱 단위 통로가 없다. 앱 전체에서 바꾸려면 `className` 임의값(`rounded-[2px]`, 알려진 동작 3)을 호출 지점마다 반복해야 하고, 빠뜨린 곳을 잡는 테스트가 없다. v1에서 앱마다 갈리는 축은 색(C-5b) · 간격 리듬(C-7a 열거 중 무엇을 고르는가) · 화면 구조 셋이다. 이 제약이 실제로 문제가 되는지는 소비 프로젝트 2개를 만들어 본 뒤 판단하며, 그때의 확대안이 C-5b (R23) 트리거다.
15. **(R24)** RN 로컬 오버라이드(C-5b)의 다크 블록은 웹과 형태가 다르다 — 웹은 3블록(`:root` / `.dark` / `@media … :root:not(.light)`), RN은 2블록(`:root` / `@media … :root`). 웹 3블록을 RN에 그대로 붙여넣으면 다크에서 소비자 **라이트** 값이 나온다(다크 블록 둘 다 죽는다). 에러가 아니라 무효이며, 같은 소비자 CSS를 웹·RN에 복사할 때의 유일한 차이점이다. 근거는 [gate-c19.md](gate-c19.md) (2)·(4)·(6).
16. **(R24)** RN의 `text-<step>` line-height는 `px` 값을 그대로 쓰지 않는다. react-native-css가 line-height를 단위 없는 배수로 읽어 `--text-xl--line-height: 28px`이 `fontSize 20 × 28 = 560`이 된다(`rem`도 같은 방식으로 틀린다). fontSize·fontWeight는 정상이다. C-19 (5)의 두 경로 중 **native 산출물이 이 값을 단위 없는 배수로 내는 쪽**으로 확정했다(2026-09-06 사용자 확정, 계획 §2.3 D-31). Text 어댑터는 두지 않으므로 소비자 `className="text-lg"`도 RN에서 세 값이 다 적용된다.
17. **(R25)** RN의 `font-variant-numeric` 유틸리티 중 `tabular-nums`만 동작한다. react-native-css가 이 속성을 옮기지 않아 native 래퍼가 `tabular-nums`에 RN 선언을 더했다. `oldstyle-nums` · `slashed-zero` 등은 RN에서 무효다.
18. **(R25)** RN Button sm · md와 Chip의 누름 영역은 세로 `hitSlop`(sm 9 · md 3 · Chip 5)과 최소 폭 48(`min-w-12`)로 48dp를 채운다. 모양(높이 30 · 42 · 38)은 그대로다. 세로로 쌓을 때 hitSlop끼리 겹치지 않으려면 sm은 18, md는 6, Chip 줄은 10 이상 띄운다. 겹치면 뒤 형제가 누름을 가져간다. hitSlop은 부모 경계를 넘지 못한다. RN Input · Textarea에는 hitSlop이 없다 — 누름 영역이 보이는 높이 그대로라 sm · md는 48dp에 못 미친다. 터치 폼은 `lg`를 권한다(RN `TextInput`의 hitSlop은 기기 동작을 확인하지 못해 넣지 않았다).
19. **(R25)** Chip은 토글 하나다. 묶음 의미(라디오 그룹, "몇 개 중 몇 번째")가 없고, 하나만 고르기 · 여럿 고르기 · 다시 눌러 풀기는 소비자 상태다. 스크린 리더는 칩마다 선택 상태만 읽는다. RN에서 세로 부모 안에 두면 부모 폭으로 늘어난다(Badge와 같다, `self-start`로 줄인다).
20. **(R25)** RN Icon의 그림 크기는 `size` prop만 정한다. `className`의 `size-*` · `w-*` · `h-*`는 svg 크기를 바꾸지 못한다(웹은 CSS가 이긴다). 배치 · 변형 · 투명도 클래스(`ml-*`, `absolute`, `self-*`, `rotate-*`, `opacity-*`)는 svg를 감싼 루트 View에 한 번 걸린다 — svg에 주면 lucide가 style을 도형마다 펼쳐 `rotate-*`는 예외를 던지고 `opacity-*`는 겹쳐 곱해진다. 색 클래스(`text-*`)만 svg 색으로 간다.
21. **(R25)** 눌림 표시는 `active:opacity-80`이다. 웹 hover는 여전히 `hover:bg-*-hover` 색이다. 소비자가 배경을 바꾸면 hover 색은 따라가지 않지만(알려진 동작 4) 눌림 표시는 투명도라 따라간다. 소비자가 `active:`를 주면 같은 그룹만 덮는다.
22. **(R25)** RN Button · Chip의 `className`은 표면(Pressable)에 붙는다. 글자 클래스(`text-*`, `tabular-nums`)는 RN 라벨에 닿지 않는다(N-12의 연장). 웹은 버튼 하나라 라벨까지 적용된다.
23. **(R25)** RN Input · Textarea의 포커스 표시는 1px 테두리 색 변화다(`border-focus`). `invalid`면 포커스 중에도 danger 테두리라 캐럿만 포커스를 알린다(WCAG 2.4.7은 캐럿으로 충족). 테두리를 굵히면 컨트롤 높이(계획 D-6)가 흔들려 그대로 둔다.
24. **(R26)** Card는 테두리 · 그림자 없이 canvas와의 명도 차이(라이트 1.10, 다크 1.12)로만 구분된다. 소비자가 `--bg-canvas`를 surface와 같은 값으로 재선언하면 Card 경계가 사라진다. 그때는 `className="border border-border"`를 준다. bakery는 canvas(amber-50)와 surface가 1.05:1이라 Card가 흐리다.
25. **(R26)** Input · Textarea · 고르지 않은 Chip은 테두리 대신 `surface-muted` 채움으로 보인다(canvas 위 1.12, surface 위 1.24). 채움은 비텍스트 3:1 대상으로 보지 않는다 — 라벨로 식별되고 포커스 때 brand 테두리가 생긴다. 테두리는 투명으로 남아 높이를 맞춘다. 소비자가 `--bg-surface-muted`를 canvas나 surface와 같은 값으로 재선언하면 채움이 보이지 않는다.
26. **(R26)** RN DS 컴포넌트는 `Pretendard` 패밀리를 요청한다. 소비 앱이 등록하지 않으면 Android는 기본 글꼴로 조용히 떨어진다. iOS는 "Unrecognized font family" 메시지를 낸다고 알려져 있으나 기기에서 확인하지 못했다. 등록한 글꼴에 없는 무게는 가까운 무게로 그려진다.
27. **(R26)** `text-brand`는 채움 색(`bg.brand`)이다. 글자로 쓰면 다크 surface 위 3.57:1이라 기준에 못 미친다. 브랜드 색 글자는 `text-fg-brand`를 쓴다. `text-brand`는 0.3.0 소비자 호환을 위해 남아 있다(색 키는 `@theme inline` 하나에서 `bg-` · `text-` · `border-`를 함께 만든다).

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
- **(R22)** 소비자 `@theme` 확장 지원 — 소비 프로젝트가 `@theme { --color-accent: … }`로 새 클래스를 만드는 것. 어휘 봉쇄(C-15)를 소비자 쪽에서 깨는 경로라 지원하지 않는다. 막을 수도 없지만(Tailwind 설정은 소비자 것) 그 클래스는 DS 어휘가 아니며 twMerge 키 목록에도 없다
- **(R22)** 간격·타이포·component 계층의 브랜드별 분리 — "이 앱은 미니멀, 저 앱은 화려하게" 같은 밀도·스케일 차이. C-5a 불변 계층이고 AC-6a(브랜드 교체 시 색만 바뀜)와 `size` 5단 계약이 전제한다. v1 범위 밖. 색 밖의 차이는 `className` 컴포넌트 단위 커스텀으로 흡수한다
- **(R22)** 런타임 브랜드 전환(NativeWind `VariableContextProvider`, 웹 클래스 토글) — C-5a 유지
- **(R23)** 위 (R22) 항목과 **C-5c를 혼동하지 않는다.** Non-Goal인 것은 간격·타이포 스케일 **구조**의 브랜드별 분리(열거 자체가 브랜드마다 달라지는 것)이고, 이는 트리거와 무관하게 v1·v2 모두 열지 않는다. 오버라이드 **대상**을 색 + `--radius-*` + 폰트 패밀리로 넓히는 C-5c는 Non-Goal이 아니라 **연기**이며 조건은 C-5b (R23)에 있다 — 스케일 열거는 그대로 두고 값만 앱별로 다르게 하므로 `size` 5단 계약·C-7a와 충돌하지 않는다
- **(R23)** "소비 프로젝트마다 디자인이 충분히 다른가"의 자동 검증 AC — 두지 않는다. 수치화가 불가능하고 유지보수 표면만 늘린다. C-5b (R23) 트리거의 판단 주체는 사용자 1인이다

## Acceptance Criteria

### tokens
- [ ] AC-1. 토큰 소스가 단일 플랫폼 무관 파일(JSON/DTCG)로 존재한다
- [ ] AC-2. primitive / semantic / component 3계층이 파일 구조와 네이밍으로 구분된다
- [ ] AC-3. **(R21 수정)** 빌드 스크립트가 소스에서 Tailwind v4 `@theme` CSS(`@eeennsu/tokens/themes/<brand>.css`)를 생성하고, web 래퍼(`@eeennsu/web/themes/<brand>.css`)와 native 래퍼(`@eeennsu/native/themes/<brand>.css`)가 같은 토큰 파일을 import한다. 웹 Tailwind와 NativeWind v5는 각자의 래퍼를 통해 같은 어휘를 읽는다
- [ ] AC-4. 빌드 스크립트가 같은 소스에서 RN 런타임용 JS 객체를 생성한다
- [ ] AC-5. **(R21 수정)** semantic 토큰 한 줄을 바꾸면 웹·RN 양쪽에 동시에 전파된다. 검증 = 빌드 스냅샷(CSS 변수 + JS 객체). `className`으로 쓴 커스텀 클래스에도 전파된다 — `@theme inline`이 `var()`를 참조하므로 구조로 보장되며 별도 테스트 대상이 아니다
- [ ] AC-6. **(R21 수정)** 컴포넌트 소스 어디에도 primitive 토큰 직접 참조가 없다. 강제 = primitive가 `@theme`에 없어 `bg-blue-500` 같은 클래스가 생성되지 않는 구조(C-7) + probe 컴파일 테스트(`bg-red-500` 등 primitive 클래스를 DS 테마로 컴파일해 출력이 비어 있음을 확인)
  - 이전: "lint 규칙으로 강제". DS 레포 내부 미등록 클래스 lint는 운영 사항이며 AC가 아니다. 소비 프로젝트용 lint는 선택 사항으로 문서화(C-3 "import 한 줄까지" 유지)
- [ ] AC-6a. **(R21 수정)** 브랜드를 교체하면 semantic 색 토큰만 바뀌고 간격·타이포·component 계층은 그대로다. 검증 = `base` vs `bakery` 빌드 결과 diff에서 semantic 색 변수만 다름을 확인
- [ ] AC-6b. **(R21 수정)** 간격 토큰이 4px 배수 숫자 키의 열거 `1,2,3,4,6,8,12,16,20,24` + 영점 `0`으로 정의된다. 열거 외 키는 클래스가 생성되지 않는다(probe 테스트: `mt-5`, `mt-17`, `w-64`, `font-bold`가 출력 없음. Tailwind v4의 동적 spacing은 단독 `--spacing` 변수가 구동하므로 `--spacing-*: initial`이 그것까지 지우는지 이 probe가 확인한다). 이는 에러가 아닌 무효이며 v1 알려진 동작이다. 컴포넌트 `size`는 전역 `sm|md|lg|xl|2xl`, 컨트롤은 `sm|md|lg` 부분집합으로 정의된다
- [ ] AC-6c. `fontFamily` 토큰이 존재하고, 패키지에 폰트 파일이 동봉되지 않는다

### components (`@eeennsu/web`)
- [ ] AC-7. **(R21 수정)** 다음 12개가 구현된다: `Button` `Input` `Textarea` `Label` `Card` `Badge` `Tooltip` `Dialog` `Drawer` `Form` `ButtonGroup` `Text`. **(R25)** `Chip` `Icon`이 더해졌다(계약은 C-13 · C-17)
  - `Text` 계약: `children: string | string[]`(string 전용, RN 안전. `string[]`은 `<Text>Hi {name}</Text>` 허용용, R21 후속), `tone?: Tone`, `size?: TypographyStep`, `heading?: '1' | '2' | '3'`(R21 후속), `className?`. 비인터랙티브라 `label` 없음. `children: ReactNode`는 계약이 같아도 런타임이 갈려(`<span>`이 RN에서 크래시) 타입으로 못 막으므로 불채택. string에서 node로 넓히는 변경은 추가적
  - `heading`: 웹은 `<h1>` ~ `<h3>`, 없으면 `<span>`. RN은 `accessibilityRole="header"`. 문자열 enum인 이유 — `as`는 C-10 금지이고 숫자 리터럴은 AC-15 mapped type 테스트에 걸린다. `heading`은 시맨틱 레벨이며 시각 크기는 여전히 `size`가 정한다(두 축 독립)
  - `Textarea`: `size`가 행수를 정한다(매핑값은 계획). `rows` · `maxLength` 없음(알려진 동작 10). `Label`: `children: string`, `htmlFor?: string`. `Badge`: `children: string`
- [ ] AC-8. **(R21 수정)** 레이아웃 프리미티브 `Stack` `Box`가 구현된다. API는 `direction` / `align` / `justify` / `wrap`. `gap` · `padding` 등 간격 prop 없음 — 간격은 `className`(C-14). `children`은 문자열 제외 엘리먼트 노드(C-17 children 규칙). `wrap`은 기능 불리언(C-11 예외). enum 값과 Box · Stack의 역할 구분은 계획 단계
- [ ] AC-9. **(R21 수정)** 전 컴포넌트가 동일한 `variant` 집합(`primary | secondary | ghost | danger`)과 `tone` 집합(`default | muted | danger`)에서만 고른다 (타입으로 강제). 컴포넌트별 부분집합은 빼되 이름은 바꾸지 않는다(Badge가 `ghost`를 안 쓰면 뺌). 검증 = C-17 export 맵 타입 동등성 테스트
- [ ] AC-10. **(R21 수정)** 전 컴포넌트가 전역 `Size`(`sm | md | lg | xl | 2xl`)에서 고르고, 컴포넌트별 부분집합이 타입으로 고정된다(`ControlSize = sm | md | lg`). Text만 5단 전부(`TypographyStep`). 검증 = C-17 맵 테스트
- [ ] AC-11. **(R20 반전, R21 수정)** 전 컴포넌트가 `className?: string`을 받고, 소비자 클래스가 DS 기본 클래스와 충돌하면 소비자가 이긴다 (예: `variant="primary"`에 `className="bg-danger"`를 주면 배경이 danger). 승리 범위는 같은 유틸리티 그룹·같은 변형(C-15). 웹·RN 동일 동작은 정지 상태에 한정. 검증 3계층 — 단위: 병합 문자열 · `toHaveClass`. 웹 통합: Playwright computed style을 토큰 JS 값과 비교. RN: NativeWind가 테스트 환경에서 className을 style로 해석하면 `toHaveStyle`, 안 되면 className prop 스냅샷으로 격하(AC-25)
- [ ] AC-11a. **(R21 수정)** 어떤 컴포넌트도 `style` prop을 받지 않고, `{...rest}` 스프레드로 미지 prop을 통과시키지 않는다 (타입 테스트로 검증). `className`이 유일한 커스텀 채널
- [ ] AC-12. 어떤 컴포넌트도 `as` / `render` / `asChild`를 공개 prop으로 노출하지 않는다
- [ ] AC-13. **(R21 재작성)** 제어 API가 두 갈래로 고정된다. 값 입력 컴포넌트(Input · Textarea)는 `value` / `defaultValue` / `onValueChange`만, 오버레이(Dialog · Drawer · Tooltip)는 `open` / `defaultOpen` / `onOpenChange`만 노출한다. Button 누름 이벤트는 웹 `onClick` / RN `onPress` 하나씩만 — 웹에 `onPress` 없고 RN에 `onClick` 없다(R21 후속). **(R25)** Chip도 같다 — `selected`는 제어 전용이고 `onSelectedChange` 같은 변경 콜백이 없다. 시그니처는 양쪽 `() => void`. ButtonGroup 자체는 누름 이벤트 없음(자식 Button이 가짐). `onChange` / `onToggle` 같은 이름은 어디에도 없다. Form은 값이 없어 대상 밖. 검증 = C-17 맵 테스트
- [ ] AC-14. 인터랙티브 컴포넌트에서 `label` 누락 시 타입 에러가 난다
- [ ] AC-15. **(R21 재정의)** 계약 전체에 `number` 타입 prop이 없고, 색 의도를 받는 prop(`variant`, `tone`)은 enum 키만 받는다 (`tone="#333"`은 타입 에러). mapped type 테스트 1개로 검증. `className` 문자열 내부는 검사 대상이 아니다
  - 이전: "`padding={16}`, `color="#333"`이 타입 에러". 해당 prop이 존재하지 않는 쪽으로 재정의(C-14)
- [ ] AC-15a. 아이콘을 받는 컴포넌트가 `icon="이름"` 문자열만 받고, 잘못된 이름은 타입 에러가 난다. 아이콘 노드(`icon={<Trash />}`)는 타입에서 거부된다

### distribution
- [ ] AC-16. **(R20 수정, R21 구체화) 부트스트랩 검증**: Tailwind v4가 설치된 빈 Next.js 프로젝트에 `@eeennsu/web`을 설치하고, 전역 CSS에 `@import "@eeennsu/web/themes/base.css"` 한 줄을 추가한 뒤, 로그인 화면 하나를 DS 컴포넌트만으로 작성해 정상 렌더된다. `tailwind.config`·PostCSS 설정 편집은 없어야 한다
  - 화면 구성: `Form` > (`Label` + `Input kind="email"`), (`Label` + `Input kind="password"`), `Text tone="danger"`(오류), `Button variant="primary"`. 제출은 Button `onClick`에서 소비자 코드가 처리. Enter는 무동작(알려진 동작 5)
  - 확인 항목: 렌더(자동) + 비밀번호 필드에 브라우저 자동완성 제안이 뜬다(`<form>` + `kind` 파생 힌트, C-21). 자동완성 제안 UI는 브라우저 크롬이라 Playwright로 단언할 수 없다 — 자동 검증은 DOM의 `<form>` 존재와 `autocomplete="current-password"` / `"email"` 속성으로, 제안 UI 자체는 수동 확인(R21 후속)
  - 이전: "설정 파일 편집 없이". Tailwind v4 필수화로 import 한 줄까지 허용
- [ ] AC-17. **(R21 수정)** 새로 만든 빈 Vite + React 19 + Tailwind v4 프로젝트에서도 AC-16과 같은 경로·브랜드(`@eeennsu/web/themes/base.css`)로 동일 화면이 렌더된다 (프레임워크 비종속 검증). 다크는 코드 0줄로 OS 추종을 확인(AC-19 a)
- [ ] AC-18. 타입 정의(`.d.ts`)가 함께 배포되어 IDE·클로드코드가 prop 시그니처를 읽을 수 있다
- [ ] AC-19. **(R21 재작성)** 다크모드가 AC-16의 import 한 줄 외 추가 설정 없이 hybrid로 동작한다.
  - (a) 루트 엘리먼트에 `.dark` / `.light` 클래스가 없으면 OS `prefers-color-scheme`을 따른다. Vite 검증 프로젝트에서 코드 0줄로 확인.
  - (b) 루트에 `.dark` 또는 `.light` 클래스가 있으면 클래스가 OS 설정보다 우선한다. Next.js 검증 프로젝트에서 next-themes로 확인.
  - (c) **(R24 수정)** RN은 OS 색 구성표만 따른다. 루트 클래스로 덮는 경로는 없다(게이트 (2)·(4), C-20 RN 항목). 앱이 바꾸려면 `Appearance.setColorScheme`을 쓴다.
  - 검증: 웹은 Playwright `emulateMedia({ colorScheme })` × 루트 클래스 유무 4조합에서 semantic 배경색 computed style을 토큰 값과 비교. RN은 `Appearance` 모킹 2조합(라이트 / 다크)이며 `toHaveStyle`로 단언한다 — 게이트 (9)가 jest에서 className 해석을 확인했으므로 AC-25의 스냅샷 격하 규칙을 쓰지 않는다. 브랜드는 `base`.
- [ ] AC-24. **(R20 신설, R21 수정) 커스텀 검증**: AC-16 화면에서 버튼 하나에 `className`으로 배경색·여백을 바꾸면 그 버튼만 바뀌고 다른 버튼은 그대로다. 사용한 클래스는 DS `@theme` 어휘(`bg-danger`, `mt-6` 등 — `mt-6`은 열거 안의 키)여야 한다. 전제: 어휘 봉쇄(C-15)로 `@theme` 밖의 클래스는 애초에 생성되지 않는다
- [ ] AC-26. **(R22 신설) 로컬 오버라이드 검증**: AC-16 화면의 전역 CSS에서 `@import "@eeennsu/web/themes/base.css"` 다음 줄에 semantic 색 변수 하나(예: `--bg-brand`)를 3블록(`:root` / `.dark` / `@media … :root:not(.light)`)으로 재선언한다. 라이트 값 X·다크 값 Y는 `base`·`bakery` 어느 값과도 다르게 잡는다
  - (a) `Button variant="primary"` 배경과 `className="bg-brand"`를 준 요소의 computed style이 AC-19 4조합(`emulateMedia` × 루트 클래스 유무)에서 각각 X 또는 Y다 — 컴포넌트 기본 스타일과 소비자 클래스가 같은 변수를 따라감
  - (b) 재선언하지 않은 semantic 변수(예: `--bg-danger`)는 `base` 값 그대로다 — 오버라이드가 변수 단위로 격리됨
  - (c) 소비자 CSS에 `tailwind.config`·PostCSS·`@theme` 편집이 없다 — C-3 "import 한 줄" 유지, 추가된 건 CSS 선언뿐
  - (d) 회귀 가드: 알려진 동작 12 재현. `:root`만 재선언한 상태로 4조합을 돌려 `.dark` 클래스 조합에서 X, 클래스 없는 OS 다크 조합에서 `base` 다크 값이 나옴을 확인한다. 통과 기준이 아니라 "이 불일치가 계약대로 발생한다"는 스냅샷
  - RN: **(R24 수정)** AC-23 화면의 `global.css`에 **2블록**(`:root` + `@media (prefers-color-scheme: dark) { :root }`)을 쓰고 `Button variant="primary"` 배경이 `Appearance` 모킹 2조합에서 X / Y다. 웹의 3블록을 그대로 쓰면 다크 조합이 X에 머문다(알려진 동작 15). AC-25 격하 규칙은 쓰지 않는다 — 게이트 (9)가 `toHaveStyle` 검증을 확인했다. 전제인 게이트 (6)은 통과했다
  - Vite(AC-17)에서는 반복하지 않는다 — 캐스케이드는 번들러 무관이고 AC-17의 목적은 프레임워크 비종속 렌더 확인

### platform-adapter (`@eeennsu/native`)
- [ ] AC-20. **(R21 수정)** `Button` `Input` `Card` `Stack` `Text` 5개가 RN + NativeWind v5로 구현된다. v1 이후 `Textarea` `Label` `Badge` `Box`(구현 노트 N-16), **(R25)** `Chip` `Icon`이 더해져 11개다
- [ ] AC-21. **(R21 수정)** 이 5개의 prop 시그니처가 `@eeennsu/web`과 일치한다 — 단 계약이 플랫폼 매개변수로 정의한 이름 매핑(Button 웹 `onClick` ↔ RN `onPress`)은 제외하며, 그 외 차이는 0. `@eeennsu/tokens`의 계약 타입 `Contracts<'web'>` / `Contracts<'native'>`를 양쪽이 구현하며, Button · Input의 `ref` 핸들(`{ focus(); blur() }`)도 계약에 포함된다. 검증 = export 맵 타입 동등성 테스트(C-17). 한쪽에만 prop을 추가하거나 컴포넌트를 빠뜨리면 테스트가 깨진다 (실제로 깨지는지 확인)
- [ ] AC-22. **(R21 수정)** `label`이 RN에서 접근성 이름이 된다 — Button은 `label`이 가시 텍스트이자 `accessibilityLabel`, Input은 `accessibilityLabel`만(가시 라벨은 `Label` 조합)
- [ ] AC-23. **(R20 수정, R21 수정) 크로스플랫폼 검증**: 새로 만든 빈 Expo 프로젝트(SDK는 C-19 게이트가 정함. `spot`은 개발 중단)에 NativeWind v5와 `@eeennsu/native`를 설치하고 `@eeennsu/native/themes/base.css`를 import해 화면 하나를 DS 컴포넌트만으로 작성한다(제목·오류 텍스트는 `Text`). 웹 프로젝트와 같은 색·간격이 나온다
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
| 계약 일치는 규율로 지킬 수 있다 | 웹에만 prop 하나 추가하면 계약이 깨지고 아무도 모른다. AC-21이 검증 불가능한 AC였다 | 계약 타입을 `@eeennsu/tokens`에 단일 정의. 어기면 컴파일 에러. R21: 강제 수단을 export 맵 타입 동등성 테스트로 확정(C-17) |
| 아이콘은 노드로 받으면 된다 | `icon={<Trash />}`는 아무 노드나 통과시켜 C-15로 막은 드리프트 경로를 다시 연다. 게다가 lucide는 웹/RN 패키지가 갈린다 | 이름 문자열로만 받고 DS가 내부에서 플랫폼 분기 |

## Technical Context

### 형제 프로젝트 실측 (`/Users/wonderround/Documents/Git/porfolio`)

> R21 후속 주석: 이 절은 2026-09-01 Mac 기기 실측이며 **설계 근거로만** 남긴다. 검증 대상이 아니다(C-4a, C-18). `spot`은 개발 중단. 현재 Windows 기기에는 `spot` · `photo_top` · `eeennsu-resume`가 없고 `eunstory`는 Tailwind v3라 "웹 5개 전부 v4"는 기기에 따라 다르다. 검증 프로젝트는 전부 새로 만든다.

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
| ComponentContract | core domain | variant 어휘, size 스케일(전역 5단 + 컨트롤 부분집합), `tone` 축 (R21), 제어 네이밍(`value` 3종 / `open` 3종 / 누름은 플랫폼 관용 `onClick`·`onPress`), 교차 어휘 열거형 `kind` (R21), 플랫폼 매개변수 `Contracts<P>` (R21 후속), a11y 필수, 금지 prop 목록, `className` 허용 (R20), `ref` 핸들 | governs all Components across both Platforms; enforced by export-map type equality test (C-17) |
| Platform | supporting | web \| native | consumes DesignToken via platform build; hosts its own Component impl; both resolve className against shared ClassVocabulary |
| ClassVocabulary | supporting (R20) | `@theme` 산출물 — 토큰에서 파생된 Tailwind 클래스 집합. **봉쇄** (R21): Tailwind 기본 팔레트·동적 spacing 리셋, primitive 미노출. 열거 외 키는 무효 | built from DesignToken; consumed by web Tailwind and NativeWind identically via platform wrapper; the only customization channel; merged by tailwind-merge with DS key config |
| Package | supporting | name, version, exports, types | `@eeennsu/tokens` → `@eeennsu/web`, `@eeennsu/native`. 스코프 이름 `@eeennsu` 확정(2026-09-05). 공개 경로는 `web/themes/<brand>.css`, `native/themes/<brand>.css` |
| Theme | supporting | brand × (light \| dark) | rebinds semantic DesignToken; composed of Brand and color scheme; dark resolved by hybrid rule (C-20) |
| Brand | core domain | name, semantic 색 오버라이드. v1: `base`, `bakery` (R21). 주입 위치 2곳 (R22): DS 브랜드 파일(이름 있는 프리셋) / 소비자 로컬 오버라이드(앱 전용, C-5b) | injects into semantic tier only; 간격·타이포·component 계층은 불변; preset selected at build time by import path, one per app; local override cascades over the preset in consumer global CSS |
| SemanticVariable | supporting (R22) | `:root` semantic 색 변수 이름(예: `--bg-brand`. 실제 이름은 토큰 인벤토리), 3블록(light / `.dark` / `@media`) | public override contract (C-5b); referenced by ClassVocabulary via `@theme inline` `var()`; 1:1 with `twMergeConfig` 색 키; renaming or removal is breaking(major), addition is additive; not mirrored into RN JS token object (알려진 동작 11); (R23) 확대 후보 변수군 `--radius-*`·폰트 패밀리는 계약 밖이나 토큰 인벤토리에서 계약 후보로 명명한다 |
| Icon | supporting | name (문자열, `IconName` 28개), size 토큰(컨트롤 3단), `tone` (R25), `label?` (R25) | referenced by Component via name only; DS가 플랫폼별 lucide 패키지로 분기; (R25) 공개 컴포넌트 `Icon`으로도 쓴다 — 색은 상속하지 않고 `tone`으로 갖는다 |
| DesignLanguage | supporting | 차용 층위(토큰 아키텍처, 크로스플랫폼 분리) | derived from Seed(당근). WDS · Bezier는 R5에서 거론됐으나 차용한 결정 없음 |
| AgentContract | external system | 조회 인터페이스 | v2 보류. v1에서는 `.d.ts`가 대체 |

## Interview Transcript

<details>
<summary>전체 Q&A (19 라운드 + R20·R21·R22 사후 개정)</summary>

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
**A:** **`@eeennsu/tokens`에 계약 타입 동거**

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
**후속 확정(2026-09-05, decisions-r21.md 밖):** 개정 적용 중 근거 문서에 없어 남긴 3건을 판단 기준(되돌리기 쉬운 쪽, 타입 강제)으로 닫음 — ① C-13 매핑에 Textarea(= Input), ButtonGroup(`label` 필수, `role="group"`), Badge · Card · Label(대상 아님) 추가 ② C-11 `kind` 어댑터 매핑은 AC-16·알려진 동작 8의 근거라 스펙에 유지 ③ C-8 `tone = default | muted | danger` 3값 확정 ④ **B-9 재개정** — 사용자가 웹 `onPress`를 어색하다고 판단. 누름 이벤트를 플랫폼 관용 이름(웹 `onClick` / RN `onPress`, 시그니처 `() => void` 동일)으로 바꾸고, 계약에 플랫폼 매개변수 `Contracts<P>`를 도입해 매핑을 계약 1곳에 둠. 웹 `onClick` 별칭 추가안은 "같은 개념에 두 이름"이라 기각. C-12·C-17·C-21·AC-13·AC-16·AC-21·알려진 동작 5 수정 ⑤ **계획 착수 전 누락 점검**(독립 리뷰 + 실측 재확인) — 결정 8건을 추천안대로 닫음: Label ↔ Input은 `id` / `htmlFor`(RN v2 `nativeID` / `accessibilityLabelledBy`) · 컨테이너 `children`은 문자열 제외 엘리먼트 노드(RN 크래시 타입 차단) · Button 아이콘 전용 모드 v1 제외(알려진 동작 9) · Text `heading?: '1'|'2'|'3'` + `children: string | string[]` · Textarea `size` → 행수, `rows`·`maxLength` 없음(알려진 동작 10) · 리셋에 `--font-weight-*` 추가, breakpoint·container 유지 · 검증 대상은 새 빈 프로젝트(`spot` 개발 중단, 형제 프로젝트 무시) · peer `react >= 19`. 소수정: native 래퍼 `@source "../dist"` · C-4 산출물 제약(`"use client"` 보존, 정적 클래스) · `@import "tailwindcss"` 중복 확인 · AC-16 자동완성 수동 확인 · `ref`는 Button·Input·Textarea만. 계획 태스크로 넘긴 것: 토큰 인벤토리·값, 컴포넌트별 축 매트릭스, 오버레이 세부, Stack/Box enum, focus ring 토큰, `IconName` 소스, exports·peer·lockstep 버전, 테스트 러너 2개, 검증 앱 위치

### Round 22 — tokens + distribution / Constraints · **소비 프로젝트 특화 통로** (2026-09-05)
**배경:** 스펙 리뷰 중 사용자가 3단계로 물음 — ① "프로젝트마다 지향하는 디자인 방향이 다른데 DS가 감안하나?" (답: 브랜드 축 C-5a와 `className`으로 색은 커버, 밀도·스케일 방향성은 미커버) ② "소비 프로젝트가 DESIGN.md를 만들면 DS가 인지·반영하는 구조인가?" (답: 아니다. agent-native v2 보류, DS는 `.d.ts`만 노출) ③ "소비 프로젝트만의 특화된 디자인이 필요하면 통로를 열어놔야 하지 않나?"
**조사:** NativeWind v5 테마 가이드 — `@theme`은 클래스 생성용, `:root`는 런타임 기본값. `VariableContextProvider` / `vars()`로 런타임 오버라이드, `useUnstableNativeVariable`로 JS에서 변수 읽기 가능. import 순서 캐스케이드는 문서에 없음
**Q1:** 통로 3개 중 어느 것을 여나? A 소비자 로컬 semantic 오버라이드(구조상 이미 됨, 어휘 봉쇄 유지) / B 소비자 `@theme` 확장(어휘 봉쇄 깨짐) / C 간격·타이포 브랜드별 분리(AC-6a·`size` 계약 재설계)
**A:** **A, 단 RN 확인 먼저**
**Q2:** RN 확인 후 — 소비자 CSS 오버라이드가 RN JS 토큰 객체에 안 닿는 갭을 어떻게? ① 알려진 동작으로 기록(v1 DS 코드 무영향, unstable API 의존 없음) / ② `useToken()` 훅 제공(preview unstable API에 DS 계약 얹힘)
**A:** **① 알려진 동작으로 기록**
**결과:** C-5b 신설(로컬 semantic 오버라이드 = 공개 계약, DS 코드 변경 0), C-5a 보강(주입 위치 2곳), C-19 게이트 (6) 추가, 알려진 동작 11~13, AC-26 신설, Non-Goal 3건 명시(소비자 `@theme` 확장 / 간격·타이포 브랜드 분리 / 런타임 브랜드 전환), Ontology `Brand` 수정·`SemanticVariable` 추가. 여는 비용은 semantic 변수 이름 안정성 의무 하나. 결정 근거·대안 비교·조합 검증은 [decisions-r22.md](decisions-r22.md). DESIGN.md 인지는 여전히 범위 밖 — 그건 DS 메커니즘이 아니라 소비 프로젝트에서 클로드코드가 읽는 컨텍스트이며, 그 결과가 C-5b 채널로 들어온다

### Round 23 — tokens / Constraints · **확대안 연기 결정** (2026-09-05)
**배경:** R22 반영 직후 사용자가 이어서 물음 — ① "통로가 소비 프로젝트에서 DS 규약을 수정하게 하는 것이냐" ② "어차피 화면은 클로드코드가 DESIGN.md를 보고 만드는데 그 걱정이 필요한가"
**답변 ①:** 아니다. C-5b는 CSS 변수 **값** 재선언만이며 클래스 어휘·컴포넌트 API·스케일 계약은 전부 불변이다. 그래서 "DS 코드 변경 0"이 성립했다. 스펙 변경 없음(C-5b 본문이 이미 그렇게 쓰여 있음)
**답변 ②:** 부분적으로 맞다. 클로드코드가 커버하는 층 = 화면 구조·정보 위계·컴포넌트 선택, 그리고 열거된 간격 중 무엇을 고르는가(앱 A `mt-2`/`mt-4` vs 앱 B `mt-8`/`mt-12` → 밀도 인상이 갈림). 커버 못 하는 층 = 컴포넌트 내부 형태(Button 높이·패딩, Card radius, Input 테두리)와 폰트 패밀리. 이걸 앱 전역에서 바꾸려면 호출 지점마다 `className` 임의값을 반복하게 되고 이는 이 레포가 없애려는 shadcn 복붙 드리프트와 같은 모양이다. DESIGN.md의 지위는 R22 그대로 — DS 메커니즘이 아니라 소비 프로젝트의 에이전트 컨텍스트라, DESIGN.md가 지시할 수 있는 범위는 곧 DS가 연 채널의 범위다
**Q:** 걱정이 유효하다면 C-5c(오버라이드 대상을 색 + `--radius-*` + 폰트 패밀리로 확대)를 지금 여나? ① 지금 연다 / ② 트리거 조건부 연기
**A:** **② 연기.** 비대칭이 결정적 — 대상 추가는 나중에도 추가적(minor)이라 기다리는 비용이 0인데, 지금 열면 이름 안정성 의무 3종 + AC-6a 문구 수정을 앱 0개 상태의 추측으로 문다
**결과:** 계약·동작·AC 변경 없음. C-5b에 (R23) 확대 트리거 기록(DS v1 + 소비 프로젝트 2개 구축 후 사용자 판단), 알려진 동작 14 추가, Non-Goal에 후보 C ↔ C-5c 구분 및 자동 검증 AC 부재 명시, Ontology `SemanticVariable` 명명 규칙 한 줄, 계획 태스크 "토큰 인벤토리"에 요구 2건(radius·폰트 패밀리 오버라이드 가능 여부 확인 / 계약 후보 명명). 조합 검증 충돌 0, 문구 보강 1. 결정 근거는 [decisions-r23.md](decisions-r23.md)

### Round 24 — platform-adapter / Constraints · **C-19 착수 게이트 실행** (2026-09-06)
**성격:** 인터뷰 라운드가 아니다. C-19가 예정한 개정 경로(게이트 실패 시 스펙을 먼저 고친다)를 실행한 것이며, 질문·선택지가 아니라 측정 결과가 입력이다. 측정 전문은 [gate-c19.md](gate-c19.md)
**측정:** 빈 Expo 프로젝트(SDK 57 / RN 0.86.3 / nativewind 5.0.0-preview.4 / react-native-css 3.0.7)에서 9항목. jest-expo + RNTL 14로 판정했고, `Appearance.setColorScheme`이 jest에서 no-op이라 `NativeAppearance`를 모킹해야 (2)·(4)를 실제로 판정할 수 있었다
**결과:** (1)(3)(6)(8)(9) 통과, (2)(4) 실패, (5) 부분(lineHeight만), (7)은 기기 화면 확인 1회 미실시. 실패 2건의 뿌리는 하나 — react-native-css가 루트 클래스 셀렉터를 해석하지 않는다(`.dark` 사문화, `:root:not(.light)`의 `:not`이 매칭을 깨뜨림). `:not`을 뺀 `@media … :root`는 동작한다
**개정:** C-20 RN 항목 재작성(RN 다크 = OS 단독), C-6에 native 래퍼 전용 다크 블록 추가, C-5b RN 항목 2블록으로 수정, AC-19 (c)·AC-26 RN절 수정, 알려진 동작 15~16 추가. 웹 산출물·웹 AC·계약 타입·클래스 어휘 무변경. 게이트 (8) 결과로 계획 §9 S-5(보류) 종결 — native 래퍼를 바꾸지 않는다
**남은 것:** 게이트 (7) 기기 화면 확인 1회. 이것이 Phase 5 착수의 마지막 조건이다

### Round 25 — components + platform-adapter / Constraints · **첫 RN 소비 앱 반영** (2026-09-25)
**성격:** 인터뷰 라운드가 아니다. v1 이후 첫 RN 소비 앱 spendback의 입력 폼 요구, 그 앱의 디자인 검증 지적(누름 영역 · 눌림 표시 · 고정폭 숫자 · placeholder 대비), 연동하며 잰 번들 크기, DS 검증 에이전트의 지적(RN Icon 배치, bakery 라이트 대비, 눌림 색이 소비자 배경을 무시함)이 입력이다
**결과:** Chip · Icon 신설, `IconName` 28개, 눌림 표시 `active:opacity-80`, RN 누름 영역 · 포커스 · placeholder 색 · 고정폭 숫자 · 아이콘별 import, 글자 대비(base 다크 · bakery). 결정 근거와 열지 않은 것은 [decisions-r25.md](decisions-r25.md)

</details>
