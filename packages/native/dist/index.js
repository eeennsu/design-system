import { Button } from "./button.js";
import { Card } from "./card.js";
import { Input } from "./input.js";
import { Stack } from "./stack.js";
import { Text } from "./text.js";
export { Button, Card, Input, Stack, Text };
export { cn } from "./cn.js";
/**
 * 계약 맵 테스트(C-17)가 보는 객체. 키 집합이 `nativeComponents` 와 같고
 * 값 타입이 `FC<Contracts<"native">[K]>` 와 같아야 한다(AC-21).
 */
export const components = {
    Button,
    Input,
    Card,
    Stack,
    Text,
};
//# sourceMappingURL=index.js.map