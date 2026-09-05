# design-system

React 웹/앱 공통 개인 디자인 시스템. 웹(Next.js / Vite)과 React Native(Expo) 프로젝트가 같은 토큰을 쓴다.

## 목표

새 React 프로젝트를 시작할 때 shadcn 복붙·테마 세팅을 생략하고, 패키지 설치와 CSS import 한 줄만으로 화면 작성을 시작할 수 있게 한다.

기존 Next 프로젝트 5개가 shadcn 복사 모델로 서로 드리프트한 것이 출발점이다. 그래서 코드 복사가 아니라 **npm 패키지**로 배포한다. 컴포넌트 소스는 이 레포에만 있다.

## 범위

- 배포 형태: npm 패키지 3개 (`tokens` / `web` / `native`). pnpm workspace 단일 레포, 공개 npm
- 웹과 RN은 **토큰과 클래스 어휘를 공유**하고 컴포넌트 구현은 분리한다. 웹은 Tailwind v4, RN은 NativeWind v5
- 소비 프로젝트는 `className`으로 커스텀할 수 있다. 어휘는 DS 토큰에서 나온 Tailwind 테마다
- v1은 웹 컴포넌트 전체 + RN 핵심 컴포넌트 일부. RN 오버레이 컴포넌트는 v2
- 프레임워크 비종속. Next.js는 검증 환경일 뿐 설계 기준이 아니다

## 하지 않는 것

- 웹·RN 컴포넌트 코드 1본화. NativeWind는 쓰되 구현은 플랫폼별로 둔다
- Storybook, MCP 서버, 자체 CLI, shadcn 레지스트리
- 기존 Next 프로젝트 5개 마이그레이션. 부수 효과일 뿐 성공 기준이 아니다

## 문서

- 스펙: [docs/design-system-spec.md](docs/design-system-spec.md). 토큰 구조, 컴포넌트 API 계약, 수용 기준이 여기 있다. 아직 검증 전이라 구현하면서 바뀔 수 있다
- 2026-09-05 R20 개정으로 `className` 정책이 차단에서 허용으로 바뀌었다. 스펙 상단 "R20 개정 요약"과 미결 3건을 먼저 읽는다
- 계획·구현 문서는 아직 없다
