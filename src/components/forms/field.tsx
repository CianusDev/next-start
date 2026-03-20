import * as React from "react";

import { cn } from "@/lib/utils";

export function FieldError({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    />
  );
}

export function Field({
  className,
  ...props
}: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn("flex flex-col gap-2 w-full relative", className)}
      {...props}
    />
  );
}
