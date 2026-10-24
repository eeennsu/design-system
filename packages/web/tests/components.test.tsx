/**
 * T-W8 웹 단위 테스트 (AC-7 · AC-8 · AC-11 단위 계층 · C-11 매핑 · C-21).
 *
 * 정지 상태의 클래스와 DOM 속성만 본다. computed style 비교는 T-V1 Playwright 몫이다.
 */
import { createRef } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { FocusHandle } from "@eeennsu/tokens";
import { describe, expect, it, vi } from "vitest";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  Chip,
  CodeBlock,
  Dialog,
  Drawer,
  Form,
  Icon,
  Input,
  Label,
  Prose,
  Stack,
  Table,
  Tabs,
  Text,
  Textarea,
  Tooltip,
} from "../src/index.js";

describe("AC-8 Stack · Box", () => {
  it("direction · align · justify · wrap 이 클래스로 간다", () => {
    render(
      <Stack direction="row" align="center" justify="between" wrap>
        <span>자식</span>
      </Stack>,
    );
    const stack = screen.getByText("자식").parentElement!;
    expect(stack).toHaveClass("flex", "flex-row", "items-center", "justify-between", "flex-wrap");
  });

  it("기본은 column · stretch · start 이고 wrap 은 없다", () => {
    render(
      <Stack>
        <span>자식</span>
      </Stack>,
    );
    const stack = screen.getByText("자식").parentElement!;
    expect(stack).toHaveClass("flex-col", "items-stretch", "justify-start");
    expect(stack).not.toHaveClass("flex-wrap");
  });

  it("간격은 소비자 className 으로만 들어간다 (C-14)", () => {
    render(
      <Stack className="gap-4">
        <span>자식</span>
      </Stack>,
    );
    expect(screen.getByText("자식").parentElement).toHaveClass("gap-4");
  });

  it("Box 는 className 외에 아무 클래스도 붙이지 않는다 (plan D-7)", () => {
    render(
      <Box className="p-4">
        <span>자식</span>
      </Box>,
    );
    expect(screen.getByText("자식").parentElement!.className).toBe("p-4");
  });
});

describe("AC-7 Text · Label · Badge · Card", () => {
  it("heading 이 h1~h3 을, 없으면 span 을 만든다", () => {
    const { rerender } = render(<Text heading="1">제목</Text>);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    rerender(<Text heading="3">제목</Text>);
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
    rerender(<Text>본문</Text>);
    expect(screen.getByText("본문").tagName).toBe("SPAN");
  });

  it("tone 과 size 가 각각 색·타이포 스텝 클래스로 간다", () => {
    render(
      <Text tone="danger" size="2xl">
        오류
      </Text>,
    );
    expect(screen.getByText("오류")).toHaveClass("text-fg-danger", "text-2xl");
  });

  it("Label 이 htmlFor 로 컨트롤에 연결된다", () => {
    render(
      <>
        <Label htmlFor="email">이메일</Label>
        <Input id="email" label="이메일" kind="email" />
      </>,
    );
    expect(screen.getByText("이메일").getAttribute("for")).toBe("email");
  });

  it("Badge variant 3개가 각자 semantic 색을 쓴다", () => {
    const { rerender } = render(<Badge variant="primary">신규</Badge>);
    expect(screen.getByText("신규")).toHaveClass("bg-brand", "text-fg-on-brand");
    rerender(<Badge variant="secondary">보통</Badge>);
    expect(screen.getByText("보통")).toHaveClass("bg-surface-muted", "text-fg");
    rerender(<Badge variant="danger">위험</Badge>);
    expect(screen.getByText("위험")).toHaveClass("bg-danger", "text-fg-on-danger");
  });

  it("Card 가 표면 recipe 를 붙인다", () => {
    render(
      <Card>
        <span>내용</span>
      </Card>,
    );
    const card = screen.getByText("내용").parentElement;
    expect(card).toHaveClass("bg-surface", "rounded-xl", "p-6");
    // R26: 테두리 · 그림자 없이 canvas 와의 명도 차이로 구분된다(알려진 동작 24)
    expect(card).not.toHaveClass("border", "shadow-sm");
  });
});

describe("AC-7 Button · ButtonGroup", () => {
  it("label 이 가시 텍스트이자 접근성 이름이다", () => {
    render(<Button label="저장" />);
    expect(screen.getByRole("button", { name: "저장" })).toHaveTextContent("저장");
  });

  it("type 은 항상 button 이다 (C-21)", () => {
    render(<Button label="저장" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("onClick 이 인자 없이 호출된다", () => {
    const onClick = vi.fn();
    render(<Button label="저장" onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0]).toEqual([]);
  });

  it("아이콘이 있어도 label 은 렌더된다 (알려진 동작 9)", () => {
    render(<Button label="삭제" icon="trash" />);
    const button = screen.getByRole("button", { name: "삭제" });
    expect(button).toHaveTextContent("삭제");
    expect(button.querySelector("svg")).not.toBeNull();
  });

  it("loading 은 disabled 와 같은 상태를 만들고 누름이 막힌다", () => {
    const onClick = vi.fn();
    render(<Button label="저장" loading onClick={onClick} />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("opacity-50", "pointer-events-none");
    expect(button.querySelector("svg")).toHaveClass("animate-spin");
  });

  it("ref 가 focus · blur 핸들로 동작한다 (C-17)", () => {
    const ref = createRef<FocusHandle>();
    render(<Button label="저장" ref={ref} />);
    expect(typeof ref.current!.focus).toBe("function");
    expect(typeof ref.current!.blur).toBe("function");
    ref.current!.focus();
    expect(screen.getByRole("button")).toHaveFocus();
    ref.current!.blur();
    expect(screen.getByRole("button")).not.toHaveFocus();
  });

  it("ButtonGroup 이 role=group + aria-label 을 만든다", () => {
    render(
      <ButtonGroup label="정렬">
        <Button label="오름차순" />
      </ButtonGroup>,
    );
    expect(screen.getByRole("group", { name: "정렬" })).toBeInTheDocument();
  });
});

describe("N-17 Chip · Icon", () => {
  it("Chip label 이 가시 텍스트이자 접근성 이름이고, 고른 상태를 aria-pressed 로 알린다", () => {
    render(
      <Stack>
        <Chip label="식비" selected />
        <Chip label="배달" />
      </Stack>,
    );
    expect(screen.getByRole("button", { name: "식비" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "배달" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "식비" })).toHaveClass("bg-brand", "text-fg-on-brand");
    expect(screen.getByRole("button", { name: "배달" })).toHaveClass("bg-surface-muted", "border-transparent");
  });

  it("Chip onClick 이 인자 없이 호출되고, 상태는 소비자가 바꾼다", () => {
    const onClick = vi.fn();
    render(<Chip label="식비" onClick={onClick} />);
    fireEvent.click(screen.getByRole("button", { name: "식비" }));
    expect(onClick).toHaveBeenCalledWith();
    expect(screen.getByRole("button", { name: "식비" })).toHaveAttribute("aria-pressed", "false");
  });

  it("Chip type 은 button 이고 disabled 면 누름이 막힌다", () => {
    const onClick = vi.fn();
    render(<Chip label="식비" disabled onClick={onClick} />);
    const chip = screen.getByRole("button", { name: "식비" });
    expect(chip).toHaveAttribute("type", "button");
    expect(chip).toHaveClass("opacity-50", "pointer-events-none");
    fireEvent.click(chip);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("Chip ref 가 focus 핸들로 동작한다 (C-17)", () => {
    const ref = createRef<FocusHandle>();
    render(<Chip label="식비" ref={ref} />);
    ref.current?.focus();
    expect(screen.getByRole("button", { name: "식비" })).toHaveFocus();
  });

  it("label 없는 Icon 은 꾸밈이라 숨고, 있으면 이름 있는 그림이다", () => {
    const { container } = render(
      <Stack>
        <Icon name="home" />
        <Icon name="calendar" label="날짜" />
      </Stack>,
    );
    const [decorative] = container.querySelectorAll("svg");
    expect(decorative).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("img", { name: "날짜" })).not.toHaveAttribute("aria-hidden");
  });

  it("Icon tone 이 Text 와 같은 fg 색 클래스로 간다", () => {
    const { container } = render(
      <Stack>
        <Icon name="home" />
        <Icon name="info" tone="muted" />
        <Icon name="alert-circle" tone="danger" className="text-brand" />
      </Stack>,
    );
    const [home, info, alert] = container.querySelectorAll("svg");
    expect(home).toHaveClass("text-fg");
    expect(info).toHaveClass("text-fg-muted");
    // 소비자 className 이 같은 그룹을 이긴다(C-15)
    expect(alert).toHaveClass("text-brand");
    expect(alert).not.toHaveClass("text-fg-danger");
  });

  it("눌림 표시는 색이 아니라 투명도다 — 소비자가 배경을 바꿔도 따라간다", () => {
    render(
      <Stack>
        <Button label="저장" className="bg-danger" />
        <Chip label="식비" selected className="bg-danger" />
      </Stack>,
    );
    for (const name of ["저장", "식비"]) {
      const element = screen.getByRole("button", { name });
      expect(element).toHaveClass("active:opacity-80", "bg-danger");
      expect(element.className).not.toMatch(/active:bg-/);
    }
  });

  it("label 이 빈 문자열이면 이름 없는 그림을 만들지 않는다", () => {
    const { container } = render(<Icon name="home" label="" />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("img")).toBeNull();
  });
});

describe("AC-7 Input · Textarea (C-11 매핑)", () => {
  it("kind 4값이 각자 DOM 속성으로 파생된다", () => {
    const { rerender } = render(<Input label="이름" />);
    expect(screen.getByLabelText("이름")).toHaveAttribute("type", "text");

    rerender(<Input label="비밀번호" kind="password" />);
    const password = screen.getByLabelText("비밀번호");
    expect(password).toHaveAttribute("type", "password");
    expect(password).toHaveAttribute("autocomplete", "current-password");

    rerender(<Input label="이메일" kind="email" />);
    const email = screen.getByLabelText("이메일");
    expect(email).toHaveAttribute("type", "email");
    expect(email).toHaveAttribute("autocomplete", "email");

    rerender(<Input label="수량" kind="number" />);
    const numeric = screen.getByLabelText("수량");
    expect(numeric).toHaveAttribute("type", "text"); // 스피너를 띄우지 않는다
    expect(numeric).toHaveAttribute("inputmode", "numeric");
  });

  it("제어 · 비제어 · 콜백 3종이 동작한다 (C-12)", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Input label="이름" defaultValue="처음" />);
    expect(screen.getByLabelText("이름")).toHaveValue("처음");

    rerender(<Input label="이름" value="고정" onValueChange={onValueChange} />);
    const input = screen.getByLabelText("이름");
    expect(input).toHaveValue("고정");
    fireEvent.change(input, { target: { value: "입력" } });
    expect(onValueChange).toHaveBeenCalledWith("입력");
  });

  it("invalid 가 테두리와 aria-invalid 를 함께 바꾼다", () => {
    render(<Input label="이메일" kind="email" invalid />);
    const input = screen.getByLabelText("이메일");
    expect(input).toHaveClass("border-danger");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("Textarea size 가 행수 3 / 5 / 8 이다 (plan D-14)", () => {
    const { rerender } = render(<Textarea label="메모" size="sm" />);
    expect(screen.getByLabelText("메모")).toHaveAttribute("rows", "3");
    rerender(<Textarea label="메모" />);
    expect(screen.getByLabelText("메모")).toHaveAttribute("rows", "5");
    rerender(<Textarea label="메모" size="lg" />);
    expect(screen.getByLabelText("메모")).toHaveAttribute("rows", "8");
  });

  it("Textarea 도 focus 핸들을 노출한다", () => {
    const ref = createRef<FocusHandle>();
    render(<Textarea label="메모" ref={ref} />);
    ref.current!.focus();
    expect(screen.getByLabelText("메모")).toHaveFocus();
  });
});

describe("AC-7 Form (C-21)", () => {
  it("submit 이 preventDefault 된다 — Enter 는 무동작이다 (알려진 동작 5)", () => {
    const { container } = render(
      <Form>
        <Input label="이메일" kind="email" />
      </Form>,
    );
    const form = container.querySelector("form")!;
    const submit = new Event("submit", { bubbles: true, cancelable: true });
    form.dispatchEvent(submit);
    expect(submit.defaultPrevented).toBe(true);
  });

  it("계약에 onSubmit 이 없으므로 폼은 레이아웃만 맡는다", () => {
    const { container } = render(
      <Form className="gap-6">
        <span>내용</span>
      </Form>,
    );
    expect(container.querySelector("form")).toHaveClass("flex", "flex-col", "gap-6");
  });
});

describe("AC-7 오버레이 (C-12)", () => {
  it("Dialog label 이 제목으로 렌더되고 aria-labelledby 로 연결된다", () => {
    render(
      <Dialog label="삭제 확인" defaultOpen>
        <Text>되돌릴 수 없다</Text>
      </Dialog>,
    );
    const dialog = screen.getByRole("dialog");
    const titleId = dialog.getAttribute("aria-labelledby");
    expect(titleId).toBeTruthy();
    expect(document.getElementById(titleId!)).toHaveTextContent("삭제 확인");
    expect(screen.getByText("되돌릴 수 없다")).toBeInTheDocument();
  });

  it("Dialog onOpenChange 가 boolean 하나만 받는다", () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog label="삭제 확인" defaultOpen onOpenChange={onOpenChange}>
        <Text>내용</Text>
      </Dialog>,
    );
    fireEvent.click(screen.getByRole("button", { name: "닫기" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onOpenChange.mock.calls[0]).toHaveLength(1);
  });

  it("Drawer side 가 위치 클래스를 바꾼다", () => {
    const { rerender } = render(
      <Drawer label="메뉴" defaultOpen>
        <Text>내용</Text>
      </Drawer>,
    );
    expect(screen.getByRole("dialog")).toHaveClass("inset-y-0", "right-0", "max-w-sm");
    rerender(
      <Drawer label="메뉴" side="bottom" defaultOpen>
        <Text>내용</Text>
      </Drawer>,
    );
    expect(screen.getByRole("dialog")).toHaveClass("inset-x-0", "bottom-0");
  });

  it("Tooltip 앵커로 DS Button 을 쓸 수 있다", () => {
    render(
      <Tooltip label="영구 삭제" defaultOpen>
        <Button label="삭제" icon="trash" />
      </Tooltip>,
    );
    expect(screen.getByRole("button", { name: "삭제" })).toBeInTheDocument();
    expect(screen.getByText("영구 삭제")).toBeInTheDocument();
  });
});

describe("AC-11 병합 — 소비자 className 이 이긴다", () => {
  it("variant=primary 에 bg-danger 를 주면 bg-brand 가 사라진다", () => {
    render(<Button label="삭제" variant="primary" className="bg-danger" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-danger");
    expect(button).not.toHaveClass("bg-brand");
  });

  it("다른 그룹은 함께 남는다", () => {
    render(<Button label="저장" className="mt-6" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-brand", "mt-6", "px-4", "py-2");
  });

  it("열거 밖 간격 클래스는 DS 기본값을 밀어내지 않는다 (알려진 동작 1 · 4)", () => {
    render(
      <Card className="p-5">
        <span>내용</span>
      </Card>,
    );
    expect(screen.getByText("내용").parentElement).toHaveClass("p-6", "p-5");
  });
});

describe("R27 Table", () => {
  const columns = [{ label: "이름" }, { label: "금액", align: "end" as const }];
  const rows = [{ cells: ["커피", "4,500"] }, { cells: [<code key="c">tea</code>, "3,000"] }];

  it("label 이 caption 글자이고 table 의 접근성 이름이다", () => {
    render(<Table label="지출" columns={columns} rows={rows} />);
    expect(screen.getByRole("table", { name: "지출" })).toBeInTheDocument();
    expect(screen.getByText("지출").tagName).toBe("CAPTION");
  });

  it("label 이 있으면 루트가 region 이고, 없으면 caption 도 region 도 없지만 tabIndex 는 남는다", () => {
    const { unmount } = render(<Table label="지출" columns={columns} rows={rows} />);
    expect(screen.getByRole("region", { name: "지출" })).toHaveAttribute("tabindex", "0");
    unmount();
    const { container } = render(<Table columns={columns} rows={rows} />);
    expect(container.querySelector("caption")).toBeNull();
    expect(screen.queryByRole("region")).toBeNull();
    expect(container.firstElementChild).toHaveAttribute("tabindex", "0");
  });

  it("align=end 열의 th · td 는 text-end tabular-nums 이고 기본 열은 text-start 이다", () => {
    render(<Table columns={columns} rows={rows} />);
    const [nameHead, amountHead] = screen.getAllByRole("columnheader");
    expect(nameHead).toHaveClass("text-start");
    expect(nameHead).not.toHaveClass("tabular-nums");
    expect(amountHead).toHaveClass("text-end", "tabular-nums");
    expect(amountHead).not.toHaveClass("text-start");
    const cells = screen.getAllByRole("cell");
    expect(cells[0]).toHaveClass("text-start");
    expect(cells[1]).toHaveClass("text-end", "tabular-nums");
    expect(cells[1]).not.toHaveClass("text-start");
  });

  it("th 는 scope=col 이고 행마다 cells 수만큼 td 가 나오며 셀에 엘리먼트를 넣을 수 있다", () => {
    render(<Table columns={columns} rows={rows} />);
    for (const head of screen.getAllByRole("columnheader")) expect(head).toHaveAttribute("scope", "col");
    expect(screen.getAllByRole("row")).toHaveLength(3);
    expect(screen.getAllByRole("cell")).toHaveLength(4);
    expect(screen.getByText("tea").tagName).toBe("CODE");
  });

  it("셀이 모자란 행은 빈 칸을 채우지 않고 짧은 행이 된다", () => {
    render(<Table columns={columns} rows={[{ cells: ["커피"] }]} />);
    expect(screen.getAllByRole("cell")).toHaveLength(1);
  });

  it("루트가 tabIndex=0 이고 소비자 className 이 루트에 병합된다", () => {
    const { container } = render(<Table columns={columns} rows={rows} className="mt-6" />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("tabindex", "0");
    expect(root).toHaveClass("overflow-x-auto", "mt-6");
  });
});

describe("R27 CodeBlock", () => {
  it("문자열은 공백과 줄바꿈 그대로 code 안에 있고, 배열은 \\n 으로 join 된다", () => {
    const source = "if (a) {\n  b();\n}";
    const { container, unmount } = render(<CodeBlock>{source}</CodeBlock>);
    expect(container.querySelector("pre > code")!.textContent).toBe(source);
    unmount();
    const array = render(<CodeBlock>{["a", "b"]}</CodeBlock>);
    expect(array.container.querySelector("pre > code")!.textContent).toBe("a\nb");
  });

  it("label 이 있으면 figcaption 글자이고 pre 가 region 이다", () => {
    const { container } = render(<CodeBlock label="예제">{"x"}</CodeBlock>);
    expect(container.querySelector("figcaption")).toHaveTextContent("예제");
    expect(screen.getByRole("region", { name: "예제" }).tagName).toBe("PRE");
  });

  it("label 이 없거나 빈 문자열이면 figcaption 도 region 도 aria-label 도 없다", () => {
    for (const label of [undefined, ""]) {
      const { container, unmount } = render(<CodeBlock label={label}>{"x"}</CodeBlock>);
      expect(container.querySelector("figcaption")).toBeNull();
      expect(screen.queryByRole("region")).toBeNull();
      expect(container.querySelector("pre")).not.toHaveAttribute("aria-label");
      unmount();
    }
  });

  it("pre 가 tabIndex=0 · overflow-x-auto · bg-transparent · font-mono 이고 루트는 figure 다", () => {
    const { container } = render(<CodeBlock>{"x"}</CodeBlock>);
    expect(container.firstElementChild!.tagName).toBe("FIGURE");
    const pre = container.querySelector("pre")!;
    expect(pre).toHaveAttribute("tabindex", "0");
    expect(pre).toHaveClass("overflow-x-auto", "bg-transparent", "font-mono");
  });

  it("AC-11 소비자 className=bg-surface 가 루트의 bg-surface-muted 를 민다", () => {
    const { container } = render(<CodeBlock className="bg-surface">{"x"}</CodeBlock>);
    const root = container.firstElementChild!;
    expect(root).toHaveClass("bg-surface");
    expect(root).not.toHaveClass("bg-surface-muted");
  });
});

describe("R27 Prose", () => {
  it("루트는 div 이고 text-md text-fg 와 선택자 클래스가 붙고 소비자 className 이 병합된다", () => {
    const { container } = render(<Prose className="mt-6">{"x"}</Prose>);
    const root = container.firstElementChild!;
    expect(root.tagName).toBe("DIV");
    expect(root).toHaveClass(
      "text-md",
      "text-fg",
      "mt-6",
      "[:where(&)>*+*]:mt-4",
      "[:where(&)_h2]:text-xl",
      "[:where(&)_:not(pre)>code]:font-mono",
    );
  });

  it("AC-11 소비자 className 이 루트 글자 크기를 민다", () => {
    const { container } = render(<Prose className="text-sm">{"x"}</Prose>);
    const root = container.firstElementChild!;
    expect(root).toHaveClass("text-sm");
    expect(root).not.toHaveClass("text-md");
  });

  it("원시 h2 · p · code 를 자식으로 렌더한다", () => {
    render(
      <Prose>
        <h2>제목</h2>
        <p>
          본문 <code>x</code>
        </p>
      </Prose>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "제목" })).toBeInTheDocument();
    expect(screen.getByText("x").tagName).toBe("CODE");
  });
});

describe("R27 Tabs", () => {
  const items = [
    { value: "c", label: "C", content: <p>C 내용</p> },
    { value: "ts", label: "TS", content: <p>TS 내용</p> },
    { value: "py", label: "PY", content: <p>PY 내용</p> },
  ];

  it("label 이 tablist 의 접근성 이름이고 탭마다 role=tab 이며 이름이 항목 label 이다", () => {
    render(<Tabs label="언어" items={items} />);
    expect(screen.getByRole("tablist", { name: "언어" })).toBeInTheDocument();
    expect(screen.getAllByRole("tab").map((tab) => tab.textContent)).toEqual(["C", "TS", "PY"]);
    expect(screen.getByRole("tab", { name: "TS" })).toBeInTheDocument();
    expect(screen.queryByText("언어")).toBeNull();
  });

  it("비제어 기본은 첫 항목이고 첫 패널 내용만 DOM 에 있다", () => {
    render(<Tabs label="언어" items={items} />);
    expect(screen.getByRole("tab", { name: "C" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "TS" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByText("C 내용")).toBeInTheDocument();
    expect(screen.queryByText("TS 내용")).toBeNull();
  });

  it("defaultValue 로 비제어 첫 선택을 정한다", () => {
    render(<Tabs label="언어" items={items} defaultValue="py" />);
    expect(screen.getByRole("tab", { name: "PY" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("PY 내용")).toBeInTheDocument();
  });

  it("클릭으로 바꾸면 onValueChange 가 값 문자열 하나로 불린다", () => {
    const onValueChange = vi.fn();
    render(<Tabs label="언어" items={items} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("tab", { name: "TS" }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0]).toEqual(["ts"]);
    expect(screen.getByText("TS 내용")).toBeInTheDocument();
    expect(screen.queryByText("C 내용")).toBeNull();
  });

  it("제어 — value 를 바꾸면 패널이 바뀌고 클릭만으로는 바뀌지 않는다", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Tabs label="언어" items={items} value="c" onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("tab", { name: "TS" }));
    expect(onValueChange.mock.calls).toEqual([["ts"]]);
    expect(screen.getByText("C 내용")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "C" })).toHaveAttribute("aria-selected", "true");
    rerender(<Tabs label="언어" items={items} value="ts" onValueChange={onValueChange} />);
    expect(screen.getByText("TS 내용")).toBeInTheDocument();
    expect(screen.queryByText("C 내용")).toBeNull();
  });

  it("키보드 — 화살표는 포커스만 옮기고 Enter 가 활성화하며 Home · End 로 처음과 끝에 간다", async () => {
    render(<Tabs label="언어" items={items} />);
    const [first, second, third] = screen.getAllByRole("tab") as [HTMLElement, HTMLElement, HTMLElement];
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowRight" });
    // Base UI 가 포커스를 queueMicrotask 로 옮긴다.
    await waitFor(() => expect(second).toHaveFocus());
    expect(second).toHaveAttribute("aria-selected", "false");
    expect(screen.getByText("C 내용")).toBeInTheDocument();
    // jsdom 은 버튼 Enter 의 기본 동작(click 합성)을 하지 않아 click 을 직접 보낸다. 실제 Enter 는 verify-next 의 Playwright 가 본다.
    fireEvent.keyDown(second, { key: "Enter" });
    fireEvent.click(second);
    expect(second).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("TS 내용")).toBeInTheDocument();
    fireEvent.keyDown(second, { key: "End" });
    await waitFor(() => expect(third).toHaveFocus());
    fireEvent.keyDown(third, { key: "Home" });
    await waitFor(() => expect(first).toHaveFocus());
  });

  it("탭 버튼이 type=button 이다 (C-21)", () => {
    render(<Tabs label="언어" items={items} />);
    for (const tab of screen.getAllByRole("tab")) expect(tab).toHaveAttribute("type", "button");
  });

  it("소비자 className 이 루트에 병합된다", () => {
    const { container } = render(<Tabs label="언어" items={items} className="mt-6" />);
    expect(container.firstElementChild).toHaveClass("flex", "flex-col", "mt-6");
  });
});
