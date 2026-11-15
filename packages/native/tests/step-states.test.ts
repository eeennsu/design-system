/**
 * R28 Stepper 상태 규칙(알려진 동작 36). 웹 Task 8 과 같은 여섯 사례다.
 * `stepStates` 는 react-native 를 import 하지 않는 파일에 있어 vitest 가 직접 불러온다.
 */
import { describe, expect, it } from "vitest";
import { stepStates } from "../src/step-states.js";

describe("R28 Stepper — stepStates", () => {
  const items = [{ value: "a" }, { value: "b" }, { value: "c" }, { value: "d" }];

  it("reached 가 없으면 value 앞은 지난, value 는 펼친, 뒤는 남은 단계다", () => {
    expect(stepStates(items, "b")).toEqual(["done", "current", "upcoming", "upcoming"]);
  });

  it("reached 까지는 value 뒤라도 지난 단계다", () => {
    expect(stepStates(items, "b", "d")).toEqual(["done", "current", "done", "done"]);
  });

  it("reached 가 value 보다 앞이면 value 를 따른다", () => {
    expect(stepStates(items, "c", "a")).toEqual(["done", "done", "current", "upcoming"]);
  });

  it("value 가 어느 항목과도 맞지 않으면 전부 남은 단계다 (던지지 않는다)", () => {
    expect(stepStates(items, "z")).toEqual(["upcoming", "upcoming", "upcoming", "upcoming"]);
    expect(stepStates(items, "z", "c")).toEqual(["upcoming", "upcoming", "upcoming", "upcoming"]);
  });

  it("reached 가 없는 항목이면 value 를 따른다", () => {
    expect(stepStates(items, "b", "z")).toEqual(["done", "current", "upcoming", "upcoming"]);
  });

  it("빈 items 는 빈 배열이다", () => {
    expect(stepStates([], "a")).toEqual([]);
    expect(stepStates([], "a", "b")).toEqual([]);
  });
});
