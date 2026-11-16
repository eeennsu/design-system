import type { TableColumn, TableRow } from "@eeennsu/web";
import { Callout, Card, Chip, CodeBlock, Collapsible, Icon, Link, Prose, Stack, Table, Tabs, Text } from "@eeennsu/web";
import { StepperDemo } from "./stepper-demo";

/**
 * R27 T-V4 — 새 다섯 컴포넌트와 Chip · Icon 의 서버 렌더 확인용 화면(C-4).
 * 서버 컴포넌트다: Tabs · Collapsible · Chip 이 `"use client"` 를 스스로 지니므로 여기에는 지시문이 없다.
 * Table · Tabs 하나는 canvas 위에 바로 놓아 구분선(`border.default`)을 눈으로 확인할 수 있게 했다.
 *
 * R28 Task 11 — Link · Callout · Stepper, Collapsible `secondary` · `disabled`, 세로로 넘치는 Table,
 * 긴 URL 문단, `text-4xl` · `font-semibold` · `font-mono` 글을 더했다. Stepper 만 상태가 있어 `stepper-demo.tsx` 로 뺐다.
 */
const columns: TableColumn[] = [
  { label: "항목" },
  { label: "1월 지출액", align: "end" },
  { label: "2월 지출액", align: "end" },
  { label: "3월 지출액", align: "end" },
  { label: "4월 지출액", align: "end" },
  { label: "5월 지출액", align: "end" },
  { label: "합계", align: "end" },
];

/** `max-h-96`(384px) 영역을 세로로 넘기려고 39행을 만든다. */
const longRows: TableRow[] = Array.from({ length: 39 }, (_, i) => ({
  cells: [`${i + 1}일`, `${(i + 1) * 1000}`, `${(i + 1) * 1500}`, `${(i + 1) * 2000}`, `${(i + 1) * 2500}`, `${(i + 1) * 3000}`, `${(i + 1) * 10000}`],
}));

const longUrl = "https://example.com/very/long/path/that/does/not/fit/on/one/line/of/a/393px/viewport/at/all?query=parameter&another=value";

const rows: TableRow[] = [
  { cells: ["식비", "320,000", "298,500", "341,200", "310,400", "329,900", "1,600,000"] },
  { cells: ["교통", "58,000", "61,500", "47,300", "52,100", "49,800", "268,700"] },
  { cells: ["구독", "42,900", "42,900", "42,900", "42,900", "42,900", "214,500"] },
];

export default function ComponentsPage() {
  return (
    <Stack className="bg-canvas min-h-screen p-4 gap-8">
      <Text heading="1" size="xl">
        컴포넌트
      </Text>

      <section aria-label="탭 영역">
        <Tabs
          label="예시 탭"
          items={[
            {
              value: "code",
              label: "코드",
              content: <CodeBlock label="탭 안 코드">{["const total = 1 + 2;", "console.log(total);"]}</CodeBlock>,
            },
            { value: "usage", label: "사용법", content: <Text>사용법 패널이다</Text> },
            { value: "notes", label: "메모", content: <Text>메모 패널이다</Text> },
          ]}
        />
      </section>

      <section aria-label="표 영역">
        <Table label="분기별 지출" columns={columns} rows={rows} />
      </section>

      <section aria-label="카드 안 표 영역">
        <Card>
          <Table label="카드 안 지출" columns={columns} rows={rows} />
        </Card>
      </section>

      <section aria-label="코드 블록 영역">
        <CodeBlock label="긴 한 줄">
          {"const veryLongLine = [\"alpha\", \"bravo\", \"charlie\", \"delta\", \"echo\", \"foxtrot\", \"golf\", \"hotel\", \"india\"].join(\", \");"}
        </CodeBlock>
      </section>

      <section aria-label="Prose 영역">
        <Prose>
          <h2>Prose 제목</h2>
          <p>
            본문 문단이다. 인라인 <code>code</code> 와 <a href="#prose">링크</a> 가 들어 있다.
          </p>
          <ul>
            <li>첫째 항목</li>
            <li>둘째 항목</li>
          </ul>
          <pre>
            <code>raw pre 코드</code>
          </pre>
          <blockquote>인용문이다.</blockquote>
          <hr />
          <table>
            <thead>
              <tr>
                <th>이름</th>
                <th>값</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>알파</td>
                <td>1</td>
              </tr>
            </tbody>
          </table>
          <Text heading="2" size="sm">
            Prose 안 DS 제목
          </Text>
          <CodeBlock label="Prose 안 코드">{"const inside = true;"}</CodeBlock>
          <CodeBlock label="Prose 안 surface 코드" className="bg-surface">
            {"const surface = true;"}
          </CodeBlock>
        </Prose>
      </section>

      <section aria-label="접기 영역">
        <Collapsible label="정답 보기">
          <Text>정답은 사십이다</Text>
        </Collapsible>
      </section>

      <section aria-label="카드 안 접기 영역">
        <Card>
          <Collapsible label="카드 안 정답 보기">
            <Text>카드 안 정답이다</Text>
          </Collapsible>
        </Card>
      </section>

      <section aria-label="접기 secondary 영역">
        <Collapsible label="secondary 접기" variant="secondary">
          <Text>secondary 패널이다</Text>
        </Collapsible>
      </section>

      <section aria-label="접기 disabled 영역">
        <Collapsible label="비활성 접기" disabled>
          <Text>비활성 패널이다</Text>
        </Collapsible>
      </section>

      <section aria-label="링크 영역">
        <Stack className="gap-2">
          <Link label="기본 링크" href="#link-default" />
          <Link label="muted 링크" href="#link-muted" tone="muted" />
          <Link label="큰 링크" href="#link-lg" size="lg" />
        </Stack>
      </section>

      <section aria-label="Callout 영역">
        <Stack className="gap-3">
          <Callout tone="info" title="안내" icon="info">
            정보 Callout 본문이다. 한국어 문장이 어절 단위로 줄을 바꾸는지 본다.
          </Callout>
          <Callout tone="success" title="완료" icon="check">
            성공 Callout 본문이다.
          </Callout>
          <Callout tone="warning" title="주의" icon="alert-circle">
            경고 Callout 본문이다.
          </Callout>
          <Callout tone="danger" title="오류" icon="alert-circle">
            위험 Callout 본문이다.
          </Callout>
          <Callout tone="brand">제목 · 아이콘 없는 brand Callout 이다.</Callout>
        </Stack>
      </section>

      <section aria-label="Stepper 영역">
        <StepperDemo />
      </section>

      <section aria-label="세로 넘침 표 영역">
        <Table label="일별 지출" columns={columns} rows={longRows} className="max-h-96" />
      </section>

      <section aria-label="긴 URL Prose 영역">
        <Prose>
          <p data-testid="long-url">
            주소는 {longUrl} 이다. 줄보다 긴 주소도 화면 밖으로 넘치지 않아야 한다.
          </p>
        </Prose>
      </section>

      <section aria-label="글 어휘 영역">
        <Stack className="gap-2">
          <Text size="4xl">큰 제목 4xl</Text>
          <Text className="font-semibold">semibold 글</Text>
          <Text className="font-mono">const mono = true;</Text>
        </Stack>
      </section>

      <section aria-label="칩 영역">
        <Stack direction="row" className="gap-2">
          <Chip label="고른 칩" selected />
          <Chip label="안 고른 칩" />
        </Stack>
      </section>

      <section aria-label="아이콘 영역">
        <Stack direction="row" className="gap-2">
          <Icon name="settings" label="설정" />
          <Icon name="check" />
          <Icon name="info" tone="muted" label="안내" />
        </Stack>
      </section>
    </Stack>
  );
}
