import { Badge } from "./badge.js";
import { Box } from "./box.js";
import { Button } from "./button.js";
import { ButtonGroup } from "./button-group.js";
import { Card } from "./card.js";
import { Dialog } from "./dialog.js";
import { Drawer } from "./drawer.js";
import { Form } from "./form.js";
import { Input } from "./input.js";
import { Label } from "./label.js";
import { Stack } from "./stack.js";
import { Text } from "./text.js";
import { Textarea } from "./textarea.js";
import { Tooltip } from "./tooltip.js";

export { Badge, Box, Button, ButtonGroup, Card, Dialog, Drawer, Form, Input, Label, Stack, Text, Textarea, Tooltip };
export { cn } from "./cn.js";

/**
 * 계약 맵 테스트(C-17)가 보는 객체. 키 집합이 `webComponents` 와 같고
 * 값 타입이 `FC<Contracts<"web">[K]>` 와 같아야 한다.
 */
export const components = {
  Button,
  ButtonGroup,
  Input,
  Textarea,
  Label,
  Card,
  Badge,
  Text,
  Stack,
  Box,
  Tooltip,
  Dialog,
  Drawer,
  Form,
};
