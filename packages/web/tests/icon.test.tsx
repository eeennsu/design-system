/**
 * `IconName` 28개가 실제 lucide 컴포넌트로 이어지는가 (plan §4.5 · AC-15a). v1 24개 + N-17 4개.
 *
 * `Record<IconName, LucideIcon>` 이 누락은 잡지만, lucide 가 별칭 이름을 `undefined` 로
 * 내보내는 경우(major 에서 별칭이 사라질 때)는 타입이 잡지 못한다. 렌더로 확인한다.
 */
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button, Icon } from "../src/index.js";
import { icons } from "../src/icon.js";

const names = Object.keys(icons) as (keyof typeof icons)[];

describe("아이콘 맵", () => {
  it("v1 24개에 N-17 의 4개(home · list · chart-pie · calendar)를 더해 28개다", () => {
    expect(names).toHaveLength(28);
    expect(names).toEqual(expect.arrayContaining(["home", "list", "chart-pie", "calendar"]));
  });

  it("모든 이름이 실제 컴포넌트로 렌더된다", () => {
    for (const name of names) {
      const { container, unmount } = render(<Button label="열기" icon={name} />);
      expect(container.querySelector("svg"), `${name} 이 렌더되지 않았다`).not.toBeNull();
      unmount();
    }
  });

  it("아이콘은 접근성 트리에서 숨는다 — 이름은 label 이 준다 (C-13)", () => {
    const { container } = render(<Button label="삭제" icon="trash" />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("단독 Icon 도 모든 이름을 렌더한다", () => {
    for (const name of names) {
      const { container, unmount } = render(<Icon name={name} />);
      expect(container.querySelector("svg"), `${name} 이 렌더되지 않았다`).not.toBeNull();
      unmount();
    }
  });
});
