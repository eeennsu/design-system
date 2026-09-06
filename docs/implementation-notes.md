# 구현 노트

[plan.md](plan.md) 를 실행하면서 계획과 갈린 지점, 구현 중 확인한 사실을 모은다.
스펙 내부 불일치는 plan.md §9 에 있고 이 문서는 **계획 ↔ 구현** 사이만 다룬다.

- 기준일: 2026-09-05
- 진행: Phase 0 ~ Phase 3 완료. Phase 4(C-19 게이트) 이후 미착수

## 1. 완료 상태

| Phase | 태스크 | 상태 | 증거 |
|---|---|---|---|
| 0 | T-0 레포 부트스트랩 | 완료 | `pnpm install` · `pnpm -r build` · `pnpm -r test` 통과 |
| 1 | T-T1 ~ T-T5 tokens | 완료 | `packages/tokens` 테스트 53개 |
| 2 | T-W0 웹 선확인 | 완료 | [gate-c19.md](gate-c19.md) "웹 선확인" |
| 2 | T-W1 ~ T-W8 web | 완료 | `packages/web` 테스트 67개 (타입 테스트 포함) |
| 3 | T-V1 verify-next | 완료 | Playwright 16개 |
| 3 | T-V2 verify-vite | 완료 | Playwright 5개 |
| 3 | T-V3 pack 설치 | 완료 | `pnpm verify:pack` |
| 4~7 | 게이트 · native · RN 검증 · publish | 미착수 | — |

수동 확인으로 남은 것: AC-16 의 "비밀번호 자동완성 제안 UI"(브라우저 크롬이라 자동 단언 불가). DOM 쪽 근거(`<form>` + `autocomplete="current-password"`)는 Playwright 가 본다.

## 2. 계획과 갈린 지점

### N-1. 생성 TS 는 `src/` 에 두고 `tsc` 가 컴파일한다

plan §5.1 은 tokens `dist/` 를 "tsc + 생성 JS" 로 적었다. 구현은 빌드가 **TypeScript 소스**
(`src/generated/values.ts`, `src/brands/<brand>.ts`)를 생성하고 `tsc` 가 `dist` 로 컴파일한다.

이유: `exports` 가 `./dist/brands/base.d.ts` 를 가리키므로 `.d.ts` 가 필요한데, 빌드가 JS 를 직접
쓰면 `.d.ts` 도 직접 만들어야 한다. 소스를 생성하면 타입 정의가 같은 실행에서 나온다(AC-18).

### N-2. 스냅샷 대상은 커밋된 산출물 자체다

plan T-T2 는 "스냅샷 테스트가 CSS 2개 + JS 3개를 고정" 이라고 했다. 구현은 vitest
`toMatchFileSnapshot` 으로 **커밋된 산출물 파일** 을 스냅샷 대상으로 삼는다
(`packages/tokens/tests/build-output.test.ts`). 별도 `__snapshots__` 사본을 두면 같은 내용이
세 곳(소스 · 산출물 · 스냅샷)에 생기고, 토큰 값 하나를 바꿀 때 리뷰할 diff 가 두 배가 된다.

### N-3. `prebuild` 를 두지 않는다

plan T-T2 는 web·native 의 `prebuild` 가 tokens 빌드를 호출한다고 했다. 실제로 넣어 보니
`pnpm -r build` 가 web 과 native 의 `prebuild` 를 **동시에** 돌려 두 프로세스가
`packages/tokens/themes/*.css` 를 같이 쓴다. 내용이 같아도 동시 쓰기는 파일이 찢어질 수 있다.

pnpm 이 의존성 그래프대로 tokens → web → native → apps 순서로 돌리므로 `prebuild` 없이도
순서가 보장된다. 단독 `pnpm --filter @eeennsu/web build` 는 토큰을 다시 만들지 않는데,
산출물이 소스와 어긋나면 tokens 테스트가 잡는다.

### N-4. 웹 `ref` 는 엘리먼트를 그대로 넘긴다

plan §4.8 · C-17 의 계약 타입(`Ref<FocusHandle>`)은 그대로다. 구현이 `useImperativeHandle` 로
핸들을 만들지 않고 DOM 엘리먼트를 넘긴다 — `HTMLElement` 가 `FocusHandle` 을 구조적으로 만족한다.

이유는 실측이다. 구성한 핸들을 넘기면 Base UI Tooltip 이 DS Button 을 앵커로 쓸 때 floating-ui 가
앵커에서 `getBoundingClientRect` 를 찾지 못해 위치 계산이 예외로 끝난다(plan §4.3 은 "React 19 에서
ref 가 일반 prop 이라 주입할 수 있다"까지만 보고 주입된 값의 **형태**를 보지 않았다).

C-17 은 "핸들에서 DOM 노출로 넓히는 변경은 소비자 무영향(추가적)" 이라고 못박았으므로 방향은 맞다.
RN 은 `TextInput` · `Pressable` 인스턴스에 `focus`/`blur` 가 있으므로 같은 방식이 되는지 T-N3 에서 본다.

### N-5. Button `onClick` 을 감싼다

계약은 `onClick?: () => void` 다. DOM 핸들러로 그대로 넘기면 런타임에는 이벤트 객체가 들어가
`onClick={setOpen}` 같은 코드가 이벤트를 상태에 넣는다. 타입은 막아도 값은 새므로 인자 없이 감싼다.

### N-6. tokens 테스트 러너 구성

plan §5.5 는 러너 2개(Vitest · Playwright)를 말한다. 그대로다. 다만 Playwright 는 `packages/*` 가
아니라 검증 앱 안에 있고 `pnpm -r test` 가 둘 다 돌린다.

## 3. 구현 중 확인한 사실

### F-1. R23 요구 (a) — 비-inline `@theme` 변수도 소비자가 덮을 수 있다

`rounded-md` 는 `border-radius: var(--radius-md)` 로, `font-sans` 는 `font-family: var(--font-sans)` 로
컴파일된다. 토큰 CSS 뒤에 온 소비자 `:root` 재선언이 last-wins 로 이긴다.
**C-5c 를 열 때 필요한 것은 빌드 변경이 아니라 이름을 계약으로 승격하는 결정뿐이다.**
근거: `packages/tokens/tests/probe.test.ts`, plan §3.7 각주.

### F-2. `--spacing: initial` 은 4.3.3 에서 불필요하다

`--spacing-*: initial` 만으로도 `mt-5` 가 생성되지 않는다(plan v2 F-26 재확인). peer 하한 4.1 과
차이가 있을 수 있어 §3.11 대로 유지하고, 테스트가 현재 동작을 고정한다.

### F-3. Next 빌드는 `oklch` 를 `lab` 으로 바꿔 내보낸다

`next build` 의 CSS 최적화가 색 함수를 바꾼다. 그래서 Playwright 에서 computed style 문자열을
토큰 문자열과 직접 비교하면 같은 색인데도 실패한다. 양쪽을 캔버스에 칠해 8비트 sRGB 로 환산해
비교한다(`apps/verify-next/e2e/color.ts`, 채널당 오차 2 허용).

### F-4. lucide 1.41.0 의 정식 이름

`trash` → `Trash`(`Trash2` 는 이 버전에 없다), `alert-circle` → `CircleAlert`(`AlertCircle` 도 없다), `loader` → `Loader`.
plan §4.5 예시의 `Trash2` 는 옛 이름이다. 넷 다 `declare const X: react.ForwardRefExoticComponent` 로
선언된 정식 export 이고 별칭(`declare const X: typeof Y`)이 아니다. `Record<IconName, LucideIcon>` 이
누락을 잡고, `packages/web/tests/icon.test.tsx` 가 24개를 실제로 렌더해 별칭 소멸까지 잡는다.

### F-5. Base UI 1.8.0 에 `@base-ui/react/drawer` 가 있다

plan D-12 는 Dialog 파트로 Drawer 를 구현하기로 했고 그대로 했다 — Base UI Drawer 는 스와이프 등
v1 이 범위 밖으로 둔 동작을 함께 들여온다. 나중에 바꿀 때 재검토할 대상으로만 적어 둔다.

### F-6. 컨테이너 `children` 은 필수라 빈 컨테이너에 `{null}` 을 써야 한다

`Card` · `Box` · `Stack` 의 `children: ElementChildren` 이 필수라 `<Box className="…" />` 는 타입
에러다. `ElementChildren` 이 `undefined` 를 포함해도 JSX 는 prop 존재를 요구한다. 검증 앱의 색
견본이 `<Box className="bg-brand p-8">{null}</Box>` 인 이유다. 계약을 바꾸지 않았다.

### F-7. 웹 래퍼 중복 import 는 실무상 문제가 아니다

소비자가 `@import "tailwindcss"` 를 이미 갖고 있어도 preflight 주 리셋과 유틸리티는 중복되지 않고
`@supports … ::placeholder` 블록 한 쌍(+241 B)만 늘어난다. 상세는 [gate-c19.md](gate-c19.md).

## 4. 다음

- Phase 4 C-19 게이트(T-G1 · T-G2) — native 착수 전 9항목. 웹은 이 게이트와 무관하다
- Phase 7 publish 는 npm 계정이 준비된 뒤. `pnpm -r publish --access public` 전에 `--dry-run`
