# @eeennsu/native

React Native(Expo + NativeWind v5) 용 디자인 시스템 컴포넌트다. 토큰과 클래스 어휘를 `@eeennsu/web` 과 공유하고, 컴포넌트 구현은 플랫폼별로 따로 둔다. 공개 컴포넌트는 웹의 일부이고, 웹의 오버레이(Dialog · Drawer · Tooltip)와 Form 은 v2 라서 없다.

## 설치

```sh
pnpm add @eeennsu/native
```

peer 의존성(`nativewind` · `react-native-css` · `react-native-svg` · `tailwindcss` 등)의 범위는 설치된 `package.json` 의 `peerDependencies` 가 정한다. `nativewind` 와 `react-native-css` 는 `^` 없이 고정된 정확한 버전이다(C-19). 소비 프로젝트는 NativeWind v5 를 갖춰야 한다.

전역 CSS 에 한 줄을 넣는다.

```css
@import "@eeennsu/native/themes/base.css";
```

이 한 줄은 Expo 소비자 기준이다. Expo 없는 RN CLI 앱의 Metro 설정은 그 앱의 몫이다.

브랜드는 앱당 하나이고 import 하는 `themes/<brand>.css` 로 고른다. 어떤 브랜드가 있는지는 설치된 `themes/` 폴더가 보여 준다.

## 소비 규칙

이 패키지로 화면을 만들 때 지키는 규칙이다. 괄호의 `C-n` 은 DS 레포 스펙의 조항 번호다.

### 앱이 바꿀 수 있는 것

앱마다 갈리는 축은 색, 간격 리듬, 화면 구조 셋이다.

**메인 색.** 전역 CSS 에서 DS import **다음 줄**, `@layer` **밖**에 semantic 변수를 재선언한다(C-5b). 앱이 지정하는 것은 메인 색 네 개이고, 넷을 짝으로 덮는다.

- `--bg-brand`, `--bg-brand-hover`: 채움 색
- `--fg-on-brand`: 채움 위 글자
- `--fg-brand`: 표면 위에 쓰는 브랜드 색 글자

RN 은 웹과 블록 구성이 다르다. 쓰는 블록은 **2개**다: `:root` 와 `@media (prefers-color-scheme: dark) { :root }`.

```css
@import "@eeennsu/native/themes/base.css";

:root {
  --bg-brand: oklch(…);
  --bg-brand-hover: oklch(…);
  --fg-on-brand: oklch(…);
  --fg-brand: oklch(…);
}

@media (prefers-color-scheme: dark) {
  :root {
    /* 같은 네 변수, 다크 값 */
  }
}
```

- `.dark` 블록과 `:root:not(.light)` 블록은 RN 에서 죽으므로 쓰지 않는다. 웹의 3블록 CSS 를 그대로 붙여 넣으면 다크에서 앱의 **라이트** 값이 나온다. 에러가 아니라 무효다(알려진 동작 15).
- 값은 빌드 시점 캐스케이드로 굳고 런타임 CSS 변수로 남지 않는다. NativeWind 의 런타임 오버라이드(`VariableContextProvider`, `vars()`)는 DS 채널이 아니며, 런타임 브랜드 전환은 범위 밖이다(C-5a · C-5b).
- 재선언은 `@eeennsu/tokens` 의 JS 토큰 객체에 닿지 않는다. 앱 코드(Reanimated 등)가 JS 객체에서 색을 읽으면 재선언 전의 값이 나온다(알려진 동작 11).
- 공개 계약은 semantic 변수 **이름**이다. 이름 변경·삭제는 파괴적 변경(major)이다.
- 짝 대비: `--bg-brand` 를 덮으면 그 위 글자 `--fg-on-brand` 도 함께 본다(`--bg-danger` 와 `--fg-on-danger` 도 같다). DS 는 자기 브랜드의 짝만 4.5:1 을 보장하므로, 앱 색의 짝 대비는 앱이 맞춘다. base 의 on-brand 는 라이트·다크 모두 흰색이다. 채움을 밝게 바꿔 흰 글자가 4.5:1 에 못 미치면 on-brand 를 어두운 값으로 다시 정한다(C-5b R26).
- 채움과 글자 색은 별개 값이다. `--bg-danger` 만 덮으면 글자 빨강(`tone="danger"`)은 따라가지 않는다(`--fg-danger`, C-5b R26).
- 브랜드 색 **글자**에는 `text-fg-brand` 를 쓴다. `text-brand` 는 채움 색이라 다크 surface 위에서 대비가 모자란다(알려진 동작 27).
- 메인 색 밖의 `--bg-canvas` · `--bg-surface-muted` 는 건드리지 않는 것이 기본이다. canvas 를 surface 와 같은 값으로 덮으면 Card 경계가 사라지고(그때는 `className="border border-border"`), `--bg-surface-muted` 를 canvas 나 surface 와 같게 덮으면 입력 칸 채움이 보이지 않는다(알려진 동작 24 · 25).

**간격 리듬.** 간격·글자 스케일은 전 앱이 공유한다. 앱이 정하는 것은 그 열거 안에서 어떤 단계를 쓰는가다(C-7a, 알려진 동작 14). 간격은 `className`(`p-4`, `gap-6`, `mt-2` 등)으로만 주고, `padding={16}` 같은 prop 은 없다(C-14). 허용 키는 설치된 토큰 CSS 의 `--spacing-*` 가 정한다. 그 밖의 키(`mt-5`, `mt-17`)는 에러가 아니라 클래스가 생성되지 않는 무효다(알려진 동작 1).

**화면 구조.** 어떤 컴포넌트를 어떤 순서와 배치로 놓는지는 앱이 정한다. 배치의 1순위 수단은 `Stack` · `Box` 이지만 강제는 아니고 `className` 의 레이아웃 유틸리티도 쓴다(C-15). `Stack` 의 배치 prop 은 `direction` · `align` · `justify` · `wrap` 뿐이고, `Box` 는 `children` 과 `className` 만 받는다. 둘 다 `gap` · `padding` prop 은 없다. 컨테이너(Card · Stack · Box)의 자식으로 문자열을 직접 넣을 수 없다. RN `View` 안의 원시 문자열은 크래시하므로 타입이 막는다. 글자는 `Text` 로 감싼다(C-17).

### 바꾸지 않는 것

- **컴포넌트 소스와 내부 형태.** 소비 프로젝트는 컴포넌트 소스를 고치지 않는다(C-2). Button 높이·패딩, Card radius, Input 테두리를 앱 단위로 바꾸는 통로는 없다. 앱 전체를 바꾸려면 호출 지점마다 `className` 임의값을 반복해야 하고 빠뜨린 곳을 잡는 테스트도 없다(알려진 동작 14).
- **폰트 패밀리.** 앱 단위로 바꾸지 않는다. 패밀리 이름(`Pretendard`)과 크기·줄 높이·무게 스케일은 DS 가 갖는다. 폰트 파일은 동봉하지 않으며 등록은 앱의 의무다(아래 "RN 에서만 지켜야 하는 것").
- **`@theme` 확장과 새 토큰.** `@theme { --color-accent: … }` 로 새 클래스를 만들지 않는다. 지원하지 않으며, 그 클래스는 DS 어휘가 아니라 병합 키 목록에도 없다(Non-Goals). 간격·타이포·radius·shadow 변수는 재선언 대상이 아니다. primitive 변수(`--ds-*`)는 덮으면 동작하지만 계약 밖이라 이름 안정성이 없다(알려진 동작 13).
- **스케일 밖 임의값.** `bg-[#333]`, `mt-[13px]` 은 타입도 구조도 막지 못하는 **의도된 탈출구**일 뿐 기본 수단이 아니다(C-14 · C-15, 알려진 동작 3). 96px 를 넘는 고정 폭·높이 유틸리티(`w-64` 등)는 없으므로 `w-full`, `max-w-*`, 임의값을 쓴다(알려진 동작 2).

컴포넌트 하나만 다르게 하려면 `className` 을 쓴다. `className` 이 유일한 커스텀 채널이고 `style` 은 열려 있지 않다. DS 기본 스타일과 병합되며 충돌하면 앱이 이긴다. 단 같은 유틸리티 그룹, 같은 변형만 덮는다(C-15, 알려진 동작 4). 색 의도를 받는 prop(`variant` · `tone`)은 열거값만 받는다(C-14).

### 다크 방식

RN 은 hybrid 가 아니라 **OS 단독**이다(C-20 R24). 루트 `.dark` · `.light` 클래스로 OS 설정을 덮는 경로가 없다. 다크 색은 `@media (prefers-color-scheme: dark) { :root { … } }` 한 셀렉터로 나가고, 이 블록은 native 래퍼가 낸다. 토큰 파일의 `.dark` 블록은 RN 에서 무해하게 죽는다. 앱이 색 구성표를 바꾸려면 RN 의 `Appearance.setColorScheme` 을 쓰고, 그러면 `@media` 블록이 따라간다. NativeWind v5 에는 자체 `colorScheme.set` API 가 없다. 유틸리티 변형 `dark:` 는 동작하므로 앱의 `className` 에서 쓸 수 있다. DS 컴포넌트는 semantic 변수로 색을 내므로 `dark:` 를 쓰지 않는다.

### RN 에서만 지켜야 하는 것

**Pretendard 글꼴 등록.** RN 에는 글꼴 상속이 없어서 DS 텍스트 컴포넌트(Text · Button 라벨 · Chip 라벨 · Badge · Label · Input · Textarea)가 각자 `font-sans` 로 `Pretendard` 패밀리를 요청한다(C-7b R26). 폰트 파일은 동봉하지 않으므로 앱이 `Pretendard` 라는 이름으로 등록해야 한다.

- 등록할 무게는 글자 스텝이 쓰는 400 · 600 · 700 이다. 500 도 넣으면 앱의 `className` 에 안전하다.
- 등록하지 않으면 Android 는 기본 글꼴로 조용히 떨어진다. iOS 는 "Unrecognized font family" 메시지를 낸다고 알려져 있으나 기기에서 확인하지 못했다. 등록한 글꼴에 없는 무게는 가까운 무게로 그려진다(알려진 동작 26).
- Expo: `expo-font` 로 같은 이름을 등록한다. 무게별 등록 방법은 SDK 문서를 따른다. DS 는 이 경로를 확인하지 못했다.
- RN CLI Android: `android/app/src/main/res/font/` 에 `pretendard_regular.otf` 처럼 소문자 이름으로 넣고, 같은 폴더의 `pretendard.xml` 에 무게별 `<font>` 를 가진 `<font-family>` 를 둔다. `MainApplication.onCreate` 에서 `ReactFontManager.getInstance().addCustomFont(this, "Pretendard", R.font.pretendard)` 를 부른다. RN 이 `fontWeight` 로 무게를 고른다. 에뮬레이터에서 확인했다.
- Pretendard 는 SIL OFL 1.1 이다.

**배수 line-height.** react-native-css 는 line-height 를 단위 없는 배수로 읽는다. `px` 값을 그대로 두면 `fontSize 20 × 28 = 560` 이 되어 화면이 무너지고, `rem` 도 같은 방식으로 틀린다. 그래서 native 래퍼가 `--text-<step>--line-height` 를 배수로 다시 낸다(알려진 동작 16). 줄 높이는 `text-<step>` 클래스로 정하고, 앱 CSS 에서 `px`·`rem` 으로 직접 선언하지 않는다. 앱의 `className="text-lg"` 도 크기·줄 높이·무게 세 값이 모두 적용된다.

**웹과 다르게 동작하는 것.**

- Button · Chip 의 `className` 은 표면(Pressable)에 붙는다. 글자 클래스(`text-*`, `tabular-nums`)는 라벨에 닿지 않는다(알려진 동작 22).
- `Icon` 의 그림 크기는 `size` prop 만 정한다. `className` 의 `size-*` · `w-*` · `h-*` 는 바꾸지 못한다. 배치·변형·투명도 클래스(`ml-*`, `absolute`, `self-*`, `rotate-*`, `opacity-*`)는 svg 를 감싼 루트 View 에 걸리고, 색 클래스(`text-*`)만 svg 색으로 간다(알려진 동작 20).
- `font-variant-numeric` 유틸리티 중 `tabular-nums` 만 동작한다(알려진 동작 17).
- Button(sm · md)과 Chip 은 세로 `hitSlop` 으로 누름 영역 48dp 를 채운다. 세로로 쌓을 때 sm 은 18, md 는 6, Chip 줄은 10 이상 띄운다. 겹치면 뒤 형제가 누름을 가져간다. Input · Textarea 에는 `hitSlop` 이 없어 sm · md 는 48dp 에 못 미치므로 터치 폼은 `lg` 를 권한다(알려진 동작 18).

### 어휘 위치

어휘 목록은 이 문서에 옮겨 적지 않는다. 옮겨 적은 목록은 버전이 오르면 어긋나므로 설치된 버전의 파일이 기준이다.

- 색·간격·글자 스텝·radius·shadow: `themes/<brand>.css` 가 import 하는 `@eeennsu/tokens/themes/<brand>.css`. `@theme` 블록이 스케일을, `@theme inline` 블록이 semantic 색 매핑을 갖고, `:root` 에 semantic 변수가 있다. 이 패키지의 `themes/<brand>.css` 는 거기에 RN 다크 블록, 배수 line-height, `--font-sans`, `tabular-nums` 선언을 더한다.
- 컴포넌트와 prop 타입: `dist/index.d.ts` 가 내보내는 것이 공개 컴포넌트이고, 컴포넌트별 타입은 `dist/<컴포넌트>.d.ts` 에 있다. 공용 prop 계약과 `IconName` 은 `@eeennsu/tokens` 의 `dist/contracts.d.ts` 에 있다.

`@eeennsu/tokens` 는 이 패키지의 `dependencies` 라서 앱의 직접 의존성이 아니다. `node-linker=hoisted` 설치에서는 최상위 `node_modules/@eeennsu/tokens/` 에 있다. pnpm 격리 레이아웃(기본값)에서는 최상위 `node_modules/@eeennsu/` 에 `native` 만 보이고, `tokens` 는 이 패키지 실경로(`node_modules/.pnpm/@eeennsu+native@…/node_modules/@eeennsu/native`) 옆의 `../tokens` 에 있다. pnpm 의 기본 hoist 설정이면 `node_modules/.pnpm/node_modules/@eeennsu/tokens/` 에도 있다.
