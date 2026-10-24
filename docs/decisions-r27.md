# R27 결정 기록 (2026-10-24)

첫 웹 소비 앱인 amulator 학습 사이트(`../amulator`)가 챕터 화면에 쓸 범용 UI 다섯 개를 DS에 요청했다. Tabs · Table · CodeBlock · Prose · Collapsible을 `@eeennsu/web`에만 더해 `0.5.0`으로 낸다. 스펙 본문은 결과만 싣고(스펙 "R27 개정 요약"), 대안 비교는 여기 둔다. 판단 기준은 R21과 같다 — 확정 사항 불변, 되돌리기 쉬운 쪽, 유지보수 표면이 작은 쪽, 타입 · 테스트로 자동 강제되는 쪽.

- 입력: amulator `docs/superpowers/specs/2026-10-19-amulator-learning-site-design.md` 4.3 · 4.4 · 9절. 그 문서에서 사용자가 정한 것은 다섯 개를 DS에 넣는다는 것, 웹 전용이라는 것, Collapsible을 모든 챕터(확인 질문의 답 펼치기, 기본으로 접힌 "실제 안드로이드 에뮬레이터는" 상자)에 쓴다는 것, 범위를 다섯 개로 고정한다는 것이다
- **이 라운드의 API 결정은 전부 설계자 판단이다.** 사용자는 다섯 개가 DS에 들어갈 것이라고 보고 인터뷰 없이 진행하라고 했다. 아래 표의 "결정" 열은 기존 컴포넌트 관례(축 이름, Dialog · Tooltip이 Base UI를 감싸는 방식, `Contracts<P>` 모양, ref 핸들)를 따라 고른 것이고, 사용자가 고른 것이 아니다. 컴포넌트는 amulator 전용이 아니라 어느 웹 소비 앱에서도 쓰는 모양으로 정했다
- 닫힌 결정(R21~R26)과 C-5c, R25 보류(데이터 값 number prop)는 열지 않았다. 아래 "열지 않은 것"에 이유를 적었다
- `@base-ui/react` 1.8.0에 두 파트가 있는 것을 설치본에서 확인했다 — `node_modules/.pnpm/@base-ui+react@1.8.0_…/node_modules/@base-ui/react/tabs/index.parts.d.ts`(Root · List · Tab · Indicator · Panel), `…/collapsible/index.parts.d.ts`(Root · Trigger · Panel), `package.json` exports의 `./tabs` · `./collapsible`. 새 의존성은 없다

## 상태 요약

| # | 항목 | 결정 | 근거 | 되돌리기 |
|---|---|---|---|---|
| 1 | 다섯 개의 모양을 정하는 공통 제약 | 한 컴포넌트 = 한 계약 키 = `FC<Props>` 하나. 파트를 정적 속성으로 붙이지 않는다 | 설계자 판단 | 하 |
| 2 | Tabs 구조 | 데이터 방식 `items: { value; label; content }[]` | 설계자 판단 | 중(파트 방식으로 바꾸면 소비자 코드가 바뀐다) |
| 3 | Tabs 값 | `value` · `defaultValue` · `onValueChange`, 값은 `string`. 비제어면 첫 항목 | 설계자 판단 | 하 |
| 4 | Tabs `label` | 필수. 탭 목록(`role="tablist"`)의 접근성 이름이고 화면에 보이지 않는다. 항목의 `label`은 탭 글자 | 설계자 판단 | 하(보이게 하는 것은 추가적) |
| 5 | Tabs 키보드 · 패널 | Base UI 기본 그대로 — 화살표로 포커스 이동, Enter · Space로 활성화, Home · End, 끝에서 처음으로. 가로만. 숨은 패널은 마운트하지 않는다 | 설계자 판단 | 하(내부 옵션) |
| 6 | Tabs 모양 | 밑줄 탭 — 목록 아래 `border-border` 선, 활성 탭은 `border-brand` 2px 밑줄 + `text-fg` | 설계자 판단 | 하 |
| 7 | Table 구조 | 데이터 방식 `columns: { label; align? }[]` + `rows: TableRow[]`(`{ cells: ReactNode[] }`, 셀은 위치 순서) | 설계자 판단 | 중 |
| 8 | Table 숫자 정렬 | 열마다 `align: "start" \| "end"`, `end`는 `text-end tabular-nums` | 설계자 판단 | 하 |
| 9 | Table · CodeBlock `label` | 선택. 보이는 캡션(`<caption>` · `<figcaption>`)으로 렌더하고 접근성 이름을 겸한다 | 설계자 판단 | 하 |
| 10 | 가로 스크롤 | Table · CodeBlock의 스크롤 영역은 `overflow-x-auto`이고 `tabIndex={0}`으로 키보드 포커스를 받는다. `label`이 있으면 `role="region"` + `aria-label` | 설계자 판단 | 하 |
| 11 | CodeBlock 범위 | 블록 하나. 인라인 코드는 Prose가 맡는다. 문법 강조 · 복사 버튼 · 줄 번호 · 언어 prop 없음, 줄바꿈 없이 가로 스크롤 | 설계자 판단(문법 강조 제외는 소비 앱 설계 문서의 설계자 판단을 따랐다) | 하(추가는 추가적) |
| 12 | CodeBlock 모양 | 루트(`<figure>`)가 `bg-surface-muted rounded-lg` 채움, 글꼴 `font-mono` | 설계자 판단 | 하 |
| 13 | Prose 방식 | 정적 클래스 문자열의 임의 변형(`[:where(&)_h2]:text-xl`)으로 원시 요소를 칠한다. 특이성은 `:where`로 낮춘다 | 설계자 판단 | 중(선택자 범위를 바꾸면 소비 화면 모양이 바뀐다) |
| 14 | Prose가 다루는 요소 | h1~h3 · p · ul · ol · li · a · 인라인 code · pre · blockquote · hr · table · th · td · img. 세로 간격은 직계 자식 형제 규칙 | 설계자 판단 | 하(추가는 추가적) |
| 15 | Prose 안의 DS 컴포넌트 | DS 컴포넌트는 자기 클래스가 이긴다(`:where`). Prose의 `pre` · `table`은 CodeBlock · Table과 같은 recipe 값을 쓴다 | 설계자 판단 | 하 |
| 16 | Collapsible 구조 · 값 | 컴포넌트 하나. `label`(필수)이 트리거 글자, `open` · `defaultOpen` · `onOpenChange`, 기본은 닫힘 | 설계자 판단 | 하 |
| 17 | Collapsible 모양 · 패널 | 상자 없이 ghost 트리거 줄 + 꺾쇠 아이콘. 상자가 필요하면 Card에 넣는다. 닫힌 패널은 마운트하지 않는다(찾기로 펼쳐지지 않는다). 높이 애니메이션 없음 | 설계자 판단 | 하 |
| 18 | ref | 다섯 개 모두 `ref` 없음 | 설계자 판단 | 하(추가는 추가적) |
| 19 | 토큰 | 새 semantic 토큰 없음. 구분선은 기존 `border.default`(라이트 canvas 위 1.12로 약하다 — T-V4에서 사용자 확인) | 설계자 판단 | 하 |
| 20 | component recipe | Tabs · Table · CodeBlock · Collapsible에 component 계층 recipe를 둔다. Prose는 두지 않는다 | 설계자 판단 | 하 |
| 21 | `font-mono` | 계획 S-7(어휘 봉쇄의 예외)을 스펙 알려진 동작 28로 옮기고, tokens probe가 `font-mono` 생성을 확인한다 | 설계자 판단(소비 앱 설계 문서의 판단을 따랐다) | 하 |
| 22 | 검증 화면 | verify-next에 서버 컴포넌트 라우트 `/components`를 새로 두고 다섯 개와 Chip · Icon을 올린다. AC-23 스크린샷 라우트(`/`)는 그대로 | 설계자 판단 | 하 |

## 1. 공통 제약 — 한 컴포넌트는 `FC<Props>` 하나

shadcn · Radix 관례는 `Tabs.List` · `Tabs.Trigger`처럼 파트를 정적 속성으로 붙인다. 이 레포에서는 그 모양이 계약 검사와 부딪힌다.

- C-17 맵 테스트는 `expectTypeOf(components).toEqualTypeOf<{ [K in WebKey]: FC<Contracts<"web">[K]> }>()`다. `Tabs.Tab`을 붙이면 `typeof Tabs`가 `FC<Props> & { Tab: … }`가 되어 동등성이 깨진다
- 파트를 최상위 컴포넌트(`TabsList` · `TabsTab` · `TabsPanel`)로 내면 계약 키가 다섯이 아니라 열다섯 남짓이 되고, 키마다 C-13 · AC-14 · AC-15 검사 대상이 된다. RN v2가 같은 계약을 구현할 때도 파트마다 대응물을 만들어야 한다
- 그래서 다섯 개 모두 "props 하나로 다 받는" 모양을 먼저 찾고, 그 모양이 일반 소비 앱의 쓰임을 막는지 따로 봤다(2 · 7 · 13 · 16)

## 2. Tabs 구조

| 안 | 내용 | 판정 |
|---|---|---|
| **A. 데이터 방식** | `<Tabs label="보기" items={[{ value: "c", label: "C", content: <CodeBlock>…</CodeBlock> }]} />` | **채택(설계자 판단)** |
| B. 파트 방식(최상위 키) | `Tabs` + `TabsList` + `Tab` + `TabsPanel` | 탈락 |
| C. 패널 자식 방식 | `<Tabs label="…"><TabPanel value="c" label="C">…</TabPanel></Tabs>`, Tabs가 자식 props를 읽어 목록을 만든다 | 탈락 |

- A는 계약 키 하나다. 탭 글자와 패널 내용이 한 항목에 묶여 있어 "탭은 있는데 패널이 없다" 같은 어긋남이 타입에서 생기지 않는다. RN v2도 같은 배열로 그린다
- B는 1절의 비용(계약 키 · 검사 대상 증가)을 그대로 문다. 탭 위치를 자유롭게 배치하는 이점은 이 DS가 지금 받는 쓰임(챕터 안 예시 전환, 설정 화면 구역 전환)에 필요하지 않다
- C는 `Children.map`으로 자식 props를 읽어야 한다. 소비자가 `TabPanel`을 다른 컴포넌트로 감싸거나 조건부로 넣으면 조용히 빠진다. React 문서도 이 방식을 권하지 않는다
- 항목 타입은 `TabItem = { value: string; label: string; content: ReactNode }`로 계약 파일에서 내보낸다. `content`는 웹 전용이라 `ReactNode`다(C-17 children 규칙의 웹 전용 갈래)
- 항목별 `disabled`는 두지 않는다. 항목 타입에 선택 필드를 더하는 것은 추가적이고 지금 요구가 없다

## 3. Tabs 값

- 고른 탭은 값 입력과 같은 3종 `value` · `defaultValue` · `onValueChange`다(C-12). Base UI `Tabs.Root`의 이름과 같다. 오버레이 3종(`open`)이 아니다 — 열림 · 닫힘이 아니라 여럿 중 하나를 고르는 값이다
- 값은 `string`이다. Base UI의 `Tabs.Tab.Value`는 `any`이고 비제어 기본값이 숫자 `0`이지만, DS는 number prop을 두지 않으므로(C-14) 문자열로 좁힌다
- `value`도 `defaultValue`도 없으면 DS가 `items[0].value`를 `defaultValue`로 넘긴다. Base UI 기본값 `0`은 문자열 값과 맞지 않아 자동 대체(이벤트 사유 `initial`)에 기대게 되는데, 그러면 서버 렌더에서 첫 패널이 비었다가 hydration 뒤에 나타날 수 있다
- `onValueChange`는 Base UI 콜백의 둘째 인자(`eventDetails`)를 버리고 값만 넘긴다. Dialog의 `onOpenChange`와 같은 처리다

## 4. Tabs `label`

C-13은 인터랙티브 컴포넌트에 `label`을 요구한다. Tabs에는 이름 붙일 자리가 둘이다.

| 안 | 판정 |
|---|---|
| **루트 `label` 필수 → `Tabs.List`의 `aria-label`. 항목 `label`은 탭 글자 겸 그 탭의 접근성 이름** | **채택(설계자 판단)** |
| 루트 `label`을 제목으로 렌더 | 탈락 — 탭 위에 제목을 둘지는 화면 구조라 앱이 정한다. ButtonGroup(`role="group"` + `aria-label`, 보이지 않음)과 같은 판단이다 |
| 루트 `label` 없음(항목 `label`만) | 탈락 — 한 화면에 탭 묶음이 둘이면 스크린 리더가 둘을 구분하지 못한다. 필수 → 선택은 추가적이고 반대는 파괴적이라 필수로 시작한다(C-13 ButtonGroup과 같은 논리) |

## 5. Tabs 키보드 · 패널

Base UI 1.8.0 `Tabs.List` 기본값을 그대로 쓴다. 공개 prop으로 열지 않는다.

- `activateOnFocus = false` — 화살표는 포커스만 옮기고 Enter · Space가 탭을 바꾼다. WAI-ARIA 작성 지침은 패널이 지연 없이 뜨면 포커스 즉시 활성화를 권하지만, 패널 안에 무거운 위젯(amulator의 에뮬레이터 화면 같은 것)이 있으면 화살표를 누를 때마다 마운트 · 해제가 일어난다. 일반 DS로는 수동 활성화가 덜 놀랍다
- `loopFocus = true`, Home · End 활성(`TabsList.js`가 `enableHomeAndEndKeys: true`를 넘긴다)
- `Tabs.Panel keepMounted = false` — 숨은 패널은 DOM에 없다. 그래서 탭을 바꾸면 그 패널 안의 상태가 사라지고, 브라우저 찾기가 숨은 패널을 찾지 못한다(알려진 동작 31). 상태를 지켜야 하는 화면은 소비자가 상태를 Tabs 밖으로 올린다
- 방향은 가로만이다. `orientation`은 열거형으로 나중에 추가할 수 있다
- 탭 버튼은 Base UI `useButton`이 `type="button"`을 붙인다(`internals/use-button/useButton.js`). Form 안에서 Enter 제출 대상이 되지 않는다(C-21)

## 6. Tabs 모양

| 안 | 내용 | 판정 |
|---|---|---|
| **A. 밑줄 탭** | 목록 아래 `border-b border-border`, 탭 `border-b-2 border-transparent text-fg-muted`, 활성 `data-[active]:border-brand data-[active]:text-fg` | **채택(설계자 판단)** |
| B. 세그먼트(토스 필터 모양) | 트랙 `bg-surface-muted`, 활성 탭 `bg-surface` | 탈락 |

- A는 바탕이 canvas든 surface든 같은 모양이다. 활성 표시가 색과 함께 2px 밑줄(모양)이라 색만으로 알리지 않는다. brand 밑줄은 비텍스트 3:1을 넘는다(흰 surface 위 4.64, 다크 zinc-900 위 3.57 — decisions-r26 4 · 5의 수치)
- B는 활성 탭과 트랙의 차이가 라이트 1.24, 다크 zinc-900 · zinc-800으로 약하다. 다크에서는 활성 탭이 트랙보다 어두워 눌린 것처럼 보인다
- 글자 무게로 활성을 표시할 수 없다 — 무게는 글자 스텝만 정한다(C-6 `--font-weight-*` 리셋). 그래서 색 + 밑줄이다
- 탭 버튼에 `-mb-px`를 줘서 활성 밑줄 2px가 목록의 1px 선 위에 겹친다(선이 두 줄로 보이지 않는다)
- 탭 높이는 `px-4 py-2 text-md` + 아래 테두리 2px로 42다. md 컨트롤 높이(D-6)와 같다. 패널은 `pt-4`다

## 7. Table 구조

| 안 | 내용 | 판정 |
|---|---|---|
| **A. 데이터 방식** | `columns: { label: string; align?: "start" \| "end" }[]`, `rows: TableRow[]`(`TableRow = { cells: ReactNode[] }`) | **채택(설계자 판단)** |
| B. 파트 방식 | `Table` · `TableHeader` · `TableRow` · `TableCell` … 최상위 키 4~6개 | 탈락 |
| C. 스타일 감싸개 | `<Table>` 안에 소비자가 원시 `<thead>` · `<tr>` · `<td>`를 쓰고 Table이 선택자로 칠한다 | 탈락 |

- A는 계약 키 하나에 숫자 정렬을 열 단위 열거형으로 강제한다(8). 셀은 `ReactNode`라 코드 · Badge · 링크를 넣을 수 있다
- B는 1절 비용. C는 모양이 Prose와 같은 선택자 방식이 되어 "표 모양"이 두 곳(Table · Prose)에서 같은 일을 한다. 원시 요소 표는 MDX의 마크다운 표가 이미 만들고, 그것은 Prose가 칠한다(14). React로 짜는 표는 구조를 DS가 쥐는 편이 낫다
- 열 타입은 `TableColumn = { label: string; align?: "start" | "end" }`으로 계약 파일에서 내보낸다. 열의 `label`은 머리글 글자다(보이는 글자 = 이름, C-13 어휘)
- 행 모양은 세 안을 비교했다

| 행 안 | 내용 | 판정 |
|---|---|---|
| **a. 행 객체 `TableRow = { cells: ReactNode[] }`** | 셀은 위치 순서 배열이고 행이 객체 하나로 감싸진다 | **채택(설계자 판단)** |
| b. 셀 배열의 배열 `ReactNode[][]` | 가장 짧다 | 탈락 — 행에 붙일 것(React key, 행 머리글, 행 강조)이 생기면 행 타입을 객체로 바꿔야 해 모든 호출부가 깨진다 |
| c. 열 키 객체 `Record<string, ReactNode>` | 열 순서를 바꿔도 안전하다 | 탈락 — 열마다 키 이름이 한 번 더 늘고, 행에 붙일 메타데이터와 셀 키가 한 객체에서 섞인다 |

- a는 b보다 `{ cells: … }` 한 겹이 길지만 행에 선택 필드(`key?: string`, 행 머리글 표시, 강조 상태)를 나중에 더해도 기존 호출부가 그대로 컴파일된다(추가적). b에서 a로 가는 것은 파괴적이라 지금 a로 시작한다. 지금은 `cells` 하나만 둔다
- 열과 셀 길이가 어긋나는 문제는 어느 안도 타입으로 막지 못한다. 셀이 모자라면 빈 칸으로 그리지 않고 그대로 짧은 행이 된다
- 행 React key는 지금 인덱스다 — 표는 표시용이라 행 안에 상태를 두지 않는다. 정렬 · 삽입이 생기면 `key?` 필드를 더한다
- 셀이 `ReactNode`라 숫자도 들어간다. 이것은 R25 보류(데이터 값 `number` prop)를 여는 일이 아니다 — 셀은 Dialog `children`처럼 내용이고, 타입이 `number`인 prop은 여전히 없다(AC-15 mapped type 테스트 그대로)
- 행 타입 `TableRow`도 계약 파일에서 내보내고, `@eeennsu/web` 진입점이 `TabItem` · `TableColumn` · `TableRow`를 타입 전용으로 다시 내보낸다. pnpm 격리 레이아웃에서는 앱이 `@eeennsu/tokens`를 직접 import할 수 없기 때문이다(web README). `components` 맵은 그대로다
- 정렬 · 행 선택 · 고정 머리글 · 행 머리글(`<th scope="row">`)은 두지 않는다. 인터랙티브가 아니므로 `label` 필수 대상이 아니다(C-13)

## 8. Table 숫자 정렬

`align: "end"`인 열은 머리글과 셀 모두 `text-end tabular-nums`다. `tabular-nums`는 Tailwind 정적 유틸리티라 리셋 대상이 아니고 R25에서 이미 어휘로 쓰고 있다. `text-start` · `text-end`는 논리 방향이라 쓰기 방향이 바뀌어도 맞다. `center`는 두지 않는다 — 표 셀 가운데 정렬은 쓰임이 드물고 열거형 값 추가는 추가적이다.

## 9. Table · CodeBlock `label`

| 안 | 판정 |
|---|---|
| **선택 `label` → 보이는 캡션. Table은 `<caption>`, CodeBlock은 `<figcaption>`** | **채택(설계자 판단)** |
| `caption` 같은 새 prop 이름 | 탈락 — 계약에서 `label`은 "접근성 이름"이고(C-13), 그것을 어떻게 그리는지는 어댑터 몫이다. Dialog `label`은 제목으로, Icon `label`은 숨은 이름으로 그린다. 같은 개념에 두 이름을 두지 않는다(C-12 원칙) |
| 숨은 이름(`aria-label`) | 탈락 — 표와 코드 예시의 제목(파일 이름, 표 설명)은 보이는 편이 모두에게 낫다. 숨김 옵션은 나중에 추가적이다 |

둘 다 비인터랙티브라 선택이다. 캡션은 `text-sm text-fg-muted`다.

## 10. 가로 스크롤

넓은 표와 긴 코드 줄은 줄을 바꾸지 않고 가로로 스크롤한다. 스크롤 영역(Table의 감싸개 `div`, CodeBlock의 `pre`)에 `tabIndex={0}`과 포커스 링(§4.6)을 둔다.

| 안 | 판정 |
|---|---|
| **스크롤 영역이 늘 탭 정지점** | **채택(설계자 판단)** |
| 브라우저에 맡긴다 | 탈락 — 키보드로 스크롤할 수 있는 스크롤 영역이 엔진마다 다르고 이 레포에서 확인한 적이 없다. 마우스 없이 코드 줄 끝을 볼 수 없으면 WCAG 2.1.1에 걸린다 |
| 넘칠 때만 `tabIndex` | 탈락 — 크기를 재는 클라이언트 코드가 필요해 Table · CodeBlock이 `"use client"`가 된다 |

대가로 넘치지 않는 표 · 코드 블록도 Tab을 한 번 더 누르게 한다(알려진 동작 29).

- `label`이 있으면 스크롤 영역(Table 감싸개 `div`, CodeBlock `pre`)에 `role="region"`과 `aria-label={label}`을 준다. 포커스를 받은 영역이 스크린 리더에 이름 없는 덩어리로 읽히지 않게 하기 위해서다. 어댑터 내부 처리라 계약은 그대로다. `label`이 없으면 역할 없이 `tabIndex`만 둔다 — 이름 없는 `region`은 랜드마크로 쓸 수 없다
- Prose 안의 원시 `pre` · `table`(MDX 펜스 코드, 마크다운 표)은 Tab 정지점이 아니다. Prose는 원시 요소에 속성을 줄 수 없다. MDX 소비자는 `components.pre`를 CodeBlock으로 넘기는 몇 줄짜리 어댑터(자식 `<code>`의 글자를 꺼내 `children`으로)를 쓸 수 있다(알려진 동작 30)

## 11. CodeBlock 범위

- **인라인 코드는 Prose의 일이다.** MDX 본문의 `` `코드` ``는 원시 `<code>`로 나오고 Prose가 칠한다(14). 블록과 인라인을 한 컴포넌트가 맡으면 `display` 같은 모드 prop이 생기고 두 모드의 의미가 다르다. Prose 밖 React 위젯의 인라인 코드 컴포넌트는 범위가 다섯으로 고정돼 있어 넣지 않는다(열지 않은 것)
- 내용은 `children: string | string[]`이다. Text와 같은 글자 컴포넌트 규칙이라 `<CodeBlock>{source}</CodeBlock>`와 보간이 된다. 공백은 `pre`의 기본 `white-space: pre`가 지킨다. 배열은 Text처럼 그대로 렌더해 줄바꿈 없이 이어 붙는다. 줄 배열은 소비자가 `lines.join("\n")`으로 넘긴다(JSDoc에 적는다, 알려진 동작 29)
- **설계자 판단, 최종 리뷰 뒤 고침.** 처음에는 배열을 줄 배열로 보고 `\n`으로 join했다. 최종 리뷰가 두 가지를 짚었다. `string[]`은 JSX 보간 `<CodeBlock>npm i {pkg}</CodeBlock>`가 만드는 값이라 `"npm i "`와 `pkg`가 두 줄로 깨지고, 같은 타입이 Text에서는 이어 붙임이라 같은 입력의 뜻이 컴포넌트마다 달랐다. 0.5.0이 나간 뒤에 바꾸면 같은 입력의 동작이 바뀌므로 publish 전에 정했다. 타입은 `string | string[]` 그대로다 — JSX 보간이 만드는 값을 받아야 하기 때문이다
- MDX의 펜스 코드 블록은 `<pre><code>`로 나온다. `pre`의 자식이 엘리먼트라 MDX `components` 매핑으로 CodeBlock에 바로 넘길 수 없다. 그래서 펜스 코드는 Prose가 CodeBlock과 같은 recipe로 칠한다(15)
- **문법 강조는 없다.** 강조에는 새 의존성과 색 토큰이 필요하고 레포에 선례가 없다(소비 앱 설계 문서 4.4의 설계자 판단). 언어를 받는 prop도 쓸 곳이 없어 두지 않는다
- **복사 버튼은 없다.** 버튼이 들어오면 CodeBlock이 인터랙티브가 되어 `"use client"`, 클립보드 API, 버튼 라벨 문구가 따라온다. 범위가 고정돼 있다
- 줄 번호는 없다. 줄바꿈 대신 가로 스크롤이다(10)

## 12. CodeBlock 모양

| 안 | 판정 |
|---|---|
| **루트 `<figure>`가 `bg-surface-muted rounded-lg`, `pre`가 `p-4 text-sm font-mono text-fg`** | **채택(설계자 판단)** |
| 채움을 `pre`에 | 탈락 — 소비자 `className`은 루트에 붙는다. 채움이 루트에 있어야 `className="bg-surface"`가 채움을 바꾼다(AC-11) |
| 테두리 상자 | 탈락 — R26이 DS 컴포넌트의 테두리를 채움으로 바꿨다(decisions-r26 11) |

- 채움 `surface-muted`는 R26의 입력 칸 · 칩과 같은 세 번째 톤이라 흰 Card 위(1.24)와 회색 canvas 위(1.12)에서 모두 보인다. 글자 `fg`는 secondary Button과 같은 조합이라 tokens 대비 테스트 안에 있다
- `font-mono`는 DS 토큰이 아니라 Tailwind 기본 `--font-mono`다(21)
- 루트는 캡션이 없어도 `<figure>`다. 소비자 `className`이 붙는 요소가 `label` 유무로 바뀌지 않게 하기 위해서다

## 13. Prose 방식

MDX 본문은 원시 HTML 요소(`h2` · `p` · `ul` · `code` …)로 나온다. 이 요소들에 DS 토큰을 입혀야 한다. Tailwind 타이포그래피 플러그인은 색 · 크기 · 무게 네임스페이스를 DS가 리셋하므로 그대로 쓸 수 없다(C-6).

| 안 | 판정 |
|---|---|
| **정적 클래스 문자열의 임의 변형** — `[:where(&)_h2]:text-xl` 같은 클래스를 Prose 루트의 `cn()` 안에 정적 리터럴로 둔다. 값은 전부 DS 어휘다 | **채택(설계자 판단)** |
| 래퍼 CSS에 `.prose h2 { … }`를 싣는다 | 탈락 — 래퍼는 토큰 빌드 산출물이고, 컴파일된 컴포넌트 CSS를 동봉하지 않는다는 C-3 결정과 부딪힌다 |
| 타이포그래피 플러그인 + 설정 | 탈락 — 플러그인이 쓰는 `--color-*` · `--text-*` 기본값이 리셋돼 없다. 소비자 설정(C-3 "import 한 줄")도 늘어난다 |
| MDX `components`로 요소마다 DS 컴포넌트 매핑을 DS가 제공 | 탈락 — MDX에 묶인 API가 DS에 들어온다. Text가 문자열만 받아(알려진 동작 6) `p` · `li`의 인라인 서식을 담지 못한다 |

- 임의 변형은 값이 아니라 선택자다. 값(`text-xl`, `mt-4`, `text-fg-muted`)은 DS 어휘라 어휘 봉쇄(C-15)를 깨지 않는다. 클래스가 정적 문자열이라 `@source "../dist"` 스캔이 잡는다(C-4 (2))
- **특이성을 `:where`로 낮춘다.** `[&_h2]:text-xl`은 `.x h2`(클래스 1 + 요소 1)라 Prose 안에 놓인 DS `Text heading="2"`(`.text-lg`, 클래스 1)를 이긴다. `:where(.x) h2`는 요소 1뿐이라 DS 컴포넌트의 자기 클래스와 소비자가 원시 요소에 준 클래스가 이긴다. preflight는 `@layer base`라 레이어 순서로 진다. 타이포그래피 플러그인이 `:where`를 쓰는 것과 같은 이유다
- 표기는 설치된 Tailwind 4.3.3에서 확인했다(2026-10-24, 독립 리뷰가 메모리 컴파일로 확인). `[:where(&)_h2]:text-xl`은 `:where(.…) h2 { … }`, `[:where(&)>*+*]:mt-4`는 `:where(.…) > * + *`로 나오고, `_:not(pre)>code` · `_li+li` · `>*+h2`도 기대대로 나온다. Oxide 스캐너가 JS 문자열에서 이 후보들을 뽑는다. peer 범위는 `tailwindcss >=4.1`이지만 확인한 것은 4.3.3뿐이라 plan T-W11의 probe를 회귀 가드로 둔다(알려진 동작 30)
- Prose는 비인터랙티브이고 `children: ReactNode`(웹 전용)다. 훅이 없어 `"use client"`가 아니다

## 14. Prose가 다루는 요소

| 요소 | 클래스(뜻) |
|---|---|
| 루트 | `text-md text-fg` |
| 직계 자식 사이 | `mt-4` — 첫 자식 뒤의 모든 직계 자식(`>*+*`) |
| `h1` · `h2` · `h3` | `text-2xl` · `text-xl` · `text-lg`. 앞에 형제가 있으면 `mt-8` · `mt-8` · `mt-6` |
| `ul` · `ol` | `list-disc` · `list-decimal`, `ps-6` |
| `li` | 형제 사이 `mt-1` |
| `a` | `text-fg-brand underline` |
| 인라인 `code`(`pre` 안이 아닌 것) | `font-mono text-sm bg-surface-muted rounded-sm px-1` |
| `pre` | CodeBlock과 같은 채움 · 패딩 · 글자(`bg-surface-muted rounded-lg p-4 text-sm font-mono overflow-x-auto`) |
| `blockquote` | `border-s-4 border-border ps-4 text-fg-muted` |
| `hr` | `border-border` |
| `table` · `th` · `td` | Table과 같은 셀 패딩 · 글자 · 구분선, `th`는 `text-start text-fg-muted` |
| `img` | `max-w-full` |

- 세로 간격은 요소마다 위아래 여백을 주지 않고 **직계 자식 형제 규칙** 하나로 준다. 첫 자식 위에 여백이 생기지 않고, Prose에 직계 자식으로 놓인 DS 컴포넌트(CodeBlock · Table · Collapsible)도 같은 간격을 받는다. 직계 자식 규칙의 특이성도 0이라 DS 컴포넌트나 소비자가 준 `mt-*`가 이긴다
- 간격 값은 전부 열거 안(`1` · `4` · `6` · `8`)이다(C-7a)
- `strong` · `em`은 칠하지 않는다. 무게를 글자 스텝 밖에서 줄 수 없고(C-6), preflight가 남기는 브라우저 `bolder`가 그대로 굵게 그린다
- `h4` 이하는 본문과 같다. 챕터 글은 세 단계면 충분하고 추가는 추가적이다
- 원시 `table`은 가로 스크롤 감싸개가 없다. `table`에 `display: block`을 주는 방법은 일부 스크린 리더에서 표 의미를 잃는다. 넓은 표는 DS Table을 쓴다(알려진 동작 30)
- 글 폭(`max-w-prose`)은 정하지 않는다. 화면 구조라 앱이 `className`으로 준다

## 15. Prose 안의 DS 컴포넌트

- 13의 `:where` 때문에 Prose 안의 DS 컴포넌트는 자기 모양을 지킨다. `Text heading="2" size="sm"`은 Prose 안에서도 14px이다. verify-next가 이것을 computed style로 확인한다
- Prose의 `pre` · `table` 규칙과 CodeBlock · Table의 클래스는 같은 component recipe 값에서 나온다(20). 같은 값을 두 파일에 정적 문자열로 쓰므로 단위 테스트가 두 쪽 모두 recipe 값과 같은지 본다(T-W8 (6)과 같은 방식)
- CodeBlock을 Prose 안에 두면 CodeBlock의 `pre`에도 Prose의 `pre` 규칙이 걸린다. 패딩 · 글자는 CodeBlock `pre`의 자기 클래스가 이기고 값도 같다. 채움은 CodeBlock이 `pre`가 아니라 루트 `figure`에 두므로, `pre`에 `bg-transparent`를 줘서 Prose의 `pre` 채움이 소비자가 루트에 준 배경(`className="bg-surface"`)을 가리지 않게 한다. CodeBlock의 루트는 `figure`라 직계 자식 간격 규칙을 받는다

## 16. Collapsible 구조 · 값

| 안 | 판정 |
|---|---|
| **컴포넌트 하나 — `label`이 트리거 글자, `children`이 패널** | **채택(설계자 판단)** |
| 파트(`Collapsible` · `CollapsibleTrigger` · `CollapsiblePanel`) | 탈락 — 1절. 트리거 모양을 소비자가 정하면 C-13(트리거의 접근성 이름)과 D-6 높이를 DS가 보장하지 못한다 |

- `label: string` 필수다(C-13). Button처럼 보이는 글자이자 트리거 버튼의 접근성 이름이다. Base UI Trigger가 `aria-expanded`와 `aria-controls`를 붙인다(`collapsible/trigger/CollapsibleTrigger.js`)
- 열림 상태는 `open` · `defaultOpen` · `onOpenChange: (open: boolean) => void`다. 오버레이가 아니지만 Base UI `Collapsible.Root`의 이름과 같고 "열림 · 닫힘 불리언 하나"라는 개념도 같다. "둘이 같으면 이름 하나"(C-12 원칙)를 따라 오버레이 3종 이름을 쓴다. C-12 문구를 "개폐 3종(오버레이 · Collapsible)"으로 넓힌다
- 기본은 닫힘(`defaultOpen` 기본 `false`)이다. 소비 앱의 두 쓰임(답 펼치기, 비교 상자)이 모두 닫힌 채 시작한다
- `children: ReactNode`(웹 전용). `disabled`는 두지 않는다

## 17. Collapsible 모양 · 패널

| 안 | 판정 |
|---|---|
| **상자 없음 — ghost 트리거 줄(`border border-transparent rounded-md px-3 py-2 text-md text-fg hover:bg-surface-hover`) + 오른쪽 `chevron-down`(열리면 `rotate-180`), 패널 `px-3 pt-2`** | **채택(설계자 판단)** |
| 채움 상자(`bg-surface-muted rounded-lg`) | 탈락 — 안에 CodeBlock이나 Prose 인라인 코드를 넣으면 같은 `surface-muted` 위에 놓여 코드 채움이 사라진다. 비교 상자에는 코드가 자주 들어간다 |
| 테두리 상자 | 탈락 — R26이 테두리를 채움으로 바꿨고, `border.default`는 라이트 canvas 위에서 1.12:1이라 가장 약하다(19) |

- 상자가 필요하면 Card 안에 둔다(`<Card><Collapsible label="…">…</Collapsible></Card>`). 표면은 Card 하나라는 기존 판단(§4.2 "Card에 variant를 두지 않는다")과 같은 조합 방식이다
- 트리거 높이는 투명 테두리 포함 42로 md 컨트롤과 같다(D-6). ghost Button과 같은 hover다
- 꺾쇠는 내부 `Glyph`(공개 Icon 아님)이고 `text-fg-muted`, 회전은 `group-data-[panel-open]:rotate-180`이다
- **닫힌 패널은 마운트하지 않는다**(Base UI 기본, `keepMounted` · `hiddenUntilFound` 끔). `hiddenUntilFound`를 켜면 브라우저 찾기가 닫힌 답을 펼쳐 버린다. 확인 질문의 답이 찾기로 드러나지 않는 쪽을 골랐다(알려진 동작 31)
- 높이 애니메이션은 없다. Base UI는 `--collapsible-panel-height` 변수로 높이를 알려 주지만 그것을 쓰려면 임의값 클래스(`h-[var(…)]`)를 DS 소스에 써야 한다

## 18. ref

다섯 개 모두 `ref`가 없다. C-17은 `ref`를 포커스 가능한 단일 컨트롤(Button · Input · Textarea · Chip)에만 둔다. Tabs · Collapsible은 안에 버튼이 여럿이거나 패널이 있어 "포커스할 하나"가 정해지지 않는다. 핸들을 더하는 것은 추가적이다.

## 19. 토큰

새 semantic 토큰을 두지 않는다. 쓰는 색은 전부 있는 것이다.

| 쓰임 | 토큰 |
|---|---|
| 코드 채움 · 인라인 코드 | `bg-surface-muted` |
| 트리거 hover | `bg-surface-hover` |
| 탭 목록선 · 표 구분선 · blockquote · hr | `border-border`(`border.default`) |
| 활성 탭 밑줄 | `border-brand` |
| 링크 | `text-fg-brand` |
| 캡션 · 표 머리글 · 비활성 탭 | `text-fg-muted` |
| 포커스 | `outline-border-focus` |

- 코드 전용 채움(`bg.code`)을 두는 안은 탈락했다. semantic 변수 추가는 C-5b 계약 표면이고 두 브랜드 × 두 스킴 값을 모두 정해야 한다. `surface-muted`로 모든 바탕에서 보인다(12)
- 구분선 `border.default`는 R26 계획 §3.3에 "DS 컴포넌트는 R26부터 쓰지 않는다"고 적혀 있었다. 실제로는 Tooltip이 계속 써 왔고(`tooltip.tsx`), R27이 구분선으로 다시 쓴다. 값은 그대로라 결정을 다시 여는 일이 아니다 — 계획 표의 용도 열만 고친다
- **구분선 대비.** `border.default`는 `surface-muted`와 같은 값이다(라이트 gray-200, 다크 zinc-800, plan §3.3). oklch 명도로 어림한 대비(독립 리뷰, 2026-10-24)는 다음과 같다

| 바탕 | 라이트 | 다크 |
|---|---|---|
| surface | 1.24 | 1.19 |
| canvas | **1.12**(가장 약함) | 1.34 |
| surface-muted 채움 | 1.00 — 선이 사라진다 | 1.00 — 선이 사라진다 |

- 구분선은 비텍스트 3:1 대상으로 보지 않는다. 표 구조는 `<th>` · `<td>`가 전하고 탭 목록은 `role="tablist"`와 활성 밑줄(brand)이 전한다. 그래서 새 토큰을 두지 않는 결론은 그대로다
- 다만 Table · Tabs를 `surface-muted` 채움 위(예: 채운 상자 안)에 두면 선이 보이지 않는다(알려진 동작 32). 라이트 canvas 위(1.12)는 보이기는 하지만 약하다 — 이 화면을 T-V4 verify-next에서 사용자에게 보여 준다. 사용자가 받아들이지 않으면 갈래는 둘이다. (a) `border.default` 값을 올린다 — Card 경계 · Tooltip 테두리도 같이 바뀌고, 지금 값은 사용자가 R26에서 고른 인상이다. (b) 구분선 전용 semantic 토큰을 새로 둔다 — C-5b 계약 표면이 늘고 두 브랜드 × 두 스킴 값을 정해야 한다. 어느 쪽이든 사용자 결정이다

## 20. component recipe

| 컴포넌트 | recipe | 값 |
|---|---|---|
| Tabs(탭 버튼) | `paddingX` / `paddingY` / `text` | `4` / `2` / `md` (높이 42) |
| Table(셀) | `paddingX` / `paddingY` / `text` | `3` / `2` / `sm` |
| CodeBlock | `padding` / `text` / `radius` | `4` / `sm` / `lg` |
| Collapsible(트리거) | `paddingX` / `paddingY` / `text` / `radius` | `3` / `2` / `md` / `md` (높이 42) |

- 기존 컴포넌트와 같은 경로다 — 값은 component 계층 소스에 두고, 구현은 정적 클래스로 옮겨 쓰고, recipe 테스트가 둘을 맞춘다(plan §3.8 · T-W8 (6))
- Prose는 recipe를 두지 않는다. 값 대부분이 요소 선택자 조합이라 recipe로 옮기면 소스가 클래스 목록을 다시 적는 것이 된다. Form(`gap-4`)과 같은 처리다. 대신 Prose의 `pre` · `table` 값이 CodeBlock · Table recipe와 같은지를 테스트가 본다(15)

## 21. `font-mono`

계획 S-7은 `--font-*`를 리셋하지 않고 `--font-sans`만 덮어써서 Tailwind 기본 `--font-mono` · `--font-serif`가 남는 것을 어휘 봉쇄의 예외로 적어 두었다. 지금까지는 DS가 그 클래스를 쓰지 않아 계획의 메모로 충분했다. R27에서 CodeBlock과 Prose가 `font-mono`를 쓰므로 소비자에게 보이는 동작이 됐다.

| 안 | 판정 |
|---|---|
| **스펙 알려진 동작으로 옮기고(28), tokens probe가 `font-mono` 출력을 확인한다** | **채택(설계자 판단, 소비 앱 설계 문서 4.4의 판단을 따랐다)** |
| DS `fontFamily.mono` 토큰을 둔다 | 탈락 — 이름 · 값을 정하면 C-7b 대상이 늘고 소비자 로딩 책임이 생긴다. 시스템 고정폭 목록(Tailwind 기본)으로 충분하다 |
| `--font-mono`를 리셋한다 | 탈락 — CodeBlock이 쓸 글꼴이 없어진다 |

- probe가 있어야 Tailwind가 기본 테마를 바꾸거나 리셋 범위가 바뀌어 `font-mono`가 사라질 때 테스트가 잡는다. 지금은 아무 테스트도 이 클래스를 보지 않는다
- `--font-mono` 재선언은 기술적으로 덮이지만 계약 밖이다(C-5c와 같은 지위). 한글은 시스템 글꼴로 대체된다

## 22. 검증 화면

| 안 | 판정 |
|---|---|
| **verify-next에 `/components` 라우트를 새로 둔다. 페이지는 서버 컴포넌트이고 다섯 개와 Chip · Icon을 올린다** | **채택(설계자 판단)** |
| 로그인 화면(`/`)에 더한다 | 탈락 — `/`는 AC-23 비교 스크린샷(`docs/assets/ac23-web-*.png`)을 찍는 화면이다. 요소가 늘면 RN 짝과 맞지 않는다(F-25) |

- 페이지에 `"use client"`가 없으므로 Next 빌드와 렌더가 곧 C-4 확인이다. Tabs · Collapsible · Chip은 `"use client"` 경계 너머에서, Table · CodeBlock · Prose · Icon은 서버에서 렌더된다
- 웹 Chip · Icon은 R25 뒤 verify-next에 없었다. 구현 노트 §4 "다음"이 "다음 웹 작업 때 화면에 올려 확인한다(DS 재검증 테스트 공백 6)"로 미뤄 둔 항목이다. 이 라운드가 그 웹 작업이라 같은 페이지에 올린다
- `(app)` 그룹 아래에 둬서 앱 전용 brand(C-5b 재선언)를 그대로 받는다. 활성 탭 밑줄과 고른 Chip은 앱 brand 값, 나머지 색은 `brands/base` 값과 비교한다

## 열지 않은 것

| 요구 | 열지 않은 이유 | 앱은 지금 |
|---|---|---|
| 문법 강조 | 새 의존성과 색 토큰이 필요하다(11). 소비 앱 설계 문서가 S2에서 다시 묻기로 했다 | 강조 없는 CodeBlock |
| 복사 버튼 | CodeBlock이 인터랙티브가 된다(11). 범위 고정 | - |
| Prose 밖 인라인 코드 컴포넌트 | 범위 고정. 블록과 인라인을 한 컴포넌트에 섞지 않는다(11) | 위젯 안 짧은 코드는 Prose로 감싼다 |
| Accordion(Collapsible 묶음, 하나만 열기) | 범위 고정. Collapsible 여러 개를 쌓으면 된다. Base UI `accordion`이 설치본에 있어 나중에 새 컴포넌트로 더하는 것은 추가적이다 | Collapsible 여러 개 |
| Tabs 세로 방향 · 항목 비활성 · 포커스 즉시 활성화 | 지금 요구가 없다. 모두 선택 prop · 선택 필드 추가라 추가적이다(5) | - |
| Table 정렬 · 행 선택 · 고정 머리글 · 행 머리글 | 인터랙티브가 되거나(정렬 · 선택) 쓰임이 아직 없다(7) | - |
| 세그먼트 컨트롤 | Tabs 모양으로 탈락했다(6). 필터 고르기는 Chip 묶음으로 된다 | Chip |
| 코드 채움 전용 semantic 토큰 | C-5b 계약 표면이 는다(19) | `surface-muted` |
| DS 고정폭 글꼴 토큰 | C-7b 대상이 는다(21) | Tailwind 기본 `font-mono` |
| RN 구현 | 소비 앱이 웹이고, 다섯 개는 웹 전용 목록(ButtonGroup · Tooltip · Dialog · Drawer · Form)과 같은 자리다. 계약은 tokens에 있어 RN v2가 같은 계약을 구현하면 맵 테스트가 대칭을 본다 | - |
| 웹 Dialog · Drawer 닫기 버튼 24px · Button · Chip `cursor-pointer` | decisions-r25가 "웹 소비 앱 작업 때"로 미뤘다. R27은 컴포넌트를 더하는 라운드이고 범위가 고정돼 있다. amulator S2에서 Dialog를 실제로 쓸 때 본다 | - |
| 데이터 값 `number` prop(R25 보류) | Table 셀은 `ReactNode` 내용이라 이 질문을 열지 않는다(7). 여는지는 여전히 사용자 판단이다 | - |
