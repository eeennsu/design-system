import type { StepItem as PlatformStepItem } from "@eeennsu/tokens";
import { Badge } from "./badge.js";
import { Box } from "./box.js";
import { Button } from "./button.js";
import { Callout } from "./callout.js";
import { Card } from "./card.js";
import { Chip } from "./chip.js";
import { Icon } from "./icon.js";
import { Input } from "./input.js";
import { Label } from "./label.js";
import { Link } from "./link.js";
import { Stack } from "./stack.js";
import { Stepper } from "./stepper.js";
import { Text } from "./text.js";
import { Textarea } from "./textarea.js";

export { Badge, Box, Button, Callout, Card, Chip, Icon, Input, Label, Link, Stack, Stepper, Text, Textarea };
export { cn } from "./cn.js";

/** Stepper 항목. 계약의 플랫폼 매개변수를 native 로 고정해 `StepItem[]` 로 쓴다(웹 진입점과 같은 방식). */
export type StepItem = PlatformStepItem<"native">;

/**
 * 계약 맵 테스트(C-17)가 보는 객체. 키 집합이 `nativeComponents` 와 같고
 * 값 타입이 `FC<Contracts<"native">[K]>` 와 같아야 한다(AC-21).
 */
export const components = {
  Button,
  Input,
  Textarea,
  Label,
  Card,
  Badge,
  Chip,
  Icon,
  Text,
  Stack,
  Box,
  Link,
  Callout,
  Stepper,
};
