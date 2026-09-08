# design-system

React 웹/앱 공통 개인 디자인 시스템. 웹(Next.js / Vite)과 React Native(Expo) 프로젝트가 같은 토큰을 쓴다.

## 목표

새 React 프로젝트를 시작할 때 shadcn 복붙·테마 세팅을 생략하고, 패키지 설치와 CSS import 한 줄만으로 화면 작성을 시작할 수 있게 한다.

기존 Next 프로젝트 5개가 shadcn 복사 모델로 서로 드리프트한 것이 출발점이다. 그래서 코드 복사가 아니라 **npm 패키지**로 배포한다. 컴포넌트 소스는 이 레포에만 있다.

## 범위

- 배포 형태: npm 패키지 3개 (`tokens` / `web` / `native`). pnpm workspace 단일 레포, 공개 npm
- 웹과 RN은 **토큰과 클래스 어휘를 공유**하고 컴포넌트 구현은 분리한다. 웹은 Tailwind v4, RN은 NativeWind v5
- 소비 프로젝트는 `className`으로 커스텀할 수 있다. 어휘는 DS 토큰에서 나온 Tailwind 테마다
- 앱 단위 색은 소비 프로젝트가 전역 CSS에서 semantic 변수를 재선언해 바꾼다(C-5b). DS 레포에 브랜드 파일을 추가하지 않아도 된다. 간격·타이포 스케일은 전 앱 공유
- v1은 웹 컴포넌트 전체 + RN 핵심 컴포넌트 일부. RN 오버레이 컴포넌트는 v2
- 프레임워크 비종속. Next.js는 검증 환경일 뿐 설계 기준이 아니다

## 하지 않는 것

- 웹·RN 컴포넌트 코드 1본화. NativeWind는 쓰되 구현은 플랫폼별로 둔다
- Storybook, MCP 서버, 자체 CLI, shadcn 레지스트리
- 기존 Next 프로젝트 5개 마이그레이션. 부수 효과일 뿐 성공 기준이 아니다

## 문서

- 스펙: [docs/design-system-spec.md](docs/design-system-spec.md). 토큰 구조, 컴포넌트 API 계약, 수용 기준이 여기 있다. 구현 전 검증(R21), 소비 프로젝트 특화 통로(R22), 확대안 연기 결정(R23), C-19 게이트 실행(R24)까지 마쳤고 구현하면서 바뀔 수 있다
- 2026-09-06 R24 개정이 현재 기준. 스펙 상단 "R21 개정 요약"~"R24 개정 요약"과 Constraints 아래 "알려진 동작(v1)"을 먼저 읽는다. **R24 는 게이트 실측 반영이다 — RN 다크는 hybrid 가 아니라 OS 단독이고, native 래퍼만 `@media (prefers-color-scheme: dark) { :root }` 블록을 추가로 낸다. 웹은 무변경.** R20 미결 3건은 닫혔다(1·2 종결, 3은 C-19 착수 게이트). 결정 대기 항목·보류 없음 — plan §2.3 D-31(RN line-height는 native 래퍼가 배수로 낸다)은 2026-09-06 확정
- **앱마다 갈리는 축은 색·간격 리듬·화면 구조 셋이다**(알려진 동작 14). 컴포넌트 내부 형태와 폰트 패밀리를 앱 단위로 바꾸는 통로(C-5c)는 열지 않았다 — 소비 프로젝트 2개를 만든 뒤 판단하는 조건부 항목이며 조건은 C-5b (R23)에 있다. 그 전에 미리 열지 않는다
- 결정 근거: [docs/decisions-r21.md](docs/decisions-r21.md), [docs/decisions-r22.md](docs/decisions-r22.md), [docs/decisions-r23.md](docs/decisions-r23.md). 스펙 본문은 결과만 싣고 대안 비교·조합 검증은 여기 있다. 닫힌 결정을 다시 열지 않는다
- 구현 계획: [docs/plan.md](docs/plan.md) v2. 토큰 인벤토리·값, 컴포넌트 축 매트릭스, `Contracts<P>`, 패키지 구성, 태스크(T-0 ~ T-P1)와 AC 매핑이 여기 있다. 스펙과 어긋나는 지점은 plan.md §9에 모으고 스펙은 고치지 않는다
- 계획 검증: [docs/plan-verification.md](docs/plan-verification.md). 2026-09-05 검증 완료(B 2·P 21·N 13, 전부 plan.md v2에 반영). 사용자 확정 4건은 plan.md D-6 · D-28 · D-29 · D-30
- 착수 게이트는 두 단계이고 **둘 다 닫혔다** — 웹 선확인(T-W0) 2026-09-05 통과, C-19 게이트(T-G1 · T-G2) 2026-09-06 실행, 게이트 (7) 기기 화면 확인 2026-09-08 완료(Android 에뮬레이터 + Expo Go, 스크린샷은 `docs/assets/`). **Phase 5 착수 조건은 없다.** 기기 확인에서 (5) lineHeight 결함이 화면 레이아웃을 무너뜨리는 것을 봤고, T-N0 이 그것을 고쳤다
- 게이트 기록: [docs/gate-c19.md](docs/gate-c19.md). 9항목 판정과 고정한 버전이 여기 있다 — (1)(3)(6)(8)(9) 통과, (2)(4) 실패(R24 개정 완료), (5) 부분, (7) 기기 확인 미실시
- 구현 노트: [docs/implementation-notes.md](docs/implementation-notes.md). 진행 상태(Phase 0~4 완료), 계획과 갈린 지점 9건, 구현 중 확인한 사실 13건이 여기 있다. 계획을 다시 읽기 전에 이걸 먼저 본다

## 현재 코드 상태

- `packages/tokens` — DTCG 소스 3계층 + 빌드(`scripts/build-outputs.ts`가 산출물 문자열, `scripts/build.ts`가 쓰기) + 계약 타입. 테스트 53
- `packages/web` — 컴포넌트 14개, Base UI 1.8.0 · lucide 1.41.0 · tailwind-merge 3. 테스트 67(타입 테스트 포함)
- `packages/native` — 스캐폴드 + peer 고정(`nativewind` `5.0.0-preview.4`) + `dist/_gate-stub.js`(게이트 스캔 대상, T-N1 이 대체). 컴포넌트는 Phase 5
- `apps/verify-next` · `apps/verify-vite` — 웹 검증 앱. Playwright 16 + 5
- `apps/verify-expo` — 게이트 · RN 검증 앱(Expo SDK 57). jest-expo + RNTL 14, 테스트 20(게이트 19 + smoke 1)
- 명령: `pnpm -r build` · `pnpm -r test` · `pnpm verify:pack`(타르볼 설치 재검증) · `pnpm version:set <v>`
- 토큰 산출물(`packages/*/themes/*.css`, `packages/tokens/src/generated`, `src/brands`)과 `dist`는 **추적한다**. 손으로 고치지 않는다 — 빌드가 덮고 테스트가 잡는다
