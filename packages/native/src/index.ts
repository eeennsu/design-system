import { Badge } from "./badge.js";
import { Box } from "./box.js";
import { Button } from "./button.js";
import { Card } from "./card.js";
import { Chip } from "./chip.js";
import { Icon } from "./icon.js";
import { Input } from "./input.js";
import { Label } from "./label.js";
import { Stack } from "./stack.js";
import { Text } from "./text.js";
import { Textarea } from "./textarea.js";

export { Badge, Box, Button, Card, Chip, Icon, Input, Label, Stack, Text, Textarea };
export { cn } from "./cn.js";

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
};
