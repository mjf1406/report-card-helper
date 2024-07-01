"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "~/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-6 w-full overflow-hidden rounded-full bg-accent",
      className,
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-secondary transition-all"
      // style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      style={{ transform: `translateX(-${(100 - (value ?? 0)).toFixed(3)}%)` }}
    />
    <span className="absolute inset-0 flex items-center justify-center text-base font-semibold text-background">
      {value != null ? `${value.toFixed(1)}%` : null}
    </span>
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
