# REPORT_AUDIT — SMOVE

## Résumé exécutif
L'audit a porté sur l'application Next.js (App Router), les routes API, la logique d'authentification, Prisma/MongoDB et le CMS admin. Les points bloquants identifiés concernent la fiabilité des accès DB lors des flux d'auth, la génération/validation des slugs dans les CRUD CMS, l'absence d'un `.env.example` et un seed incomplet (catégories + admin bootstrap). Les correctifs P0 appliqués renforcent la stabilité et fournissent une base de démarrage fiable pour le CMS.

## Bugs trouvés & statut des correctifs

### P0 — Bloquants
1) **Auth login/activation non résilients aux erreurs DB**
- **Cause racine** : les routes `POST /api/auth/login` et `POST /api/auth/activate` appelaient Prisma directement sans gestion de timeouts/retry.
- **Correctif appliqué** : usage de `safePrisma` + retry/backoff, gestion propre des erreurs 503 avec messages clairs.

2) **Slug CMS : collisions non traitées proprement (services/projets/événements)**
- **Cause racine** : les routes CRUD reposaient sur l'erreur `P2002` sans pré-validation ni suggestion de slug disponible.
- **Correctif appliqué** : pré-validation des slugs + suggestion automatique via `findAvailableSlug` (suffixes `-2`, `-3`, etc.).

3) **Seed insuffisant (catégories + admin bootstrap)**
- **Cause racine** : le seed ne créait que `SiteSettings`.
- **Correctif appliqué** : ajout des catégories par défaut (post/service/project/event) et création optionnelle d'un admin bootstrap via `.env`.

4) **Absence de `.env.example` pour l’onboarding**
- **Cause racine** : pas de template pour éviter les erreurs de configuration (DATABASE_URL, JWT, bootstrap).
- **Correctif appliqué** : création de `.env.example` et mise à jour README.

### P1 — Importants
1) **Catégories/secteurs non branchés partout**
- **Cause racine** : certains formulaires CMS utilisent encore des champs libres (services/projets/événements).
- **Statut** : à intégrer via taxonomies et dropdowns connectés aux endpoints.

2) **Données média non industrialisées**
- **Cause racine** : gestion média seulement par URL.
- **Statut** : planifié (Media Library + stockage local + variants via `sharp`).

### P2 — Améliorations
1) **Optimisations de performance**
- **Cause racine** : absence de pagination côté front sur certaines listes, revalidation et cache faibles.
- **Statut** : planifié (revalidate, pagination, skeletons/EB).

2) **CMS enrichi (contenu modulaire)**
- **Cause racine** : modèle d'article trop simple pour production.
- **Statut** : planifié (sections, blocs média, gallery/cover obligatoires).

## Risques sécurité & mitigations
- **Risque** : fuite de secrets en repo.
  - **Mitigation** : `.env.example` uniquement, rappel README, pas de secrets committés.
- **Risque** : bootstrap admin actif en production.
  - **Mitigation** : `ADMIN_BOOTSTRAP_ALLOW_PROD=false` par défaut + check en seed/login.
- **Risque** : auth DB instable (timeouts).
  - **Mitigation** : `safePrisma` avec timeout/retry + erreurs 503 maîtrisées.

## Roadmap PRO (3 itérations)

### Itération 1 — Stabilité & cohérence CMS (1-2 semaines)
- **Objectifs** : stabiliser admin, centraliser les taxonomies, fiabiliser la validation des formulaires.
- **Tâches** :
  - Brancher services/projets/événements sur `Category`/`Taxonomy` (dropdowns + fetch).
  - Centraliser la logique slug côté client (vérification + suggestion) pour tous les modèles.
  - Ajouter des error boundaries UI dédiées pour pages admin lourdes.
- **Critères d'acceptation** : CRUD complet sans 500, slugs uniques, formulaires robustes.

### Itération 2 — Media Library & contenus enrichis (1-2 semaines)
- **Objectifs** : uploader médias, générer variants, enrichir les articles.
- **Tâches** :
  - Page “Media Library” dans le CMS.
  - Upload local + `sharp` pour variants (thumb/small/medium/large) + metadata.
  - Support des sections de contenu (paragraphes + media blocks).
- **Critères d'acceptation** : média réutilisable, articles riches, pas de dépendance externe.

### Itération 3 — Performance & production (1-2 semaines)
- **Objectifs** : temps de chargement maîtrisés, caching et pagination.
- **Tâches** :
  - Pagination côté public + caching `revalidate`.
  - Skeleton loaders et fallback UI si DB down.
  - Tests e2e des flux admin essentiels.
- **Critères d'acceptation** : pages rapides, UX stable, monitoring minimal.

## Endpoints clés (site + CMS)
### Auth
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/activate`

### Admin CMS
- `GET /api/admin/categories?type=post|service|project|event`
- `POST /api/admin/categories` / `PATCH /api/admin/categories/:id` / `DELETE /api/admin/categories/:id`
- `GET /api/admin/posts` / `POST /api/admin/posts`
- `GET /api/admin/posts/:id` / `PUT /api/admin/posts/:id` / `DELETE /api/admin/posts/:id`
- `GET /api/admin/services` / `POST /api/admin/services`
- `PUT /api/admin/services/:id` / `DELETE /api/admin/services/:id`
- `GET /api/admin/projects` / `POST /api/admin/projects`
- `GET /api/admin/projects/:id` / `PUT /api/admin/projects/:id` / `DELETE /api/admin/projects/:id`
- `GET /api/admin/events` / `POST /api/admin/events`
- `PUT /api/admin/events/:id` / `DELETE /api/admin/events/:id`
- `GET /api/admin/slug?model=<post|project|service|event>&slug=...&excludeId=...`
- `GET /api/admin/users` / `POST /api/admin/users` / `PATCH /api/admin/users/:id` / `DELETE /api/admin/users/:id`
- `GET /api/admin/settings` / `PUT /api/admin/settings`
- `GET /api/admin/taxonomies` / `POST /api/admin/taxonomies` / `PUT /api/admin/taxonomies/:id` / `DELETE /api/admin/taxonomies/:id`

## Modèles Prisma (schéma final)
- **User** : `email`, `passwordHash`, `role`, `status`, `inviteTokenHash`, `inviteExpiresAt`, timestamps.
- **Post** : `slug`, `title`, `excerpt`, `body`, `tags`, `coverImage`, `gallery`, `videoUrl`, `categoryId`, `status`, `publishedAt`, timestamps.
- **Service** : `slug`, `name`, `description`, `category`, `categorySlug`, `sectorSlug`, `image`, timestamps.
- **Project** : `slug`, `client`, `title`, `sector`, `sectorSlug`, `categorySlug`, `summary`, `body`, `results`, `category`, `coverImage`, timestamps.
- **Event** : `slug`, `title`, `date`, `location`, `description`, `category`, `coverImage`, timestamps.
- **Category** : `type`, `name`, `slug`, `order`, timestamps.
- **Taxonomy** : `type`, `slug`, `label`, `order`, `active`, timestamps.
- **SiteSettings** : singleton (`key`) + branding, seo, contact, homepage.

## Notes d'audit complémentaires
- `safePrisma` centralise la gestion des erreurs MongoDB (auth/IP/TLS/timeouts).
- La configuration DB vérifie la présence de `/smove` dans l'URI.
- Les pages publiques affichent un fallback UI en cas de DB indisponible.
