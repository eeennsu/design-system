import type { TableColumn, TableRow } from "@eeennsu/web";
import { Card, Chip, CodeBlock, Collapsible, Icon, Prose, Stack, Table, Tabs, Text } from "@eeennsu/web";

/**
 * R27 T-V4 — 새 다섯 컴포넌트와 Chip · Icon 의 서버 렌더 확인용 화면(C-4).
 * 서버 컴포넌트다: Tabs · Collapsible · Chip 이 `"use client"` 를 스스로 지니므로 여기에는 지시문이 없다.
 * Table · Tabs 하나는 canvas 위에 바로 놓아 구분선(`border.default`)을 눈으로 확인할 수 있게 했다.
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
