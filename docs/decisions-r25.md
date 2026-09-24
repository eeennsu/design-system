# R25 결정 기록 (2026-09-25)

첫 RN 소비 앱 spendback(`../spendback`)을 연동하고 디자인을 검증하면서 나온 DS 쪽 요구를 정리했다. 스펙 본문은 결과만 싣고(스펙 "R25 개정 요약"), 대안 비교는 여기 둔다. 판단 기준은 R21과 같다 — 확정 사항 불변, 되돌리기 쉬운 쪽, 유지보수 표면이 작은 쪽, 타입·테스트로 자동 강제되는 쪽.

- 입력: spendback `docs/DESIGN.md` 5.2(DS 0.2.0에 없는 것), 그 앱의 디자인 검증 지적(누름 영역, 눌림 표시, `tabular-nums`, placeholder 대비), 연동하며 잰 번들 크기, DS 검증 에이전트의 지적(RN Icon 배치, bakery 라이트 대비, 눌림 색이 소비자 배경을 무시함, 가로 누름 영역), 재검증 에이전트의 지적(RN Icon 변형 · 투명도 클래스, Chip 글자 크기 상한, RN Input 누름 영역, 문서 모순)
- 닫힌 결정(R21~R24)과 C-5c는 열지 않았다. 아래 "열지 않은 것"에 이유를 적었다

## 상태 요약

| # | 항목 | 결정 | 되돌리기 |
|---|---|---|---|
| 1 | 고르는 칩 | `Chip` 신설(웹 · RN). 토글 하나, `selected` + 누름 이벤트 | 하(그룹 컴포넌트 추가는 추가적) |
| 2 | 단독 아이콘 | `Icon` 공개(웹 · RN). `name` · `size` · `tone` · `label` | 하 |
| 3 | 아이콘 이름 | `home` · `list` · `chart-pie` · `calendar` 4개 추가(28개) | 하(추가는 추가적) |
| 4 | 눌림 표시 | Button · Chip `active:opacity-80`(웹 · RN 같은 클래스) | 하 |
| 5 | RN 누름 영역 | Button sm · md, Chip에 세로 `hitSlop` + 최소 폭 `min-w-12`로 48dp | 하 |
| 6 | RN 입력 포커스 · placeholder | Input · Textarea `focus:border-border-focus`(plan D-9 구현 누락), placeholder 색 `fg-muted` | 하 |
| 7 | RN 고정폭 숫자 | native 래퍼가 `.tabular-nums`에 RN 선언을 더한다 | 하 |
| 8 | RN 번들 크기 | native Icon이 lucide를 아이콘별 경로로 import | 하 |
| 9 | 글자 대비 | base 다크 `fg.on-brand` · `fg.on-danger`, bakery 다크 `fg.on-danger`, bakery 라이트 `fg.on-brand`를 gray-950으로, bakery 라이트 `bg.brand-hover`를 amber-500으로. tokens 대비 테스트 신설 | 중(값 변경이라 모양이 바뀐다) |

## 1. Chip

spendback 입력 폼은 카테고리 11개, 날짜, 지출/수입, 이유 태그, 만족도, 결제수단을 전부 칩으로 고른다. 웹 쪽 소비처(내역 필터 같은 것)도 같은 모양을 쓴다.

| 안 | 내용 | 판정 |
|---|---|---|
| **A. 토글 칩 하나** | `Chip: { label; selected?; disabled?; className?; ref? } & Press<P>`. 상태는 소비자가 누름 이벤트에서 바꾼다 | **채택** |
| B. 값 입력 그룹 | `ChipGroup: { label; value; defaultValue; onValueChange; children: Chip[] }`(C-12 값 3종), 라디오 의미 | 탈락 |
| C. Base UI Toggle 이름을 따른 계약 | `pressed` / `defaultPressed` / `onPressedChange` | 탈락 |

- A는 계약 표면이 가장 작다. `selected`는 `disabled` · `invalid`(D-16)와 같은 상태 불리언이라 C-11 예외에 든다. 누름은 이미 있는 `Press<P>` 갈래를 그대로 쓴다. 오버레이가 `trigger` 없이 소비자의 Button 누름으로 `open`을 바꾸는 것(C-12)과 같은 방식이다
- B는 한 개 고르기(카테고리)와 고른 것 지우기(선택 항목) 규칙이 앱마다 다르다. spendback만 해도 필수 항목은 지울 수 없고 선택 항목은 다시 눌러 지운다. 그 규칙을 그룹 prop으로 올리면 불리언이 늘고(C-11), 여러 개 고르기가 필요해지면 `value` 타입이 갈린다. A 위에 소비자가 몇 줄로 짜는 편이 낫다. 그룹이 필요해지면 나중에 추가적으로 연다
- C는 "같은 개념에 두 이름을 두지 않는다"(C-12 원칙)와 부딪힌다. 이 칩의 누름은 Button과 같은 누름이다
- 접근성: 웹은 `<button aria-pressed>`, RN은 `accessibilityRole="button"` + `accessibilityState.selected`. 그룹 의미("11개 중 1번째")는 없다(알려진 동작 19)
- 라벨은 글자 크기 설정을 끝까지 따른다. 처음 구현은 RN 라벨을 `maxFontSizeMultiplier` 1.5로 잘랐는데 WCAG 1.4.4(200%)에 못 미치고 Button과 어긋나 뺐다(DS 재검증 DS-002). 칩 묶음은 줄을 바꿔 늘어난 글자를 받는다

## 2. Icon

탭 바, 설정 목록의 꺾쇠, 상태 표시처럼 버튼 밖의 아이콘이 필요하다. 지금은 `<Button icon>` 안에서만 쓸 수 있다.

| 안 | 색을 정하는 방법 | 판정 |
|---|---|---|
| **A. `tone` 축** | Text와 같은 `default | muted | danger`, 기본 `default`. `className`의 `text-*`가 덮는다 | **채택** |
| B. 글자색 상속 | 웹 `currentColor` | 탈락 — RN에는 View → 아이콘 색 상속이 없어 같은 코드가 두 플랫폼에서 다르게 칠해진다(AC-25) |
| C. `color` prop | 색 값을 받는다 | 탈락 — 색 의도를 받는 prop은 enum 키만 받는다(C-14) |

- 이름은 문자열로만 받는다(C-7c). 플랫폼 분기는 DS 안에 있다
- `label`은 선택이다. 있으면 이름 있는 그림(웹 `role="img"` + `aria-label`, RN `accessibilityRole="image"`), 없으면 꾸밈이라 숨긴다. 아이콘은 인터랙티브가 아니므로 C-13의 필수 대상이 아니다
- `size`는 컨트롤과 같은 `sm | md | lg`(16 · 20 · 24)다
- 누름 이벤트는 없다. 누르는 아이콘은 Button의 일이다(아이콘 전용 Button은 여전히 없다, 알려진 동작 9)
- RN은 svg를 View 하나로 감싸고 `className`을 그 View에 붙인다. 두 번 고쳐 여기에 왔다. 처음 구현은 View로 감싸고 클래스를 안쪽 svg에 붙여 `ml-auto` · `absolute` 같은 배치 클래스가 웹(svg 자신이 flex 항목)과 다르게 걸렸다(DS 검증 DS-001). 다음 구현은 View를 없애고 svg에 붙였는데, lucide가 style을 자식 도형마다 펼쳐 `rotate-*` · `scale-*`는 렌더 중 예외를 던지고 `opacity-50`은 세 번 곱해져 약 0.125가 됐다(DS 재검증 DS-001). 지금은 배치 · 변형 · 투명도가 View에 한 번 걸리고 색(`text-*`)만 lucide `color`로 간다. 접근성 속성도 View에만 있어 도형마다 복사되지 않는다
- RN에서 그림 크기는 `size` prop이 정한다. react-native-svg가 width · height prop을 style보다 뒤에 적용해 `className`의 `size-*`가 이기지 못한다. 크기 축은 계약(컨트롤 3단)이 정하므로 알려진 동작 20으로 두었다. 웹과 맞추려고 크기를 클래스로 옮기는 안은 20px(키 5)가 간격 열거에 없어(계획 F-8) 임의값 클래스를 DS 소스에 써야 해 버렸다

## 3. 아이콘 이름 4개

`home`(House), `list`(List), `chart-pie`(ChartPie), `calendar`(Calendar). 탭 바 3개와 날짜 선택용이다. lucide의 정식 export 이름만 쓴다(plan v2 F-6). lucide 전체 이름을 타입으로 여는 안은 D-8에서 이미 탈락했다.

## 4. 눌림 표시

0.2.0의 RN Button은 누르는 동안 모양이 그대로다. 웹은 `hover:`가 있지만 RN에는 hover가 없다.

| 안 | 판정 |
|---|---|
| **`active:opacity-80`** — react-native-css가 Pressable의 누름 상태로 푼다. 색과 무관해 소비자가 바꾼 배경을 따라간다 | **채택** |
| `active:bg-*-hover` — 이미 있는 hover 토큰 | 탈락. 처음 구현이 이것이었는데, `<Button className="bg-danger">`가 누르는 동안만 brand-hover(파랑)로 칠해졌다(DS 검증 DS-003). 소비자 `bg-*`는 `active:` 그룹을 덮지 못한다(C-15 승리 범위) |
| `android_ripple` | 탈락 — 색을 주면 JS 값이라 소비자의 C-5b 재선언이 닿지 않는다(알려진 동작 11). 색을 빼면 테마의 중립색(`colorControlHighlight`)이라 쓸 수는 있지만(spendback 디자인 검증 3차 008), Android에만 있어 웹과 눌림 어휘가 갈리고(AC-25) 소비자 `className`으로 바꿀 수 없다 |
| Reanimated 눌림 크기 변화 | 탈락 — 의존성과 움직임 정책이 DS에 들어온다 |

웹 Button · Chip에도 같은 클래스를 넣어 두 플랫폼의 어휘를 맞춘다(AC-25). 누르는 동안 라벨 대비가 내려간다 — canvas 위에 합성해 primary 3.75(base 라이트) · 3.76(base 다크), danger 3.63(두 브랜드 다크)이다(DS 재검증 DS-005). 0.9로 올려도 4.39~4.46이라 기준을 채우지 못하고 눌림이 덜 보인다. 손을 떼면 돌아오는 순간 상태라 받아들였다.

## 5. RN 누름 영역

컨트롤 높이 30 · 42 · 54(D-6)는 Input과 Button의 높이를 맞춘 값이다. 앱 기준(44pt · 48dp)에는 sm · md가 모자라다.

| 안 | 판정 |
|---|---|
| **세로 `hitSlop`**(sm 9, md 3, Chip 5) — 모양은 그대로 두고 누름 영역만 48 | **채택** |
| 높이를 48로 올린다 | 탈락 — D-6의 높이 맞춤과 웹 · RN 같은 높이가 깨진다 |
| 소비자가 `min-h-12`를 준다 | 탈락 — 모든 호출 지점에서 반복해야 한다(알려진 동작 14와 같은 모양) |

가로는 라벨과 패딩이 대개 48을 넘지만 "예" · "+" 같은 짧은 라벨은 모자라다(DS 검증 DS-004). 가로 hitSlop은 한 줄에 붙은 이웃과 바로 겹치므로 최소 폭 48(`min-w-12`, 간격 열거 안)을 둔다. 웹은 그대로다(웹 기준 24px은 이미 넘는다). 이웃 컨트롤이 slop보다 가까우면 누름 영역이 겹친다(알려진 동작 18).

RN Input · Textarea는 보정하지 않았다(DS 재검증 DS-003). `TextInput`의 hitSlop은 기기 동작을 확인하지 못했고, Pressable로 감싸 누르면 `focus()`를 부르는 안은 코드와 접근성 트리가 늘어난다. sm · md는 누름 영역이 보이는 높이(30 · 42) 그대로라 터치 폼에는 `lg`를 권한다(알려진 동작 18). 0.1.0부터 있던 차이다.

## 6. RN 입력 포커스 · placeholder

plan D-9는 "RN: Input에 NativeWind `focus:border-border-focus`"라고 정했는데 0.2.0 구현에 빠져 있었다. 계획대로 넣는다. `invalid`는 포커스 중에도 danger 테두리를 지킨다 — 웹은 포커스를 테두리가 아니라 outline으로 그려 두 상태가 겹치지 않는다.

placeholder는 0.2.0까지 플랫폼 기본색이었다(N-13). Android AppCompat 라이트의 기본 hint 색은 흰 표면 위 약 2.7:1이라 spendback 검증에서 걸렸다. react-native-css가 `placeholder:` 변형을 옮기지 않는 대신 `useCssElement`의 매핑은 클래스의 색을 다른 prop으로 옮길 수 있다(Icon이 이미 `color`로 쓴다). DS 안에 `placeholderClassName` → `placeholderTextColor` 매핑을 가진 TextInput을 두고 `text-fg-muted`를 준다(웹 Input의 `placeholder:text-fg-muted`와 같은 토큰). 계약은 그대로다 — 소비자는 이 prop을 볼 수 없다(AC-11a).

## 7. RN 고정폭 숫자

react-native-css 3.0.7은 `font-variant-numeric`을 RN 스타일로 옮기지 않는다. 그래서 `tabular-nums`가 RN에서 아무 일도 하지 않고, 금액 같은 숫자의 자릿수 폭이 흔들린다.

| 안 | 판정 |
|---|---|
| **native 래퍼가 `.tabular-nums { -rn-font-variant: tabular-nums }`를 더한다** | **채택** — T-N0(다크 블록, 배수 line-height)과 같은 "native 래퍼만 RN 보정" 경로다. 같은 클래스가 웹 · RN에서 같은 결과를 낸다 |
| Text에 `numeric` 같은 prop | 탈락 — 계약이 늘고 소비자 `className="tabular-nums"`는 여전히 무효다 |
| react-native-css가 고칠 때까지 기다린다 | 탈락 — 0.x 동안 고정 버전을 쓰므로(C-19) 언제 풀릴지 모른다 |

`oldstyle-nums` 같은 나머지 `font-variant-numeric` 유틸리티는 RN에서 여전히 무효다(알려진 동작 17).

## 8. RN 번들 크기

native Icon이 `lucide-react-native` 목록 파일에서 import하면 Metro(tree shaking 없음)가 아이콘 3,600여 개를 모두 번들에 넣는다. spendback 릴리스 번들에서 잰 값: 3.91MB → 아이콘별 경로 import로 2.20MB. lucide-react-native 1.41.0은 `./icons/*` 경로를 공식으로 내보낸다. 웹은 번들러(Next · Vite)가 tree shaking을 하므로 바꾸지 않는다.

## 9. 글자 대비

| 조합 | 0.2.0 | 0.3.0 |
|---|---|---|
| base 다크 brand(blue-500) 위 on-brand | 흰색 3.71:1 | gray-950 5.42:1 |
| base 다크 danger(red-500) 위 on-danger | 흰색 3.81:1 | gray-950 5.29:1 |
| bakery 다크 danger 위 on-danger | 흰색 3.81:1 | gray-950 5.29:1 |
| bakery 라이트 brand(amber-600) 위 on-brand | 흰색 3.20:1 | gray-950 6.29:1 |
| bakery 라이트 brand-hover 위 on-brand | 흰색 위 amber-700 5.03:1 | gray-950 위 amber-500 9.40:1 |

버튼 글자(16px 400)는 4.5:1이 기준이다. brand · danger 배경을 어둡게 하는 안은 다크 표면(gray-900 · 950) 위에서 버튼이 가라앉고 두 브랜드의 배경 값이 모두 바뀌어 탈락했다. bakery 다크의 on-brand는 이미 gray-950이라 같은 방식이다. bakery 라이트(DS 검증 DS-002)는 두 안이 있었다 — (a) brand를 amber-700으로 어둡게(흰 글자 5.03), (b) 글자를 gray-950으로. amber-700은 갈색에 가까워 브랜드 인상이 바뀌어 (b)를 골랐다. gray-950 글자에 hover가 더 어두우면(amber-700, 4.00:1) 다시 떨어지므로 hover를 밝은 쪽(amber-500)으로 뒤집었다. base 라이트는 그대로다(흰 글자 5.25 · 4.77). bakery 라이트의 포커스 표시(amber-600, canvas amber-50 위 3.09:1)는 3:1을 겨우 넘어 그대로 둔다. 같은 amber-600인 고른 Chip 채움도 비텍스트 3:1 대상이다 — 3.08(canvas) · 3.19(surface)로 경계에 붙어 있어 대비 테스트에 넣었다(DS 재검증 DS-010). 대비는 기기가 칠하는 sRGB 값(F-15의 런타임 환산)으로 쟀다.

이 실패들은 0.1.0부터 검사 없이 나갔다. tokens에 대비 테스트를 두어 브랜드 × 스킴마다 글자 쌍(fg · muted · danger · on-brand · on-danger와 그 배경, hover 포함) 4.5:1, 포커스 표시 · 고른 칩 채움 3:1을 확인한다. 환산은 CSS Color 4 식을 테스트 안에 두었다(의존성 없음).

## 열지 않은 것

| 요구 | 열지 않은 이유 | 앱은 지금 |
|---|---|---|
| Chip의 고른 상태 표시에 check 아이콘 | 켜고 끌 때 칩 폭이 바뀌어 줄이 흔들린다. 고른 칩은 채움과 글자색이 함께 바뀌어 색만으로 알리는 것이 아니다 | - |
| 입력 칸 테두리 3:1(`border.control` 같은 semantic 추가) | semantic 변수 추가는 C-5b 계약 표면이 늘고 두 브랜드 값을 모두 정해야 한다. 입력 칸은 라벨로 식별되고 포커스 테두리가 생겼다. 소비 앱 두 개에서 문제가 되면 연다 | - |
| RN `kind="number"` → `number-pad` | C-11이 스펙에 매핑 표를 두었다(`numeric`). 원 단위 정수 앱에는 `number-pad`가 맞지만 소수가 필요한 앱도 있다. 열거형에 값을 더하는 것(`integer` 등)은 추가적이라 요구가 둘이 되면 본다 | 숫자 외 문자를 코드가 거른다 |
| 사용률 막대(Progress · Meter) | 값(`value: number`)을 받아야 하는데 계약 전체에 number prop이 없다(C-14, AC-15). 토큰 값 prop을 막으려던 규칙이지만 AC-15의 타입 테스트는 모든 number를 막는다. 데이터 값 prop을 허용할지는 사용자 판단이 필요하다 | 앱 컴포넌트 |
| 텍스트 줄 수 제한(`numberOfLines`) | 같은 이유(number prop) | RN Text + DS 클래스 |
| 문장 안 강조 | Text는 문자열만 받는다(알려진 동작 6, v1 범위 밖) | 중첩 RN Text |
| 더 큰 표시 글자(3xl) | 5단 스케일(C-7a, B-8)을 다시 여는 일이다 | `text-2xl` |
| 목록 줄(ListItem) | 소비 앱에서 모양이 아직 굳지 않았다. 세 화면에서 같아지면 본다 | 화면 안 조합 |
| RN 바텀 시트 · 대화상자 | RN 오버레이는 v2(Non-Goals) | React Navigation formSheet |
| 앱 단위 radius · 글꼴(C-5c) | 트리거(소비 앱 2개 뒤 사용자 판단)가 아직이다 | - |
| RN Chip이 고르지 않은 상태를 알리기 | C-13(R25)이 `accessibilityState.selected`로 정했다. `selected: false`는 스크린 리더가 읽지 않아 "버튼"으로만 들린다(웹은 "토글 버튼, 눌리지 않음", DS 재검증 DS-009). `togglebutton` 역할 + `checked`로 바꾸는 안은 기기에서 읽히는 방식을 먼저 봐야 하고 C-13 매핑을 바꾸는 사용자 판단이다 | - |
| RN 입력 포커스를 굵게 | 알려진 동작 23. RN outline 스타일은 높이를 흔들지 않지만 react-native-css 3.0.7이 `focus:outline-*`를 옮기는지 기기에서 확인하지 못했다(DS 재검증 DS-011). 되면 `invalid` 포커스가 캐럿으로만 보이는 문제도 같이 풀린다 | 1px 색 변화 |
| 웹 Dialog · Drawer 닫기 버튼 24px | 16px 아이콘 버튼이 0.1.0부터 그대로다(DS 재검증 DS-012). 주변에 다른 누름 대상이 없어 WCAG 2.5.8 간격 예외에 든다. 이번 범위(RN 소비 앱) 밖이라 웹 소비 앱 작업 때 `p-1 -m-1`로 채운다 | - |
| 웹 Button · Chip `cursor-pointer` | Tailwind v4 기본(버튼은 `cursor: default`)을 0.1.0부터 따른다. Chip만 바꾸면 Button과 갈린다(DS 재검증 DS-010) | - |
| NativeWind 5.0.0-rc.0 · react-native-css 3.1.0-rc.0 | C-19: 정식 승격 전까지 검증한 preview를 고정하고 승격 뒤 한 번만 올린다. rc.0은 `latest`가 아니다(2026-09-25 `latest`는 4.2.7). 올리면 C-19 게이트 9항목을 다시 돌려야 한다. rc.0도 `@expo/metro-config`를 peer로 요구하고 Metro 변환기 구조가 같아, RN CLI 소비자의 문제를 풀어 주지도 않는다 | preview.4 |
