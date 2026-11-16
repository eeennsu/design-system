import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
import { Pressable, Text as RNText, View } from "react-native-css/components";
import { cn } from "./cn.js";
import { Glyph } from "./icon.js";
import { stepStates } from "./step-states.js";
import { steps } from "./text.js";

/**
 * 단계 표시(R28). 번호 없이 지난 단계는 체크, 펼친 단계는 막대다. 되돌아가기는 onValueChange 가 있을 때만 버튼이다.
 * 지난 단계는 버튼이든 아니든 "완료"로 읽힌다. RN Text 는 글자 크기를 상속하지 않아 글마다 md 스텝을 준다.
 */
export const Stepper: FC<Contracts<"native">["Stepper"]> = ({ label, items, value, reached, onValueChange, className }) => {
  const states = stepStates(items, value, reached);
  return (
    <View accessibilityLabel={label} className={cn("flex-col", className)}>
      {items.map((item, i) => {
        const state = states[i];
        // 템플릿 리터럴 대신 이어 붙인다 — dist 검사가 템플릿 리터럴을 막는다.
        const done = item.label + ", 완료";
        return (
          <View key={item.value} className="flex-row gap-3 py-2">
            <View className="h-6 w-4 shrink-0 items-center justify-center">
              {state === "done" ? <Glyph name="check" size="sm" className="text-fg-muted" /> : null}
              {state === "current" ? <View className="h-full border-l-2 border-brand" /> : null}
            </View>
            <View className="min-w-0 flex-1">
              {state === "current" ? (
                // accessible 이 아닌 View 의 state 는 스크린 리더에 닿지 않아 글자에 단다.
                <RNText accessibilityState={{ selected: true }} className={cn("font-sans font-semibold text-fg", steps.md)}>
                  {item.label}
                </RNText>
              ) : state === "done" && onValueChange ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={done}
                  onPress={() => onValueChange(item.value)}
                  className="self-start active:opacity-80"
                >
                  <RNText className={cn("font-sans text-fg-muted", steps.md)}>{item.label}</RNText>
                </Pressable>
              ) : (
                <RNText accessibilityLabel={state === "done" ? done : undefined} className={cn("font-sans text-fg-muted", steps.md)}>
                  {item.label}
                </RNText>
              )}
              {state === "current" && item.content !== undefined ? <View className="mt-2">{item.content}</View> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
};
