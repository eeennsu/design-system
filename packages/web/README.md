# @eeennsu/web

React 19 + Tailwind v4 용 디자인 시스템 컴포넌트다. 토큰과 클래스 어휘를 `@eeennsu/native` 와 공유하고, 컴포넌트 구현은 플랫폼별로 따로 둔다.

## 설치

```sh
pnpm add @eeennsu/web
```

peer 의존성(`react` · `react-dom` · `tailwindcss`)의 범위는 설치된 `package.json` 의 `peerDependencies` 가 정한다. 소비 프로젝트는 Tailwind v4 를 갖춰야 한다.

전역 CSS 에 한 줄을 넣는다. `tailwind.config` 나 PostCSS 설정은 고치지 않는다.

```css
@import "@eeennsu/web/themes/base.css";
```

브랜드는 앱당 하나이고 import 하는 `themes/<brand>.css` 로 고른다. 기본은 `base` 다. 앱 색은 아래 C-5b 재선언으로 정하고, `themes/` 폴더의 `bakery` 는 DS 가 브랜드 교체(AC-6a)를 검증하는 프리셋이다.

## 소비 규칙

이 패키지로 화면을 만들 때 지키는 규칙이다. 괄호의 `C-n` 은 DS 레포 스펙의 조항 번호다.

### 앱이 바꿀 수 있는 것

앱마다 갈리는 축은 색(메인 색과 표면 관계), 모서리, 간격 리듬, 화면 구조 넷이다.

전역 CSS 에서 DS import **다음 줄**, `@layer` **밖**에 변수를 재선언한다(C-5b · C-5c). 재선언할 수 있는 변수는 세 묶음이다. 이 목록은 계약이고 design-flow 가 읽는 자리라 어휘 목록을 옮겨 적지 않는다는 원칙의 예외로 적는다.

- 메인 색 다섯: `--bg-brand` · `--bg-brand-hover` · `--fg-on-brand` · `--fg-brand` · `--bg-brand-subtle`
- 표면 관계 여섯: `--bg-canvas` · `--bg-surface` · `--bg-surface-muted` · `--bg-surface-hover` · `--border-default` · `--border-surface`
- 모서리 넷: `--radius-sm` · `--radius-md` · `--radius-lg` · `--radius-xl`

나머지 semantic 색도 재선언 대상이다(C-5b).

**메인 색.** 다섯을 짝으로 덮는다.

- `--bg-brand`, `--bg-brand-hover`: 채움 색
- `--fg-on-brand`: 채움 위 글자
- `--fg-brand`: 표면 위에 쓰는 브랜드 색 글자
- `--bg-brand-subtle`: 옅은 브랜드 바탕

웹은 **3블록(라이트 `:root`, 다크 둘)을 모두** 재선언한다. 하나라도 빠지면 OS 라이트·다크와 루트 클래스 유무로 나뉘는 4조합 중 일부만 바뀐다(알려진 동작 12).

```css
@import "@eeennsu/web/themes/base.css";

:root {
  --bg-brand: oklch(…);
  --bg-brand-hover: oklch(…);
  --fg-on-brand: oklch(…);
  --fg-brand: oklch(…);
  --bg-brand-subtle: oklch(…);
}

.dark {
  /* 같은 다섯 변수, 다크 값 */
}

@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    /* 같은 다섯 변수, 같은 다크 값 */
  }
}
```

- 공개 계약은 semantic 변수 **이름**이다. 이름 변경·삭제는 파괴적 변경(major)이다.
- 짝 대비: `--bg-brand` 를 덮으면 그 위 글자 `--fg-on-brand` 도 함께 본다(`--bg-danger` 와 `--fg-on-danger` 도 같다). DS 는 자기 브랜드의 짝만 4.5:1 을 보장하므로, 앱 색의 짝 대비는 앱이 맞춘다. base 의 on-brand 는 라이트·다크 모두 흰색이다. 채움을 밝게 바꿔 흰 글자가 4.5:1 에 못 미치면 on-brand 를 어두운 값으로 다시 정한다(C-5b R26).
- 채움과 글자 색은 별개 값이다. `--bg-danger` 만 덮으면 글자 빨강(`tone="danger"`)은 따라가지 않는다(`--fg-danger`, C-5b R26).
- 브랜드 색 **글자**에는 `text-fg-brand` 를 쓴다. `text-brand` 는 채움 색이라 다크 surface 위에서 대비가 모자란다(알려진 동작 27).

**표면 관계.** 여섯 변수는 색이라 메인 색과 같은 3블록 규칙을 따른다. 바꿀 때는 짝을 맞춘다.

- `--bg-canvas` 와 `--bg-surface` 를 같은 값으로 두면 Card 경계가 사라지므로 `--border-surface` 에 값을 준다(`className="border border-border"` 로도 막을 수 있다).
- `--bg-surface-muted` 는 canvas · surface 와 구분되게 둔다. 같게 두면 입력 칸 채움과 CodeBlock 바탕이 보이지 않는다(알려진 동작 24 · 25).

**모서리.** `--radius-sm` · `md` · `lg` · `xl` 네 개를 `:root` 한 블록에 쓴다. 스킴과 무관하므로 다크 블록에는 쓰지 않는다. Badge · Chip 은 `rounded-xl` 이라 `--radius-xl` 을 줄이면 Card 와 함께 각이 진다. `--radius-full` 은 계약 밖이다.

```css
:root {
  --radius-md: 2px; /* 예시 값 */
}
```

**간격 리듬.** 간격·글자 스케일은 전 앱이 공유한다. 앱이 정하는 것은 그 열거 안에서 어떤 단계를 쓰는가다(C-7a, 알려진 동작 14). 간격은 `className`(`p-4`, `gap-6`, `mt-2` 등)으로만 주고, `padding={16}` 같은 prop 은 없다(C-14). 허용 키는 설치된 토큰 CSS 의 `--spacing-*` 가 정한다. 그 밖의 키(`mt-5`, `mt-17`)는 에러가 아니라 클래스가 생성되지 않는 무효다(알려진 동작 1).

**화면 구조.** 어떤 컴포넌트를 어떤 순서와 배치로 놓는지는 앱이 정한다. 배치의 1순위 수단은 `Stack` · `Box` 이지만 강제는 아니고 `className` 의 레이아웃 유틸리티도 쓴다(C-15). `Stack` 의 배치 prop 은 `direction` · `align` · `justify` · `wrap` 뿐이고, `Box` 는 `children` 과 `className` 만 받는다. 둘 다 `gap` · `padding` prop 은 없다.

### 바꾸지 않는 것

- **컴포넌트 소스와 내부 형태.** 소비 프로젝트는 컴포넌트 소스를 고치지 않는다(C-2). Button 높이·패딩 같은 컴포넌트 내부 형태를 앱 단위로 바꾸는 통로는 없다. 바꿀 수 있는 것은 위 "표면 관계"와 "모서리"의 변수뿐이다. 앱 전체를 바꾸려면 호출 지점마다 `className` 임의값을 반복해야 하고 빠뜨린 곳을 잡는 테스트도 없다(알려진 동작 14).
- **컴포넌트 치수.** Button 높이·패딩 같은 치수도 앱 단위로 바꾸지 않는다.
- **폰트 패밀리.** 앱 단위로 바꾸지 않는다. 패밀리 이름과 크기·줄 높이·무게 스케일은 DS 가 갖는다. 폰트 파일은 동봉하지 않으므로 로딩은 소비 프로젝트가 한다(C-7b, 아래 "폰트 로딩").
- **`--radius-full`.** 원(스피너, 아이콘 바탕)의 기하라서 덮으면 원이 네모가 된다. 덮으면 동작하지만 계약 밖이다.
- **`@theme` 확장과 새 토큰.** `@theme { --color-accent: … }` 로 새 클래스를 만들지 않는다. 지원하지 않으며, 그 클래스는 DS 어휘가 아니라 병합 키 목록에도 없다(Non-Goals). 간격·타이포·shadow 변수는 재선언 대상이 아니다. primitive 변수(`--ds-*`)는 덮으면 동작하지만 계약 밖이라 이름 안정성이 없다(알려진 동작 13).
- **스케일 밖 임의값.** `bg-[#333]`, `mt-[13px]` 은 타입도 구조도 막지 못하는 **의도된 탈출구**일 뿐 기본 수단이 아니다(C-14 · C-15, 알려진 동작 3). 간격 키는 `96`(384px)이 상한이라 그보다 큰 고정 폭·높이(`w-100` 등)는 없으므로 `w-full`, `max-w-*`, 임의값을 쓴다(알려진 동작 2).

컴포넌트 하나만 다르게 하려면 `className` 을 쓴다. `className` 이 유일한 커스텀 채널이고 `style` 은 열려 있지 않다. DS 기본 스타일과 병합되며 충돌하면 앱이 이긴다. 단 같은 유틸리티 그룹, 같은 변형만 덮는다. `hover:bg-*` 는 `bg-danger` 로 덮이지 않는다(C-15, 알려진 동작 4). 색 의도를 받는 prop(`variant` · `tone`)은 열거값만 받는다(C-14).

### 폰트 로딩

DS 는 패밀리 이름만 갖고 파일을 싣지 않는다. 소비 앱이 글꼴을 로딩한다.

- Pretendard 400 · 600 · 700. `--font-sans` 는 `"Pretendard Variable"` 과 `Pretendard` 두 이름을 차례로 요청하므로 로딩한 글꼴의 `font-family` 가 둘 중 하나여야 한다. 로딩 방법은 npm `pretendard` 패키지의 CSS 를 전역으로 import 하거나 Next 의 `next/font/local` 로 파일을 싣는 식이다. 어느 쪽이든 DS 가 이 경로를 확인한 것은 아니며, 이름 규칙은 구현 노트 N-18 에 있다.
- `font-mono` 를 쓰면(CodeBlock · Prose 의 코드 등) JetBrains Mono. 라이선스는 SIL OFL 1.1 이고 npm 의 `@fontsource/jetbrains-mono`(400 · 600 · 700 css 를 import)나 가변 글꼴 `@fontsource-variable/jetbrains-mono` 로 받는다(구현 노트 F-32). 패밀리 이름은 `JetBrains Mono` 다.
- 로딩됐는지는 `await document.fonts.ready` 뒤 그 패밀리의 `FontFace` 가 `status === "loaded"` 인지로 확인한다. 예: `[...document.fonts].some(f => f.family.replace(/"/g, "") === "JetBrains Mono" && f.status === "loaded")`. `document.fonts.check()` 는 목록에 없는 글꼴에도 `true` 를 돌려주므로 증거가 되지 않는다. 로딩하지 않으면 조용히 기본 글꼴로 떨어진다.
- 무게 유틸리티는 `font-normal` 400 · `font-semibold` 600 · `font-bold` 700 이다. `font-medium` 은 없다.

### 0.6.0 에서 달라진 것

- tone 이 일곱이 됐다: brand · success · warning · info 가 늘었다. 글자 스텝에 `3xl` · `4xl`, 간격 키에 32 · 40 · 48 · 64 · 80 · 96 이 늘었다. `Record<Tone, …>` 나 `Record<TypographyStep, …>` 처럼 전수 맵을 가진 앱은 새 키를 더해야 타입이 맞는다.
- Collapsible 의 기본이 `variant="ghost"` 이고 가로 패딩이 없다. 이전 기본에 맞추려고 `-mx-3` 을 붙였다면 지운다. 기본 트리거 글자색이 `text-fg` 에서 `text-fg-muted` 로 바뀌었고 hover 채움과 모서리가 없어졌다(hover 때 `text-fg`).
- Card 에 1px 테두리(`border-surface`)가 생겼다. 안쪽 폭이 2px 줄어든다.
- 0.5.0 에서는 없는 클래스라 조용히 무효였던 `font-bold` · `w-64` · `text-3xl` 같은 것이 이제 적용된다. 그 클래스를 이미 붙여 둔 곳은 화면이 바뀐다.
- Callout 의 뜻은 글로 전한다. 색만으로 구분하지 않는다.
- Link 는 문서 이동(`href`)이다. 문단 속 링크는 Prose 의 `a` 다.

### 다크 방식

웹은 hybrid 다(C-20). 루트 엘리먼트에 `.dark` 또는 `.light` 클래스가 있으면 클래스가 OS 설정보다 우선하고, 없으면 `prefers-color-scheme` 을 따른다. next-themes 는 `attribute="class"` 로 두면 해석된 테마를 `light` · `dark` 클래스로 루트에 써서 맞물린다. 기본값은 `data-theme` 속성이라 클래스를 쓰지 않으므로 DS 색에 닿지 않는다. 클래스 코드를 한 줄도 안 쓰면 OS 를 따른다. 래퍼가 `@custom-variant dark` 를 선언하므로 `dark:` 변형도 같은 규칙을 따른다. import 한 줄 밖에 DS 쪽 추가 설정은 없다(AC-19).

### 어휘 위치

어휘 목록은 이 문서에 옮겨 적지 않는다. 옮겨 적은 목록은 버전이 오르면 어긋나므로 설치된 버전의 파일이 기준이다.

- 색·간격·글자 스텝·radius·shadow: `themes/<brand>.css` 가 import 하는 `@eeennsu/tokens/themes/<brand>.css`. `@theme` 블록이 스케일을, `@theme inline` 블록이 semantic 색 매핑을 갖고, `:root` 에 semantic 변수가 있다. 이 패키지의 `themes/<brand>.css` 는 Tailwind·토큰 import, 다크 variant, `@source` 선언뿐이다.
- 컴포넌트와 prop 타입: `dist/index.d.ts` 가 내보내는 것이 공개 컴포넌트이고, 컴포넌트별 타입은 `dist/<컴포넌트>.d.ts` 에 있다. 공용 prop 계약과 `IconName` 은 `@eeennsu/tokens` 의 `dist/contracts.d.ts` 에 있다. `StepItem` · `TabItem` · `TableColumn` · `TableRow` 는 `@eeennsu/web` 에서 import 한다.
- 글꼴: DS 가 내는 패밀리 변수는 `--font-sans` 와 `--font-mono` 다. 글꼴 파일은 싣지 않는다(위 "폰트 로딩"). CodeBlock · Prose 의 코드가 `font-mono` 를 쓴다.

`@eeennsu/tokens` 는 이 패키지의 `dependencies` 라서 앱의 직접 의존성이 아니다. `node-linker=hoisted` 설치에서는 최상위 `node_modules/@eeennsu/tokens/` 에 있다. pnpm 격리 레이아웃(기본값)에서는 최상위 `node_modules/@eeennsu/` 에 `web` 만 보이고, `tokens` 는 이 패키지 실경로(`node_modules/.pnpm/@eeennsu+web@…/node_modules/@eeennsu/web`) 옆의 `../tokens` 에 있다. pnpm 의 기본 hoist 설정이면 `node_modules/.pnpm/node_modules/@eeennsu/tokens/` 에도 있다.
