"use client";
import { useTransition, type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";
import { FormWrapper } from "@/components/forms/form-wrapper";
import { Form } from "@/components/forms/form";
import { FormInput } from "@/components/forms/form-input";
import { Button } from "@/components/ui/button";
import { signIn } from "../auth.service";
import { logger } from "@/lib/logger";

const schema = z.object({
  email: z.email({
    message: "L'adresse e-mail n'est pas valide",
  }),
  password: z.string({
    message: "Le mot de passe est requis",
  }),
});

export const LoginForm: FC = () => {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (paylaod: z.infer<typeof schema>) => {
    startTransition(async () => {
      const { success, data, message } = await signIn(paylaod);
      if (!success) {
        toast.error(message || "Erreur lors de la connexion");
        return;
      }
      toast.success(message || "Connexion réussie");
      logger.debug("Apres connexion:", {
        data,
      });
    });
  };

  return (
    <FormWrapper title="Connectez-vous pour continer">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="E-mail"
          type="email"
          placeholder="e-mail"
          error={errors.email?.message}
          {...register("email")}
        />
        <FormInput
          label="Mot de passe"
          type="password"
          placeholder="mot de passe"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button className="mt-2" type="submit" loading={isPending}>
          Se connecter
        </Button>
      </Form>
    </FormWrapper>
  );
};
