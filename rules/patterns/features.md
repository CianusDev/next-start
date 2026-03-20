# Pattern : Features (Architecture Feature-Based)

Ce document décrit comment structurer et créer une **feature** dans ce projet.

---

## Concept

Une **feature** est un module fonctionnel autonome qui regroupe tout le code nécessaire pour une fonctionnalité métier spécifique.

**Avantages :**
- 🎯 **Cohésion** : Tout le code lié est au même endroit
- 🔄 **Réutilisabilité** : Facile à copier dans un autre projet
- 🗑️ **Suppression facile** : Un dossier à supprimer
- 👥 **Travail en équipe** : Moins de conflits Git

---

## Structure d'une Feature

```
src/features/{feature-name}/
├── components/              # Composants spécifiques à la feature
│   ├── {component}.tsx
│   └── readme.md
├── {feature}.service.ts     # Actions serveur (appels API)
├── use-{feature}.ts         # Hook React (logique client)
├── {feature}.guard.ts       # Protection/vérifications (optionnel)
├── {feature}.types.ts       # Types/DTOs spécifiques (optionnel)
├── {feature}.interface.ts   # Interfaces TypeScript (optionnel, alt à types.ts)
└── readme.md                # Documentation de la feature
```

---

## Fichiers Détaillés

### 1. Service (`*.service.ts`)

Le service contient les **Server Actions** pour communiquer avec l'API.

```typescript
// features/users/users.service.ts
"use server";

import { api, processApiData } from "@/config/axios";
import { APIResponse } from "@/config/types";

const endpoint = "/users";

export async function getUsers(): Promise<APIResponse> {
  const handle = api.get(endpoint);
  return processApiData(handle);
}

export async function getUserById(id: string): Promise<APIResponse> {
  const handle = api.get(`${endpoint}/${id}`);
  return processApiData(handle);
}

export async function createUser(data: CreateUserDTO): Promise<APIResponse> {
  const handle = api.post(endpoint, data);
  return processApiData(handle);
}

export async function updateUser(id: string, data: UpdateUserDTO): Promise<APIResponse> {
  const handle = api.patch(`${endpoint}/${id}`, data);
  return processApiData(handle);
}

export async function deleteUser(id: string): Promise<APIResponse> {
  const handle = api.delete(`${endpoint}/${id}`);
  return processApiData(handle);
}
```

**Règles :**
- Toujours utiliser `"use server"` en haut du fichier
- Toujours retourner `Promise<APIResponse>`
- Utiliser `processApiData` pour la gestion d'erreurs
- Définir l'endpoint en constante

---

### 2. Hook (`use-*.ts`)

Le hook encapsule la **logique côté client** : état, chargement, erreurs.

```typescript
// features/users/use-users.ts
"use client";

import { useEffect, useState } from "react";
import { User } from "@/models/user.model";
import { getUsers } from "./users.service";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchUsers() {
    setIsLoading(true);
    setError(null);
    try {
      const { success, data, message } = await getUsers();
      if (success && data) {
        setUsers(data as User[]);
      } else {
        setError(message || "Une erreur s'est produite");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return { 
    users, 
    isLoading, 
    error, 
    refetch: fetchUsers 
  };
}
```

**Règles :**
- Toujours utiliser `"use client"` en haut du fichier
- Retourner un objet avec : données, isLoading, error, refetch
- Gérer tous les états (loading, error, success)

---

### 3. Guard (`*.guard.ts`)

Le guard vérifie les **permissions et accès**.

```typescript
// features/auth/auth.guard.ts
import { redirect } from "next/navigation";
import { verifySession } from "@/config/session";

export async function requireAuth() {
  const session = await verifySession();
  
  if (!session) {
    redirect("/login");
  }
  
  return session;
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireAuth();
  
  if (!allowedRoles.includes(session.data?.role)) {
    redirect("/unauthorized");
  }
  
  return session;
}
```

**Utilisation dans une page :**
```typescript
// app/dashboard/page.tsx
import { requireAuth } from "@/features/auth/auth.guard";

export default async function DashboardPage() {
  const session = await requireAuth();
  
  return <div>Bienvenue {session.data?.name}</div>;
}
```

---

### 4. Components (`components/`)

Composants React **spécifiques à la feature**.

```typescript
// features/users/components/user-card.tsx
"use client";

import { User } from "@/models/user.model";

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (id: string) => void;
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
      <span className="text-sm text-gray-500">{user.status}</span>
      
      <div className="mt-4 flex gap-2">
        {onEdit && (
          <button onClick={() => onEdit(user)}>Modifier</button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(user.id)}>Supprimer</button>
        )}
      </div>
    </div>
  );
}
```

**Règles :**
- Un composant = un fichier
- Nommage en kebab-case
- Props typées avec interface
- Export nommé (pas default)

---

### 5. Types (`*.types.ts` ou `*.interface.ts`) - Optionnel

Types et interfaces spécifiques à la feature (DTOs, états locaux, payloads).

> Les deux extensions sont valides : utiliser `*.interface.ts` pour des interfaces pures (ex: payloads d'API), `*.types.ts` pour un mix de types et interfaces.

```typescript
// features/users/users.types.ts

export interface CreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  status?: string;
}

export interface UsersFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}
```

> **Note :** Les types d'entités (User, Product...) vont dans `src/models/`, pas ici.

---

## Exemple Complet : Feature "Products"

```
src/features/products/
├── components/
│   ├── product-card.tsx
│   ├── product-form.tsx
│   ├── product-list.tsx
│   └── readme.md
├── products.service.ts
├── use-products.ts
├── use-product.ts          # Hook pour un seul produit
├── products.types.ts
└── readme.md
```

---

## Quand Créer une Feature ?

✅ **Créer une feature si :**
- La fonctionnalité a plusieurs composants liés
- Il y a des appels API spécifiques
- La logique est réutilisable

❌ **Ne PAS créer une feature si :**
- C'est juste un composant UI générique → `components/ui/`
- C'est un utilitaire sans état → `lib/`
- C'est un hook générique → `hooks/`

---

## Checklist Nouvelle Feature

- [ ] Créer le dossier `src/features/{feature-name}/`
- [ ] Créer `{feature}.service.ts` avec les actions serveur
- [ ] Créer `use-{feature}.ts` avec le hook client
- [ ] Créer `components/` pour les composants spécifiques
- [ ] Créer `{feature}.types.ts` si nécessaire
- [ ] Ajouter les types d'entités dans `src/models/`
- [ ] Documenter dans `readme.md`
