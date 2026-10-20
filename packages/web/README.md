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

앱마다 갈리는 축은 색, 간격 리듬, 화면 구조 셋이다.

**메인 색.** 전역 CSS 에서 DS import **다음 줄**, `@layer` **밖**에 semantic 변수를 재선언한다(C-5b). 앱이 지정하는 것은 메인 색 네 개이고, 넷을 짝으로 덮는다.

- `--bg-brand`, `--bg-brand-hover`: 채움 색
- `--fg-on-brand`: 채움 위 글자
- `--fg-brand`: 표면 위에 쓰는 브랜드 색 글자

웹은 **3블록(라이트 `:root`, 다크 둘)을 모두** 재선언한다. 하나라도 빠지면 OS 라이트·다크와 루트 클래스 유무로 나뉘는 4조합 중 일부만 바뀐다(알려진 동작 12).

```css
@import "@eeennsu/web/themes/base.css";

:root {
  --bg-brand: oklch(…);
  --bg-brand-hover: oklch(…);
  --fg-on-brand: oklch(…);
  --fg-brand: oklch(…);
}

.dark {
  /* 같은 네 변수, 다크 값 */
}

@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    /* 같은 네 변수, 같은 다크 값 */
  }
}
```

- 공개 계약은 semantic 변수 **이름**이다. 이름 변경·삭제는 파괴적 변경(major)이다.
- 짝 대비: `--bg-brand` 를 덮으면 그 위 글자 `--fg-on-brand` 도 함께 본다(`--bg-danger` 와 `--fg-on-danger` 도 같다). DS 는 자기 브랜드의 짝만 4.5:1 을 보장하므로, 앱 색의 짝 대비는 앱이 맞춘다. base 의 on-brand 는 라이트·다크 모두 흰색이다. 채움을 밝게 바꿔 흰 글자가 4.5:1 에 못 미치면 on-brand 를 어두운 값으로 다시 정한다(C-5b R26).
- 채움과 글자 색은 별개 값이다. `--bg-danger` 만 덮으면 글자 빨강(`tone="danger"`)은 따라가지 않는다(`--fg-danger`, C-5b R26).
- 브랜드 색 **글자**에는 `text-fg-brand` 를 쓴다. `text-brand` 는 채움 색이라 다크 surface 위에서 대비가 모자란다(알려진 동작 27).
- 메인 색 밖의 `--bg-canvas` · `--bg-surface-muted` 는 건드리지 않는 것이 기본이다. canvas 를 surface 와 같은 값으로 덮으면 Card 경계가 사라지고(그때는 `className="border border-border"`), `--bg-surface-muted` 를 canvas 나 surface 와 같게 덮으면 입력 칸 채움이 보이지 않는다(알려진 동작 24 · 25).

**간격 리듬.** 간격·글자 스케일은 전 앱이 공유한다. 앱이 정하는 것은 그 열거 안에서 어떤 단계를 쓰는가다(C-7a, 알려진 동작 14). 간격은 `className`(`p-4`, `gap-6`, `mt-2` 등)으로만 주고, `padding={16}` 같은 prop 은 없다(C-14). 허용 키는 설치된 토큰 CSS 의 `--spacing-*` 가 정한다. 그 밖의 키(`mt-5`, `mt-17`)는 에러가 아니라 클래스가 생성되지 않는 무효다(알려진 동작 1).

**화면 구조.** 어떤 컴포넌트를 어떤 순서와 배치로 놓는지는 앱이 정한다. 배치의 1순위 수단은 `Stack` · `Box` 이지만 강제는 아니고 `className` 의 레이아웃 유틸리티도 쓴다(C-15). `Stack` 의 배치 prop 은 `direction` · `align` · `justify` · `wrap` 뿐이고, `Box` 는 `children` 과 `className` 만 받는다. 둘 다 `gap` · `padding` prop 은 없다.

### 바꾸지 않는 것

- **컴포넌트 소스와 내부 형태.** 소비 프로젝트는 컴포넌트 소스를 고치지 않는다(C-2). Button 높이·패딩, Card radius, Input 테두리를 앱 단위로 바꾸는 통로는 없다. 앱 전체를 바꾸려면 호출 지점마다 `className` 임의값을 반복해야 하고 빠뜨린 곳을 잡는 테스트도 없다(알려진 동작 14).
- **폰트 패밀리.** 앱 단위로 바꾸지 않는다. 패밀리 이름과 크기·줄 높이·무게 스케일은 DS 가 갖는다. 폰트 파일은 동봉하지 않으므로 로딩(`next/font` 등)은 소비 프로젝트가 한다(C-7b).
- **`@theme` 확장과 새 토큰.** `@theme { --color-accent: … }` 로 새 클래스를 만들지 않는다. 지원하지 않으며, 그 클래스는 DS 어휘가 아니라 병합 키 목록에도 없다(Non-Goals). 간격·타이포·radius·shadow 변수는 재선언 대상이 아니다. primitive 변수(`--ds-*`)는 덮으면 동작하지만 계약 밖이라 이름 안정성이 없다(알려진 동작 13).
- **스케일 밖 임의값.** `bg-[#333]`, `mt-[13px]` 은 타입도 구조도 막지 못하는 **의도된 탈출구**일 뿐 기본 수단이 아니다(C-14 · C-15, 알려진 동작 3). 96px 를 넘는 고정 폭·높이 유틸리티(`w-64` 등)는 없으므로 `w-full`, `max-w-*`, 임의값을 쓴다(알려진 동작 2).

컴포넌트 하나만 다르게 하려면 `className` 을 쓴다. `className` 이 유일한 커스텀 채널이고 `style` 은 열려 있지 않다. DS 기본 스타일과 병합되며 충돌하면 앱이 이긴다. 단 같은 유틸리티 그룹, 같은 변형만 덮는다. `hover:bg-*` 는 `bg-danger` 로 덮이지 않는다(C-15, 알려진 동작 4). 색 의도를 받는 prop(`variant` · `tone`)은 열거값만 받는다(C-14).

### 다크 방식

웹은 hybrid 다(C-20). 루트 엘리먼트에 `.dark` 또는 `.light` 클래스가 있으면 클래스가 OS 설정보다 우선하고, 없으면 `prefers-color-scheme` 을 따른다. next-themes 는 `attribute="class"` 로 두면 해석된 테마를 `light` · `dark` 클래스로 루트에 써서 맞물린다. 기본값은 `data-theme` 속성이라 클래스를 쓰지 않으므로 DS 색에 닿지 않는다. 클래스 코드를 한 줄도 안 쓰면 OS 를 따른다. 래퍼가 `@custom-variant dark` 를 선언하므로 `dark:` 변형도 같은 규칙을 따른다. import 한 줄 밖에 DS 쪽 추가 설정은 없다(AC-19).

### 어휘 위치

어휘 목록은 이 문서에 옮겨 적지 않는다. 옮겨 적은 목록은 버전이 오르면 어긋나므로 설치된 버전의 파일이 기준이다.

- 색·간격·글자 스텝·radius·shadow: `themes/<brand>.css` 가 import 하는 `@eeennsu/tokens/themes/<brand>.css`. `@theme` 블록이 스케일을, `@theme inline` 블록이 semantic 색 매핑을 갖고, `:root` 에 semantic 변수가 있다. 이 패키지의 `themes/<brand>.css` 는 Tailwind·토큰 import, 다크 variant, `@source` 선언뿐이다.
- 컴포넌트와 prop 타입: `dist/index.d.ts` 가 내보내는 것이 공개 컴포넌트이고, 컴포넌트별 타입은 `dist/<컴포넌트>.d.ts` 에 있다. 공용 prop 계약과 `IconName` 은 `@eeennsu/tokens` 의 `dist/contracts.d.ts` 에 있다.

`@eeennsu/tokens` 는 이 패키지의 `dependencies` 라서 앱의 직접 의존성이 아니다. `node-linker=hoisted` 설치에서는 최상위 `node_modules/@eeennsu/tokens/` 에 있다. pnpm 격리 레이아웃(기본값)에서는 최상위 `node_modules/@eeennsu/` 에 `web` 만 보이고, `tokens` 는 이 패키지 실경로(`node_modules/.pnpm/@eeennsu+web@…/node_modules/@eeennsu/web`) 옆의 `../tokens` 에 있다. pnpm 의 기본 hoist 설정이면 `node_modules/.pnpm/node_modules/@eeennsu/tokens/` 에도 있다.
