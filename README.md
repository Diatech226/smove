# SMOVE

SMOVE – site vitrine premium avec hero animé (2 écrans + vidéo) et back-office CMS pour une agence de communication digitale.

## Stack technique
- Next.js (App Router) & TypeScript
- Tailwind CSS
- Framer Motion
- Prisma & MongoDB

## Structure des dossiers
- `/app` : pages publiques et admin (App Router, API routes incluses)
- `/components` : composants UI, layout, sections et 3D
- `/lib` : utilitaires (Prisma, hooks, configuration)
- `/prisma` : schéma Prisma

## État actuel (production-ready)
### ✅ Ce qui fonctionne
- Site public (home, services, projets, blog) avec fallback UI si la DB est indisponible.
- CMS admin complet (posts, services, projets, événements, catégories, taxonomies, users, settings, media).
- Auth admin (login, activation, session) protégée par middleware.
- Media Library avec upload local (dev) ou S3/R2 (prod), génération de variants.
- Slugs contrôlés côté API + suggestion automatique en cas de conflit.
- Dashboard admin avec compteurs fiables et chargement optimisé.

### ⚠️ Ce qui reste à prévoir
- Tests E2E et CI/CD (non configurés).
- Monitoring/alerting (Sentry/Logtail/Datadog).
- Rôles avancés (éditeur/relecteur) + workflow éditorial multi-étapes.

## Checklist production
- ✅ Variables d’environnement à jour (`.env.example`).
- ✅ Build Next.js (`npm run build`).
- ✅ Base MongoDB accessible (Atlas, IP whitelist, auth).
- ✅ Seed initial (`npm run db:seed`) + admin bootstrap si nécessaire.
- ✅ Média : config `MEDIA_STORAGE` + bucket S3/R2 pour la prod.
- ✅ DNS / domaine (mettre à jour `NEXT_PUBLIC_SITE_URL`).
- ✅ Vérifier `APP_URL` pour l’activation d’invitations.
- ✅ Déploiement (Vercel/Fly.io) avec volumes ou S3.
- ✅ Vérifier les politiques CORS / CSP si besoin.

## Bugs corrigés (audit)
- Dashboard admin : comptages incohérents corrigés (lecture `json.data`).
- Status rapides pour services/projets/événements (PATCH sécurisé + UI).
- Dropdowns alimentés par taxonomies/catégories (services/projets/événements).
- Filtrage public sur les contenus publiés (draft/archived exclus).
- Limites d’upload média (taille + volume) + validations renforcées.

## UI refonte
- Layout global : header sticky, footer enrichi, design system bleu/blanc + accents.
- Sections publiques : hero animé en 2 écrans, services, portfolio, blog, testimonials, CTA.
- Composants clés : `components/sections/*`, `components/layout/*`, `components/ui/*` (notamment `MediaCover` pour les covers).
- Animations : transitions `easeOut` ~800ms, reveal au scroll, micro-interactions hover.

### Vidéo hero & SEO
- `NEXT_PUBLIC_HERO_VIDEO_URL` : URL MP4 pour l'écran 2 (fullscreen background).
- `NEXT_PUBLIC_HERO_VIDEO_POSTER` : poster de la vidéo (fallback `public/hero-poster.svg`).
- `NEXT_PUBLIC_HERO_DELAY_MS` : délai avant transition auto entre les écrans (800 → 4000ms).
- `NEXT_PUBLIC_SITE_URL` : fallback pour `metadataBase` (SEO/OG).

## Variables d'environnement (`.env` / `.env.local`)
Next.js charge automatiquement `.env` puis surcharge avec `.env.local` à la racine du projet.
Copiez `.env.example` puis ajustez les valeurs **localement** :

```bash
cp .env.example .env.local
```

Ensuite, remplissez `JWT_SECRET`, `DATABASE_URL` et les variables liées au bootstrap admin selon votre environnement.

- **Toujours** inclure le nom de base de données `/smove` dans le chemin. Les erreurs `P2010` / "empty database name" viennent généralement d'une URL tronquée.
- **Pas de guillemets ni d'espaces** dans les valeurs (ex: pas de `"..."` autour de l'URI MongoDB).
- Le client Prisma est initialisé via `env("DATABASE_URL")` (voir `prisma/schema.prisma` et `lib/prisma.ts`).
- `DIRECT_DATABASE_URL` est également supporté par Prisma pour les migrations : dupliquez l'URL principale avec le suffixe `/smove` pour éviter les erreurs d'auth ou de base introuvable.
- Pour MongoDB, les identifiants utilisent `String @id @default(auto()) @map("_id") @db.ObjectId`.
- `NEXT_PUBLIC_SITE_URL` sert de fallback pour `metadataBase` (SEO/OG) si aucun paramètre n'est défini dans le CMS.
- `JWT_SECRET` signe les JWT stockés en cookie httpOnly pour l'accès admin.
- `APP_URL` sert à générer les liens d'activation d'invitation.
- `MEDIA_STORAGE` (`local` ou `s3`) détermine le stockage des fichiers média.
- `MEDIA_PUBLIC_BASE_URL` / `S3_PUBLIC_BASE_URL` servent à construire les URLs publiques.
- `MEDIA_MAX_BYTES` / `MEDIA_MAX_FILES` limitent la taille et le volume d'uploads.

## Setup Mongo Atlas
1. Créez un cluster MongoDB Atlas et une base nommée **smove** (ou assurez-vous que l'URL se termine par `/smove`).
2. Autorisez votre IP (ou `0.0.0.0/0` temporairement) dans Network Access.
3. Activez un utilisateur avec les droits de lecture/écriture sur la base smove.
4. Copiez l'URI fournie par Atlas dans `DATABASE_URL` (format `mongodb+srv://.../smove?...`).
5. Poussez le schéma et générez le client Prisma :
   ```bash
   npm run prisma:push
   npm run prisma:generate
   ```
6. Lancez le projet avec `npm run dev`.

### Dépannage connexion MongoDB
- **Server selection timeout / ReplicaSetNoPrimary / P2010** : vérifiez que l'IP est bien autorisée dans Atlas, que le cluster est démarré et que l'URI pointe sur la base `smove`.
- **Bad auth / authentification échouée** : confirmez l'utilisateur/mot de passe utilisés et les droits sur la base `smove`.
- **Caractères spéciaux dans le password** : encodez-les (`@` → `%40`, `:` → `%3A`, etc.) avant de les mettre dans l'URI.
- **Base manquante** : ajoutez impérativement `/smove` à la fin du chemin dans `DATABASE_URL`.
- **Chaîne d'URL** : utilisez l'URI `mongodb+srv://.../smove?retryWrites=true&w=majority&appName=Cluster0` fournie par Atlas (n'oubliez pas le nom de la base).
- **Whitelisting IP** : autorisez l'adresse IP de votre machine (ou `0.0.0.0/0` temporairement) dans l'onglet Network Access.
- **TLS/SSL errors / InternalError** : Node.js 20 peut déclencher des erreurs TLS avec certains clusters. Essayez Node.js **18 LTS** et assurez-vous d'utiliser l'URI sécurisée `mongodb+srv://`.
- **Validation rapide avec Compass** : connectez-vous à l'URI Atlas via MongoDB Compass pour confirmer l'accès réseau et les droits.
- **Après changement d'env** : redémarrez le serveur de dev (`npm run dev`) après toute modification `.env`.

### Vérifier la santé de la base
- Endpoint de santé API : `GET /api/health/db` effectue un `post.count` rapide (timeout 2.5s) et retourne `status: ok` ou `status: error`.
- Les pages publiques affichent un message de secours plutôt que de planter si la base est inaccessible.
- Diagnostic local : `npm run db:check` affiche la présence de `DATABASE_URL` (masquée) et tente un `prisma.$connect()` + requête simple.

### Commandes Prisma après modification du schéma
- Pousser le schéma vers la base : `npm run prisma:push`
- Générer le client : `npm run prisma:generate`

## Mise en route
1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Créer `.env` ou `.env.local` à partir du modèle :
   ```bash
   cp .env.example .env.local
   ```
3. Générer/mettre à jour la base MongoDB :
   ```bash
   npx prisma db push
   ```
4. Créer le singleton SiteSettings si nécessaire :
   ```bash
   npm run db:seed
   ```
   > Le seed initialise aussi les catégories par défaut et peut créer un admin bootstrap si activé dans `.env.local`.
5. Générer le client Prisma (automatique avec `next dev`, mais possible manuellement) :
   ```bash
   npx prisma generate
   ```
6. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```

## Accès à l'admin
- URL : `/admin/login`
- Connectez-vous avec un compte `User` actif (email + mot de passe).
- Après connexion, vous êtes redirigé vers `/admin/dashboard` et pouvez gérer services, projets et articles.
- La section **Users** permet de gérer les comptes (rôles admin/client, statuts active/disabled/pending) et d'envoyer des invitations.
- Les slugs sont vérifiés côté serveur via `GET /api/admin/slug?model=<post|project|service|event>&slug=...&excludeId=...` pour garantir l'unicité dès la saisie.
- Un squelette `app/admin/loading.tsx` évite les flashes blancs pendant les chargements du back-office.

### Bootstrap admin (local/dev)
Si vous devez démarrer sans utilisateur en base, vous pouvez activer un **bootstrap admin** via `.env.local` :

```bash
ADMIN_BOOTSTRAP_ENABLED=true
ADMIN_BOOTSTRAP_EMAIL=admin@smove.com
ADMIN_BOOTSTRAP_PASSWORD=ChangeMe123!
ADMIN_BOOTSTRAP_ROLE=admin
```

- Le bootstrap est **désactivé par défaut** en production. Pour l'autoriser explicitement :

```bash
ADMIN_BOOTSTRAP_ENABLED=true
ADMIN_BOOTSTRAP_ALLOW_PROD=true
```

- Lors d'un login bootstrap réussi, un user est créé (ou mis à jour) avec `status=active` et `role` défini.
- Ne loggez jamais le mot de passe et pensez à **désactiver** le bootstrap après initialisation.
 - Le seed (`npm run db:seed`) utilise également ces variables pour créer un admin bootstrap si besoin.

### Flux d'invitation
1. **Invitation** : depuis `/admin/users`, cliquez sur "Inviter un user" et récupérez le lien généré.
2. **Activation** : l'utilisateur ouvre `/activate?token=...`, choisit un mot de passe et active son compte.
3. **Connexion** : l'utilisateur se connecte via `/admin/login` avec son email et son mot de passe.

## Paramètres du site (Settings)
- Page CMS dédiée : `/admin/settings` pour configurer le branding, les réseaux, le SEO et les réglages blog/homepage.
- Les paramètres sont stockés dans la collection `SiteSettings` (singleton) et un enregistrement par défaut est créé au premier accès.
- Un seed dédié est disponible via `npm run db:seed` pour créer ce document si besoin.
- Logo, favicon et Open Graph peuvent être renseignés via URL (ou chemins relatifs).
- `seo.metadataBase` alimente directement la base SEO/OG pour éviter le warning Next.js.

## Validation et stabilité
- Les routes `POST/PUT` admin passent par des schémas Zod (cf. `lib/validation/admin.ts`) pour renvoyer des erreurs 400 explicites plutôt que des plantages.
- Les erreurs Prisma renvoient des réponses `503` avec un message `Database unreachable` quand la base est hors-ligne, évitant de casser la navigation admin.
- Les slugs utilisent le pattern `^[a-z0-9]+(?:-[a-z0-9]+)*$` et sont vérifiés en temps réel dans les formulaires d'articles.

## Modèles de données
Les modèles Prisma/MongoDB sont définis dans `prisma/schema.prisma` :
- `Media` : type (image/vidéo), dossier, URL originale, variantes (JSON), poster vidéo, dimensions, taille, durée optionnelle, timestamps.
- `Service` : slug unique, nom, description, catégorie/type, `categorySlug` et `sectorSlug` (dropdown admin), `status` (draft/published/archived), `coverMediaId`.
- `Project` : slug unique, client, titre, secteur, `sectorSlug` et `categorySlug` (dropdown admin), résumé, corps, résultats, catégorie/type, `status` et `coverMediaId`.
- `Post` : slug unique, titre, extrait, contenu, `tags`, `categoryId`, `coverMediaId`, `galleryMediaIds`, `videoMediaId`, statut `status` (draft/published/archived/removed), dates de création/mise à jour + `publishedAt`.
- `Event` : slug unique, titre, date, lieu, description, catégorie/type, `status` et `coverMediaId`.
- `User` : email unique, `role` (admin/client), `status` (pending/active/disabled), `passwordHash` optionnel, token d'invitation (hash + expiry), timestamps.
- `Category` : typée (`post`, `service`, `project`, `event`), `name`, `slug`, ordre, timestamps.
- `Taxonomy` : type (`service_sector`, `service_category`, `project_sector`, `project_category`, `post_category`), slug, label, ordre, actif, timestamps.
- `SiteSettings` : singleton pour le branding, SEO, réseaux sociaux, contact, homepage et réglages blog.

## Gestion du contenu
- `admin/services` : lister, créer, mettre à jour et supprimer les services.
- `admin/projects` : CRUD projets (slug, client, secteur, résumé, description, résultats).
- `admin/posts` : CRUD articles (slug, titre, catégorie, extrait, contenu, publication, média). Les articles supportent une image de couverture, une galerie, une vidéo MP4 et les tags/catégories.
- `admin/media` : médiathèque (upload, recherche, filtre, suppression, copie de lien).
- `admin/categories` : gérer les catégories utilisées dans les formulaires CMS (par type).
- `admin/users` : gérer les comptes, rôles et statuts depuis le CMS.
- `admin/settings` : paramètres globaux (nom du site, SEO, réseaux, homepage, pagination blog).
- `admin/taxonomies` (API) : CRUD des taxonomies référentielles (secteurs, catégories) pour alimenter les dropdowns des services/projets/articles.

Les données sont persistées via Prisma/MongoDB et utilisées par les pages publiques (`/projects`, `/blog`, etc.).

## Blog & CMS
- Pages publiques : `/blog` (listing éditorial) et `/blog/[slug]` (détail de l'article, galerie, vidéo, posts liés, derniers articles).
- Administration : `/admin/posts` pour gérer les articles (création, édition, suppression).

Flux de gestion :
1. **Créer un article** : cliquez sur "Nouvel article" dans `/admin/posts`, renseignez le titre/slug (auto-généré), la catégorie, l'extrait, le contenu et le statut de publication.
2. **Modifier un article** : depuis la liste `/admin/posts`, utilisez l'action "Modifier" pour ajuster le contenu ou le statut, puis sauvegardez.
3. **Supprimer un article** : cliquez sur "Supprimer" dans la ligne concernée et confirmez la suppression.

## CMS Articles - statuts, slugs, catégories
- **Statuts** : utilisez `status` (`draft`, `published`, `archived`, `removed`) dans le formulaire ou les actions rapides depuis `/admin/posts`. La date `publishedAt` est gérée automatiquement lorsque le statut passe sur `published`.
- **Slugs** : la validation supporte `excludeId` pour l'édition et propose un slug alternatif en cas de collision. Le backend renvoie un `suggestedSlug` si un doublon est détecté à l'enregistrement.
- **Catégories** : les listes sont alimentées via `GET /api/admin/categories?type=post`. S'il n'y a pas de catégorie, un bouton permet de générer un seed ou de créer une catégorie depuis `/admin/categories`.

## Endpoints CMS clés
- Auth :
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `POST /api/auth/activate`
- Taxonomies :
  - `GET /api/admin/taxonomies?type=service_sector|service_category|project_sector|project_category|post_category`
  - `POST /api/admin/taxonomies` (body Zod `taxonomySchema`)
  - `PUT /api/admin/taxonomies/:id` / `DELETE /api/admin/taxonomies/:id`
- Catégories :
  - `GET /api/admin/categories?type=post|service|project|event`
  - `POST /api/admin/categories` (CRUD + seed via `{ seed: true, type: "post" }`)
  - `PATCH /api/admin/categories/:id` / `DELETE /api/admin/categories/:id`
- Slugs : `GET /api/admin/slug?model=<post|project|service|event>&slug=...&excludeId=...`
- Users :
  - `GET /api/admin/users?q=&role=&status=&sort=&page=&limit=`
  - `POST /api/admin/users` (invite + lien d'activation)
  - `GET /api/admin/users/:id`
  - `PATCH /api/admin/users/:id`
  - `DELETE /api/admin/users/:id`

## Media system
### Stockage (local vs S3/R2)
- `MEDIA_STORAGE=local|s3` : sélection du provider.
- `MEDIA_PUBLIC_BASE_URL` : base publique en local (ex: `http://localhost:3000`). Les fichiers sont servis depuis `/uploads/...`.
- `S3_PUBLIC_BASE_URL` : base publique du bucket (ex: `https://cdn.example.com`).
- `S3_BUCKET`, `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` : accès S3/R2.
- `MEDIA_MAX_BYTES` et `MEDIA_MAX_FILES` : limite de taille par fichier et nombre d'uploads par requête.

### Endpoints
- `GET /api/admin/media?type=image|video&folder=...&search=...&page=1&limit=24`
- `POST /api/admin/media` (multipart/form-data: `files[]`, `folder`, `poster` optionnel)
- `DELETE /api/admin/media?id=<mediaId>`

### CMS
- Utilisez la médiathèque dans les formulaires (cover, galerie, vidéo). Les images génèrent des variantes webp (thumb 320, sm 640, md 1024, lg 1600).
- Les vidéos MP4 peuvent avoir un poster (upload image -> variantes webp).

### Script utilitaire
```bash
npm run media:clean
```

## Seed admin (Users CMS)
Si vous avez besoin d'un compte admin dans la collection `User`, lancez :

```bash
SMOVE_ADMIN_SEED_EMAIL="admin@smove.local" SMOVE_ADMIN_SEED_PASSWORD="ChangeMe123!" npm run seed:admin
```

- `SMOVE_ADMIN_SEED_PASSWORD_HASH` est optionnel si vous stockez déjà des mots de passe hashés.

## Notes supplémentaires
- Le hero public est désormais animé en 2 écrans avec une vidéo fullscreen (supporte poster + preload metadata).
- Les routes `/portfolio` redirigent vers la convention unique `/projects`.

## Known issues
- Pas de suite de tests automatisés (unit/e2e) intégrée.
- Pas de système d’analytics ni monitoring applicatif.
- Les contenus existants sans `status` sont considérés publiés pour compatibilité.

## Commandes Prisma utiles
- Pousser le schéma vers la base : `npx prisma db push`
- Générer le client : `npx prisma generate`
- Visualiser les données : `npx prisma studio`

## Roadmap (P0 / P1 / P2)
### P0 — Qualité & workflow éditorial
- Prévisualisation des pages publiques depuis le CMS.
- Workflow multi-rôles (éditeur, relecteur, admin) + permissions fines.
- Validation avancée des formulaires (bloquer publication sans media/SEO).

### P1 — Performance & SEO
- Cache revalidate par page (services/projets/blog).
- Pagination + recherche full-text (posts, projets, services).
- Optimisation Core Web Vitals (media lazy + compression).

### P2 — Observabilité & CI/CD
- Tests E2E (Playwright) + unit tests (Vitest).
- Monitoring (Sentry, métriques uptime).
- CI/CD avec déploiement automatique + environnements de staging.
