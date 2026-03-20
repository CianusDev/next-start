# 📚 Rules - Guide pour les Agents IA

Ce dossier contient la documentation et les règles du projet **Next.js Boilerplate**. Il sert de référence principale pour tout agent IA travaillant sur ce projet.

---

## 🚀 Quick Start

1. **Commencer ici** → Lis ce fichier en entier
2. **Comprendre l'architecture** → `architecture.md`
3. **Respecter les règles** → `disclaimer.md`
4. **Suivre les patterns** → `patterns/*.md`
5. **Consulter les tâches** → `tasks/*.md`

---

## 📁 Structure du Dossier

```
rules/
├── README.md              # 👈 Tu es ici - Index et sommaire
├── architecture.md        # Architecture technique du projet
├── disclaimer.md          # Règles et avertissements importants
├── prd.md                 # Product Requirements Document (si disponible)
│
├── patterns/              # Patterns de code à suivre
│   ├── features.md        # Architecture feature-based
│   ├── forms.md           # Gestion des formulaires
│   ├── hooks.md           # Création de hooks React
│   ├── pages.md           # Structure des pages Next.js
│   └── services.md        # Services et Server Actions
│
└── tasks/                 # Tâches et spécifications
    └── 00-example.md      # Template de tâche
```

---

## 📖 Description des Fichiers

### Fichiers Racine

| Fichier | Description | Quand le lire |
|---------|-------------|---------------|
| `README.md` | Index et sommaire du dossier rules | En premier |
| `architecture.md` | Vue d'ensemble de l'architecture technique, stack, structure des dossiers | Avant de modifier le code |
| `disclaimer.md` | Règles obligatoires, conventions, avertissements | Avant toute modification |
| `prd.md` | Spécifications produit et requirements | Pour comprendre le contexte métier |

### Dossier `patterns/`

Guides détaillés pour implémenter chaque type de code.

| Fichier | Description | Quand le lire |
|---------|-------------|---------------|
| `features.md` | Comment créer une feature complète (service, hook, composants) | Nouvelle fonctionnalité |
| `forms.md` | Gestion des formulaires avec Zod et Server Actions | Créer un formulaire |
| `hooks.md` | Création de hooks React (data fetching, mutations, utilitaires) | Créer un hook |
| `pages.md` | Structure des pages Next.js (App Router, metadata, layouts) | Créer une page |
| `services.md` | Services et Server Actions pour les appels API | Créer un service |

### Dossier `tasks/`

Spécifications des tâches à réaliser.

| Fichier | Description |
|---------|-------------|
| `00-example.md` | Template de référence pour créer de nouvelles tâches |
| `XX-*.md` | Tâches spécifiques (numérotées) |

---

## 🏗️ Architecture en Bref

```
src/
├── app/           # Pages et routes (App Router)
├── components/    # Composants UI réutilisables
├── config/        # Configuration (env, axios, session)
├── features/      # Modules fonctionnels autonomes ⭐
├── hooks/         # Hooks React globaux
├── lib/           # Utilitaires partagés
├── models/        # Types des entités
├── providers/     # Context providers
├── services/      # Services globaux
└── stores/        # État global
```

**Point clé** : Ce projet utilise une **architecture feature-based**. Chaque fonctionnalité est encapsulée dans `src/features/{feature-name}/`.

---

## 🛠️ Stack Technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| Next.js | 16.x | Framework React |
| React | 19.x | UI Library |
| TypeScript | 5.x | Typage strict |
| Tailwind CSS | 4.x | Styling |
| shadcn/ui | latest | Composants UI (radix-ui) |
| Zod | 4.x | Validation |
| react-hook-form | 7.x | Formulaires |
| Axios | 1.x | HTTP Client |
| jose | 6.x | JWT |
| sonner | 2.x | Toasts |
| lucide-react | latest | Icônes |

---

## ⚡ Commandes Essentielles

```bash
pnpm dev          # Démarrer en développement
pnpm build        # Build production
pnpm lint         # Vérifier le linting
pnpm type-check   # Vérifier les types TypeScript
```

---

## 📋 Checklist Agent IA

Avant de modifier le code, vérifie que tu as :

- [ ] Lu `disclaimer.md` pour les règles obligatoires
- [ ] Compris l'architecture dans `architecture.md`
- [ ] Identifié le bon pattern dans `patterns/`
- [ ] Vérifié si une tâche existe dans `tasks/`

---

## 🔍 Navigation Rapide

### Je veux créer...

| Objectif | Lire |
|----------|------|
| Une nouvelle feature | `patterns/features.md` |
| Une nouvelle page | `patterns/pages.md` |
| Un formulaire | `patterns/forms.md` |
| Un hook | `patterns/hooks.md` |
| Un service/API call | `patterns/services.md` |

### Je cherche...

| Information | Où trouver |
|-------------|------------|
| La structure des dossiers | `architecture.md` |
| Les conventions de nommage | `disclaimer.md` |
| Les variables d'environnement | `architecture.md` → section Config |
| La gestion des sessions | `architecture.md` → section Config |

---

## ⚠️ Points d'Attention

1. **Ne jamais modifier** les fichiers de config sensibles sans demande explicite
2. **Toujours utiliser** `"use server"` pour les services
3. **Toujours valider** les données avec Zod
4. **Respecter** l'architecture feature-based
5. **Typer** toutes les fonctions et composants

---

## 📝 Mise à jour de la Documentation

Si tu modifies l'architecture ou ajoutes de nouveaux patterns :

1. Mettre à jour le fichier concerné dans `rules/`
2. Mettre à jour ce README si nécessaire
3. Ajouter des exemples de code si pertinent

---

*Dernière mise à jour : Mars 2026*