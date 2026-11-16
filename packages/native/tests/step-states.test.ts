import { describe, expect, it } from "vitest";
import { stepStates } from "../src/step-states.js";

describe("R28 stepStates (native)", () => {
  const items = [{ value: "a" }, { value: "b" }, { value: "c" }, { value: "d" }];

  it("reached 가 없으면 value 앞이 done 이고 뒤가 upcoming 이다", () => {
    expect(stepStates(items, "b")).toEqual(["done", "current", "upcoming", "upcoming"]);
  });

  it("reached 가 뒤면 그 앞까지 done 이다", () => {
    expect(stepStates(items, "b", "d")).toEqual(["done", "current", "done", "done"]);
  });

  it("reached 가 value 앞이면 value 가 이긴다", () => {
    expect(stepStates(items, "c", "a")).toEqual(["done", "done", "current", "upcoming"]);
  });

  it("value 가 없는 값이면 전부 upcoming 이다", () => {
    expect(stepStates(items, "z")).toEqual(["upcoming", "upcoming", "upcoming", "upcoming"]);
  });

  it("reached 가 없는 값이면 무시한다", () => {
    expect(stepStates(items, "b", "z")).toEqual(["done", "current", "upcoming", "upcoming"]);
  });

  it("빈 배열은 빈 배열이다", () => {
    expect(stepStates([], "a")).toEqual([]);
  });
});
