import { Badge } from "./badge.js";
import { Box } from "./box.js";
import { Button } from "./button.js";
import { Callout } from "./callout.js";
import { ButtonGroup } from "./button-group.js";
import { Card } from "./card.js";
import { Chip } from "./chip.js";
import { CodeBlock } from "./code-block.js";
import { Collapsible } from "./collapsible.js";
import { Dialog } from "./dialog.js";
import { Drawer } from "./drawer.js";
import { Form } from "./form.js";
import { Icon } from "./icon.js";
import { Input } from "./input.js";
import { Label } from "./label.js";
import { Link } from "./link.js";
import { Prose } from "./prose.js";
import { Stack } from "./stack.js";
import { Table } from "./table.js";
import { Tabs } from "./tabs.js";
import { Text } from "./text.js";
import { Textarea } from "./textarea.js";
import { Tooltip } from "./tooltip.js";

export { Badge, Box, Button, ButtonGroup, Callout, Card, Chip, CodeBlock, Collapsible, Dialog, Drawer, Form, Icon, Input, Label, Link, Prose, Stack, Table, Tabs, Text, Textarea, Tooltip };
export type { TabItem, TableColumn, TableRow } from "@eeennsu/tokens";
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
  Chip,
  Icon,
  Text,
  Stack,
  Box,
  Tooltip,
  Dialog,
  Drawer,
  Form,
  Table,
  CodeBlock,
  Prose,
  Tabs,
  Collapsible,
  Link,
  Callout,
};
