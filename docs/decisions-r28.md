# R28 결정 기록 (2026-11-15)

소비 앱 두 개(spendback, amulator)를 만든 뒤 사용자가 "색 말고는 인상이 구분되지 않는다"고 판단했다. C-5c를 열고, 표현 어휘(굵기 · 큰 제목 · 고정폭 글꼴 · 상태색 · 큰 크기)와 Callout · Stepper · Link를 더해 `0.6.0`으로 낸다. 스펙 본문은 결과만 싣고(스펙 "R28 개정 요약"), 대안 비교는 여기 둔다. 판단 기준은 R21과 같다 — 확정 사항 불변, 되돌리기 비용이 큰 쪽을 피한다.

- 입력: `~/my-agent-setup/docs/works/mixed/design-flow/2026-11-15-design-flow-v2-design.md` 8장과 amulator `docs/ds-feedback.md` 8건(2026-11-08)
- **사용자가 정한 것**(2026-11-15): C-5c를 연다 — 대상은 `--radius-*`와 canvas · surface · surface-muted · border 관계이고 폰트 패밀리는 Pretendard를 유지한다. 어휘 A~D를 한 라운드로 낸다. Callout · Stepper · Link는 웹과 native 둘 다 만든다. ds-feedback 8건을 닫는다. README 소비 규칙을 고친다
- **빌더 점검 뒤 사용자가 답한 것**(2026-11-15): Stepper는 세로 단계 목록으로 만든다(16절). 상태색은 연한 채움과 글자만 만든다(10절). 코드 강조색은 이번에 만들지 않는다(13절)
- **그 밖은 전부 설계자 판단이다.** 사용자는 조사 요약을 확인한 뒤 "알아서 진행"하라고 했다. 아래 표의 "근거" 열이 설계자 판단인 항목은 사용자가 고른 것이 아니다. 틀렸을 가능성이 큰 것 둘은 따로 표시했다 — 고정폭 글꼴 선택(8), Stepper 모양(17)
- 닫힌 결정(R21~R27)과 R25 보류(데이터 값 number prop)는 열지 않았다. `tone`과 간격 열거 · `size`에는 값을 **더하기만** 한다. C-8은 `tone`에 대해 "추가는 추가적"이라고 적었다. C-7a와 AC-10은 `size`를 5단으로 못박고 있어 이 라운드가 7단으로 고친다 — 근거는 4절이다. 아래 "열지 않은 것"에 이유를 적었다
- 설계 전에 잰 것(2026-11-15, 토큰 CSS를 Tailwind로 컴파일): `:root { --radius-md: 2px }`를 덧붙이면 `--radius-md` 선언이 둘 나오고 `rounded-md`는 `var(--radius-md)`를 쓴다(웹에서 뒤 선언이 이긴다). `w-sm` · `max-w-md` · `min-w-xs` · `basis-sm`은 생성되고(`--container-*`), `h-sm` · `max-h-sm` · `size-sm` · `h-64` · `max-h-96` · `w-80`은 생성되지 않는다. `h-screen` · `h-dvh` · `h-1/2`는 생성된다. `font-semibold`는 생성되지 않는다

## 상태 요약

| # | 항목 | 결정 | 근거 | 되돌리기 |
|---|---|---|---|---|
| 1 | C-5c 대상 | `--radius-sm` · `md` · `lg` · `xl` 네 개와 표면 관계 semantic 변수(canvas · surface · surface-muted · surface-hover · border-default · 새 `border-surface`). `--radius-full`과 폰트 패밀리는 계약 밖. Badge · Chip의 모서리를 `rounded-full`에서 `rounded-xl`로 옮긴다 | 대상은 사용자, 변수 목록과 Badge · Chip은 설계자 판단 | 상(계약에서 빼면 major) |
| 2 | 표면 경계선 | semantic `border.surface` 신설. Card · Input · Textarea · 고르지 않은 Chip의 쉬는 테두리 색이고 base 값은 투명. Card에 1px 테두리가 생긴다 | 설계자 판단 | 중 |
| 3 | radius 블록 | `:root` 한 번. 스킴과 무관하다. RN은 착수 게이트로 잰다 | 설계자 판단 | 하 |
| 4 | 큰 제목 | 전역 `Size`에 `3xl` · `4xl`을 더해 7단. `TypographyStep = Size` 유지 | 설계자 판단(이 라운드의 판단 항목) | 상(단계 이름은 계약) |
| 5 | 큰 제목 값 | `3xl` 36/44/700, `4xl` 48/56/700 | 설계자 판단 | 하(값) |
| 6 | 96px 넘는 크기 | 간격 열거에 `32,40,48,64,80,96`(128 · 160 · 192 · 256 · 320 · 384px) 추가 | 설계자 판단(판단 항목) | 상(키는 계약) |
| 7 | 굵기 | 유틸리티 `font-normal`(400) · `font-semibold`(600) · `font-bold`(700). prop은 없다 | 설계자 판단 | 중 |
| 8 | 고정폭 글꼴 | DS가 `--font-mono`를 소유한다. 패밀리는 JetBrains Mono, RN 이름 `JetBrainsMono`. 파일은 동봉하지 않는다 | 소유는 사용자, 글꼴 선택은 설계자 판단 · 2026-11-15 라이선스 · 배포처 확인(구현 노트 F-32) | 중(패밀리 변경은 소비 앱 로딩 코드를 바꾼다) |
| 9 | 상태색 토큰 | 연한 채움 5개(`bg.brand-subtle` · `success-subtle` · `warning-subtle` · `info-subtle` · `danger-subtle`)와 글자 3개(`fg.success` · `fg.warning` · `fg.info`) | 사용자(연한 채움 + 글자), 목록은 설계자 판단 | 중 |
| 10 | 진한 상태 채움 | 만들지 않는다. `variant` 4개 고정을 넓히지 않는다 | 사용자 | 하(추가는 추가적) |
| 11 | `tone` | `brand` · `success` · `warning` · `info`를 더해 7개. fg semantic과 1:1 유지 | 설계자 판단 | 상 |
| 12 | 대비 | 새 글자색은 surface · canvas · 자기 연한 채움 위에서 4.5:1. `fg.default`는 모든 연한 채움 위에서 4.5:1. base · bakery × 라이트 · 다크 전부 | 설계자 판단 | 하 |
| 13 | 코드 강조색 | 이번에 만들지 않는다. 강조는 굵기 유틸리티와 `tone`으로 표현한다 | 사용자 | 하(추가는 추가적) |
| 14 | Link | 웹 `href` 필수 `<a>`, native `onPress` 필수. `label` 문자열, `tone`(기본 `brand`), `size` | 설계자 판단 | 중 |
| 15 | Callout | `tone`(`info` 기본 · `success` · `warning` · `danger` · `brand`), `title?`, `icon?`, `children`. 연한 채움 상자, 테두리 없음 | 설계자 판단 | 중 |
| 16 | Stepper 구조 | 세로 단계 목록. `items: StepItem[]`(`{ value; label; content? }`) + `value`(펼친 단계) + `reached?`(가장 멀리 간 단계) + `onValueChange?` + `label`(접근성 이름). number prop 없음 | 세로 목록은 사용자, API는 설계자 판단 | 중 |
| 17 | Stepper 모양 | 단계마다 한 줄. 지난 단계는 체크 아이콘, 지금 단계는 굵은 글과 그 아래 내용. 번호 원과 연결선을 그리지 않는다 | 설계자 판단 · 2026-11-16 사용자가 화면을 보고 받아들임 | 하(내부 모양) |
| 18 | Collapsible `disabled` | 기능 불리언 추가 | ds-feedback 2 | 하 |
| 19 | Collapsible 들여쓰기 · 모양 | `variant`(`ghost` 기본 · `secondary`). `ghost`는 가로 여백 0이라 주변 문단과 왼쪽이 맞는다. `secondary`는 트리거 줄이 채움 상자 | ds-feedback 3 · 8, 설계자 판단 | 중(0.5.0 소비자의 `-mx-3` 보정이 어긋난다) |
| 20 | Button 상태 글 통로 | 만들지 않는다. 그 요구가 나온 자리(지난 단계 버튼)를 Stepper가 가져간다 | 설계자 판단 | 하(추가는 추가적) |
| 21 | Prose | 루트에 한국어 줄바꿈(`break-keep` + `wrap-break-word`), `a`에 포커스 외곽선. `a`의 상시 밑줄은 그대로 | ds-feedback 1 · 7 | 하 |
| 22 | Table 세로 스크롤 | `className="max-h-96"`을 주면 스크롤 영역이 세로로도 스크롤된다 | ds-feedback 4 | 하 |
| 23 | 웹 · native 범위 | 토큰 · 유틸리티 · `tone` · `Size`는 양쪽. Link · Callout · Stepper는 양쪽. Collapsible · Prose · Table 수정은 웹 전용(native에 없다) | 사용자 + 설계자 판단 | — |
| 24 | RN 착수 게이트 | 네 항목을 verify-expo에서 먼저 잰다. 실패 항목은 R24처럼 native 래퍼에서 우회하거나 RN 계약에서 뺀다 | 설계자 판단 | — |
| 25 | README 소비 규칙 | web · native README의 "앱이 바꿀 수 있는 것"을 다시 쓴다 — 재선언 변수 목록과 폰트 로딩 의무 | 사용자 | 하 |
| 26 | 버전 | `0.6.0`. 계약은 추가뿐이다. 모양이 바뀌는 곳은 Collapsible 들여쓰기(19)와 Card 테두리 1px(2). `Tone` · `Size`의 전수 맵을 가진 소비자 코드는 컴파일 에러가 난다 | 설계자 판단 | — |

## 1. C-5c 대상

C-5b(R23)가 적어 둔 트리거("도메인이 다른 소비 프로젝트 2개를 만든 뒤 색 이외의 인상에서 구분되지 않는다고 사용자가 판단하면")가 충족됐다. 사용자가 연 범위는 radius와 표면 관계이고, R23이 후보로 적은 폰트 패밀리는 이번에 빼라고 했다.

**radius.** 계약 이름은 `--radius-sm` · `--radius-md` · `--radius-lg` · `--radius-xl` 네 개다. R23 요구 (b)에 따라 Tailwind 관용 이름으로 지어 둔 그대로다. `--radius-*`는 `@theme`(inline 아님)에 있어 `:root` 변수로 남고 유틸리티가 `var()`로 읽으므로, 소비자가 DS import 다음 줄에 재선언하면 덮인다(위 실측). DS 코드 변경은 없고 계약 승격과 테스트가 실체다.

`--radius-full`은 계약에 넣지 않는다. `rounded-full`은 원(스피너, 아이콘 바탕)과 알약의 기하이고, 이것을 4px로 덮으면 원이 네모가 된다. 덮으면 동작하지만 계약 밖이다(primitive 변수와 같은 지위, 알려진 동작 13).

| 대안 | 내용 | 탈락 이유 |
|---|---|---|
| A. 네 키(채택) | sm · md · lg · xl | — |
| B. 다섯 키 | `full` 포함 | 원 모양이 깨지는 경로를 계약으로 연다 |
| C. 배수 하나 | `--radius-scale: 0.5` 한 변수 | 새 변수와 `calc()`가 든다. RN이 `calc(var())`를 빌드 시점에 푸는지 미확인이고, 키별로 다르게 줄 수 없다 |

**Badge · Chip.** 두 컴포넌트는 웹 · native 모두 `rounded-full`이라, 앱이 모서리를 2px로 덮어도 알약 모양으로 남는다. 사용자가 꼽은 AI 티 목록에 "pill 배지"가 있으므로 이대로면 design-flow 평가에서 DS 배지가 늘 걸린다. 둘을 `rounded-xl`로 옮긴다. base에서는 `xl`이 20px이고 Chip 높이가 38, Badge는 그보다 낮아 모양이 지금과 같은 알약이다. 앱이 `--radius-xl`을 줄이면 Card와 함께 각이 진다. 원(스피너 등)은 `rounded-full`에 남는다.

**표면 관계.** canvas · surface · surface-muted · surface-hover · border-default는 semantic 색 변수라 C-5b의 대상에 **이미** 들어 있다. 막고 있던 것은 README의 "건드리지 않는 것이 기본"이라는 안내와, 덮었을 때 Card · 입력 칸 경계가 사라지는 구조(알려진 동작 24 · 25)다. 그래서 여는 일은 둘이다 — 안내를 "바꿀 수 있고, 이렇게 짝을 맞춘다"로 고치고, 경계가 사라지는 문제를 앱 단위로 풀 변수 하나(2절)를 더한다.

**폰트 패밀리**는 열지 않는다(사용자 결정). 알려진 동작 14는 "폰트 패밀리와 컴포넌트 치수(Button 높이 · 패딩)는 앱 단위 통로가 없다"로 줄어든다.

## 2. 표면 경계선 `border.surface`

앱이 "회색 바탕에 흰 카드"를 벗어나려고 canvas를 surface와 같은 값으로 덮으면 Card 경계가 사라진다. 지금 안내는 Card마다 `className="border border-border"`를 주라는 것인데, 호출 지점마다 반복하고 빠뜨린 곳을 잡을 수 없다는 점에서 C-5c가 풀려던 문제 그대로다.

| 대안 | 내용 | 탈락 이유 |
|---|---|---|
| A. semantic 변수 하나(채택) | `border.surface` — Card · Input · Textarea · 고르지 않은 Chip의 쉬는 테두리 색. base는 투명 | — |
| B. 변수 둘 | Card용과 입력 칸용을 나눈다 | 두 앱 어디에서도 둘을 다르게 둘 이유가 나오지 않았다. 나누는 것은 나중에 추가적이다 |
| C. 그대로 두고 README만 고친다 | 호출마다 `className` | C-5c를 연 이유와 어긋난다 |
| D. Card `variant` | `outlined` 같은 값 | `variant`는 4개 고정이고(C-8), 앱 전체 결정을 호출마다 적게 된다 |

- 입력 칸과 Chip은 이미 투명 테두리 1px을 갖고 있어(알려진 동작 25) 색만 이 변수로 바뀐다. 포커스(`border-focus`)와 `invalid`(danger)는 지금처럼 그 위를 덮는다
- **Card에는 테두리 1px이 새로 생긴다.** base에서는 투명이라 보이지 않지만 안쪽 폭이 2px 줄어든다. AC-23 스크린샷이 1px 단위로 달라질 수 있으니 구현 태스크에서 다시 찍는다
- 클래스 이름은 `border-border-surface`다(`border-border` · `border-border-focus`와 같은 규칙). 값 `transparent`를 토큰 소스에서 어떻게 표현할지는 구현에 맡긴다
- bakery는 canvas와 surface가 1.05:1이라 Card가 흐리다(알려진 동작 24). bakery에서 이 변수에 값을 줄지는 구현에서 화면을 보고 정한다. 주지 않아도 계약은 성립한다

## 3. radius 재선언 블록과 RN

radius는 스킴과 무관하므로 `:root`에 한 번만 쓴다. 표면 관계 변수는 색이라 C-5b의 다크 블록 규칙(웹 3블록, RN 2블록)을 그대로 따른다.

RN은 값이 빌드 시점 캐스케이드로 굳는다. semantic 색의 last-wins는 게이트 (6)이 확인했지만 `@theme` 변수(`--radius-*`)가 같은 식으로 덮이는지는 재지 않았다. 24절의 게이트 항목이다.

## 4. 큰 제목을 `size` 계약에 넣는 방식

이 라운드가 판단하기로 한 항목이다. 스펙은 간격 · 타이포 스케일 **구조**의 브랜드별 분리(R22 후보 C)를 Non-Goal로 두지만, 그것은 "열거가 브랜드마다 달라지는 것"이다. 전 브랜드가 공유하는 열거에 단계를 더하는 것은 C-7a("좁게 시작하고 … 나중에 추가한다")가 예정한 일이다.

| 대안 | 내용 | 맞바꾸는 것 |
|---|---|---|
| A. `Size`를 7단으로(채택) | `sm \| md \| lg \| xl \| 2xl \| 3xl \| 4xl`. `TypographyStep = Size` 유지 | 전역 축 하나가 늘어난다. 스펙의 "5단" 문구를 전부 고친다 |
| B. 별도 display 어휘 | `Size`는 그대로, `text-display` · `text-display-lg` 클래스만 추가 | Text `size` prop으로 닿지 않아 `className`으로만 쓴다. 타이포 어휘가 t-shirt와 display 둘이 된다. C-7a가 간격에서 피한 `md-plus`식 이름이 타이포에 생긴다 |
| C. `TypographyStep`만 넓힌다 | `TypographyStep = Size \| "3xl" \| "4xl"` | "모든 컴포넌트가 동일한 집합에서만 고르고 부분집합은 `Extract`"(C-8)가 깨진다. 초집합이 하나 생긴다 |

A를 골랐다.

- 전역 `Size`를 그대로 쓰는 곳은 `TypographyStep`뿐이다. `ControlSize` · `BadgeSize`는 `Extract`라 영향이 없다
- `Text`의 `steps` 맵이 `Record<TypographyStep, string>`이라 키가 늘면 웹 · native 양쪽이 컴파일 에러로 알려 준다
- 추가는 추가적(minor)이고, 단계 이름을 빼거나 바꾸는 것은 파괴적이다. 그래서 이름은 Tailwind의 t-shirt 연장(`3xl` · `4xl`)을 그대로 따른다
- **타입은 추가여도 소비자 코드를 깰 수 있다.** `Record<TypographyStep, string>` · `Record<Tone, string>`처럼 전수 맵을 가진 소비자는 키가 모자라 컴파일 에러가 난다(spendback `src/ui/prose.tsx`가 그렇다). 0.x의 minor에서 받아들이고, 구현 노트와 README에 "맵에 새 키를 더한다"를 적는다. spendback 수정은 그 레포의 일이다. 11절의 `tone`도 같다
- 스펙에서 고칠 곳: C-7a · C-8의 "5단" 문구, AC-10, C-5b (R23)과 Non-Goals의 "`size` 5단 계약" 표현. 뒤 둘은 "열거가 브랜드마다 달라지지 않는다"는 뜻이 남도록 고친다
- 두 단계인 이유: amulator에서 필요한 것은 페이지 제목(지금 최대 28px이 본문 18px과 차이가 작다)과 첫 화면의 큰 글이다. 한 단계면 둘 중 하나가 빈다. 세 단계 이상은 요구가 없다

## 5. 큰 제목 값

| 스텝 | 크기 / 줄 높이 / 무게 | 쓰임 |
|---|---|---|
| `3xl` | 36 / 44 / 700 | 페이지 제목 |
| `4xl` | 48 / 56 / 700 | 첫 화면의 큰 글 |

기존 스텝의 간격(18 → 22 → 28, 약 1.25배)을 잇는다. 줄 높이는 기존 스텝처럼 크기 + 8이다. native 래퍼는 배수 line-height를 같은 소스에서 다시 낸다(T-N0 방식 그대로). 자간은 두지 않는다 — 토큰에 자간 축이 없고 요구도 없다.

## 6. 96px 넘는 크기

판단 항목의 둘째다. 실측대로 폭은 `--container-*` 덕에 `w-sm`(384px)부터 있고, 비어 있는 것은 **높이**와 96px~384px 사이의 고정 폭이다.

| 대안 | 내용 | 맞바꾸는 것 |
|---|---|---|
| A. 간격 열거를 넓힌다(채택) | `32,40,48,64,80,96` 추가 = 128 · 160 · 192 · 256 · 320 · 384px | `p-96` · `gap-64`도 함께 생긴다 |
| B. 높이용 열거를 따로 둔다 | `@utility`로 `h-*` · `max-h-*`만 여는 새 네임스페이스 | 새 메커니즘이 하나 든다. twMerge 키 그룹을 따로 만들고 RN이 `@utility`를 옮기는지 재야 한다 |
| C. 그대로 두고 임의값 | `max-h-[384px]` | ds-feedback 4를 닫지 못한다. 임의값은 design-flow 마무리 검사에 걸린다 |

A를 골랐다.

- 새 메커니즘이 없다. 토큰 소스에 키 여섯 개를 더하면 CSS · JS 객체 · `twMergeConfig` spacing 키가 함께 따라온다. RN도 기존 간격과 같은 경로다
- 4px 배수 숫자 키라는 C-7a의 규칙과 Tailwind 관용 이름이 그대로다(`h-64` = 256px)
- 큰 padding이 가능해지는 것은 해가 없다. 열거가 희소하다는 성질은 유지된다(96px 위로 여섯 개)
- 384px을 넘는 폭은 지금처럼 `w-md` · `max-w-*`(`--container-*`)를, 높이는 `h-screen` · `h-dvh` · 분수(`h-1/2`)를 쓴다. 알려진 동작 2를 이 내용으로 고친다

## 7. 굵기 유틸리티

`--font-weight-*`를 리셋만 하고 채우지 않아 `font-semibold`가 생성되지 않는다(ds-feedback 5). 굵기 키 셋을 채운다 — `normal` 400, `semibold` 600, `bold` 700. Tailwind 관용 이름이다.

- 셋인 이유: RN 소비 앱이 등록하는 Pretendard 무게가 400 · 600 · 700이다(C-7b). `medium`(500)을 열면 RN에서 가까운 무게로 조용히 떨어진다(알려진 동작 26)
- **prop은 두지 않는다.** "독립 `weight` prop은 없다"(C-7b, 알려진 동작 6)는 그대로이고, `<Text className="font-semibold">`로 쓴다. 타이포 스텝이 무게의 기본값이고 유틸리티가 그것을 덮는다
- 웹에서는 `text-lg`가 `font-weight: var(--tw-font-weight, var(--text-lg--font-weight))`를 내므로 `font-bold`가 순서와 무관하게 이긴다. RN이 이 폴백을 같은 결과로 옮기는지는 게이트 항목이다(24절)
- `twMergeConfig`에 굵기 키를 더한다. 알려진 동작 1의 예시에서 `font-bold`를 뺀다

| 대안 | 탈락 이유 |
|---|---|
| Text `weight` prop | 채널이 둘이 된다(C-14가 간격에서 피한 것). 닫힌 결정(R21)을 다시 연다 |
| `medium` 포함 넷 | RN 등록 무게에 없다 |

## 8. 고정폭 글꼴

지금 `font-mono`는 Tailwind 기본값(시스템 고정폭 목록)이고 DS는 소유하지 않는다(알려진 동작 28). 사용자가 DS 소유로 바꾸라고 했다.

- 토큰 `fontFamily.mono`를 더하고 `--font-mono`를 DS 값으로 덮어쓴다 — `"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`. RN 이름은 `JetBrainsMono` 하나다(`--font-sans`와 같은 방식, native 래퍼가 다시 낸다)
- 폰트 파일은 동봉하지 않는다(C-7b). 로딩은 소비 앱이 하고, README가 방법을 안내한다. 로딩하지 않으면 뒤의 시스템 목록으로 떨어지므로 지금과 같은 모양이다
- 한글은 고정폭 글꼴에 없어 시스템 글꼴로 대체된다(지금과 같다)
- `font-serif`는 Tailwind 기본값으로 남는다. 요구가 없다
- native에는 코드 컴포넌트가 없지만 어휘를 공유하므로 `font-mono` 클래스는 native에서도 같은 이름을 가리킨다. 쓰지 않는 앱은 등록하지 않아도 된다

**글꼴 선택은 설계자 판단이고 확인이 필요하다.** JetBrains Mono를 고른 이유는 코드 글자 구분(0 · O, 1 · l)이 뚜렷하고 가변 글꼴과 무게별 파일이 모두 배포된다는 것이다. 라이선스(OFL)와 배포처(웹 패키지, Expo용 패키지)는 **미확인**이며 계획의 첫 토큰 태스크에서 출처와 확인일을 달아 확인한다. 확인에서 걸리면 그 태스크에서 대안을 사용자에게 가져온다.

글꼴 확인(2026-11-15): JetBrains Mono는 SIL OFL 1.1이고, 웹은 `@fontsource/jetbrains-mono` · `@fontsource-variable/jetbrains-mono`(400 · 600 · 700), Expo는 `@expo-google-fonts/jetbrains-mono`가 있다. 출처와 Expo 등록 키 바꾸기는 구현 노트 F-32다. 대안으로 넘어가지 않았다.

## 9. 상태색 토큰

Callout과 글자 강조에 쓸 semantic 색을 더한다.

| 새 semantic | 쓰임 |
|---|---|
| `bg.brand-subtle` · `bg.success-subtle` · `bg.warning-subtle` · `bg.info-subtle` · `bg.danger-subtle` | 연한 채움. Callout 바탕, 강조 구역 |
| `fg.success` · `fg.warning` · `fg.info` | 표면과 연한 채움 위의 글자 · 아이콘 |

- `danger-subtle`은 요구 목록에 없지만 Callout의 danger에 필요해 함께 넣었다
- `fg.brand` · `fg.danger`는 이미 있다(R26)
- 필요한 primitive 색(초록 · 주황 · 하늘 계열)은 primitive 계층에 더한다. primitive는 `@theme`에 들어가지 않으므로 클래스가 늘지 않는다(C-7)
- bakery에도 값을 전부 정한다. C-8이 `tone`을 좁게 둔 이유가 이 비용이었고, 이번에 치른다
- C-5b의 재선언 대상에 자동으로 들어간다(semantic 색 키 = 계약). 앱이 `--bg-brand`를 덮으면 `--bg-brand-subtle`과 `--fg-brand`도 짝으로 본다 — README의 "메인 색 네 개"가 다섯 개가 된다

## 10. 진한 상태 채움은 만들지 않는다

입력의 "채움과 글자 짝"은 **연한 채움 + 글자**다. 스펙에서 "채움"은 흰 글자를 얹는 진한 색(`bg.danger`)을 가리켜 왔기 때문에 사용자에게 물었고, 연한 채움과 글자만 만든다고 답했다(2026-11-15). `bg.success` + `fg.on-success` 같은 진한 채움은 Button · Badge의 `variant`에 값을 더해야 쓸 자리가 생기는데, `variant`는 4개 고정이다(C-8). 진한 채움이 필요한 화면이 나오면 그때 추가한다(추가적).

## 11. `tone`

`Tone = default | muted | danger | brand | success | warning | info`. fg semantic 토큰과 1:1이라는 C-8의 규칙이 그대로 성립한다(`fg.brand`는 R26부터 있었는데 `tone`에 없었다). Text와 Icon이 일곱 값을 받고, 양쪽 `tones` 맵이 `Record<Tone, string>`이라 빠뜨리면 컴파일 에러다.

C-8은 "3개 확정"이라고 적고 같은 줄에서 "추가는 추가적"이라고 했다. 확정을 뒤집는 것이 아니라 예정된 추가다.

## 12. 대비

- 새 글자색 `fg.success` · `fg.warning` · `fg.info`: surface, canvas, 자기 연한 채움 위에서 4.5:1
- `fg.brand` · `fg.danger`: 자기 연한 채움 위에서도 4.5:1
- `fg.default`: 다섯 연한 채움 모두 위에서 4.5:1(Callout 본문)
- base · bakery, 라이트 · 다크 전부. tokens의 대비 테스트(브랜드 × 스킴)에 짝을 더한다
- 연한 채움과 canvas · surface의 구분은 비텍스트 3:1 대상으로 보지 않는다(알려진 동작 25의 입력 칸 채움과 같은 판단). Callout은 채움 말고도 제목 · 아이콘 · 글로 식별된다

## 13. 코드 강조색은 이번에 만들지 않는다

입력은 "코드 강조색" 한 마디이고 뜻이 적혀 있지 않았다. 세 가지를 사용자에게 물었다.

| 읽기 | 내용 | 크기 |
|---|---|---|
| A. 만들지 않는다(채택) | 강조는 굵기 유틸리티(7절)와 `tone`(11절)으로 표현한다 | 0 |
| B. 짚는 표시색 | semantic `bg.highlight` 하나. Prose `<mark>`와 `bg-highlight` 클래스 | 토큰 1개 |
| C. 문법 강조 팔레트 | 키워드 · 문자열 · 주석 · 숫자 색 + CodeBlock이 토큰화된 입력을 받는 API | 토큰 여럿, CodeBlock 계약 변경, 강조기 의존성 |

사용자가 A를 골랐다(2026-11-15). amulator는 바뀐 값을 바탕색이 아니라 글자색과 굵기(`<strong className="text-fg-brand">`, `apps/web/src/chapter/Emphasis.tsx`)로 강조하고 있어 `font-semibold`가 생기면 그 요구는 닫힌다. B는 쓸 화면이 없고, C는 R27에서 정한 CodeBlock 범위(알려진 동작 29)를 다시 연다. 쓸 화면이 나오면 B를 더한다(추가적).

## 14. Link

ds-feedback 1 — 링크 스타일이 Prose 안에만 있어 내비 링크를 Prose로 감싸 빌려 썼다.

```ts
Link: {
  label: string;
  tone?: Tone;            // 기본 "brand"
  size?: TypographyStep;  // 기본 "md"
  className?: string;
} & (P extends "web" ? { href: string } : { onPress: () => void });
```

- 포커스를 받는 인터랙티브 컴포넌트라 C-13을 따른다. `label`이 보이는 글이자 접근성 이름이고 `children`은 없다(Button · Chip과 같다)
- 웹은 `<a href>`이고 `focus-visible` 외곽선을 갖는다. native는 `accessibilityRole="link"`인 누름 글자이고 `onPress`를 받는다 — RN의 링크는 대부분 화면 이동이라 URL보다 누름이 관용이다(C-12의 "플랫폼 관용을 따른다")
- 밑줄은 hover · 포커스에서만 보인다(웹). `tone`이 `brand`가 아니면 글자색은 주변 글과 같고 hover 밑줄로 링크임을 안다. 목차 제목 링크가 이 경우다
- **Link는 혼자 놓이는 링크다**(내비, 목차, 카드 안의 이동). 문단 속 링크는 Prose의 `a`를 쓴다 — 그쪽은 밑줄이 늘 보인다(21절). 문단 속에서 색만으로 링크를 구분하면 WCAG 1.4.1에 걸리기 때문이다. README에 적는다
- `ref` 없음, 새 창 열기 · 외부 링크 아이콘 없음(추가는 추가적)

**웹 Link는 클라이언트 라우터와 연동하지 않는다.** `next/link`나 react-router의 `Link`로 렌더하려면 `as` · `render` · `asChild` 중 하나가 필요한데 C-10이 금지한다. 그래서 웹 Link는 문서 이동이다. amulator는 라우터 없이 `<a href>`로 이동하므로 충분하다. Next 소비 앱이 프리페치를 원하면 그때 판단한다 — 알려진 동작으로 적는다.

| 대안 | 탈락 이유 |
|---|---|
| 링크 클래스만 낸다(`link` 유틸리티) | 어휘 밖의 새 클래스 종류가 생긴다. native에 대응물이 없다 |
| 웹에도 `onClick` | 이벤트를 받지 않는 시그니처(C-12)라 `preventDefault`를 못 해 라우터 연동이 되지 않는다. 쓸모없는 prop이 된다 |
| Text에 `href` | Text는 문자열을 감싸는 글자 요소이고 포커스 · 누름이 없다. 섞으면 Text가 인터랙티브가 된다 |

## 15. Callout

본문 흐름에서 한 구역을 짚는 상자다(주의, 참고, 결과). amulator가 Card와 Collapsible로 대신하던 자리이고, 사용자가 꼽은 "설명을 접기로 숨긴다"의 대안이기도 하다.

```ts
Callout: {
  children: P extends "web" ? ReactNode : ElementChildren;
  tone?: Extract<Tone, "info" | "success" | "warning" | "danger" | "brand">; // 기본 "info"
  title?: string;
  icon?: IconName;
  className?: string;
};
```

- 모양: `bg-<tone>-subtle` 채움, `rounded-lg`, 안쪽 여백 4. **테두리와 왼쪽 색 띠가 없다.** `title`은 `fg.<tone>` 색 semibold 한 줄, `icon`은 제목 앞(제목이 없으면 본문 앞)에 `fg.<tone>` 색으로 놓인다. 본문은 `fg.default`다
- `icon`은 기본값이 없다. 꾸밈 아이콘을 자동으로 붙이지 않는다. 색만으로 뜻을 전하지 않도록(WCAG 1.4.1) 상태의 뜻은 `title`이나 본문 글이 전한다 — README에 적는다
- 축 이름은 `tone`이다. 같은 semantic 색 계열을 가리키는 같은 개념이라 이름을 공유한다(C-8). `default` · `muted`는 Callout에 뜻이 없어 `Extract`로 뺀다
- 웹은 `role="note"`다. 정적 내용이라 `alert`가 아니다. native는 역할 없이 `title`과 내용이 순서대로 읽힌다
- `children` 타입이 플랫폼마다 다르다. 웹은 MDX 문단이 문자열로 들어오고, native는 Text 밖 문자열이 깨진다(C-17). 누름 이벤트(`Press<P>`)처럼 계약의 플랫폼 매개변수에서 가른다
- 닫기 버튼, 접기 없음. `"use client"` 대상이 아니다
- component recipe(`callout`): 안쪽 여백 · 모서리 · 제목 스텝

## 16. Stepper 구조

ds-feedback 6 — 지난 · 지금 · 남은 단계를 Box와 ghost Button으로 직접 그렸다.

amulator의 실제 화면(`apps/web/src/chapter/StepList.tsx`)은 세로 목록이다. 지금 단계만 펼쳐 보이고, 지난 단계는 눌러서 다시 연다. 초안은 누를 수 없는 가로 진행 표시였는데 그것으로는 이 화면을 대체하지 못해, 사용자가 세로 단계 목록으로 정했다(2026-11-15).

```ts
export type StepItem<P extends Platform> = {
  value: string;
  label: string;
  content?: P extends "web" ? ReactNode : ElementChildren;
};

Stepper: {
  label: string;                             // 목록의 접근성 이름. 보이지 않는다
  items: StepItem<P>[];
  value: string;                             // 펼친 단계
  reached?: string;                          // 가장 멀리 간 단계. 없으면 value와 같다
  onValueChange?: (value: string) => void;
  className?: string;
};
```

- **number prop이 없다.** 단계를 `current={2}`로 받으면 C-14 · AC-15에 걸리고 R25 보류를 연다. Tabs처럼 항목의 문자열 `value`로 가리킨다
- **`value`와 `reached`가 따로 있다.** amulator는 4단계까지 간 뒤 2단계를 다시 열 수 있다. `value` 하나만 있으면 2단계를 여는 순간 3 · 4단계가 "남은 단계"가 되어 돌아갈 수 없다. `reached`까지가 지난 단계이고 그 뒤가 남은 단계다. `reached`가 `value`보다 앞이면 `value`를 따른다
- 상태는 셋이다 — 펼친 단계(`value`), 지난 단계(`reached`까지에서 `value`를 뺀 것), 남은 단계. 펼친 단계만 `content`를 그린다. 나머지의 `content`는 마운트하지 않는다(Tabs · Collapsible과 같다)
- **누름**: `onValueChange`가 있으면 지난 단계 줄이 버튼이 되고 누르면 그 `value`로 콜백을 부른다. 남은 단계는 누를 수 없다. `onValueChange`가 없으면 전부 글이다
- **제어 전용이다.** `value`가 필수이고 `defaultValue`가 없다. 다음 단계로 넘어가는 조건(답을 맞혔는가)이 앱 로직이라 Stepper가 스스로 단계를 넘기는 경우가 없다. Chip의 `selected`와 같은 방식이다(C-12 R25)
- `value`가 어느 항목과도 맞지 않으면 전부 남은 단계로 그린다(던지지 않는다)
- 접근성: 웹은 `<ol aria-label={label}>`이고 펼친 단계 항목이 `aria-current="step"`이다. 지난 단계는 Stepper가 "완료"를 숨긴 글로 붙여 읽는다 — ds-feedback 8이 Button에 요구했던 것이다(20절). 키보드는 버튼의 Tab 순서 그대로이고 화살표 이동은 없다. native는 줄마다 `accessibilityState`와 라벨로 같은 뜻을 전한다. 정확한 문구는 구현에 맡긴다
- 세로 방향만 있다. `ref` 없음. 누름 핸들러를 받으므로 웹은 `"use client"` 대상이다
- `StepItem`은 tokens `contracts.ts`에 두고 `@eeennsu/web` · `@eeennsu/native` 진입점이 타입 전용으로 다시 내보낸다(R27의 `TabItem`과 같다)

| 대안 | 탈락 이유 |
|---|---|
| 가로 진행 표시(초안) | amulator의 단계 화면을 대체하지 못한다. ds-feedback 6 · 8이 닫히지 않는다 |
| `current: number` | C-14 위반, R25 보류를 연다 |
| 항목마다 `status: "done" \| "current" \| "upcoming"` | 한 단계 넘길 때 항목 둘을 고친다. 펼친 단계가 둘이 되는 잘못된 상태를 타입이 막지 못한다 |
| 파트 조합(`Stepper.Step`) | 한 컴포넌트 = 계약 키 하나(decisions-r27 1) |
| `content` 없이 줄만 그린다 | 펼친 단계의 내용을 목록 안 그 줄 아래에 둘 수 없어 앱이 목록을 다시 직접 그린다 |

## 17. Stepper 모양

amulator가 직접 그린 것은 번호 원이었고, 사용자가 2026-11-15에 꼽은 AI 티 목록에 "원 안 숫자, pill 배지"가 있다. 그 모양을 DS에 옮기지 않는다.

```
✓ 레지스터 초기화
✓ 명령어 읽기
▌ 레지스터 값 읽기
  (이 단계의 content)
  메모리 쓰기
  다음 명령어
```

- 줄마다 앞에 표시 자리(아이콘 폭)가 있고 그 뒤에 `label`이 온다. 모든 줄의 글자 왼쪽이 맞는다
- 지난 단계: 체크 아이콘(`fg.muted`)과 `fg.muted` 글. 누를 수 있으면 hover에서 글자색이 `fg.default`가 된다
- 펼친 단계: `bg-brand` 세로 막대(폭 2~3px, 줄 높이)와 `fg.default` semibold 글. 그 아래 `content`가 글자 열에 맞춰 놓인다
- 남은 단계: 표시 없이 `fg.muted` 글
- 번호, 원, 줄 사이 연결선, 상자를 그리지 않는다. `content`를 상자에 넣을지는 앱이 정한다(Card를 넣으면 된다)
- component recipe(`stepper`): 줄 높이 · 표시 자리 폭 · 줄 간격 · 글자 스텝

모양은 내부 구현이라 계약을 바꾸지 않고 고칠 수 있다. **사용자가 구현 화면을 보고 확인한다.**

Stepper 모양 확인(2026-11-16): verify-next `/components`의 라이트 · 다크 스크린샷(393px)을 보이고 지금 모양을 받아들일지 물었고, 사용자가 그대로 받아들였다. 지난 단계와 남은 단계 글이 같은 `fg.muted`라 체크 표시로만 구분되는 것도 함께 보였다. 표시 막대는 `border-l-2`(2px)로 펼친 단계 제목 줄 높이만 덮는다(구현 노트 N-20).

| 대안 | 탈락 이유 |
|---|---|
| 번호 원 + 연결선 | 사용자가 꼽은 AI 티 |
| 줄마다 Card | "내용을 전부 카드에 넣는다"도 같은 목록에 있다 |

## 18. Collapsible `disabled`

ds-feedback 2. `disabled?: boolean`을 더한다. 기능 불리언이다(C-11 예외). Base UI `Collapsible.Root`의 `disabled`로 넘기고, 트리거는 다른 컨트롤의 비활성 모양(투명도)을 따른다. 열린 채 비활성이면 열린 그대로 고정된다.

## 19. Collapsible 들여쓰기 · 모양

ds-feedback 3(트리거 · 패널의 `px-3`이 같은 카드의 문단보다 12px 들여써진다)과 8(모양이 하나뿐이라 "더 읽기"와 확인 질문이 같아 보인다)을 한 번에 푼다.

```ts
variant?: Extract<Variant, "ghost" | "secondary">; // 기본 "ghost"
```

| 값 | 모양 |
|---|---|
| `ghost`(기본) | 트리거 줄과 패널의 가로 여백이 0이다. 글자 왼쪽이 주변 문단과 맞는다. hover는 채움 대신 글자색(`fg.muted` → `fg.default`)으로 알린다 |
| `secondary` | 트리거 줄이 `surface-muted` 채움 상자(`rounded-md`, 가로 여백 3)다. 패널은 채우지 않고 가로 여백 3으로 트리거 글자와 맞춘다 |

- 기존 `variant` 어휘의 부분집합이다. Button의 `ghost`(바탕 없음) · `secondary`(연한 채움)와 뜻이 같다
- `secondary`도 패널은 채우지 않는다. 채우면 안의 CodeBlock · 인라인 코드 채움이 같은 색 위에서 사라진다(알려진 동작 32)
- **기본 모양이 바뀐다.** 0.5.0에서 `-mx-3`으로 당겨 맞춘 소비자(amulator)는 그 보정을 지워야 한다. 0.x의 minor이고 소비 앱이 amulator 하나라 받아들인다. 구현 노트와 README에 적는다
- 높이 42(md 컨트롤과 같다)는 그대로다

| 대안 | 탈락 이유 |
|---|---|
| `px-3`을 두고 README에 `-mx-3` 안내 | 모든 호출에 보정이 붙는다 |
| 들여쓰기만 고치고 모양은 하나 | ds-feedback 8이 남는다 |
| 새 축(`appearance`) | 같은 개념에 다른 이름이다(C-8) |

## 20. Button 상태 글 통로는 만들지 않는다

ds-feedback 8의 뒷부분 — Button의 `label`이 곧 접근성 이름이라 "완료" 같은 상태 글을 숨겨 넣을 통로가 없다. 이 요구가 나온 자리는 지난 단계를 다시 여는 ghost Button이었고(`StepList.tsx`의 `DoneRow`), 그 줄을 Stepper가 그리면서 "완료"도 함께 읽어 준다(16절). Button에 숨김 글 prop을 더하면 "`label`이 가시 텍스트 겸 접근성 이름"(C-13, WCAG 2.5.3)에 예외가 생긴다. Stepper를 쓴 뒤에도 같은 요구가 남으면 그때 연다.

## 21. Prose

- **한국어 줄바꿈**(ds-feedback 7): 루트에 `break-keep`(`word-break: keep-all`)과 `wrap-break-word`(`overflow-wrap: break-word`)를 준다. 어절 단위로 줄을 바꾸고, 줄보다 긴 URL · 식별자는 넘치지 않게 끊는다. Callout의 본문에도 같은 둘을 준다. Text는 바꾸지 않는다 — 한 줄짜리 UI 글이 대부분이고 요구가 없다
- **링크 포커스**(ds-feedback 1): `a`에 DS 컨트롤과 같은 `focus-visible` 외곽선을 준다. 색은 Link와 같은 `fg.brand`다. **밑줄은 지금처럼 늘 보인다** — 문단 속 링크라 색만으로 구분하면 안 된다(14절)

## 22. Table 세로 스크롤

ds-feedback 4 — 96px 넘는 높이가 없어 긴 표(39줄)를 스크롤 영역으로 가둘 수 없었다. 6절로 `max-h-96`이 생긴다. 남는 것은 그 클래스가 실제로 스크롤을 만드는지다. 수용 조건은 "`<Table className="max-h-96" …>`이면 스크롤 영역이 세로로 스크롤되고 가로 스크롤 · 키보드 포커스(알려진 동작 29)는 그대로"이다. `className`이 어느 요소에 붙는지와 `overflow` 값은 구현에서 맞춘다. 머리글 고정(sticky)은 넣지 않는다.

## 23. 웹 · native 범위

| 항목 | 웹 | native |
|---|---|---|
| 토큰(semantic 색 9개, 간격 키 6개, 타이포 스텝 2개, 굵기 키 3개, `--font-mono`) | ○ | ○ |
| `Size` 7단 · `tone` 7개(Text · Icon) | ○ | ○ |
| `border.surface`(Card · Input · Textarea · Chip), Badge · Chip `rounded-xl` | ○ | ○ |
| Link · Callout · Stepper | ○ | ○ |
| Collapsible `disabled` · `variant`, Prose, Table | ○ | — (native에 없다) |
| C-5c 재선언(radius · 표면 관계) | ○ | ○ (게이트 통과 조건) |

semantic 색 9개 = 연한 채움 5 + 글자 3 + `border.surface`. 컴포넌트 수는 웹 21 → 24, native 11 → 14다.

## 24. RN 착수 게이트

native 구현 전에 verify-expo에서 넷을 잰다. C-19 게이트와 같은 방식이고 기록은 `gate-c19.md`에 R28 절로 덧붙인다.

1. DS import 뒤 `:root { --radius-md: 2px; }` 재선언이 `rounded-md`의 `borderRadius`를 2로 바꾸는가
2. `text-lg font-normal`과 `text-md font-bold`에서 유틸리티 굵기가 스텝 굵기를 이기는가(클래스 순서를 바꿔도)
3. `font-mono`가 native 래퍼의 한 이름(`JetBrainsMono`)을 `fontFamily`로 내는가
4. 새 간격 키(`h-64`, `max-h-96`)와 새 타이포 스텝(`text-4xl`, 배수 line-height)이 기존 것과 같은 식으로 나오는가

실패하면 R24처럼 처리한다 — native 래퍼가 우회 선언을 낼 수 있으면 그렇게 하고, 안 되면 그 항목을 RN 계약에서 빼고 알려진 동작에 적는다. 1번이 실패하면 "RN은 radius 재선언이 안 된다"가 사용자 결정(웹과 RN 둘 다)과 어긋나므로 사용자에게 가져온다.

## 25. README 소비 규칙

design-flow가 이 절을 읽어 시안의 축을 정한다. web · native README의 "앱이 바꿀 수 있는 것"과 "바꾸지 않는 것"을 다시 쓴다.

- 앱마다 갈리는 축: 색(메인 색, 표면 관계), 모서리, 간격 리듬, 화면 구조
- **재선언할 수 있는 변수 목록**을 세 묶음으로 적는다 — 메인 색 다섯(`--bg-brand` · `--bg-brand-hover` · `--fg-on-brand` · `--fg-brand` · `--bg-brand-subtle`), 표면 관계 여섯(`--bg-canvas` · `--bg-surface` · `--bg-surface-muted` · `--bg-surface-hover` · `--border-default` · `--border-surface`), 모서리 넷(`--radius-sm` · `md` · `lg` · `xl`). README의 "어휘 목록을 옮겨 적지 않는다"는 원칙의 예외다 — 이 목록은 계약이고 design-flow가 읽는 자리라 적는다. 나머지 semantic 색도 재선언 대상이라는 것(C-5b)은 한 줄로 남긴다
- 표면 관계를 바꿀 때 맞출 짝: canvas와 surface를 같게 두면 `--border-surface`에 값을 준다. surface-muted는 canvas · surface와 구분되게 둔다(입력 칸 채움, CodeBlock)
- **폰트 로딩 의무**: DS는 패밀리 이름만 갖고 파일을 싣지 않는다. 소비 앱이 Pretendard(400 · 600 · 700)와, `font-mono`를 쓰면 JetBrains Mono를 로딩한다. 웹은 로딩 방법과 확인법(`document.fonts`에 패밀리가 `loaded`로 있는가)을, native는 등록할 패밀리 이름을 적는다
- 바꾸지 않는 것: 컴포넌트 소스, 컴포넌트 치수, 폰트 패밀리, `--radius-full`, `@theme` 확장, 스케일 밖 임의값
- 새 컴포넌트 · 유틸리티 안내: Collapsible `-mx-3` 보정 제거, Callout의 뜻은 글로 전한다, 웹 Link는 문서 이동이고 문단 속 링크는 Prose `a`다, `Tone` · `TypographyStep` 전수 맵에 새 키를 더한다
- **design-flow 쪽에 넘길 것**: 그 설계 문서 5.2절은 시안 축을 "brand 색 네 변수"로 적었는데 R28에서 다섯이 된다. my-agent-setup은 이 레포 밖이라 여기서 고치지 않고, 0.6.0을 낸 뒤 그 세션에 알린다
- 다 쓰면 `korean-humanizer`로 다듬는다(전역 규칙)

## 26. 버전 · 검증

- `0.6.0`, 세 패키지 lockstep
- tokens: 대비 테스트(12절), probe(새 키가 생성되고 열거 밖은 여전히 생성되지 않는다, radius 재선언이 캐스케이드에 남는다), `twMergeConfig`(굵기 키, 새 간격 · 글자 키, 새 색 키)
- web · native: 계약 타입 테스트(`Size` 7단, `tone` 7개, 새 컴포넌트 셋, number prop 없음 — AC-15), 컴포넌트 테스트
- verify-next `/components`에 새 컴포넌트와 재선언 확인 화면(radius · 표면 관계를 덮은 라우트)을 올려 Playwright로 본다. verify-expo는 게이트 넷과 새 컴포넌트 셋
- `pnpm verify:pack`으로 타르볼 설치를 다시 확인한다
- 스펙 조항 본문(C-5b · C-5c, C-6, C-7a, C-7b, C-8, C-12, C-13, C-17, AC, 알려진 동작 1 · 2 · 6 · 14 · 24 · 25 · 28 · 32와 새 항목, Non-Goals, Ontology)은 이 문서 승인 뒤 계획 전에 고친다

## 구현에 맡기는 것

- 새 semantic 색의 값(primitive 선택). 12절 대비 조건을 만족하면 된다
- `border.surface`의 투명 값을 토큰 소스에서 표현하는 방식, bakery에서 값을 줄지
- Link의 hover · 포커스 클래스, Callout · Stepper recipe의 정확한 수치, Stepper의 보조 기술 문구
- Table에서 `className`이 붙는 요소와 `overflow`
- 태스크 분할과 순서. 다만 RN 게이트(24절)는 native 구현보다 앞이다
- `IconName`에 새 이름이 필요하면 더한다(추가는 tokens + 양쪽 맵 세 곳)

## 열지 않은 것

- **R25 보류(데이터 값 number prop).** Stepper를 문자열 `value`로 설계해 닿지 않는다. 그대로 사용자 판단으로 남는다
- **`variant` 4개.** 진한 상태 채움을 만들지 않았다(10절)
- **독립 `weight` prop**(R21). 유틸리티로만 연다(7절)
- **다형성 prop**(C-10). 웹 Link가 라우터와 연동하지 않는 것을 받아들였다(14절)
- **스케일 구조의 브랜드별 분리**(R22 후보 C). 열거는 여전히 전 브랜드 공유이고 단계만 더했다(4 · 6절)
- **폰트 패밀리 재선언.** 사용자가 이번에 빼라고 했다
- **컴포넌트 치수**(Button 높이 · 패딩)의 앱 단위 통로. 요구가 없다. 알려진 동작 14에 남는다
- **CodeBlock 문법 강조 · 복사 버튼 · 줄 번호**(R27 범위). 사용자가 코드 강조색을 이번에 만들지 않기로 했다(13절)
- **RN 오버레이, native의 Collapsible · Prose · Table.** 범위 밖이다
