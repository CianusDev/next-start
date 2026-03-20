import { cn } from "@/lib/utils";
import type { FC, ReactNode } from "react";

interface FormWrapperProps {
  className?: string;
  children?: ReactNode;
  title?: string;
  description?: string;
}

export const FormWrapper: FC<FormWrapperProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-col max-w-sm w-full items-center justify-center gap-6",
        className,
      )}
    >
      <div className="text-center">
        {props.title && <h2>{props.title}</h2>}
        {props.description && <p>{props.description}</p>}
      </div>
      {children}mod
    </div>
  );
};
