# Next.js Boilerplate

Un boilerplate Next.js **robuste**, **scalable** et **maintenable** pour démarrer rapidement vos projets.

## ✨ Features

- ⚡ **Next.js 16** avec App Router
- ⚛️ **React 19** avec les derniers hooks (useOptimistic, useActionState)
- 📘 **TypeScript** en mode strict
- 🎨 **Tailwind CSS 4** pour le styling
- 🧩 **shadcn/ui** (style new-york) pour les composants UI
- 🔐 **Authentification JWT** avec sessions sécurisées
- ✅ **Zod** pour la validation des données
- 📡 **Axios** configuré avec intercepteurs
- 📁 **Architecture Feature-Based** pour la scalabilité
- 🔒 **Variables d'environnement** validées au démarrage

---

## 🚀 Getting Started

### Prérequis

- Node.js 18+
- pnpm (recommandé)

### Installation

```bash
# Cloner le repository
git clone <repo-url> mon-projet
cd mon-projet

# Installer les dépendances
pnpm install

# Copier les variables d'environnement
cp .env.example .env.local

# Générer une clé de session
pnpm generate-keys
# Copier la clé générée dans SESSION_SECRET de .env.local
```

### Configuration

Créer un fichier `.env.local` avec les variables suivantes :

```env
# Server (sensibles - ne jamais exposer côté client)
SESSION_SECRET=votre_clé_secrète_de_32_caractères_minimum

# Client (publiques - préfixe NEXT_PUBLIC_)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=MonApp
```

### Lancer le projet

```bash
# Développement
pnpm dev

# Build production
pnpm build

# Démarrer en production
pnpm start
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 📁 Structure du Projet

```
src/
├── app/                 # Routes et pages (App Router)
├── components/          # Composants React réutilisables
│   ├── ui/              # Composants shadcn/ui
│   └── layouts/         # Layouts réutilisables
├── config/              # Configuration (env, axios, session)
├── features/            # Modules fonctionnels (feature-based) ⭐
├── hooks/               # Hooks React globaux
├── lib/                 # Utilitaires et helpers
├── models/              # Types des entités métier
├── providers/           # Context providers React
├── services/            # Services globaux
└── stores/              # État global (Zustand)
```

### Architecture Feature-Based

Chaque fonctionnalité est encapsulée dans son propre dossier :

```
features/
└── users/
    ├── components/          # Composants spécifiques
    ├── users.service.ts     # Server Actions (API)
    └── use-users.ts         # Hook React
```

---

## 📚 Documentation

La documentation complète se trouve dans le dossier `rules/` :

| Fichier | Description |
|---------|-------------|
| `rules/README.md` | Index et navigation |
| `rules/architecture.md` | Architecture détaillée |
| `rules/disclaimer.md` | Règles et conventions |
| `rules/patterns/*.md` | Guides par type de code |

### Guides Rapides

- **Créer une page** → `rules/patterns/pages.md`
- **Créer une feature** → `rules/patterns/features.md`
- **Créer un hook** → `rules/patterns/hooks.md`
- **Créer un service** → `rules/patterns/services.md`

---

## ⚡ Scripts Disponibles

| Script | Description |
|--------|-------------|
| `pnpm dev` | Lance le serveur de développement |
| `pnpm build` | Build de production |
| `pnpm start` | Démarre le serveur de production |
| `pnpm lint` | Vérifie le code avec ESLint |
| `pnpm type-check` | Vérifie les types TypeScript |
| `pnpm generate-keys` | Génère une clé secrète pour les sessions |

---

## 🏗️ Stack Technique

| Technologie | Version | Rôle |
|-------------|---------|------|
| Next.js | 16.x | Framework React |
| React | 19.x | Bibliothèque UI |
| TypeScript | 5.x | Typage statique |
| Tailwind CSS | 4.x | Styling |
| shadcn/ui | latest | Composants UI |
| Axios | 1.x | Client HTTP |
| Zod | 4.x | Validation |
| jose | 6.x | JWT |

---

## 📝 Conventions

### Pages

- ✅ Toujours des **Server Components**
- ✅ Utiliser `createLoader` pour charger les données
- ❌ Pas de `"use client"` sur les pages

### Features

- Un dossier par fonctionnalité dans `src/features/`
- Service avec `"use server"` pour les appels API
- Hook avec `"use client"` pour la logique client

### Nommage

| Type | Convention | Exemple |
|------|------------|---------|
| Fichier composant | kebab-case | `user-card.tsx` |
| Fichier hook | use-*.ts | `use-users.ts` |
| Fichier service | *.service.ts | `users.service.ts` |
| Fichier model | *.model.ts | `user.model.ts` |

---

## 🤝 Contribution

1. Lire `rules/disclaimer.md` avant de contribuer
2. Suivre l'architecture définie dans `rules/architecture.md`
3. Respecter les patterns dans `rules/patterns/`

---

## 📄 License

MIT