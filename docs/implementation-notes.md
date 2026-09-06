# 구현 노트

[plan.md](plan.md) 를 실행하면서 계획과 갈린 지점, 구현 중 확인한 사실을 모은다.
스펙 내부 불일치는 plan.md §9 에 있고 이 문서는 **계획 ↔ 구현** 사이만 다룬다.

- 기준일: 2026-09-06
- 진행: Phase 0 ~ Phase 4 완료. Phase 5(native) 미착수 — 게이트 (7) 기기 확인 1건이 착수 조건으로 남았다

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
| 4 | T-G1 `apps/verify-expo` 생성 | 완료 | [gate-c19.md](gate-c19.md) "T-G1" |
| 4 | T-G2 게이트 실행 | 완료 | jest 20개 + [gate-c19.md](gate-c19.md) 9항목 |
| 5~7 | native · RN 검증 · publish | 미착수 | — |

수동 확인으로 남은 것 2건:

1. AC-16 의 "비밀번호 자동완성 제안 UI"(브라우저 크롬이라 자동 단언 불가). DOM 쪽 근거(`<form>` + `autocomplete="current-password"`)는 Playwright 가 본다
2. **게이트 (7) 기기 화면 확인.** Android 에뮬레이터 또는 Expo Go 에서 `apps/verify-expo` 를 띄운다. Phase 5 착수의 마지막 조건이다

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

### N-7. `lightningcss` 고정을 `overrides` 가 아니라 직접 의존성으로 했다

plan §2.1 은 `apps/verify-expo/package.json` 에 `"overrides": { "lightningcss": "1.30.1" }` 를 넣으라고
했다. **pnpm workspace 는 멤버 패키지의 `overrides` 필드를 읽지 않는다** — 루트 `pnpm.overrides` 만
먹고, 루트에 넣으면 웹 쪽 Tailwind 가 쓰는 lightningcss 까지 같이 묶인다.

`lightningcss` 는 `react-native-css` 의 **peer** 라(`>=1.27.0`) 검증 앱의 정확 버전 devDependency 로
두면 같은 고정 효과가 나고 범위가 앱 안에 갇힌다. 그렇게 했다.

### N-8. 게이트 스텁이 `bg-brand` 한 줄이 아니다

plan v2 F-14 는 `packages/native/dist/_gate-stub.js` 를 `className="bg-brand"` 문자열 1줄로 적었다.
구현은 게이트가 쓰는 클래스 어휘 전체를 담는다 — (5) 의 `text-xl`, (6) 의 `bg-danger` 처럼
`bg-brand` 말고도 생성돼야 하는 클래스가 있기 때문이다.

(3) 의 격리 판정은 약해지지 않는다. **스텁에만 있고 앱 소스에는 없는 클래스**(`mt-6` · `text-fg-muted` ·
`bg-danger`)로 판정하고, 스텁에도 앱에도 없는 클래스(`bg-surface-hover` 등)가 생성되지 않는 것을
음성 대조로 함께 단언한다.

### N-9. 게이트 판정 (a) 에 `Appearance` 모킹이 필요했다

plan §2.1 은 판정 (a) 를 "jest-expo + RNTL 의 `toHaveStyle`" 로만 적었다. 실제로는 그 위에
**`NativeAppearance` 모킹**이 필요하다 — jest-expo 에는 그 TurboModule 이 없어
`Appearance.setColorScheme` 이 no-op 이고 `getColorScheme()` 이 항상 `null` 이다.

모킹 없이 돌리면 (2) 와 (4) 가 NativeWind 의 실제 동작과 무관하게 전부 실패로 보인다.
`apps/verify-expo/jest.setup.js` 와 `tests/color-scheme.ts` 가 그 장치이고 T-R1 도 같은 것을 쓴다.

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

### F-8. RN 은 루트 클래스 셀렉터를 아예 해석하지 않는다

게이트 (2)·(4) 의 실측이고 두 실패의 뿌리가 하나다. `.dark { … }` 는 어떤 노드에도 안 걸리고,
`@media (prefers-color-scheme: dark)` 는 동작하는데 `:root:not(.light)` 의 `:not(.light)` 이 매칭을
깨뜨린다. `:not` 을 뺀 `:root` 는 동작한다. 유틸리티 변형 `dark:` 는 정상이다.

그래서 웹의 다크 3블록을 RN 소비자 CSS 에 그대로 복사하면 다크에서 **라이트 값**이 나온다.
스펙 R24 와 알려진 동작 15 가 이 차이를 계약으로 적었다.

### F-9. RN line-height 는 `px` 를 배수로 읽는다

`--text-xl--line-height: 28px` 이 `fontSize 20 × 28 = 560` 이 된다. `1.75rem` 도 `490` 으로 틀린다.
단위 없는 `1.4` 는 `28` 로 맞는다. fontSize · fontWeight 는 정상이다.

`nativewind/theme` 이 `leading-*` 유틸리티만 단위 없는 값으로 덮는 것이 같은 문제를 아는 흔적인데,
`text-<step>` 이 내는 line-height 는 덮지 않는다.

처리 경로는 2026-09-06 사용자 확정으로 **(A) native 래퍼가 배수로 다시 낸다**(plan §2.3 D-31). T-N0 에서
다크 블록과 함께 처리하고 T-N2 의 Text 는 `text-<step>` 클래스를 그대로 쓴다.

### F-10. `@import "nativewind/theme"` 는 DS 토큰과 같이 못 쓴다

`The --spacing(…) function requires that the --spacing theme variable exists` 로 컴파일이 깨진다.
DS 가 `--spacing: initial` 로 리셋(C-6)하는데 `nativewind/theme` 이 끌어오는 `tailwindcss-safe-area` 가
`--spacing(…)` 함수를 쓴다. `--spacing` 을 되살리면 컴파일되지만 어휘 봉쇄가 깨진다(F-2 의 반대편).

v1 어휘는 그것 없이 전부 동작하므로 넣지 않는다. 못 쓰는 것은 `elevation-*` · `ripple-*` · `tint-*` 와
`ios:` · `android:` · `native:` 변형 — 전부 v1 범위 밖이다.

### F-11. jest 에서는 컴포넌트 출처가 className 해석을 가른다

`react-native-css/components` 의 `View` · `Text` 는 className 이 style 로 풀리고, `react-native` 에서
직접 import 한 `View` 는 안 풀린다(`style` 이 `undefined`, `className` 이 원시 prop 으로 남는다).
Metro 빌드는 `globalClassNamePolyfill` 이 둘 다 처리하지만 jest 에는 Metro 가 없다.

`@eeennsu/native` 컴포넌트가 어디서 import 하느냐가 T-R1 의 단언 가능 여부를 정한다(T-N1 확인 항목).

### F-12. Metro 경로도 같은 값을 낸다

`npx expo export --platform android` 산출 hbc 번들에 `#155dfc`(= `--bg-brand` 라이트 값)와 DS 클래스
이름이 들어 있다. jest 판정이 postcss + `registerCSS` 라는 우회로를 쓰기 때문에, 실제 Metro
파이프라인에서도 토큰이 같은 값으로 흐르는지 한 번 확인해 둔 것이다.

### F-13. Expo 기본 tsconfig 는 라이브러리 원본 `.ts` 를 끌어온다

`expo/tsconfig.base` 의 `customConditions: ["react-native"]` 때문에 tsc 가 `react-native-css/jest` 를
`.d.ts` 가 아니라 패키지 안의 원본 `src/jest/index.ts` 로 해석한다. `skipLibCheck` 는 `.d.ts` 만
덮으므로 그 패키지 내부 타입 오류 4건이 검증 앱의 typecheck 를 깨뜨렸다.

`customConditions: []` 로 비워 `.d.ts` 경로로 돌렸다. 런타임 해석은 Metro 가 하므로 영향이 없다.
대신 `useUnstableNativeVariable` 이 web 구현(`() => never`)으로 타이핑되므로 `App.tsx` 가 한 번
캐스팅한다 — T-N1 · T-N2 가 `nativewind` 타입을 쓸 때 같은 것을 만난다.

## 4. 다음

- **게이트 (7) 기기 화면 확인 1회** — Android 에뮬레이터 또는 Expo Go. 2026-09-06 사용자 결정으로 미뤘고, Phase 5 착수의 마지막 조건으로 남아 있다
- Phase 5 는 T-N0(native 래퍼 다크 블록 + 배수 line-height)부터. 게이트 (2)·(4)·(5) 결과로 추가된 태스크다
- Phase 7 publish 는 native 까지 끝난 뒤 3패키지 lockstep. `pnpm -r publish --access public` 전에 `--dry-run`
