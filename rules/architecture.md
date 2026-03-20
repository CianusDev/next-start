# Architecture du Projet

Ce document décrit l'architecture technique du boilerplate Next.js, conçue pour être **robuste**, **scalable** et **maintenable**.

---

## ⚠️ Règles Fondamentales

### 1. Pages = Server Components

**Toutes les pages doivent être des Server Components** (pas de `"use client"`).

Exceptions uniquement pour les fichiers spéciaux :
- `error.tsx` - Client Component (requis par Next.js)
- `loading.tsx` - Client Component si nécessaire
- `not-found.tsx` - Client Component si nécessaire

### 2. createLoader pour le SSR

**Obligatoire** : Utiliser `createLoader` pour toute page qui charge des données.

```typescript
import { createLoader } from "@/lib/loader";

const loadData = createLoader("/users/[id]", async ({ params }) => {
  return await fetchUser(params.id);
});

export default async function Page(props: typeof loadData.Props) {
  const data = await loadData(props);
  return <div>{/* ... */}</div>;
}
```

---

## Vue d'ensemble

```
src/
├── app/                 # Routes et pages (App Router)
├── components/          # Composants React réutilisables
├── config/              # Configuration de l'application
├── features/            # Modules fonctionnels (feature-based)
├── hooks/               # Hooks React personnalisés globaux
├── lib/                 # Utilitaires et helpers partagés
├── models/              # Types et interfaces des entités
├── providers/           # Context providers React
├── services/            # Services globaux
└── stores/              # État global (stores)
```

---

## Stack Technique

| Technologie | Version | Rôle |
|-------------|---------|------|
| **Next.js** | 16.x | Framework React avec App Router |
| **React** | 19.x | Bibliothèque UI |
| **TypeScript** | 5.x | Typage statique strict |
| **Tailwind CSS** | 4.x | Styling utility-first |
| **shadcn/ui** | latest | Composants UI (radix-ui, style new-york) |
| **Axios** | 1.x | Client HTTP |
| **Zod** | 4.x | Validation de schémas |
| **react-hook-form** | 7.x | Gestion des formulaires |
| **@hookform/resolvers** | 5.x | Intégration Zod + react-hook-form |
| **jose** | 6.x | Gestion des JWT |
| **sonner** | 2.x | Notifications toast |
| **lucide-react** | latest | Icônes |

---

## Description des Dossiers

### `src/app/` - Routes et Pages

> **Rôle** : Contient toutes les routes de l'application via l'App Router de Next.js.

```
app/
├── (home)/              # Route group (ne crée pas de segment URL)
│   ├── page.tsx         # Page d'accueil /
│   └── post/            # Route /post
├── layout.tsx           # Layout racine (obligatoire)
├── globals.css          # Styles globaux Tailwind
├── error.tsx            # Page d'erreur globale (Client Component)
├── not-found.tsx        # Page 404 (Client Component)
├── loading.tsx          # UI de chargement globale
├── robots.ts            # Configuration robots.txt
└── sitemap.ts           # Génération du sitemap
```

**Règles :**
- ✅ Pages = Server Components (async function)
- ✅ Utiliser `createLoader` pour charger les données
- ✅ Route Groups `(nom)` pour organiser sans affecter l'URL
- ❌ Pas de `"use client"` sur les pages (sauf error/loading/not-found)

---

### `src/components/` - Composants Réutilisables

> **Rôle** : Composants React partagés entre plusieurs features ou pages.

```
components/
├── ui/                  # Composants shadcn/ui (générés)
│   ├── button.tsx
│   ├── input.tsx
│   └── ...
├── forms/               # Composants de formulaire réutilisables
│   ├── form.tsx         # Wrapper <form> stylisé
│   ├── form-wrapper.tsx # Conteneur avec titre/description
│   ├── form-input.tsx   # Input avec label, erreur, toggle password
│   └── field.tsx        # Field et FieldError primitives
└── layouts/             # Layouts réutilisables
    └── layout-page.tsx  # Layout de page standard
```

**Règles :**
- `ui/` : Réservé aux composants générés par **shadcn/ui** - ne pas modifier manuellement
- `forms/` : Composants de formulaire génériques, utilisés avec `react-hook-form`
- `layouts/` : Layouts réutilisables (wrappers de pages, structures communes)
- Les composants **métier spécifiques** vont dans `features/{feature}/components/`

**Quand utiliser ce dossier :**
- Composant utilisé par **plusieurs features**
- Composant UI générique sans logique métier

---

### `src/config/` - Configuration

> **Rôle** : Configuration centralisée de l'application (env, API, session).

```
config/
├── env.ts               # Variables d'environnement (validées avec Zod)
├── axios.ts             # Instance Axios configurée
├── session.ts           # Gestion des sessions JWT (server-only)
└── types.ts             # Types de configuration partagés
```

**Fichiers détaillés :**

| Fichier | Description |
|---------|-------------|
| `env.ts` | Valide les variables d'environnement au démarrage. Sépare `serverEnv` (sensibles) et `clientEnv` (publiques `NEXT_PUBLIC_*`). |
| `axios.ts` | Instance Axios avec intercepteurs (auth token, gestion erreurs 401). Exporte `api` et `processApiData`. |
| `session.ts` | Fonctions `encrypt`, `decrypt`, `createSession`, `updateSession`, `deleteSession`, `verifySession`. Server-only. |
| `types.ts` | Types partagés : `SessionPayload`, `APIResponse`. |

**⚠️ Attention :** Ne pas modifier ces fichiers sans validation explicite.

---

### `src/features/` - Architecture Feature-Based

> **Rôle** : Cœur de l'architecture. Chaque feature est un module **autonome et encapsulé**.

```
features/
├── auth/
│   ├── components/
│   │   └── login-form.tsx    # Composants spécifiques à auth
│   ├── auth.service.ts       # Server Actions (appels API)
│   └── auth.guard.ts         # Protection des routes
│
└── users/
    ├── components/
    │   └── user-card.tsx     # Composants spécifiques à users
    ├── users.service.ts      # Server Actions
    └── use-users.ts          # Hook React client
```

**Structure d'une feature :**

| Fichier | Rôle | Directive |
|---------|------|-----------|
| `*.service.ts` | Appels API via Server Actions | `"use server"` |
| `use-*.ts` | Hook React (état client, mutations) | `"use client"` |
| `*.guard.ts` | Vérification d'accès, redirections | Server-only |
| `components/` | Composants UI spécifiques | Selon besoin |
| `*.types.ts` | Types/DTOs spécifiques (optionnel) | - |
| `*.interface.ts` | Interfaces TypeScript (optionnel, alt à types.ts) | - |
| `*.schema.ts` | Schémas Zod de validation (optionnel) | - |

**Voir :** `rules/patterns/features.md` pour le guide complet.

---

### `src/hooks/` - Hooks Globaux

> **Rôle** : Hooks React réutilisables dans toute l'application.

```
hooks/
├── use-debounce.ts      # Debounce de valeurs
├── use-media-query.ts   # Détection responsive
├── use-local-storage.ts # Persistance locale
└── use-toggle.ts        # État boolean toggle
```

**Règles :**
- Tous les hooks commencent par `use-`
- Directive `"use client"` obligatoire
- Hooks **spécifiques à une feature** → `features/{feature}/use-*.ts`

**Voir :** `rules/patterns/hooks.md` pour le guide complet.

---

### `src/lib/` - Utilitaires Partagés

> **Rôle** : Fonctions utilitaires, helpers et constantes globales.

```
lib/
├── utils.ts             # Utilitaires généraux
├── constants.ts         # Constantes globales
├── loader.ts            # createLoader pour SSR typé
└── logger.ts            # Système de logging
```

**Fichiers détaillés :**

| Fichier | Description |
|---------|-------------|
| `utils.ts` | Fonction `cn()` pour fusionner les classes Tailwind (clsx + tailwind-merge). |
| `constants.ts` | Constantes : `TOKEN_VALIDITY_PERIOD`, etc. |
| `loader.ts` | Helper `createLoader()` pour le data fetching SSR avec typage automatique des params. **Obligatoire pour les pages SSR.** |
| `logger.ts` | Logger structuré avec niveaux (debug, info, warn, error). Couleurs en dev, JSON en prod. |

---

### `src/models/` - Types et Entités

> **Rôle** : Types TypeScript représentant les entités métier.

```
models/
├── user.model.ts        # Type User, enum Status
├── product.model.ts     # Type Product
└── order.model.ts       # Type Order
```

**Convention de nommage :** `{entity}.model.ts`

**Exemple :**
```typescript
// models/user.model.ts
export enum Status {
  BUSY = "BUSY",
  AVAILABLE = "AVAILABLE",
}

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  status: Status;
};
```

**Note :** Les DTOs (Data Transfer Objects) spécifiques à une feature vont dans `features/{feature}/*.types.ts`.

---

### `src/providers/` - Context Providers

> **Rôle** : Providers React pour l'injection de contexte global.

```
providers/
├── theme-provider.ts    # Provider de thème (dark/light)
├── auth-provider.ts     # Provider d'authentification
└── query-provider.ts    # Provider React Query (si utilisé)
```

**Utilisation :** Les providers sont wrappés dans `app/layout.tsx`.

```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

### `src/services/` - Services Globaux

> **Rôle** : Services partagés entre plusieurs features.

```
services/
└── session.service.ts   # Service de gestion de session
```

**Différence avec `features/*.service.ts` :**
- `services/` : Services **transversaux** (session, notifications, analytics)
- `features/*.service.ts` : Services **spécifiques** à une feature

**Exemple :**
```typescript
// services/session.service.ts
"use server";

export async function getToken() {
  const session = await verifySession();
  return { token: session?.token };
}
```

---

### `src/stores/` - État Global

> **Rôle** : Stores pour la gestion d'état global côté client.

```
stores/
├── user.store.ts        # Store utilisateur connecté
└── ui.store.ts          # Store UI (sidebar, modals)
```

**Recommandation :** Utiliser **Zustand** pour la simplicité et les performances.

```typescript
// stores/user.store.ts
import { create } from "zustand";

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
```

---

## Flux de Données

```
┌──────────────────────────────────────────────────────────────┐
│                         CLIENT                                │
├──────────────────────────────────────────────────────────────┤
│  Page (Server Component)                                      │
│    │                                                          │
│    ├──▶ createLoader() ──▶ Service ("use server")            │
│    │                            │                             │
│    │                            ▼                             │
│    │                      API Backend                         │
│    │                            │                             │
│    │                            ▼                             │
│    │                      processApiData()                    │
│    │                            │                             │
│    ◀────────────────────────────┘                             │
│    │                                                          │
│    ▼                                                          │
│  Composants (Client Components)                               │
│    │                                                          │
│    ├──▶ Hooks (use-*.ts) ──▶ Services                        │
│    └──▶ Stores (Zustand)                                      │
└──────────────────────────────────────────────────────────────┘
```

---

## Configuration TypeScript

Les alias de chemin sont configurés dans `tsconfig.json` :

| Alias | Chemin | Usage |
|-------|--------|-------|
| `@/*` | `./src/*` | Import général |
| `@/components/*` | `./src/components/*` | Composants |
| `@/features/*` | `./src/features/*` | Features |
| `@/routes` | `./.next/types/routes` | Types de routes (createLoader) |

---

## Récapitulatif : Où Mettre Quoi ?

| Je veux créer... | Emplacement |
|------------------|-------------|
| Une nouvelle page | `src/app/{route}/page.tsx` |
| Un composant UI générique | `src/components/ui/` (shadcn) |
| Un composant layout | `src/components/layouts/` |
| Un composant métier | `src/features/{feature}/components/` |
| Un hook global | `src/hooks/use-*.ts` |
| Un hook de feature | `src/features/{feature}/use-*.ts` |
| Un service de feature | `src/features/{feature}/*.service.ts` |
| Un service global | `src/services/*.service.ts` |
| Un type d'entité | `src/models/*.model.ts` |
| Un provider React | `src/providers/*.tsx` |
| Un store global | `src/stores/*.store.ts` |
| Une constante | `src/lib/constants.ts` |
| Un utilitaire | `src/lib/utils.ts` |

---

## Bonnes Pratiques

1. **Server-first** : Les pages sont toujours des Server Components
2. **createLoader obligatoire** : Pour tout chargement de données SSR
3. **Feature encapsulation** : Chaque feature est autonome
4. **Types explicites** : Toujours typer les retours de fonction
5. **Validation Zod** : Valider toutes les entrées (env, formulaires, API)
6. **Séparation des responsabilités** : Un fichier = une responsabilité