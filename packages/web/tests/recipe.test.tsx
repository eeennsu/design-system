/**
 * T-W8 (6) recipe 일치 — 컴포넌트가 붙이는 클래스가 `@eeennsu/tokens` 의 component 값과 같은가.
 *
 * 구현은 정적 리터럴만 쓸 수 있으므로(C-4 (2)) 토큰 값과 클래스 문자열이 갈릴 수 있다.
 * 그 간극을 여기서 막는다. 조립은 테스트 쪽에서만 한다.
 */
import { component } from "@eeennsu/tokens";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge, Button, Card, Chip, Dialog, Drawer, Input, Textarea, Tooltip } from "../src/index.js";

type Recipe = { paddingX?: string; paddingY?: string; text?: string; radius?: string; gap?: string };

/** 토큰 recipe → 기대 클래스 목록. */
function expected(recipe: Recipe): string[] {
  const classes: string[] = [];
  if (recipe.paddingX !== undefined) classes.push(`px-${recipe.paddingX}`);
  if (recipe.paddingY !== undefined) classes.push(`py-${recipe.paddingY}`);
  if (recipe.text !== undefined) classes.push(`text-${recipe.text}`);
  if (recipe.radius !== undefined) classes.push(`rounded-${recipe.radius}`);
  if (recipe.gap !== undefined) classes.push(`gap-${recipe.gap}`);
  return classes;
}

describe("Button", () => {
  for (const size of ["sm", "md", "lg"] as const) {
    it(`size=${size} 가 토큰 recipe 와 같다`, () => {
      render(<Button label="저장" size={size} />);
      expect(screen.getByRole("button")).toHaveClass(...expected(component.button[size]));
    });
  }
});

describe("Input · Textarea", () => {
  for (const size of ["sm", "md", "lg"] as const) {
    it(`Input size=${size} 가 토큰 recipe 와 같다`, () => {
      render(<Input label="이름" size={size} />);
      expect(screen.getByLabelText("이름")).toHaveClass(...expected(component.input[size]));
    });
  }

  it("Textarea 는 Input md 패딩을 쓰고 행수만 size 를 따른다", () => {
    render(<Textarea label="메모" size="lg" />);
    const textarea = screen.getByLabelText("메모");
    expect(textarea).toHaveClass(...expected(component.input.md));
    expect(textarea).toHaveAttribute("rows", String(component.textarea.rows.lg));
  });
});

describe("Badge", () => {
  for (const size of ["sm", "md"] as const) {
    it(`size=${size} 가 토큰 recipe 와 같다`, () => {
      render(<Badge size={size}>표시</Badge>);
      expect(screen.getByText("표시")).toHaveClass(...expected(component.badge[size]));
    });
  }
});

describe("Chip", () => {
  it("토큰 recipe 와 같다 (N-17)", () => {
    render(<Chip label="식비" />);
    expect(screen.getByRole("button")).toHaveClass(...expected(component.chip));
  });
});

describe("Card · 오버레이", () => {
  it("Card", () => {
    render(
      <Card>
        <span>내용</span>
      </Card>,
    );
    expect(screen.getByText("내용").parentElement).toHaveClass(
      `p-${component.card.padding}`,
      `rounded-${component.card.radius}`,
    );
  });

  it("Dialog", () => {
    render(
      <Dialog label="확인" defaultOpen>
        <span>내용</span>
      </Dialog>,
    );
    expect(screen.getByRole("dialog")).toHaveClass(
      `p-${component.dialog.padding}`,
      `rounded-${component.dialog.radius}`,
      `shadow-${component.dialog.shadow}`,
      ...component.dialog.maxWidth.split(" "),
    );
  });

  it("Drawer", () => {
    render(
      <Drawer label="메뉴" defaultOpen>
        <span>내용</span>
      </Drawer>,
    );
    expect(screen.getByRole("dialog")).toHaveClass(
      `p-${component.drawer.padding}`,
      ...component.drawer.width.split(" "),
    );
  });

  it("Tooltip", () => {
    render(
      <Tooltip label="설명" defaultOpen>
        <Button label="대상" />
      </Tooltip>,
    );
    expect(screen.getByText("설명")).toHaveClass(...expected(component.tooltip));
  });
});

describe("Icon", () => {
  it("크기는 클래스가 아니라 lucide size prop 으로 간다 (plan v2 F-8)", () => {
    render(<Button label="삭제" icon="trash" size="lg" />);
    const svg = screen.getByRole("button").querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe(String(component.icon.size.lg));
    expect(svg.getAttribute("height")).toBe(String(component.icon.size.lg));
  });
});
