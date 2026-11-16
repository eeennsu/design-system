"use client";

import { Stepper, Text } from "@eeennsu/web";
import { useState } from "react";

const steps = ["a", "b", "c", "d", "e"].map((value, index) => ({
  value,
  label: `${index + 1}단계`,
  content: <Text>{`${index + 1}단계 내용이다`}</Text>,
}));

/**
 * R28 Stepper 확인용. Stepper 는 제어 전용이라 상태를 쥘 클라이언트 래퍼가 필요하다.
 * `reached="d"` 가 `value` 뒤에 있어 4단계까지 간 뒤 2단계를 다시 연 모양이고, 5단계(e)가 남은 단계다.
 */
export function StepperDemo() {
  const [value, setValue] = useState("b");
  return <Stepper label="예시 단계" items={steps} value={value} reached="d" onValueChange={setValue} />;
}
