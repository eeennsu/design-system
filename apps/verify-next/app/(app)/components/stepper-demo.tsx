"use client";

import type { StepItem } from "@eeennsu/web";
import { Stepper, Text } from "@eeennsu/web";
import { useState } from "react";

/**
 * R28 Task 11 — Stepper 는 제어 전용이라 상태가 필요하다. 화면(page.tsx)은 서버 컴포넌트로 두고
 * 상태만 이 작은 클라이언트 래퍼가 쥔다. `reached="d"` 라 b 를 펼쳐도 c 까지 지난 단계로 눌린다.
 */
const items: StepItem[] = [
  { value: "a", label: "계정 만들기", content: <Text>이메일과 비밀번호를 정한다</Text> },
  { value: "b", label: "프로필 채우기", content: <Text>이름과 사진을 올린다</Text> },
  { value: "c", label: "알림 설정", content: <Text>받을 알림을 고른다</Text> },
  { value: "d", label: "첫 지출 기록", content: <Text>첫 지출을 적어 본다</Text> },
  { value: "e", label: "예산 정하기", content: <Text>한 달 예산을 정한다</Text> },
];

export function StepperDemo() {
  const [value, setValue] = useState("b");
  return <Stepper label="가입 단계" items={items} value={value} reached="d" onValueChange={setValue} />;
}
