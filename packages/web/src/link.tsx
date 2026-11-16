import type { Contracts } from "@eeennsu/tokens";
import type { FC } from "react";
import { cn } from "./cn.js";
import { steps, tones } from "./text.js";

/** 글 속 링크(R28). 밑줄은 hover · focus 에서만 나온다. 소비자 `className` 이 tone 색을 이긴다. */
export const Link: FC<Contracts<"web">["Link"]> = ({ label, href, tone = "brand", size = "md", className }) => (
  <a
    href={href}
    className={cn(
      "rounded-sm hover:underline focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
      tones[tone],
      steps[size],
      className,
    )}
  >
    {label}
  </a>
);
