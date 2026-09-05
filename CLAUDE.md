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

- 스펙: [docs/design-system-spec.md](docs/design-system-spec.md). 토큰 구조, 컴포넌트 API 계약, 수용 기준이 여기 있다. 구현 전 검증(R21), 소비 프로젝트 특화 통로(R22), 확대안 연기 결정(R23)까지 마쳤고 구현하면서 바뀔 수 있다
- 2026-09-05 R23 개정이 현재 기준. 스펙 상단 "R21 개정 요약"~"R23 개정 요약"과 Constraints 아래 "알려진 동작(v1)"을 먼저 읽는다. R20 미결 3건은 닫혔다(1·2 종결, 3은 C-19 착수 게이트). 결정 대기 항목·보류 없음(npm 스코프는 2026-09-05 `@eeennsu`로 확정)
- **앱마다 갈리는 축은 색·간격 리듬·화면 구조 셋이다**(알려진 동작 14). 컴포넌트 내부 형태와 폰트 패밀리를 앱 단위로 바꾸는 통로(C-5c)는 열지 않았다 — 소비 프로젝트 2개를 만든 뒤 판단하는 조건부 항목이며 조건은 C-5b (R23)에 있다. 그 전에 미리 열지 않는다
- 결정 근거: [docs/decisions-r21.md](docs/decisions-r21.md), [docs/decisions-r22.md](docs/decisions-r22.md), [docs/decisions-r23.md](docs/decisions-r23.md). 스펙 본문은 결과만 싣고 대안 비교·조합 검증은 여기 있다. 닫힌 결정을 다시 열지 않는다
- 구현 계획: [docs/plan.md](docs/plan.md) v2. 토큰 인벤토리·값, 컴포넌트 축 매트릭스, `Contracts<P>`, 패키지 구성, 태스크(T-0 ~ T-P1)와 AC 매핑이 여기 있다. 스펙과 어긋나는 지점은 plan.md §9에 모으고 스펙은 고치지 않는다
- 계획 검증: [docs/plan-verification.md](docs/plan-verification.md). 2026-09-05 검증 완료(B 2·P 21·N 13, 전부 plan.md v2에 반영). 사용자 확정 4건은 plan.md D-6 · D-28 · D-29 · D-30
- 착수 게이트는 두 단계다. 웹(Phase 1~3)은 C-3 선확인(T-W0: web 래퍼 `@import "tailwindcss"`의 pnpm peer 해석·중복 출력)만 필요하다. **native(Phase 5) 착수 전에만** C-19 게이트(plan.md §2, 9건: NativeWind v5 확인 6건 + Expo SDK + native 래퍼 구성 + 테스트 환경 className 해석)를 통과해야 한다. 구현 문서는 아직 없다
