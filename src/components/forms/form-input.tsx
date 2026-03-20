"use client";
import { Eye, EyeClosed } from "lucide-react";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldError } from "./field";

export const FormInput = ({
  ...props
}: React.ComponentProps<"input"> & {
  label?: string;
  error?: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = props.type === "password";

  return (
    <Field>
      <Label hidden={!props.label} htmlFor={props.id}>
        {props.label}
      </Label>
      {isPassword ? (
        <div className="relative">
          <Input {...props} type={showPassword ? "text" : "password"} />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground "
            aria-label={
              showPassword
                ? "Cacher le mot de passe"
                : "Afficher le mot de passe"
            }
          >
            {showPassword ? (
              <Eye className="size-4" />
            ) : (
              <EyeClosed className="size-4" />
            )}
          </button>
        </div>
      ) : (
        <Input {...props} />
      )}
      <FieldError hidden={!props.error}>{props.error}</FieldError>
    </Field>
  );
};
