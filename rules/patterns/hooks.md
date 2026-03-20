# Pattern : Hooks

Ce document décrit comment créer et utiliser les **hooks React** dans ce projet.

---

## Concept

Un **hook** est une fonction React qui encapsule de la logique réutilisable avec état. Dans ce projet, on distingue :

- **Hooks de feature** : Spécifiques à une fonctionnalité (`features/{feature}/use-*.ts`)
- **Hooks globaux** : Réutilisables partout (`hooks/use-*.ts`)

---

## Structure d'un Hook

### Hook de Feature

```typescript
// features/users/use-users.ts
"use client";

import { User } from "@/models/user.model";
import { useEffect, useState } from "react";
import { getUsers } from "./users.service";
import { toast } from "sonner";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const defaultErrorMessage =
    "Une erreur s'est produite lors de la récupération des utilisateurs";

  async function fetchUsers() {
    setIsLoading(true);
    setError(null);
    try {
      const { success, data, message } = await getUsers();
      if (success && data) {
        setUsers(data as User[]);
      } else {
        toast.error(message || defaultErrorMessage);
        setError(message || defaultErrorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, isLoading, error, refetch: fetchUsers };
}

```

---

## Règles Fondamentales

### 1. Toujours utiliser `"use client"`

```typescript
"use client"; // Obligatoire en première ligne

export function useMyHook() {
  // ...
}
```

Les hooks utilisent des APIs React qui nécessitent le runtime client.

### 2. Nommage avec préfixe `use`

```typescript
// ✅ BON
export function useUsers() {}
export function useAuth() {}
export function useLocalStorage() {}

// ❌ MAUVAIS
export function getUsers() {}     // Pas de préfixe "use"
export function UsersHook() {}    // PascalCase
```

### 3. Retourner un objet structuré

```typescript
// ✅ BON - Objet avec propriétés nommées
return {
  data: users,
  isLoading,
  error,
  refetch,
};

// ❌ MAUVAIS - Tableau (moins lisible)
return [users, isLoading, error, refetch];
```

---

## Patterns de Hooks

### 1. Hook de Data Fetching

Le pattern le plus courant pour récupérer des données.

```typescript
"use client";

import { useEffect, useState } from "react";
import { getProducts } from "./products.service";
import { Product } from "@/models/product.model";
import { toast } from "sonner";

interface UseProductsOptions {
  initialFetch?: boolean;
  filters?: ProductsFilters;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { initialFetch = true, filters } = options;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(initialFetch);
  const [error, setError] = useState<string | null>(null);
  const defaultErrorMessage =
    "Une erreur s'est produite lors de la récupération des produits";

  async function fetchProducts() {
    setIsLoading(true);
    setError(null);
    try {
      const { success, data, message } = await getProducts(filters);
      if (success && data) {
        setProducts(data as Product[]);
      } else {
        toast.error(message || defaultErrorMessage);
        setError(message || defaultErrorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (initialFetch) {
      fetchProducts();
    }
  }, []);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    setProducts, // Pour les mises à jour optimistes
  };
}
```

### 2. Hook de Single Resource

Pour récupérer une ressource unique par ID.

```typescript
"use client";

import { useEffect, useState } from "react";
import { getUserById } from "./users.service";
import { User } from "@/models/user.model";
import { toast } from "sonner";

export function useUser(id: string | null) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);
  const defaultErrorMessage =
    "Une erreur s'est produite lors de la récupération de l'utilisateur";

  async function fetchUser() {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const { success, data, message } = await getUserById(id);
      if (success && data) {
        setUser(data as User);
      } else {
        toast.error(message || defaultErrorMessage);
        setError(message || defaultErrorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [id]);

  return {
    user,
    isLoading,
    error,
    refetch: fetchUser,
  };
}
```

### 3. Hook de Mutation

Pour les opérations CRUD (create, update, delete).

```typescript
"use client";

import { useState } from "react";
import { createUser, updateUser, deleteUser } from "./users.service";
import { CreateUserDTO, UpdateUserDTO } from "./users.types";
import { toast } from "sonner";

export function useUserMutations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(data: CreateUserDTO) {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createUser(data);
      if (!result.success) {
        toast.error(result.message || "Erreur lors de la création");
        setError(result.message || "Erreur lors de la création");
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }

  async function update(id: string, data: UpdateUserDTO) {
    setIsLoading(true);
    setError(null);
    try {
      const result = await updateUser(id, data);
      if (!result.success) {
        toast.error(result.message || "Erreur lors de la mise à jour");
        setError(result.message || "Erreur lors de la mise à jour");
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }

  async function remove(id: string) {
    setIsLoading(true);
    setError(null);
    try {
      const result = await deleteUser(id);
      if (!result.success) {
        toast.error(result.message || "Erreur lors de la suppression");
        setError(result.message || "Erreur lors de la suppression");
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    create,
    update,
    remove,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
```

---

## Hooks Globaux

Les hooks réutilisables dans toute l'application vont dans `src/hooks/`.

### Hook useDebounce

```typescript
// hooks/use-debounce.ts
"use client";

import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

### Hook useLocalStorage

```typescript
// hooks/use-local-storage.ts
"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
    setIsLoaded(true);
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return { value: storedValue, setValue, removeValue, isLoaded };
}
```

### Hook useMediaQuery

```typescript
// hooks/use-media-query.ts
"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query, matches]);

  return matches;
}

// Hooks dérivés pratiques
export function useIsMobile() {
  return useMediaQuery("(max-width: 768px)");
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)");
}
```

### Hook useToggle

```typescript
// hooks/use-toggle.ts
"use client";

import { useCallback, useState } from "react";

export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse, setValue };
}
```

---

## Hooks avec React 19

### useOptimistic

Pour les mises à jour optimistes de l'UI.

```typescript
"use client";

import { useOptimistic, useTransition } from "react";
import { likePost } from "./posts.service";

export function useOptimisticLike(initialLikes: number, initialLiked: boolean) {
  const [isPending, startTransition] = useTransition();
  
  const [optimisticState, addOptimistic] = useOptimistic(
    { likes: initialLikes, liked: initialLiked },
    (state, _action: "toggle") => ({
      likes: state.liked ? state.likes - 1 : state.likes + 1,
      liked: !state.liked,
    })
  );

  async function toggleLike(postId: string) {
    startTransition(async () => {
      addOptimistic("toggle");
      await likePost(postId);
    });
  }

  return {
    likes: optimisticState.likes,
    liked: optimisticState.liked,
    toggleLike,
    isPending,
  };
}
```

### useActionState

Pour gérer l'état des Server Actions.

```typescript
"use client";

import { useActionState } from "react";
import { submitForm } from "./form.action";

export function useFormSubmit() {
  const [state, formAction, isPending] = useActionState(submitForm, {
    success: false,
    message: "",
  });

  return {
    state,
    formAction,
    isPending,
  };
}
```

---

## Bonnes Pratiques

### 1. Éviter les dépendances inutiles dans useEffect

```typescript
// ❌ MAUVAIS - Fonction dans les dépendances
useEffect(() => {
  fetchData();
}, [fetchData]); // fetchData change à chaque render

// ✅ BON - Dépendances stables
useEffect(() => {
  fetchData();
}, []); // Ou utiliser useCallback pour fetchData
```

### 2. Nettoyer les effets

```typescript
useEffect(() => {
  const controller = new AbortController();
  
  async function fetch() {
    try {
      const response = await api.get("/data", {
        signal: controller.signal,
      });
      setData(response.data);
    } catch (error) {
      if (!controller.signal.aborted) {
        setError("Erreur");
      }
    }
  }
  
  fetch();
  
  return () => controller.abort(); // Cleanup
}, []);
```

### 3. Séparer les responsabilités

```typescript
// ❌ MAUVAIS - Hook qui fait trop de choses
export function useUserPage() {
  // Fetch user, fetch posts, handle form, handle modal...
}

// ✅ BON - Hooks spécialisés
export function useUser(id: string) { /* ... */ }
export function useUserPosts(userId: string) { /* ... */ }
export function useUserForm() { /* ... */ }
```

---

## Où Placer les Hooks

| Type | Emplacement | Exemple |
|------|-------------|---------|
| Hook de feature | `features/{feature}/use-*.ts` | `features/users/use-users.ts` |
| Hook global | `hooks/use-*.ts` | `hooks/use-debounce.ts` |

---

## Checklist Nouveau Hook

- [ ] Ajouter `"use client"` en première ligne
- [ ] Préfixer le nom avec `use`
- [ ] Retourner un objet (pas un tableau)
- [ ] Inclure `isLoading` et `error` si async
- [ ] Inclure une fonction `refetch` si data fetching
- [ ] Nettoyer les effets si nécessaire
- [ ] Documenter les paramètres et le retour
