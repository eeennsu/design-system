# 구현 노트

[plan.md](plan.md) 를 실행하면서 계획과 갈린 지점, 구현 중 확인한 사실을 모은다.
스펙 내부 불일치는 plan.md §9 에 있고 이 문서는 **계획 ↔ 구현** 사이만 다룬다.

- 기준일: 2026-09-25
- 진행: **Phase 0 ~ Phase 7 완료.** 2026-09-24 `@eeennsu/tokens` · `web` · `native` `0.1.0` 을 npm 에 publish 했다
- v1 이후: 2026-09-24 RN 컴포넌트 4개(Textarea · Label · Badge · Box)를 더한(N-16) `0.2.0` 을 **같은 날 npm 에 publish 했다**(`latest`)
- v1 이후 두 번째: 2026-09-25 Chip · Icon 과 RN 보정 · 글자 대비를 담은(N-17, 스펙 R25) `0.3.0` 을 만들었다. **아직 publish 하지 않았다**

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
| 4 | T-G2 게이트 실행 | 완료 | jest + [gate-c19.md](gate-c19.md) 9항목. (7) 기기 확인 2026-09-08 |
| 5 | T-N0 native 래퍼 다크 · 배수 line-height | 완료 | `packages/native/themes/*.css`, tokens 테스트 58개 |
| 5 | T-N1 ~ T-N4 native | 완료 | `packages/native` 컴포넌트 5개, 테스트 22개(타입·dist) |
| 6 | T-R1 verify-expo 화면 · 테스트 | 완료 | jest 31개(게이트 20 + DS 10 + smoke 1) + 화면 비교 |
| 7 | T-P1 publish | 완료 | npm `0.1.0` 3패키지. 새 Next 프로젝트에서 npm 설치로 AC-16 화면 확인 |
| v1 이후 | RN Textarea · Label · Badge · Box (N-16) | 완료 · `0.2.0` publish(2026-09-24) | `packages/native` 테스트 24개, verify-expo jest 39개(DS 18) |
| v1 이후 | Chip · Icon, RN 눌림 · 누름 영역 · 포커스 · placeholder · 고정폭 숫자 · 아이콘별 import, 글자 대비 (N-17, R25) | 완료 · `0.3.0` 미배포 | tokens 67 · web 79 · native 26 · verify-expo 50 |

수동 확인 상태:

1. AC-16 의 "비밀번호 자동완성 제안 UI"(브라우저 크롬이라 자동 단언 불가) — **남아 있다.** DOM 쪽 근거(`<form>` + `autocomplete="current-password"`)는 Playwright 가 본다
2. ~~게이트 (7) 기기 화면 확인~~ — **완료(2026-09-08).** [gate-c19.md](gate-c19.md) (7) 절
3. ~~AC-23 웹·RN 화면 비교~~ — **완료(2026-09-08).** `docs/assets/ac23-{web,rn}-{light,dark}.png` 네 장. 색(브랜드 초록 · danger 빨강) · 카드 표면 · 간격 순서가 같고, `mt-6` 를 준 버튼만 양쪽에서 같은 만큼 내려간다
4. ~~T-P1 npm 설치 화면 확인~~ — **완료(2026-09-24).** `create-next-app@16.3.6`(Tailwind) 빈 프로젝트에 `pnpm add @eeennsu/web` 으로 npm 에서 설치하고,
   전역 CSS 를 `@import "@eeennsu/web/themes/base.css"` 한 줄로 바꾼 뒤 AC-16 로그인 화면을 작성했다.
   `next build`(타입 검사 포함) 통과, `postcss.config.mjs` · `next.config.ts` 는 생성 원본과 diff 0.
   Playwright 로 `<form>` · `autocomplete` · `type="button"` · Enter 무동작 · `onClick` 오류 표시를 확인했고
   화면은 `docs/assets/ac16-npm-{light,dark}.png` 두 장이다

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

### N-10. native 만 `moduleResolution: "bundler"` 다

tokens · web 은 `NodeNext` 인데 `packages/native/tsconfig.json` 만 `module: "ESNext"` +
`moduleResolution: "bundler"` 다. `react-native-css` 가 내는 `.d.ts` 가 확장자 없는 상대 import
(`export * from "./runtime"`)를 쓰는데 그 패키지의 `dist/typescript/module/package.json` 이
`"type": "module"` 이라 NodeNext 해석에서 풀리지 않는다 — `useCssElement` 가 "없는 export" 가 된다.

RN 소비자는 Metro 로 번들하므로 bundler 해석이 실제 런타임과도 맞다. 우리 소스는 상대 import 에
`.js` 를 그대로 붙여 두므로 산출물은 두 해석 어느 쪽에서도 유효하다.

### N-11. native 는 `react` · `react-native` 를 검증 앱과 **정확히 같은 버전**으로 고정한다

`packages/native` 의 devDependency 를 `react@19.2.3` · `react-native@0.86.3` · `react-native-css@3.0.7`
로 못 박았다. 범위(`^19.2.0`)로 두면 pnpm 이 19.2.8 을 깔고, 격리 레이아웃에서
`packages/native/node_modules/react` 와 `apps/verify-expo/node_modules/react` 의 realpath 가 갈린다.
그러면 검증 앱이 DS 컴포넌트를 렌더할 때 React 가 두 벌이라 "Invalid hook call" 로 죽는다.

버전을 맞추면 세 패키지가 같은 `.pnpm` 디렉터리를 가리켜 한 벌이 된다. C-19 고정 정책과도 방향이 같다
— 게이트가 고정한 조합으로 개발한다.

### N-12. RN Icon 은 색을 `className` → `color` prop 으로 옮긴다

웹 Icon 은 `currentColor` 로 글자색을 상속하지만 RN 에는 `currentColor` 도, View → Text 색 상속도 없다.
그래서 `react-native-css` 의 `useCssElement` 로 `{ className: { target: false, nativeStyleMapping:
{ color: "color" } } }` 매핑을 걸어 클래스의 색만 lucide `color` prop 으로 넘긴다.
호출부는 웹과 같은 `text-fg-on-brand` 를 쓴다(§9 S-17, AC-25).

같은 이유로 **Button 이 variant 를 표면(Pressable)과 전경(라벨 Text) 둘로 쪼갠다.** 웹은 버튼 하나에
`bg-brand text-fg-on-brand` 를 같이 얹지만 RN 은 라벨 Text 가 색을 따로 받아야 한다.
결과: 소비자가 Button `className` 에 글자색 클래스를 주면 웹은 라벨이 바뀌고 RN 은 안 바뀐다.

### N-13. RN Input 에는 `placeholder:` 변형이 없다

웹 Input 의 기본 클래스에는 `placeholder:text-fg-muted` 가 있지만 RN 쪽은 뺐다.
`react-native-css` 가 `placeholder:` 를 `placeholderTextColor` 로 옮기지 않는다.
v1 RN 은 플랫폼 기본 placeholder 색을 쓴다.

### N-14. 검증 앱 jest 설정 2건 — ESM 패키지와 `.mjs`

`lucide-react-native` 와 `@eeennsu/*` 는 ESM 단일 출력(plan D-22)이라 jest-expo 의
`transformIgnorePatterns` 허용 목록에 넣어야 한다. 그리고 lucide 는 `react-native` 조건에서
`.mjs` 를 내주는데 jest-expo 의 transform 은 `^.+\.[jt]sx?$` 라 `.mjs` 를 건드리지 않는다.
두 줄을 `apps/verify-expo/jest.config.js` 에 넣었다.

`workspace:*` 심링크로 쓸 때는 DS 패키지 경로가 `node_modules` 밖이라 첫 번째 문제가 안 보이고,
**타르볼 설치(verify:pack)에서만 드러난다.** RN 소비자가 jest 를 쓴다면 같은 한 줄이 필요하다.

### N-15. 게이트 CSS 와 앱 CSS 를 분리했다

T-R1 이 `apps/verify-expo/global.css` 에 AC-26 용 `:root` 재선언을 넣으면서, 같은 파일을 컴파일하던
게이트 테스트의 기준값이 흔들렸다. 게이트는 `tests/fixtures/gate-global.css`(래퍼 import 한 줄)를,
T-R1 은 실제 `global.css` 를 쓴다.

컴파일 기준점도 다르다 — 게이트는 존재하지 않는 base 로 자동 소스 탐지를 막아 `@source "../dist"` 만
남기고(그래서 (3) 이 격리 판정이 된다), T-R1 은 앱 루트를 base 로 줘서 Metro 빌드와 같은 조건으로 본다.

### N-16. v1 이후 RN 컴포넌트 4개를 더했다 — Textarea · Label · Badge · Box

계획은 RN 을 핵심 5개(AC-20)에서 멈추고 나머지를 v2 로 넘겼다. 첫 RN 소비 앱(spendback)의 입력 폼에
여러 줄 입력 · 가시 라벨 · 태그가 바로 필요해서, **웹에 계약이 이미 있고 누름 갈래가 없는 4개**만 먼저 옮겼다.
오버레이 · Form · ButtonGroup 은 그대로 v2 다.

계약(`Contracts<P>`)은 한 줄도 바꾸지 않았다. `nativeComponents` 목록만 9개로 늘렸고, 맵 테스트(C-17)가
네 컴포넌트의 prop 이 웹과 같은지 함께 본다. 구현하면서 정한 것:

- **Label ↔ 컨트롤 연결**: 스펙 C-13 의 "RN 은 `nativeID` / `accessibilityLabelledBy` 로 매핑" 을
  Label `nativeID = htmlFor + "-label"`, Input · Textarea `accessibilityLabelledBy = id + "-label"` 로 구현했다.
  컨트롤이 자기 `id` 를 이미 `nativeID` 로 쓰므로 Label 은 접미어를 붙인 다른 이름을 갖는다.
  `accessibilityLabelledBy` 는 **Android 전용**이고 iOS 는 컨트롤의 `accessibilityLabel`(필수 `label`)만 읽는다.
  기존 Input 도 `id` 를 주면 이 속성이 붙는다(추가적 변경)
- **RNTL 의 이름 계산이 바뀐다**: 연결이 있으면 RNTL 은 ARIA 처럼 연결된 Label 텍스트를 접근성 이름으로 삼고
  `accessibilityLabel` 은 무시한다. Label 텍스트와 `label` 이 다르면 `getByLabelText(label)` 이 못 찾는다
- **라벨을 눌러도 컨트롤에 포커스되지 않는다**: 웹 `<label for>` 의 기본 동작에 해당하는 것이 RN 에 없다
- **Textarea**: `size` → `numberOfLines` 3 / 5 / 8 (plan D-14). `numberOfLines` 는 RN 0.86 에서 iOS · Android
  네이티브 뷰 둘 다에 넘어간다. Android 가 여러 줄 입력의 글자를 세로 가운데에 두므로 `textAlignVertical="top"` 을 준다
- **Badge**: Button 과 같이 표면(View)과 전경(Text)으로 쪼갠다(N-12). RN 에 인라인이 없어 세로 방향 부모 안에서
  부모 폭으로 늘어난다(웹도 Stack 안에서는 같다). 줄이려면 소비자가 `className="self-start"` 를 준다 —
  기본값으로 넣으면 `align="center"` 인 가로 Stack 에서 세로 가운데 정렬이 깨진다
- **Box**: `View` + `className`. RN `View` 는 원래 세로 flex 라 웹 `div` 와 달리 자식이 가로 폭으로 늘어난다
- **게이트 (3) 음성 대조**: `rounded-full` 을 Badge 가 쓰게 되어 "생성되지 않아야 할 클래스" 목록에서
  양성 쪽으로 옮기고 `rounded-sm` 으로 바꿨다
- 검증 앱 화면을 웹과 같은 구성(Label + `id`, Box 색 견본)으로 바꿨다. 보이는 모양은 그대로다.
  **기기 화면 확인은 하지 않았다** — jest 가 스타일 값과 접근성 연결을 본다

### N-17. v1 이후 두 번째 — Chip · Icon 과 RN 보정 (0.3.0)

첫 RN 소비 앱 spendback 의 입력 폼과 디자인 검증에서 나온 것을 담았다. 스펙 R25, 대안 비교는
[decisions-r25.md](decisions-r25.md) 다. N-16 과 달리 계약이 늘었다 — `Contracts<P>` 에 `Chip` · `Icon`,
`IconName` 에 4개, 키 목록이 웹 16 · RN 11 개다. 맵 테스트(C-17)가 두 플랫폼의 대칭을 그대로 본다.

- **Chip**: 웹은 Base UI Button + `aria-pressed`, RN 은 Pressable + `accessibilityState.selected`.
  Button 처럼 표면과 전경을 쪼갠다(N-12). 크기는 하나(component 토큰 `chip`: px 4 · py 2 · text sm ·
  radius full, 높이 38). RN 라벨은 글자 크기 설정을 끝까지 따른다 — 처음에는 1.5배에서 잘랐는데 WCAG 1.4.4 에 못 미치고
  Button 과 어긋나 뺐다(DS 재검증 DS-002)
- **Icon**: 내부 아이콘을 `Glyph`(Button · Dialog · Drawer 안, 웹은 `currentColor` 상속과 `spin`)로 이름을
  바꾸고, 공개 `Icon` 을 따로 둔다. 공개 Icon 은 색을 상속하지 않고 `tone` 으로 갖는다 — RN 에 상속이 없어서다.
  RN 은 `Frame`(View 하나)이 svg 를 감싸고 `className` 을 View 에 붙인다 — 배치 · 변형 · 투명도는 View 에 한 번, 색만 lucide
  `color` 로 간다(`nativeStyleMapping`). 두 번 고쳤다. 처음에는 클래스를 안쪽 svg 에 붙여 배치가 웹과 갈렸고(DS 검증 DS-001),
  View 를 없애고 svg 에 붙이자 lucide 가 style 을 도형마다 펼쳐 `rotate-*` 가 렌더 중 던지고 `opacity-*` 가 세 번 곱해졌다
  (DS 재검증 DS-001, F-27). 접근성 속성도 View 에만 있다. 그림 크기는 `size` prop 이 정한다(알려진 동작 20).
  `label` 이 빈 문자열이면 꾸밈으로 본다
- **눌림 표시**: Button · Chip 에 `active:opacity-80`. RN 은 react-native-css 가 Pressable 의 onPressIn/Out 으로 푼다.
  처음에는 `active:bg-*-hover` 였는데 소비자가 `bg-danger` 를 준 버튼이 누를 때만 파래졌다(DS 검증 DS-003). 웹도 같은 클래스다
- **누름 영역**: RN Button sm `hitSlop` 위아래 9, md 3, lg 없음, Chip 5. 가로는 최소 폭 `min-w-12`(DS 검증 DS-004).
  모양(D-6 높이)은 그대로다
- **입력 포커스 · placeholder**: RN Input · Textarea 의 `controlBase` 에 `focus:border-border-focus`(plan D-9, 0.2.0 누락).
  `invalid` 는 `border-danger focus:border-danger` 라 포커스 중에도 danger 다. placeholder 는 DS 안의 `StyledTextInput` 이
  `placeholderClassName="text-fg-muted"` 를 `placeholderTextColor` 로 옮긴다(N-13 해소. 0.2.0 까지 플랫폼 기본 hint 색,
  AppCompat 라이트 흰 표면 위 약 2.7:1)
- **고정폭 숫자**: native 래퍼 끝(`@source` 앞)에 `.tabular-nums { -rn-font-variant: tabular-nums; }`(F-21)
- **번들 크기**: RN Icon 이 `lucide-react-native/icons/<이름>` 에서 하나씩 import 한다(F-22).
  dist 검사 테스트가 목록 파일 import 를 막는다
- **글자 대비**: base 다크 `fg.on-brand` · `fg.on-danger`, bakery 다크 `fg.on-danger` 를 gray-950 으로(F-23). bakery 라이트는
  `fg.on-brand` 를 gray-950, `bg.brand-hover` 를 amber-500 으로(흰 글자 3.2:1 이었다, DS 검증 DS-002). plan §3.3 표도 고쳤다 —
  값은 계약이 아니다(이름만 계약, C-5b). tokens `tests/contrast.test.ts` 가 브랜드 × 스킴의 글자 쌍 4.5:1, 포커스 표시와 고른 칩
  채움 3:1 을 본다
- 검증 앱: verify-expo 화면에 칩 3개와 아이콘 4개, 고정폭 숫자를 더했다. jest 에 11개(선택과 칩 패딩 · 눌림과 소비자 배경 ·
  Chip 누름과 비활성 · 누름 영역과 최소 폭 · 포커스 · placeholder · 고정폭 · 아이콘 변형 · 투명도 · 아이콘 색 덮기 · 아이콘 이름 ·
  다크 on-brand(Badge · 고른 칩 · danger 버튼))
- 검증: 작업 과정을 모르는 검증 에이전트가 보고 전용으로 봤다. high 2(DS-001 · DS-002)와 medium 3(DS-003 눌림 색 · DS-004 가로 누름
  영역 · DS-005 기록)을 반영했다. 반영하지 않은 polish 는 decisions-r25.md "열지 않은 것"과 알려진 동작 17~23 에 있다
- 재검증: 새 검증 에이전트(보고 전용)가 high 1(DS-001 RN Icon 변형 · 투명도)과 medium 3(DS-002 Chip 글자 상한 · DS-003 RN
  Input 누름 영역 기록 없음 · DS-004 CLAUDE.md 의 "보류 없음")을 냈고 모두 반영했다. polish 는 스펙 문구(DS-006) · 결정 표(DS-007) ·
  plan 포커스 목록(DS-008) · 웹 고른 칩 hover 테두리(DS-010)를 반영했고, 눌림 대비(DS-005) · RN 비선택 알림(DS-009) · RN 포커스
  굵기(DS-011) · 웹 닫기 버튼(DS-012) · `cursor-pointer` 는 decisions-r25.md 에 이유를 적었다. 재검증 뒤 다시 검증하지는 않았다
- **기기 화면 확인은 하지 않았다** — jest 가 스타일 값과 접근성 속성을 본다

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

### F-16. RN 에는 `invalid` 를 알릴 접근성 채널이 없다

웹 Input 은 `invalid` 를 `aria-invalid` 로 낸다. RN 에는 대응물이 없다 —
`accessibilityState` 는 `disabled · selected · checked · busy · expanded` 뿐이고
`aria-invalid` 는 react-native 에 **존재하지 않는 prop** 이라 넘겨도 조용히 버려진다
(타입은 `react-native-css` 의 느슨한 prop 확장 때문에 통과한다).

그래서 RN `invalid` 는 테두리 색까지만 간다. 오류를 읽히려면 소비자가 `Text tone="danger"` 로
메시지를 놓는다 — 웹 Form 의 오류 표시(C-21)와 같은 방식이라 계약이 갈리지는 않는다.

### F-14. (5) 의 lineHeight 결함은 화면에서 레이아웃 붕괴로 나타난다

T-N0 전 기기 확인에서 `text-2xl` Text 하나가 화면 끝까지(768dp) 늘어나 나머지 자식이 전부 화면 밖으로
밀렸다. `--text-2xl--line-height: 32px` 를 배수로 읽어 `24 x 32 = 768` 이 된 것이다.
"글자 크기가 조금 틀리다" 가 아니라 "화면이 안 나온다" 라서, T-N0 을 Phase 5 첫 태스크로 둔 판단이 맞았다.

### F-15. 런타임과 jest 의 oklch 환산이 한 단계 다르다

같은 `--bg-brand` 다크 값을 `useUnstableNativeVariable` 은 `#3080ff` 로, jest 의 `react-native-css` 는
`#2b7fff` 로 준다. 둘 다 blue-500 이고 육안 차이는 없다. 자동 단언은 jest 값을 쓰고, 기기 확인은
probe 텍스트를 눈으로 본다.

### F-17. npm publish 는 2FA 가 필수고, 패키지마다 인증한다

2FA 가 꺼진 계정은 `E403 … Two-factor authentication or granular access token with bypass 2fa enabled
is required to publish packages` 로 막힌다. 2026-09-12 에 받은 로그인 토큰은 2026-09-24 에 `E401` 이었다 —
publish 직전에 `npm login` 한다.

패스키 2FA 에서 `pnpm -r publish` 는 **패키지마다** 브라우저 인증을 한 번씩 요구한다. lockstep 3패키지라
릴리스마다 3번이다. 인증을 기다리는 패키지는 아직 안 올라간 상태라, 도중에 끊기면 일부만 올라간다
(2026-09-24 에 tokens · native 가 먼저 올라가고 web 이 인증 대기로 남았다). 끊겼으면 남은 패키지만
`pnpm --filter @eeennsu/<이름> publish --access public` 으로 낸다. 2FA 우회 토큰은 CI 용이라 로컬에 두지 않는다.

### F-18. 갓 publish 한 버전은 pnpm 12 가 `minimumReleaseAgeExclude` 에 올린다

레포 밖에서 corepack 이 고르는 pnpm 은 12.6.0 이다(이 레포는 `packageManager` 로 10.28.1). publish 직후
소비 프로젝트에서 `pnpm add @eeennsu/web` 을 하면 설치는 성공하고, `pnpm-workspace.yaml` 의
`minimumReleaseAgeExclude` 에 `@eeennsu/web@0.1.0` · `@eeennsu/tokens@0.1.0` 이 자동으로 추가된다.
pnpm 공급망 정책이라 DS 쪽 문제가 아니고, AC-16 이 금지하는 설정 편집(`tailwind.config` · PostCSS)과도 무관하다.

### F-19. Windows 에서 소비 프로젝트 경로가 깊으면 Turbopack 빌드가 깨진다

`Cannot depend on path (\\?\C:\…\node_modules\.pnpm\@eeennsu+web@0.1.0_…\dist\card.js.map) outside of
root directory` 로 `globals.css` 처리가 실패한다. 래퍼의 `@source "../dist"` 가 스캔하는 dist 파일 경로가
260자를 넘으면 `\\?\` 접두어가 붙어 넘어오고, Turbopack 이 이를 루트 밖으로 판정한다. 같은 프로젝트를
짧은 경로로 옮기면 그대로 빌드된다.

pnpm 가상 스토어 경로와 web `dist` 의 가장 긴 파일명이 루트 뒤에 132자를 붙이므로, **프로젝트 루트가
약 126자를 넘으면** 걸린다. 보통 경로(`C:\Users\<이름>\Documents\GitHub\<프로젝트>`)는 해당 없다.
T-P1 확인 때 Claude 임시 폴더(루트 157자)에서 걸렸다. 경로 길이는 소비 환경 문제라 DS 쪽 대응은 없다.

### F-20. pnpm 11+ 는 package.json 의 `pnpm` 필드를 읽지 않는다

레포 밖에서 corepack 이 고르는 pnpm(12.x, F-18)은 `The "pnpm" field in package.json is no longer read by pnpm`
경고를 내고 `pnpm.overrides` 를 버린다. `verify:pack` 은 앱 사본 package.json 의 `pnpm.overrides` 로
web · native 타르볼 안의 `@eeennsu/tokens@<버전>` 을 로컬 타르볼로 돌렸는데, 그게 무시되어 npm 에서 찾았다.

npm 에 같은 버전이 있으면 **조용히 통과한다** — `0.1.0` publish 뒤의 실행이 그랬다. 아직 올리지 않은
`0.2.0` 에서 `ERR_PNPM_NO_MATCHING_VERSION` 으로 드러났다. override 를 사본의 `pnpm-workspace.yaml` 로
옮기고, 설치 뒤 lockfile 에 npm 에서 받은 `@eeennsu` 패키지가 없는지 검사를 더했다.
검증 스크립트 문제라 소비 프로젝트의 DS 사용과는 무관하다.

### F-21. react-native-css 3.0.7 은 `font-variant-numeric` 을 옮기지 않는다

`tabular-nums` 는 Tailwind 가 `--tw-numeric-spacing` 변수와 `font-variant-numeric` 선언으로 내는데,
react-native-css 3.0.7 은 이 속성을 지원하지 않는다고 경고하고 버린다(`compiler/declarations` 는 font-variant 계열 중
`font-variant-caps` 만 처리한다). 그래서 RN 에서 `tabular-nums` 가 아무 일도 하지 않는다. `-rn-font-variant: tabular-nums` 는
`fontVariant: "tabular-nums"` 로 컴파일되고, RN 이 네이티브로 넘길 때 `processFontVariant` 가 배열로 나눈다.
spendback 의 디자인 검증 에이전트가 global.css 를 메모리에서 컴파일해 찾았다.

### F-22. Metro 는 lucide 목록 파일 import 로 아이콘 전체를 번들에 넣는다

Metro 는 tree shaking 을 하지 않는다. `import { Check } from "lucide-react-native"` 는 목록 파일을 통째로 번들에 넣는다
(아이콘 3,616개). spendback 릴리스 번들(`react-native bundle --dev false`)에서 node_modules 의 dist 를 잠시 고쳐 잰 값이
3,910,590 B → 2,196,347 B 다(−1.71MB, −44%). lucide-react-native 1.41.0 은 `./icons/*` 를 exports 로 공식 제공하고
각 파일이 기본 export 다. 웹은 번들러가 tree shaking 을 하므로 목록 import 를 그대로 둔다.

### F-23. base 다크의 brand · danger 위 흰 글자는 4.5:1 이 안 된다

blue-500 위 흰색 3.71:1(런타임 `#3080ff`, jest `#2b7fff` 는 3.76), red-500 위 흰색 3.81:1. 버튼 라벨(text-md 400)은
4.5:1 이 기준이다. bakery 다크는 on-brand 를 이미 gray-950 으로 두었다. 두 브랜드 모두 on-danger 까지 gray-950 으로 맞췄다
(5.42 · 5.29). spendback 은 이 값을 앱 C-5b 재선언으로 먼저 고쳤었다.

같은 종류가 bakery 라이트에도 있었다 — amber-600 위 흰 on-brand 3.20:1(0.1.0 부터). on-brand 를 gray-950(6.29)으로 바꾸고,
더 어두운 hover(amber-700, gray-950 과 4.00)를 밝은 amber-500(9.40)으로 뒤집었다. tokens 에 대비 테스트가 없어 세 번 모두
검사 없이 나갔다. `packages/tokens/tests/contrast.test.ts` 를 두었다.

### F-24. RN CLI(Expo 없는) 소비자는 react-native-css 의 Metro 변환기를 쓸 수 없다

react-native-css 3.0.7(3.1.0-rc.0 도 같다)의 `metro-transformer` 는 JS 와 CSS 를 `@expo/metro-config` 의 변환 워커에 맡긴다.
Expo 없는 RN CLI 앱에 `@expo/metro-config` 를 넣으면 `@expo/metro` 가 Metro 0.84 를 고정해 RN 0.87(Metro 0.87)과
변환 워커 버전이 갈린다. spendback 은 같은 일을 하는 변환기를 앱에 두었다 — JS 는 Metro 기본 워커, CSS 는
`@tailwindcss/postcss` → `react-native-css/compiler` 의 `compile()` → `StyleCollection.inject` 코드. pnpm 이 그 peer 를 자동
설치하지 않도록 `packageExtensions` 로 선택 peer 표시를 했고, CSS 변환 결과는 Metro 디스크 캐시에 쓰지 않는다(Tailwind 결과가
다른 소스 파일에 달려 있어서다. Expo 는 자기 FileStore 로 같은 일을 한다). 상세는 spendback `docs/DESIGN.md` 1.4.
DS 쪽 변경은 없다 — C-3 "import 한 줄" 은 Expo 소비자 기준이고, RN CLI 소비자의 Metro 설정은 그 앱의 몫이다.

### F-25. verify-next 의 스크린샷 테스트는 실행할 때마다 `docs/assets` 를 덮어쓴다

`apps/verify-next/e2e/screenshot.spec.ts` 가 `docs/assets/ac23-web-{light,dark}.png` 에 저장한다. 다른 기기(폰트 · 렌더러)에서
`pnpm -r test` 를 돌리면 커밋된 AC-23 비교 이미지가 바뀐다. 이번 작업은 매번 되돌렸다(`git checkout -- docs/assets`).

### F-26. react-native-svg 는 width · height prop 을 style 뒤에 둔다

lucide-react-native 는 `size` 를 svg 의 `width` · `height` prop 으로 넘기고, react-native-svg 는 그 값을 style 배열 맨 뒤에
붙인다(`[기본, 소비자 style, { width, height }]`). 그래서 소비자 `className` 의 `size-*` 가 style 로 들어가도 그림 크기는
`size` prop 이 정한다. `nativeStyleMapping` 으로 width 를 `size` prop 에 옮겨도 호출부가 넘긴 `size` 가 이긴다(jest 로 확인).

### F-27. lucide-react-native 는 style 을 자식 도형마다 펼친다

lucide-react-native 의 `Icon` 은 받은 props 의 나머지(`...rest`, style · 접근성 속성 포함)를 svg 루트와 **자식 도형마다** 넘긴다.
react-native-svg 도형은 style 을 props 에 합친 뒤 opacity · transform 을 다시 읽는다. 그래서 svg 에 준 `rotate-180` 은
`transformToMatrix` 에서 `TypeError`, `scale-75` 는 파서 오류로 렌더 중 던지고, `opacity-50` 은 루트 · G · Path 에 세 번 걸린다
(jest 로 재현). 아이콘에 스타일을 줄 때는 lucide 밖의 View 에 준다(N-17 Icon).

## 4. 다음

- **v1 구현과 배포가 끝났다.** npm `0.1.0` (2026-09-24)
- 남은 수동 확인: AC-16 비밀번호 자동완성 제안 UI(1절 수동 확인 상태 1)
- npm 패키지 페이지가 비어 있다 — 세 패키지에 README 가 없고(루트 `README.md` 도 빈 파일) `package.json` 에
  `repository` 가 없다. publish 한 버전은 고칠 수 없으니 다음 버전에서 넣는다
- `0.2.0`(N-16 의 RN 4개)은 2026-09-24 publish 했다
- `0.3.0`(N-17)은 버전을 올리고 `pnpm -r build` · `pnpm -r test` · `pnpm verify:pack` 까지 통과했다. **publish 만 남았다** — 아래 순서의 `npm login` 부터 한다.
  pnpm 은 기본으로 main 브랜치에서만 publish 한다(`publish-branch`). 브랜치를 main 에 합친 뒤 낸다
- 0.3.0 은 base 다크 · bakery 라이트의 글자색을 바꾼다. 릴리스 노트에 적고, AC-23 다크 스크린샷(`docs/assets/ac23-*-dark.png`)은 흰 글자로 남아 있어 다음 기기 확인 때 다시 찍는다
- npm 패키지 페이지(README · `repository`)는 여전히 비어 있다
- 웹 Chip · Icon 은 verify-next 화면에 없다. 브라우저 computed style(AC-11 웹 통합 계층)과 서버 컴포넌트 렌더(C-4)를 다음 웹 작업 때
  화면에 올려 확인한다(DS 재검증 테스트 공백 6)
- 기기에서 볼 것(N-17): RN Icon 이름 한 번 읽기 · 꾸밈 건너뛰기, `rotate-180` · `ml-auto` 배치, hitSlop 48 과 칩 줄 간격 10 미만의 겹침,
  `tabular-nums`, placeholder 색(라이트 · 다크), 하드웨어 키보드 포커스 테두리, bakery 라이트 포커스 · 고른 칩 채움 약 3.1:1,
  글자 크기 200% 의 칩 줄, AC-23 다크 재촬영
- 다음 릴리스: `pnpm version:set <v>` → `pnpm -r build` · `pnpm -r test` · `pnpm verify:pack` →
  `npm login` → `pnpm -r publish --access public` (패키지마다 브라우저 인증, F-17)
