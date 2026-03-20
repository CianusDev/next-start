# Pattern : Forms (Formulaires)

Ce document décrit comment créer et utiliser les **formulaires** dans ce projet.

---

## Stack

- **react-hook-form** : Gestion de l'état du formulaire
- **@hookform/resolvers/zod** : Intégration Zod avec react-hook-form
- **Zod** : Validation du schéma
- **sonner** : Notifications toast (succès/erreur)
- **composants** : `FormWrapper`, `Form`, `FormInput` depuis `@/components/forms/`

---

## Composants de Formulaire

Les primitives sont dans `src/components/forms/` :

| Composant | Rôle |
|-----------|------|
| `FormWrapper` | Conteneur avec titre et description optionnels |
| `Form` | Wrapper `<form>` avec layout flex column |
| `FormInput` | Input avec label, affichage d'erreur, toggle password |
| `Field` | Wrapper `<fieldset>` pour un champ |
| `FieldError` | Message d'erreur stylisé (texte destructive) |

---

## Pattern Standard

### Formulaire dans un composant feature

```typescript
// features/auth/components/login-form.tsx
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
import { myAction } from "../my.service";

// 1. Définir le schéma Zod dans le composant
const schema = z.object({
  email: z.email({ message: "L'adresse e-mail n'est pas valide" }),
  password: z.string({ message: "Le mot de passe est requis" }),
});

export const MyForm: FC = () => {
  // 2. useTransition pour gérer le pending des Server Actions
  const [isPending, startTransition] = useTransition();

  // 3. useForm avec zodResolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // 4. Submit via startTransition + Server Action
  const onSubmit = (payload: z.infer<typeof schema>) => {
    startTransition(async () => {
      const { success, message } = await myAction(payload);
      if (!success) {
        toast.error(message || "Une erreur est survenue");
        return;
      }
      toast.success(message || "Succès");
    });
  };

  return (
    <FormWrapper title="Titre du formulaire">
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
          Envoyer
        </Button>
      </Form>
    </FormWrapper>
  );
};
```

---

## Règles Fondamentales

### 1. Toujours `"use client"` sur le composant formulaire

Les composants formulaire utilisent `useForm`, `useTransition` → client obligatoire.

### 2. Schéma Zod défini dans le fichier composant

Le schéma de validation est colocalisé avec le formulaire :

```typescript
// ✅ BON - Schéma dans le composant
const schema = z.object({ ... });
export function MyForm() { ... }

// ❌ MAUVAIS - Import depuis un fichier externe (sauf si partagé)
import { mySchema } from "./my.schema";
```

> Si le schéma est partagé entre plusieurs composants, le déplacer dans `{feature}.schema.ts`.

### 3. useTransition pour les Server Actions

```typescript
// ✅ BON
const [isPending, startTransition] = useTransition();
const onSubmit = (data) => {
  startTransition(async () => {
    await serverAction(data);
  });
};

// ❌ MAUVAIS - async directement sans transition
const onSubmit = async (data) => {
  await serverAction(data);
};
```

### 4. Toast pour le feedback

```typescript
import { toast } from "sonner";

if (!success) {
  toast.error(message || "Erreur générique");
  return;
}
toast.success(message || "Succès");
```

---

## FormInput - Fonctionnalités

`FormInput` gère automatiquement :
- `label` : affiche un `<Label>` si fourni
- `error` : affiche un `<FieldError>` si fourni
- `type="password"` : toggle visibilité avec icône Eye/EyeClosed (lucide-react)

```tsx
<FormInput
  label="Mot de passe"
  type="password"
  placeholder="••••••••"
  error={errors.password?.message}
  {...register("password")}
/>
```

---

## Checklist Nouveau Formulaire

- [ ] Ajouter `"use client"` sur le composant
- [ ] Définir le schéma Zod dans le fichier
- [ ] Utiliser `useForm` avec `zodResolver`
- [ ] Utiliser `useTransition` pour la soumission
- [ ] Utiliser `toast` (sonner) pour le feedback
- [ ] Utiliser `FormWrapper`, `Form`, `FormInput` de `@/components/forms/`
- [ ] Passer `loading={isPending}` au bouton submit
- [ ] Typer le payload avec `z.infer<typeof schema>`
