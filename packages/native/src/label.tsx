import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
import { Text as RNText } from "react-native-css/components";
import { cn } from "./cn.js";

/**
 * 컨트롤 `id` → 그 컨트롤을 가리키는 Label 의 `nativeID`.
 * 컨트롤이 자기 `id` 를 `nativeID` 로 이미 쓰므로 Label 은 접미어를 붙인 다른 이름을 갖는다 —
 * 같은 `nativeID` 가 둘이면 `accessibilityLabelledBy` 가 어느 쪽을 가리킬지 정해지지 않는다.
 */
export const labelNativeId = (id: string): string => id + "-label";

/**
 * Input · Textarea 의 가시 라벨. 웹 Label 과 같은 클래스다(AC-25).
 *
 * 웹의 `<label htmlFor>` 연결을 RN 은 `nativeID` / `accessibilityLabelledBy` 로 옮긴다(C-13) —
 * Label 이 `nativeID` 를 갖고, 같은 `id` 의 컨트롤이 그것을 `accessibilityLabelledBy` 로 가리킨다.
 * Android 전용 속성이고 iOS 는 컨트롤의 `accessibilityLabel`(필수 `label`)만 읽는다.
 * 웹처럼 라벨을 눌러 컨트롤에 포커스하는 동작은 없다(구현 노트 N-16).
 */
export const Label: FC<Contracts<"native">["Label"]> = ({ children, htmlFor, className }) => (
  <RNText
    nativeID={htmlFor ? labelNativeId(htmlFor) : undefined}
    className={cn("text-sm text-fg", className)}
  >
    {children}
  </RNText>
);
