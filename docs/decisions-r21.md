# R21 결정 기록 (2026-09-05)

> **상태(2026-09-05 반영 완료):** 이 문서는 동결된 결정 기록이다. F·G 절은 스펙에 전부 반영됐다. 이후 같은 날 스펙에서 닫은 후속 결정(B-9 재개정 — 웹 `onClick` / RN `onPress`, `Contracts<P>` 플랫폼 매개변수 — 와 계획 착수 전 누락 점검 결정)은 여기 없고 [design-system-spec.md](design-system-spec.md) 트랜스크립트 Round 21 "후속 확정"에 있다. 본문의 `onPress` 단일 이름과 "사람 결정 7건"(실제 11건)은 당시 기록 그대로 둔다. 현재 기준은 항상 스펙이다.

R20 개정 스펙([design-system-spec.md](design-system-spec.md))을 구현 전에 검증한 결과, 상위 5건의 해결안과 사람이 결정한 7건을 여기에 기록한다. 스펙 본문은 아직 수정하지 않았다. 이 문서의 "F. 스펙 개정 대상"이 스펙 개정의 작업 목록이고, "G. 알려진 동작"은 스펙에 그대로 옮겨 적을 문구다.

이력:
- 2026-09-05 1차: 기술 확정안 5건, 사람 결정 3건(B-4, B-5, B-7) 기록. 4건 미수신
- 2026-09-05 2차: B-1·B-2·B-3·B-6 확정. B-7 정정(소비자 공개 경로는 web 래퍼). AC-6b no-op을 v1 알려진 동작으로 수용. 조합 검증 재실행
- 2026-09-05 3차: B-8 Text `size` 5단 타이포 스텝, B-9 `onPress`, B-10 Form `<form>` + preventDefault 확정. 15건 조합 검증
- 2026-09-05 4차: B-11 오버레이 제어 API `open` / `defaultOpen` / `onOpenChange` 확정(C-12 두 갈래). 사람 결정 전부 닫힘. 남은 보류는 npm 스코프 이름뿐

판단 기준(우선순위 순):
1. R20 확정 사항을 뒤집지 않는다 — `className` 허용 / NativeWind v5 / 소비 프로젝트 Tailwind v4 필수 / 구현 1본화 안 함
2. AC-16 부트스트랩(설치 + import 한 줄)을 깨지 않는다
3. 되돌리기 쉬운 쪽 — 나중에 바꿀 때 소비 프로젝트를 건드려야 하는 안은 감점
4. 유지보수 표면이 작은 쪽 — 사용자 1인
5. 타입·테스트·lint로 자동 강제되는 쪽

## 상태 요약

| 구분 | 건수 | 상태 |
|---|---|---|
| A. 기술 확정안 | 5 | 확정 |
| B. 사람 결정 | 11 | 확정 10 / 보류 1 (B-7 npm 스코프 이름만 미확인, 경로 규칙은 확정) |
| 남은 열린 항목 | 0 | 결정 대기 없음. 착수 전 기술 확인만 남음(문서 끝) |

---

## A. 기술 확정안 5건

### A-1. 계약 강제 [C-17 · AC-21]

**택: 타입 동등성 테스트, export 맵 통째 비교.**

- `@eeennsu/tokens`가 `Contracts` 타입 맵과 `webComponents` / `nativeComponents` 키 목록을 제공한다. 각 패키지는 테스트 1개로 `expectTypeOf<typeof components>().toEqualTypeOf<{ [K in NativeKeys]: FC<Contracts[K]> }>()`를 검사한다. 추가·제거·누락 컴포넌트가 전부 걸린다. CI에 `vitest --typecheck`.
- `ref`는 플랫폼별 엘리먼트 대신 `Ref<{ focus(): void; blur(): void }>` 핸들로 계약에 포함한다. 핸들에서 DOM 노출로 넓히는 변경은 소비자 무영향(추가적)이고 반대는 파괴적이다.
- 플랫폼 전용 prop은 0개. 웹·RN 차이는 계약의 열거형 교차 어휘로 흡수한다(B-6 `kind`).
- 탈락: `implement<Contract>()` 래퍼 — 감지가 아니라 은닉이고, 우회를 막으려면 custom lint가 추가된다. `satisfies` + 생성 `.d.ts` — 레포 안에서는 안 걸리고 codegen 단계가 늘어난다.
- 되돌리기: **하**. 전부 레포 내부.

### A-2. `@theme` 산출물 [C-15 · C-5a · AC-3]

**택: 전면 봉쇄 + 파일 분리 + 브랜드 빌드타임 파일.** (다크 전략은 B-5 hybrid)

- 토큰 빌드가 브랜드마다 `@eeennsu/tokens/themes/<brand>.css`를 낸다. 내용: `:root` 변수(primitive 포함) + 다크 오버라이드 블록 2셀렉터 + `@theme inline` 매핑 + `--color-*: initial`, `--spacing-*: initial`, radius·shadow·text 네임스페이스 리셋. 이 파일은 **내부 산출물**이며 소비자가 직접 import하지 않는다.
- 소비자 공개 경로는 플랫폼 래퍼다(B-7). `@eeennsu/web/themes/<brand>.css`가 토큰 파일을 import하고 `@custom-variant dark`(hybrid), `@source "../dist"`를 덧붙인다. RN은 `@eeennsu/native/themes/<brand>.css`. 근거: `@source`는 선언한 CSS 파일 기준 상대경로이고 pnpm은 realpath로 해석하므로, 토큰 패키지 안의 파일에서는 web dist를 찾을 수 없다.
- primitive는 `:root` 변수로만 존재하고 `@theme`에 넣지 않는다. `bg-blue-500` 같은 클래스가 생성되지 않으므로 C-7 / AC-6이 lint 없이 구조로 강제된다.
- spacing은 희소 열거형(B-2). 열거 밖 키는 클래스가 생성되지 않는다. 이 no-op은 v1 알려진 동작이다(D, G).
- 브랜드는 앱당 1개, import 파일로 선택한다(B-3). 런타임 브랜드 전환은 요구사항에 없다.
- 탈락: 확장형(기본 테마 유지 + 런타임 브랜드) — 되돌릴 때 소비자의 `bg-slate-*` 흔적이 전부 깨지고 RN 런타임 변수가 v5 preview에서 미확인. 절충형(색만 봉쇄, spacing은 Tailwind 공식) — 나중에 조이면 소비자 파괴, 토큰 모델이 2종이 된다.
- 되돌리기: **중**. 리셋 완화는 추가적이라 하. 브랜드 파일 경로와 다크 전략은 소비자 import 한 줄에 박힌다.

### A-3. 병합 [C-15 · AC-11 · R20 미결 1·2]

**택: tailwind-merge를 웹·RN 양쪽에서 사용, 설정은 토큰 빌드가 생성.**

- 토큰 빌드가 `twMergeConfig`를 낸다. 내용: 색 키, spacing 키(B-2의 10개 + `0`), radius 키, text 크기 키, shadow 키. 양쪽이 `extendTailwindMerge(config)`로 `cn(base, className)` 한다.
- spacing 검증자를 DS 키 목록으로 바꾸는 이유: 기본 설정(`isNumber`)이면 `cn('mt-4', 'mt-5')`에서 존재하지 않는 `mt-5`가 `mt-4`를 밀어내 DS 기본 여백까지 사라진다. 키 목록 기반이면 `mt-5`는 spacing 그룹으로 인식되지 않아 둘 다 남고 `mt-4`가 적용된다. 오타가 DS 기본값을 지우지 않는다.
- `text-*`의 크기/색 모호성은 크기 키 목록으로 해소된다. 크기 키와 색 키 이름이 겹치면 안 된다.
- 소비자 승리 범위는 **같은 유틸리티 그룹·같은 변형**에 한정한다. `hover:bg-*`는 `bg-danger`로 덮이지 않는다. RN에는 hover가 없으므로 "웹·RN 동일 동작"은 정지 상태에 한정한다.
- R20 미결 2는 "web 래퍼의 `@source "../dist"`"로 종결한다. 컴파일된 컴포넌트 CSS는 동봉하지 않는다.
- 검증 3계층: 단위 = 병합 문자열·`toHaveClass`. 웹 통합 = Playwright computed style을 토큰 JS 값과 비교. RN = NativeWind가 테스트 환경에서 className을 style로 해석하면 `toHaveStyle`, 안 되면 className prop 스냅샷으로 격하하고 AC-25는 수동 확인으로 명시.
- 탈락: 웹 캐스케이드 레이어 — RN은 어차피 twMerge라 메커니즘이 2개가 되고 검증이 브라우저뿐이다. `!important` 자동 부여 — 중첩 합성 파괴.
- 되돌리기: **하**.

### A-4. Text 부재 · Button 콘텐츠 [AC-7 · AC-16 · C-13]

**택: Button `label: string`이 가시 텍스트 겸 접근성 이름, `children` 없음. Text 컴포넌트 추가. Input `label`은 접근성 이름만.**

- Button은 `label`을 렌더한다. 아이콘 전용일 때만 `aria-label` / `accessibilityLabel`을 쓴다. WCAG 2.5.3(Label in Name) 위반 경로가 사라진다.
- Input의 `label`은 `aria-label` / `accessibilityLabel`로만 간다(C-13 원문 유지). 가시 라벨은 `Label` 컴포넌트 조합. Input이 가시 라벨을 자동 렌더하는 변경은 나중에 추가적으로 가능하다.
- Text는 웹·RN 양쪽 v1(B-4). 계약: `children: string`(string 전용, RN 안전), `tone`(B-1), `size: TypographyStep`(B-8, 5단), `className`. 인터랙티브가 아니므로 `label` 없음. 인라인 혼합 서식(문장 중간 굵게)은 v1 범위 밖.
- 탈락: `children: string` + 선택 `label` — C-13 "필수"가 조건부로 약화되고 되돌릴 때 children 사용처 마이그레이션. `children: ReactNode` — 계약이 같아도 런타임이 갈리고(`<span>`이 RN에서 크래시) 타입으로 못 막는다.
- 되돌리기: **하**. string에서 node로 넓히는 건 추가적.

### A-5. 숫자 키 [C-14 · AC-15]

**택: 토큰 값을 받는 prop을 두지 않는다. 간격은 `className` 전용.**

- Stack은 `direction` / `align` / `justify` / `wrap`만 갖는다. `gap`·`padding` prop 없음. Box도 동일.
- AC-15 재정의: 계약 전체에 `number` 타입 prop이 없고, 색상 의도를 받는 prop(`variant`, `tone`)은 enum 키만 받는다. 예시는 `tone="#333"`이 타입 에러. mapped type 테스트 1개로 검증.
- 탈락: 문자열 리터럴 키 `gap="4"` — 채널이 2개가 되고 생성 맵이 필요하며 나중에 제거하면 소비자 파괴. 숫자 키 유지 — `padding={16}`이 64px인 혼동은 C-14가 막으려던 것.
- 되돌리기: **하**. prop 추가는 추가적.

---

## B. 사람 결정 7건

| # | 항목 | 상태 | 결정 내용 |
|---|---|---|---|
| B-1 | 전역 `variant` 집합, Text 축 | 확정 | `variant = primary \| secondary \| ghost \| danger` 4개 고정. Text는 `tone` 축 신설, 전역 어휘. 값은 아래 제안 |
| B-2 | spacing 열거 범위 | 확정 | 희소. 4px 배수 `1,2,3,4,6,8,12,16,20,24`. 좁게 시작, 밀집은 나중에 추가 |
| B-3 | 브랜드 | 확정 | v1 `base`(중립 기본) + `bakery`. AC-6a 쌍은 이 둘. 공개 계약은 브랜드명이 아니라 경로 규칙 |
| B-4 | RN v1에 Text 포함 | 확정 | 포함. AC-7 웹 11개 → 12개, AC-20 RN 4개 → 5개 |
| B-5 | 다크모드 전략 | 확정 | hybrid. 루트 클래스가 있으면 클래스 우선, 없으면 OS 추종 |
| B-6 | Input 교차 어휘, Form 범위 | 확정 | `kind = "text" \| "password" \| "email" \| "number"` 열거형 1개로 은닉. Form v1은 레이아웃 + label + error 표시. submit 개념 제외, react-hook-form 미도입 |
| B-7 | npm 스코프, 경로 | 경로 확정 / 스코프는 2026-09-05 `@eeennsu` 확정 | 소비자 공개 경로 `@eeennsu/web/themes/<brand>.css`, `@eeennsu/native/themes/<brand>.css`. 래퍼가 `@eeennsu/tokens/themes/<brand>.css`를 import. 토큰 직접 경로는 폐기. 스코프 이름은 미확인, `@eeennsu` 변수 유지 |
| B-8 | Text `size` | 확정 (3차) | 전역 `size = sm \| md \| lg \| xl \| 2xl`. Button·Input 등은 `sm \| md \| lg` 부분집합. Text의 `size`는 글자 크기·행간·무게를 묶어 바꾸는 타이포 스텝이며 계약 타입에 명시 |
| B-9 | Button 누름 이벤트 | 확정 (3차) | `onPress`. 웹 어댑터가 `onClick`으로 매핑 |
| B-10 | Form 렌더 | 확정 (3차) | `<form>`을 렌더하고 `onSubmit`은 항상 `preventDefault`. `div` + `role="form"` 불채택 — 브라우저 비밀번호 자동완성이 `<form>` 기준이고 AC-16 검증 화면이 로그인이다. v1에서 Enter는 아무 동작도 하지 않는다 |
| B-11 | 오버레이 제어 API | 확정 (4차) | C-12 두 갈래. 값 입력은 `value` / `defaultValue` / `onValueChange`, 오버레이(Dialog / Drawer / Tooltip)는 `open` / `defaultOpen` / `onOpenChange`. 같은 3종 패턴이라 규칙 취지 유지. Base UI 이름과 일치 |

### B-1. `tone` 값 제안

`tone = default | muted | danger`, 기본값 `default`.

- 강조 위계 3단이며 semantic 전경색 토큰과 1:1로 대응한다(`fg.default`, `fg.muted`, `fg.danger`). 토큰과 축이 같은 크기라 매핑 표가 필요 없다.
- `danger`는 `variant`와 이름을 공유한다. 의도적이다. 두 축의 `danger`는 같은 semantic 색(`color.danger`)을 가리키는 같은 개념이다. C-8이 금지하는 건 "같은 개념에 다른 이름"이고, 여기는 같은 개념에 같은 이름이다.
- `subtle`(placeholder 급), `success`, `brand`(강조 링크 텍스트)는 넣지 않았다. 필요해지면 추가는 추가적(소비자 무영향)이다. 지금 넣으면 semantic 토큰이 그만큼 늘고 bakery 브랜드에서 값을 전부 정해야 한다.
- 비활성 텍스트는 `tone`이 아니라 상태(`disabled`)다. 축을 섞지 않는다.

### B-2. spacing 상세

- 키 10개: `1,2,3,4,6,8,12,16,20,24` = `4,8,12,16,24,32,48,64,80,96px`.
- 빌드가 `--spacing-0: 0`을 추가한다. `p-0`, `gap-0`을 위해 필요하며 스케일 단계가 아니라 영점이다. `px`(1px)는 Tailwind 정적 유틸리티라 그대로 남는다.
- 96px 초과 고정 폭·높이(`w-64` 등)는 존재하지 않는다. `w-full`, `max-w-*`(container 네임스페이스, 리셋 대상 아님), 임의값 `w-[320px]`로 쓴다. G에 알려진 동작으로 명시.

### B-3. 브랜드 상세

- `base`: 중립 기본. AC-16 / AC-17 / AC-19 / AC-23 검증 프로젝트가 import하는 브랜드.
- `bakery`: AC-6a 비교 대상. `base`와 semantic 색 토큰 값이 실제로 달라야 diff 검증이 의미를 가진다.
- 빌드 산출물: `tokens/themes/{base,bakery}.css`, `web/themes/{base,bakery}.css`, `native/themes/{base,bakery}.css`. 래퍼 4개는 빌드가 생성한다.
- 브랜드 추가는 파일 추가라 소비자 무영향. 브랜드 이름 변경은 소비자 import 한 줄 수정.

### B-5. hybrid 다크모드 상세

웹 래퍼(`@eeennsu/web/themes/<brand>.css`):

```css
@custom-variant dark {
  &:where(.dark, .dark *) { @slot; }
  @media (prefers-color-scheme: dark) {
    &:where(:not(.light, .light *)) { @slot; }
  }
}
```

토큰 파일(`tokens/themes/<brand>.css`)의 semantic 다크 오버라이드도 같은 두 셀렉터로 낸다:

```css
.dark { /* semantic 다크 값 */ }
@media (prefers-color-scheme: dark) { :root:not(.light) { /* 동일 값 */ } }
```

- next-themes는 해석된 테마를 `light` / `dark` 클래스로 루트에 쓴다. 클래스가 있으면 클래스가 이기고, 없으면(Vite 검증 프로젝트, 코드 0줄) OS를 따른다.
- RN은 NativeWind `dark:`가 기본으로 시스템 색 구성표를 따르고 수동 전환 API로 덮을 수 있으므로 본질적으로 hybrid다. 토큰 파일의 `.dark` / `:root:not(.light)` 셀렉터를 NativeWind v5가 무시하거나 지원하는지 확인 필요(C-19 확인 항목 4번).
- class 단독 대비 hybrid는 상위집합이라 되돌리기는 하.

### B-6. Input `kind` · Form 상세

Input 어댑터 매핑:

| `kind` | 웹 | RN |
|---|---|---|
| `text` | `type="text"` | 기본 |
| `password` | `type="password"` | `secureTextEntry` |
| `email` | `type="email"` | `keyboardType="email-address"`, `autoCapitalize="none"` |
| `number` | `type="text"` + `inputMode="numeric"` (스피너 없는 쪽) | `keyboardType="numeric"` |

- `value`는 `kind`와 무관하게 항상 `string`이다(C-12). RN `TextInput`이 문자열만 다루므로 `number`도 문자열이다.
- `kind`는 열거형이라 C-11 예외가 필요 없다. C-11 예외는 `disabled` / `loading` 같은 기능 불리언에만 남는다.
- Form v1 계약: `children`(웹 전용이라 `ReactNode` 허용), `className`. 레이아웃 + `Label` 연결 + 오류 텍스트 표시(`Text tone="danger"` 또는 Base UI `Field.Error`). `onSubmit` 없음. Base UI `Form` / `Field`를 내부 기반으로 쓰되 submit 경로는 열지 않는다.
- 웹 Form이 `<form>` 엘리먼트를 렌더하면 Enter 키가 네이티브 submit을 일으켜 페이지가 새로고침된다. 구현은 `<form onSubmit={preventDefault}>` 또는 `<div role="form">`을 택해야 하며, Enter 키 제출은 v1에서 동작하지 않는다(G).
- 로그인 화면(AC-16)의 제출은 `Button`의 `onPress`(B-9)에서 소비자 코드가 처리한다. Button에 `type="submit"` 개념은 없다.
- react-hook-form 미도입. RN Form이 v2라 계약 대칭을 v1에서 검증할 수 없기 때문이다.
- 자동완성 기본값(어댑터 세부, 계약 변경 없음): B-10이 `<form>`을 택한 이유가 자동완성이므로 `kind`에서 힌트를 파생한다. 웹 `password` → `autoComplete="current-password"`, `email` → `autoComplete="email"`. RN `password` → `autoComplete="password"` + `textContentType="password"`, `email` → `autoComplete="email"` + `textContentType="emailAddress"`. 가입 화면의 `new-password`는 `kind`로 구분할 수 없어 v1 알려진 동작(G-8).

### B-8. Text `size` 상세

- 전역 `Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl'`. 계약 타입은 두 별칭을 둔다.
  - `TypographyStep = Size` — JSDoc에 "글자 크기·행간·무게를 함께 바꾸는 타이포 스텝. Text 전용 의미" 명시. Text의 `size` 타입.
  - `ControlSize = Extract<Size, 'sm' | 'md' | 'lg'>` — Button·Input·Textarea·Badge·ButtonGroup 등 컨트롤의 `size` 타입.
  - 둘 다 `Size`에서 파생되므로 C-8 "같은 집합에서 고른다"가 타입으로 성립한다. A-1 맵 테스트가 컴포넌트별 부분집합을 그대로 검사한다.
- 토큰: 스텝은 component 계층 타이포 토큰이다. `text.<step> = { fontSize, lineHeight, fontWeight }`. 웹 빌드는 Tailwind v4의 복합 폰트 크기 변수로 낸다 — `--text-xl`, `--text-xl--line-height`, `--text-xl--font-weight`. 그러면 `text-xl` 유틸리티 하나가 세 속성을 함께 적용한다. 소비자 `className="text-lg"`도 같은 스텝 의미를 갖는다.
- Tailwind 기본 `text-base`는 DS에서 `text-md`다. `--text-*: initial` 리셋 후 `base`는 없다(G-1).
- RN: NativeWind v5가 `--text-*--line-height` / `--font-weight` 복합 변수를 지원하는지 확인 항목 5번. 미지원이면 RN Text 어댑터가 JS 토큰 객체에서 세 값을 읽어 `style`로 넣는다(C-19의 "NativeWind로 표현 불가한 경우" 예외).
- Text에 독립 `weight` prop은 없다. 무게는 스텝이 정한다(G-6).

### B-9. `onPress` 상세

- Button 계약: `onPress?: () => void`. 이벤트 인자 없음. 웹 `MouseEvent`와 RN `GestureResponderEvent`가 달라 계약에 넣을 수 없다. 나중에 교차 인자를 추가하는 변경은 소비자 콜백이 인자를 무시해도 할당 가능하므로 추가적이다.
- 웹 어댑터: Base UI Button `onClick` ← `onPress`. Enter/Space 키 활성화는 `<button>` 네이티브 동작이라 별도 처리 없음.
- 웹 어댑터는 `<button type="button">`을 항상 명시한다. 기본값 `submit`이면 Form 안의 Button이 Enter 키 암묵적 제출의 대상이 되어 `onPress`가 실행된다. B-10의 "Enter는 아무 동작도 하지 않는다"를 지키려면 필수다.
- C-12에 편입: 제어 API는 `value` / `defaultValue` / `onValueChange`, 누름은 `onPress`. `onClick`·`onChange`는 공개 prop에 없다. `onChange`를 피한 것과 같은 논리로 RN 이름을 계약에 채택한다.

### B-10. Form `<form>` 상세

- 렌더: `<form onSubmit={e => e.preventDefault()}>`. 계약에 `onSubmit` prop은 없다(B-6).
- 이유: 브라우저 비밀번호 자동완성·저장 제안은 `<form>` 안의 `type="password"`를 기준으로 동작한다. AC-16 검증 화면이 로그인이라 `div` + `role="form"`은 검증 자체를 약화시킨다.
- Enter 키: 로그인 폼은 텍스트 필드가 2개이고 submit 버튼이 없으므로 HTML 암묵적 제출 규칙상 Enter가 제출을 일으키지 않는다. 필드가 1개인 폼은 암묵적 제출이 일어나지만 `preventDefault`로 막힌다. 어느 경우든 v1에서 Enter는 아무 동작도 하지 않는다(G-5).
- `"use client"` 대상이다(C-4). submit 핸들러가 있는 인터랙티브 컴포넌트다.

### B-11. 오버레이 제어 API 상세

- Dialog / Drawer / Tooltip 계약: `open?: boolean`, `defaultOpen?: boolean`, `onOpenChange?: (open: boolean) => void`. 인자는 boolean 하나라 플랫폼 이벤트 타입 문제가 없다(B-9와 같은 조건).
- 제어·비제어 양쪽 지원은 `value` 3종과 같은 규칙. `open`이 있으면 제어, 없으면 `defaultOpen`으로 시작.
- 트리거: v1은 별도 `trigger` prop 없이 제어 API만 둔다. 소비자가 `Button onPress`로 `open`을 토글한다. 표면이 가장 작고, 나중에 `trigger` 편의 prop을 추가하는 건 추가적이다. Tooltip은 앵커가 본질이라 `children`으로 앵커를 받는다. 이 부분의 세부(앵커 타입, Base UI `Trigger`의 `render` 내부 사용)는 계획 단계.
- 계약은 tokens에 놓이고 v1 구현자는 web뿐. RN v2가 같은 계약을 구현하면 A-1 맵 테스트가 그대로 검사한다.
- 되돌리기: 하. 이름 변경은 소비자 파괴지만 Base UI 이름과 같아 바꿀 이유가 생기기 어렵다.

---

## C. 조합 검증 (A 5건 + B 7건, 2차)

**충돌 없음.** 1차의 "B-7 경로 해석" 확인은 래퍼로 확정되어 닫혔다. 아래는 12건 사이의 상호작용을 전부 훑은 결과다. 결론이 "일치"인 것도 남겨 두어 나중에 같은 검토를 반복하지 않게 한다.

경로·산출물:
- **B-7 + A-2 + A-3**: 소비자 한 줄 = web 래퍼. 래퍼 안에서 `@source "../dist"`가 web 패키지 자신의 dist를 가리키므로 pnpm realpath 문제가 없다. 래퍼가 `@import "tailwindcss"`를 먼저 포함하면 리셋 순서 실수도 원천 차단된다(pnpm peer 해석 확인은 남음).
- **B-3 + B-7 + A-2**: 브랜드당 토큰 파일 1개 + 래퍼 2개. 경로 규칙이 공개 계약이고 브랜드명은 파일명일 뿐이라 브랜드 추가는 소비자 무영향.
- **B-5 + B-3**: 두 브랜드 파일 모두 다크 2셀렉터 블록을 갖는다. AC-19 검증은 `base`로.
- **B-5 + A-2 + C-19**: NativeWind v5 확인 항목 4건(`@theme inline`, `.dark` 루트, `@source`, `:root:not(.light)`).

어휘·타입:
- **B-1 + C-8**: 전역 축이 `variant` / `size` / `tone` 3개가 된다. C-8에 "다른 개념에 같은 이름을 강요하지 않는다"를 추가하고 `tone`을 전역 어휘 목록에 올린다. AC-9를 `variant`·`tone` 양쪽 타입 강제로 확장.
- **B-1 + A-4**: Text 계약 = `children: string`, `tone?`, `size?`, `className?`. 평면 객체라 A-1 맵 테스트에 그대로 들어간다.
- **B-1 + A-5**: `tone`이 enum이므로 AC-15의 색상 절반에 대상이 생겼다. 예시 `tone="#333"`.
- **B-1 + A-3**: `tone` 클래스(`text-fg-muted` 등)는 twMerge 색 그룹, Text `size` 클래스는 t-shirt 크기 그룹. 크기 키가 t-shirt 이름이면 모호성 없음.
- **B-1 variant 4개 + AC-9**: 각 컴포넌트는 4개의 부분집합만 쓴다. Badge가 `ghost`를 안 쓰면 빼되 이름은 바꾸지 않는다(C-8 원문).
- **B-6 + A-1**: `kind`가 계약에 있고 양쪽이 구현한다. 맵 테스트 통과 조건 동일. 플랫폼 전용 prop 0개 원칙 유지.
- **B-6 + C-11**: `kind`는 열거형이라 예외 불필요. C-11 예외 문구는 `disabled` / `loading`만.
- **B-6 + C-12 + AC-13**: Input은 `value: string` / `defaultValue` / `onValueChange`. Form은 값이 없어 제어 컴포넌트가 아니다. AC-13 대상 밖.
- **B-6 + A-4 + B-4**: Form은 `webComponents`에만 있다. `children: ReactNode`는 웹 전용이라 RN 런타임 갈림 문제가 없다. 계약 정의는 tokens에 두되 구현자는 web 하나.
- **B-6 + AC-16**: 로그인 화면 = `Form` > (`Label` + `Input kind="email"`), (`Label` + `Input kind="password"`), `Text tone="danger"`(오류), `Button variant="primary"`. 제출은 Button 누름 이벤트. 전부 DS 컴포넌트로 성립.

spacing:
- **B-2 + A-2**: `--spacing-*: initial` 후 10개 + `0`. probe 테스트 대상: `mt-5`, `mt-17`, `w-64`, `bg-red-500`이 출력 없음.
- **B-2 + A-3**: twMerge spacing 검증자를 DS 키 목록으로. 미등록 키가 DS 기본 여백을 밀어내지 않는다(A-3 본문).
- **B-2 + A-5**: 간격 어휘는 `@theme` 한 곳. prop이 없으므로 "prop은 유한, className은 무한" 불일치 자체가 없다.
- **B-2 + AC-6b + D**: no-op 수용. 스펙에 알려진 동작으로 명시(G).

Text·RN:
- **B-4 + A-1**: `nativeComponents` = Button, Input, Card, Stack, Text. AC-21 "이 5개".
- **B-4 + A-4 + C-7b**: Text가 폰트 스케일 토큰(`text-sm|md|lg`)을 처음으로 소비한다. 폰트 로딩은 여전히 소비 프로젝트 책임.
- **B-4 + AC-23**: RN 화면에 제목·오류 텍스트를 DS Text로 쓸 수 있어 "DS 컴포넌트만으로"가 성립.

전체:
- **npm 스코프 변수**: 12건 어디에도 스코프 이름이 박히지 않는다. 치환은 문자열 교체.
- **되돌리기 등급**: 상 없음. 중은 A-2(브랜드 파일 경로·다크 전략, 소비자 import 한 줄)뿐.

### 3차 추가 검증 (B-8 · B-9 · B-10 × 기존 12건)

**충돌 없음.** B-9와 B-10 사이에 하나의 구현 조건이 생겼고(Button `type="button"`), B-8이 G-1의 범위를 넓혔다.

B-8 Text `size`:
- **B-8 + B-1 + A-4**: Text 계약 = `children: string`, `tone?: Tone`, `size?: TypographyStep`, `className?`. 평면 객체. A-1 맵 테스트 그대로.
- **B-8 + C-8 + AC-10**: `Size` 5개가 전역, 컨트롤은 `ControlSize` 부분집합. 부분집합이 타입으로 고정되므로 "안 쓰는 값은 빼되 이름은 바꾸지 않는다"가 검증 가능해진다.
- **B-8 + A-2**: `--text-*: initial` 후 5스텝을 복합 변수로 정의. `text-base`는 무효(no-op) — G-1을 spacing에서 리셋 네임스페이스 전체로 일반화.
- **B-8 + A-3**: `sm|md|lg|xl|2xl`는 전부 t-shirt 패턴이라 twMerge 기본 `isTshirtSize`에 잡힌다. `tone`의 색 클래스와 그룹이 갈린다. 생성 설정에 text 키를 넣는 건 안전장치.
- **B-8 + B-2**: 네임스페이스가 다르다(`--text-*` vs `--spacing-*`). 무관.
- **B-8 + C-7b**: DS가 소유한다고 한 "크기·행간·무게 스케일"이 스텝 하나로 묶인 형태다. 폰트 로딩은 여전히 소비 프로젝트.
- **B-8 + C-19**: NativeWind 확인 항목이 5건이 된다(복합 폰트 변수 추가).
- **B-8 + A-5**: `size`는 enum이라 AC-15와 무관.

B-9 `onPress`:
- **B-9 + A-1**: Button 계약에 `onPress?: () => void`. 양쪽 동일 시그니처. 인자 없음이 교차 계약의 조건.
- **B-9 + C-12 + AC-13**: 제어 네이밍 규칙에 누름 이벤트를 편입. `onClick` 미노출을 A-1 맵 테스트가 검사.
- **B-9 + B-10**: 웹 Button은 `type="button"` 고정. 안 하면 `<form>` 안에서 Enter 암묵적 제출이 첫 Button의 `onPress`를 실행해 B-10의 "Enter는 아무 동작도 하지 않는다"가 깨진다. 구현 조건으로 C-21에 명시.
- **B-9 + C-13**: `label` 규칙 무관.
- **B-9 + AC-16**: 로그인 제출은 `onPress`. Enter 없음.

B-10 Form `<form>`:
- **B-10 + B-6**: 계약 불변(`children`, `className`). `onSubmit`은 구현 내부.
- **B-10 + AC-16 + B-6 autocomplete**: `<form>` + `kind` 파생 힌트로 로그인 자동완성이 동작한다. `div`였다면 AC-16이 "렌더된다"만 검증하고 자동완성은 놓쳤을 것.
- **B-10 + C-4**: Form이 `"use client"` 대상에 추가된다.
- **B-10 + B-4**: Form은 여전히 웹 전용. RN 무관.
- **B-10 + A-4**: Input `label`이 `aria-label`이어도 자동완성은 `type`·`autocomplete` 기준이라 영향 없음.
- **B-10 + G-5**: Enter 무동작 문장 추가.

되돌리기: B-8 하(스텝 값 추가는 추가적, 부분집합 확장도 추가적). B-9 하(인자 추가는 추가적). B-10 하(구현 내부).

### 4차 추가 검증 (B-11 × 기존 15건)

**충돌 없음.**

- **B-11 + C-12 + AC-13**: 규칙이 두 갈래가 된다. 값 입력(Input, Textarea)은 `value` 3종만, 오버레이는 `open` 3종만. `onChange` / `onClick` / `onToggle` 같은 DOM 이름은 어디에도 없다. A-1 맵 테스트가 검사.
- **B-11 + B-9**: 계약의 콜백 이름이 전부 RN 안전 이름(`onPress`, `onValueChange`, `onOpenChange`)이고 인자는 플랫폼 이벤트가 아닌 값 하나다. 일관.
- **B-11 + A-1 + B-4**: 오버레이 3개는 `webComponents`에만 있다. RN v2 편입 시 `nativeComponents`에 추가하면 맵 테스트가 대칭을 검사한다.
- **B-11 + C-10 + AC-12**: `render` / `asChild` 미노출 유지. 트리거 prop이 없으니 다형성 유혹 자체가 없다. Tooltip 앵커는 `children`.
- **B-11 + C-13**: Dialog / Drawer는 인터랙티브라 `label` 필수(`aria-labelledby` 또는 `aria-label`로 매핑). Tooltip은 표시 텍스트가 곧 접근성 설명이라 `label`이 내용 역할. 매핑표는 스펙 C-13에 명시.
- **B-11 + A-4**: 오버레이 본문은 웹 전용이라 `children: ReactNode` 허용. RN v2에서 같은 계약을 쓸 때 A-4의 "RN에서 노드 children" 문제가 재발하므로, v2 착수 시 재검토 항목으로 남긴다.
- **B-11 + B-10**: Dialog 안의 Form도 `<form>` + `preventDefault`. Enter 무동작 동일.

---

## D. AC-6b "열거 외 간격은 lint로 차단" 문구 판단

**추가하지 않는다.** 대신 "열거 외 키는 클래스가 생성되지 않는다(테스트로 검증)"로 쓰고, no-op을 알려진 동작으로 명시한다(G).

근거:
- A-2의 `--spacing-*: initial` 리셋으로 `mt-17` 같은 열거 외 키는 CSS가 생성되지 않는다. 차단은 구조가 이미 한다. lint는 중복 강제다.
- 소비 프로젝트에 lint를 넣으면 소비자 설정이 생겨 C-3 "import 한 줄까지"를 어긴다. 기준 2·4 감점.
- 검증은 probe 파일(`mt-5 mt-17 w-64 bg-red-500`)을 DS 테마로 컴파일해 출력이 비어 있음을 확인하는 테스트로 자동화된다. 기준 5 충족.

v1 수용 사항(사용자 확정): 열거 외 키는 에러가 아니라 조용한 무효다. B-2가 희소 스케일이라 빈도가 낮지 않다. 나중에 버그로 재발견되지 않도록 스펙 AC-6b와 G에 문장으로 남긴다.

운영 사항(AC 아님):
- DS 레포 내부에는 미등록 클래스 lint(`eslint-plugin-better-tailwindcss`의 `no-unregistered-classes` 계열, Tailwind v4 지원 확인 필요)를 켠다. 레포 내부라 C-3과 무관.
- 소비 프로젝트용 lint는 선택 사항으로 문서화한다.
- twMerge 설정을 DS 키 목록으로 생성해 미등록 키가 DS 기본값을 지우지 않게 한다(A-3). no-op의 피해 범위를 "그 클래스 하나"로 가둔다.

`mt-[13px]` 같은 임의값은 어느 방식으로도 막지 못한다. C-14의 의도된 탈출구 문구를 유지한다.

---

## E. AC-19 재작성안

> AC-19. **(R21 재작성)** 다크모드가 AC-16의 import 한 줄 외 추가 설정 없이 hybrid로 동작한다.
> - (a) 루트 엘리먼트에 `.dark` / `.light` 클래스가 없으면 OS `prefers-color-scheme`을 따른다. Vite 검증 프로젝트에서 코드 0줄로 확인.
> - (b) 루트에 `.dark` 또는 `.light` 클래스가 있으면 클래스가 OS 설정보다 우선한다. Next.js 검증 프로젝트에서 next-themes로 확인.
> - (c) RN은 시스템 색 구성표를 따르며 NativeWind의 수동 전환 API로 덮을 수 있다.
> - 검증: 웹은 Playwright `emulateMedia({ colorScheme })` × 루트 클래스 유무 4조합에서 semantic 배경색 computed style을 토큰 값과 비교. RN은 `Appearance` 모킹 2조합. 브랜드는 `base`.

---

## F. 스펙 개정 대상 전체 목록 (2차)

### Constraints

| 번호 | 변경 | 출처 |
|---|---|---|
| C-1 | 패키지명을 `@eeennsu/tokens` `@eeennsu/web` `@eeennsu/native`로. 스코프는 2026-09-05 `@eeennsu`로 확정 | B-7 |
| C-3 | 소비자 import 대상 = `@eeennsu/web/themes/<brand>.css`(웹) / `@eeennsu/native/themes/<brand>.css`(RN). 래퍼가 `tokens/themes/<brand>.css`를 import. R20 미결 2를 `@source`로 종결. 래퍼가 `@import "tailwindcss"` 포함(pnpm peer 확인 조건부) | A-2, A-3, B-7 |
| C-4 | `"use client"` 대상에 Form 추가(submit 핸들러 보유) | B-10 |
| C-4a | 스코프 표기 | B-7 |
| C-5a | 브랜드는 앱당 1개, 빌드타임 파일 선택. v1 `base` + `bakery`. 런타임 전환은 범위 밖 | A-2, B-3 |
| C-6 | 빌드 산출물 명시: `tokens/themes/<brand>.css`(`:root` + 다크 2셀렉터 + `@theme inline` + 리셋 + `--spacing-0`), 플랫폼 래퍼 `web/themes/` `native/themes/`, RN JS 객체, `twMergeConfig`(spacing 키 포함), `Contracts` 타입 맵(`Size` / `TypographyStep` / `ControlSize` / `Tone` / `Variant` 포함)과 플랫폼별 키 목록. 타이포 스텝은 `--text-<step>`, `--text-<step>--line-height`, `--text-<step>--font-weight` 복합 변수로 | A-1, A-2, A-3, B-2, B-3, B-5, B-8 |
| C-7 | primitive는 `:root` 변수로만 존재하고 `@theme`에 넣지 않는다 — 구조 강제 | A-2 |
| C-7a | 간격 키는 `className` 어휘 전용, prop 없음. 열거 `1,2,3,4,6,8,12,16,20,24` + 영점 `0`. 열거 외 키는 무효(G). `size`는 전역 `sm \| md \| lg \| xl \| 2xl`, 컨트롤은 `sm \| md \| lg` 부분집합, Text는 5단 타이포 스텝 | A-5, B-2, B-8 |
| C-7b | 크기·행간·무게 스케일은 Text의 타이포 스텝 하나로 묶여 소비된다. 독립 `weight` prop 없음 | B-8 |
| C-8 | 전역 축 3개(`variant` / `size` / `tone`). `variant = primary \| secondary \| ghost \| danger`, `tone = default \| muted \| danger`(제안), `size = sm \| md \| lg \| xl \| 2xl`. "다른 개념에 같은 이름을 강요하지 않는다" 추가. 부분집합은 `Extract`로 타입 고정 | B-1, B-8 |
| C-11 | 기능 불리언(`disabled`, `loading`) 예외 명시. 교차 어휘는 열거형(`kind`)이라 예외 아님 | A-1, B-6 |
| C-12 | 두 갈래: 값 입력은 `value` / `defaultValue` / `onValueChange`, 오버레이는 `open` / `defaultOpen` / `onOpenChange`. 누름 이벤트는 `onPress`로 고정, `onClick` 미노출. 웹 어댑터가 매핑. Input `value`는 `kind`와 무관하게 `string`. Form은 제어 컴포넌트 아님 | B-6, B-9, B-11 |
| C-13 | "label을 aria-label로 변환"을 "접근성 이름 보장"으로. 매핑표: Button은 label이 가시 텍스트, Input은 aria-label, Dialog / Drawer는 aria-labelledby 또는 aria-label, Tooltip은 label이 표시 내용. Text·Form은 비인터랙티브라 대상 아님 | A-4, B-6, B-11 |
| C-14 | 재작성: 토큰 값을 받는 prop이 없다. 계약 전체에 `number` 타입 prop 없음. 색 의도는 `variant` / `tone` enum | A-5, B-1 |
| C-15 | 병합 규칙 = tailwind-merge(DS 키 목록 설정), 승리 범위 = 같은 그룹·같은 변형. 어휘 봉쇄(기본 팔레트·동적 spacing 리셋) 명시. "유일 채널"이 문자 그대로 성립 | A-2, A-3, A-5, B-2 |
| C-17 | 강제 수단 = export 맵 타입 동등성 테스트. ref는 핸들. 플랫폼 전용 prop 0개, 교차 어휘는 열거형. 콜백은 플랫폼 이벤트 인자 없음(`onPress: () => void`) | A-1, B-6, B-9 |
| C-19 | NativeWind v5 확인 항목 5건(`@theme inline`, `.dark` 루트, `@source`, `:root:not(.light)`, `--text-*--line-height` 복합 변수). 미결 3을 착수 게이트로. 복합 변수 미지원 시 RN Text는 JS 토큰으로 `style` 지정 | A-2, B-5, B-8 |
| C-20 신설 | 다크모드 전략 hybrid(B-5 상세) | B-5 |
| C-21 신설 | Form v1 범위: 레이아웃 + label + error. `<form>` 렌더, `onSubmit` 항상 `preventDefault`, 계약에 `onSubmit` 없음. 웹 Button은 `type="button"` 고정. react-hook-form 없음. RN Form v2 후 대칭 검증 | B-6, B-9, B-10 |

### Acceptance Criteria

| 번호 | 변경 | 출처 |
|---|---|---|
| AC-3 | "같은 파일"을 "같은 `tokens/themes/<brand>.css`를 web·native 래퍼가 import"로 | A-2, B-7 |
| AC-5 | 검증 = 빌드 스냅샷(CSS 변수 + JS 객체). className 전파는 `@theme inline`이 `var()`를 참조하므로 구조 보장 | A-2 |
| AC-6 | "lint로 강제"를 "primitive 클래스 미생성으로 구조 강제 + probe 컴파일 테스트"로 | A-2 |
| AC-6a | `base` vs `bakery` 빌드 결과 diff에서 semantic 색 변수만 다름을 확인 | A-2, B-3 |
| AC-6b | 열거 `1,2,3,4,6,8,12,16,20,24` + `0`. "열거 외 키는 클래스가 생성되지 않는다(probe 테스트). 이는 에러가 아닌 무효이며 v1 알려진 동작이다" 추가. lint 문구 없음. `size`는 "전역 `sm \| md \| lg \| xl \| 2xl`, 컨트롤 `sm \| md \| lg`"로 | A-2, B-2, B-8, D |
| AC-7 | 12개: Button Input Textarea Label Card Badge Tooltip Dialog Drawer Form ButtonGroup **Text** | B-4 |
| AC-8 | Stack/Box API를 `direction` / `align` / `justify` / `wrap`으로. 간격 prop 없음 | A-5 |
| AC-9 | `variant` 4개 집합 + `tone` 집합 양쪽 타입 강제. 검증 = A-1 맵 테스트 | A-1, B-1 |
| AC-10 | 전역 `Size` 5개, 컴포넌트별 부분집합이 타입으로 고정. Text만 5단. 검증 = A-1 맵 테스트 | A-1, B-8 |
| AC-11 | 검증 3계층 명시. 승리 범위 문구 | A-3 |
| AC-11a | `{...rest}` 스프레드 금지 추가 | A-3 |
| AC-13 | 두 갈래로 재작성: 값 입력 컴포넌트는 `value` 3종만, 오버레이는 `open` 3종만. Button·ButtonGroup은 `onPress`만, `onClick` 없음. Form 제외 명시(값 없음) | B-6, B-9, B-11 |
| AC-15 | 재정의: 계약 전체에 `number` prop 없음 + 색 의도 prop은 enum. 예시 `tone="#333"` 타입 에러 | A-5, B-1 |
| AC-16 | import `@eeennsu/web/themes/base.css`. 화면 구성: Form + Label + Input(`kind`) + Text(`tone="danger"`) + Button. 제출은 Button `onPress`. Enter는 무동작(G-5). 비밀번호 자동완성 제안이 뜨는지 확인 항목에 추가 | A-2, B-3, B-4, B-6, B-7, B-9, B-10 |
| AC-17 | AC-16과 동일 경로·브랜드. 다크는 OS 추종으로 확인 | B-3, B-5, B-7 |
| AC-19 | E의 재작성안으로 교체 | B-5 |
| AC-20 | 5개: Button Input Card Stack **Text** | B-4 |
| AC-21 | "이 5개". 검증 = 맵 동등성 테스트. ref 핸들 포함 | A-1, B-4 |
| AC-22 | Button은 label이 가시 텍스트이자 `accessibilityLabel`. Input은 `accessibilityLabel`만 | A-4 |
| AC-23 | `@eeennsu/native/themes/base.css`. Text 사용 | B-3, B-4, B-7 |
| AC-24 | 어휘 봉쇄 전제 명시. 예시 클래스는 열거 안의 키(`mt-6`은 유효) | A-2, B-2 |
| AC-25 | RN 검증 격하 조건(NativeWind 테스트 해석 불가 시 수동) | A-3 |

### 그 외 본문

- 패키지 구조 다이어그램: 스코프 변수, `tokens/themes/<brand>.css`(내부), `web/themes/` `native/themes/`(공개), tokens의 계약 타입 맵·키 목록·twMerge 설정
- Topology: components 13개 → 14개, platform-adapter 핵심 4개 → 5개
- Goal: "핵심 컴포넌트 4개" → 5개
- R20 미결: 1번(병합)·2번(배포 형태) 종결. 3번(Expo SDK 호환)은 C-19 게이트로 유지
- 1본화 가능 표: 왼쪽에 Text 추가
- Ontology: Package 행 스코프 표기, ClassVocabulary에 "봉쇄" 명시, ComponentContract에 `tone` 축과 `kind`, Brand 행에 `base` / `bakery`

---

## G. 스펙에 "알려진 동작"으로 명시할 문장

스펙 Constraints 아래 "알려진 동작(v1)" 소절로 그대로 옮긴다. 나중에 버그로 재발견되지 않게 하는 것이 목적이다.

1. 리셋된 네임스페이스(spacing·color·text·radius·shadow)에서 열거 외 키(`mt-5`, `mt-17`, `text-base`, `bg-red-500`)는 클래스가 생성되지 않는다. 에러가 아니라 무효다. DS 기본값은 twMerge가 DS 키 목록으로 동작하므로 미등록 키에 밀려나지 않는다.
2. 96px을 넘는 고정 폭·높이 유틸리티(`w-64` 등)는 없다. `w-full`, `max-w-*`, 임의값 `w-[320px]`을 쓴다.
3. 임의값 `bg-[#333]`, `mt-[13px]`은 타입·구조 어느 쪽으로도 막지 않는다. 의도된 탈출구다(C-14).
4. 소비자 `className`은 같은 유틸리티 그룹·같은 변형만 덮는다. `hover:bg-*` 같은 상태 변형은 `bg-danger`로 덮이지 않는다. RN에는 hover가 없다.
5. Form v1은 submit을 다루지 않는다. `<form>`을 렌더하되 `onSubmit`은 항상 `preventDefault`이고, 웹 Button은 `type="button"`이다. **v1에서 Enter는 아무 동작도 하지 않는다.** 제출은 Button `onPress`에서 소비자가 처리한다.
6. Text는 문자열만 받는다. 문장 중간 서식(부분 굵게, 인라인 링크)은 v1 범위 밖이다. 무게는 `size` 스텝이 정하며 독립 `weight` prop은 없다.
7. Button은 `label` 문자열만 렌더한다. 아이콘은 `icon` prop, 로딩은 `loading` prop으로만 표현한다.
8. Input의 자동완성 힌트는 `kind`에서 파생된다(`password` → `current-password`). 가입 화면의 `new-password`는 v1에서 구분하지 않는다.

---

## 확인할 것

결정 대기 항목 없음.

1. **npm 스코프 이름.** 2026-09-05 `@eeennsu`로 확정, 문서 전역 치환 완료(계정·조직 소유 확인은 publish 전 T-P1). 참고: `npm org create`는 CLI 명령이 아니며 조직 생성은 npmjs.com/org/create에서 한다.

닫힌 항목: Text 제목 크기 → B-8. Button 누름 이벤트 → B-9. 오버레이 제어 API → B-11.

v2 착수 시 재검토: 오버레이 `children: ReactNode`가 RN에서도 성립하는지(A-4 원칙과 충돌 가능).

기술 확인(결정 아님, 착수 전 게이트):
- NativeWind v5: `@theme inline`, `.dark` 루트 셀렉터, `@source`, `:root:not(.light)`, `--text-*--line-height` / `--font-weight` 복합 변수 5건
- R20 미결 3: `spot` Expo SDK와 NativeWind v5 preview 요구 사양
- pnpm: web 래퍼의 `@import "tailwindcss"`가 peer로 해석되는지
