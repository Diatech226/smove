# SMOVE

SMOVE – site vitrine avec hero 3D et back-office CMS pour une agence de communication digitale.

## Stack technique
- Next.js (App Router) & TypeScript
- Tailwind CSS
- Framer Motion
- React Three Fiber (section hero 3D)
- Prisma & MongoDB

## Structure des dossiers
- `/app` : pages publiques et admin (App Router, API routes incluses)
- `/components` : composants UI, layout, sections et 3D
- `/lib` : utilitaires (Prisma, hooks, configuration)
- `/prisma` : schéma Prisma

## Variables d'environnement (`.env` / `.env.local`)
Créez un fichier `.env` (ou `.env.local` pour Next.js) à la racine avec :

```
SMOVE_ADMIN_PASSWORD="change-me"
SMOVE_ADMIN_SECRET=change-me-random-long-secret

# MongoDB connection for Prisma
# IMPORTANT: must start with mongodb:// ou mongodb+srv:// et contenir le nom de base smove
DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@cluster0.wxdxz04.mongodb.net/smove?retryWrites=true&w=majority&appName=Cluster0"

# Public site
NEXT_PUBLIC_SITE_URL=https://smove.example.com
NEXT_PUBLIC_BRAND_NAME="SMOVE Communication"
```

- **Toujours** inclure le nom de base de données `/smove` dans le chemin. Les erreurs `P2010` / "empty database name" viennent généralement d'une URL tronquée.
- Le client Prisma est initialisé via `env("DATABASE_URL")` (voir `prisma/schema.prisma` et `lib/prisma.ts`).
- Pour MongoDB, les identifiants utilisent `String @id @default(auto()) @map("_id") @db.ObjectId`.

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
- **Base manquante** : ajoutez impérativement `/smove` à la fin du chemin dans `DATABASE_URL`.
- **Chaîne d'URL** : utilisez l'URI `mongodb+srv://.../smove?retryWrites=true&w=majority&appName=Cluster0` fournie par Atlas (n'oubliez pas le nom de la base).
- **Whitelisting IP** : autorisez l'adresse IP de votre machine (ou `0.0.0.0/0` temporairement) dans l'onglet Network Access.
- **TLS/SSL errors / InternalError** : Node.js 20 peut déclencher des erreurs TLS avec certains clusters. Essayez Node.js **18 LTS** et assurez-vous d'utiliser l'URI sécurisée `mongodb+srv://`.
- **Validation rapide avec Compass** : connectez-vous à l'URI Atlas via MongoDB Compass pour confirmer l'accès réseau et les droits.
- **Après changement d'env** : redémarrez le serveur de dev (`npm run dev`) après toute modification `.env`.

### Vérifier la santé de la base
- Endpoint de santé API : `GET /api/health/db` effectue un `post.count` rapide (timeout 2.5s) et retourne `status: ok` ou `status: error`.
- Les pages publiques affichent un message de secours plutôt que de planter si la base est inaccessible.

### Commandes Prisma après modification du schéma
- Pousser le schéma vers la base : `npm run prisma:push`
- Générer le client : `npm run prisma:generate`

## Mise en route
1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Créer `.env` ou `.env.local` avec les variables ci-dessus.
3. Générer/mettre à jour la base MongoDB :
   ```bash
   npx prisma db push
   ```
4. Générer le client Prisma (automatique avec `next dev`, mais possible manuellement) :
   ```bash
   npx prisma generate
   ```
5. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```

## Accès à l'admin
- URL : `/admin/login`
- Définissez `SMOVE_ADMIN_PASSWORD` pour le mot de passe d'accès.
- `SMOVE_ADMIN_SECRET` est utilisé pour signer le cookie de session (middleware `/admin/**`).
- Après connexion, vous êtes redirigé vers `/admin/dashboard` et pouvez gérer services, projets et articles.
- Les slugs sont vérifiés côté serveur via `GET /api/admin/slug?type=<post|project|service|event>&slug=...` pour garantir l'unicité dès la saisie.
- Un squelette `app/admin/loading.tsx` évite les flashes blancs pendant les chargements du back-office.

## Validation et stabilité
- Les routes `POST/PUT` admin passent par des schémas Zod (cf. `lib/validation/admin.ts`) pour renvoyer des erreurs 400 explicites plutôt que des plantages.
- Les erreurs Prisma renvoient des réponses `503` avec un message `Database unreachable` quand la base est hors-ligne, évitant de casser la navigation admin.
- Les slugs utilisent le pattern `^[a-z0-9]+(?:-[a-z0-9]+)*$` et sont vérifiés en temps réel dans les formulaires d'articles.

## Modèles de données
Les modèles Prisma/MongoDB sont définis dans `prisma/schema.prisma` :
- `Service` : slug unique, nom, description, catégorie/type et `image` pour les cartes.
- `Project` : slug unique, client, titre, secteur, résumé, corps, résultats, catégorie/type et `coverImage`.
- `Post` : slug unique, titre, extrait, contenu, `tags` (catégories), `coverImage`, `gallery`, `videoUrl`, statut `published`, dates de création/mise à jour.
- `Event` : slug unique, titre, date, lieu, description, catégorie/type et `coverImage`.

## Gestion du contenu
- `admin/services` : lister, créer, mettre à jour et supprimer les services.
- `admin/projects` : CRUD projets (slug, client, secteur, résumé, description, résultats).
- `admin/posts` : CRUD articles (slug, titre, catégorie, extrait, contenu, publication, média). Les articles supportent l'image de couverture, une galerie, une vidéo et les tags/catégories.

Les données sont persistées via Prisma/MongoDB et utilisées par les pages publiques (`/projects`, `/blog`, etc.).

## Blog & CMS
- Pages publiques : `/blog` (listing éditorial) et `/blog/[slug]` (détail de l'article, galerie, vidéo, posts liés, derniers articles).
- Administration : `/admin/posts` pour gérer les articles (création, édition, suppression).

Flux de gestion :
1. **Créer un article** : cliquez sur "Nouvel article" dans `/admin/posts`, renseignez le titre/slug (auto-généré), la catégorie, l'extrait, le contenu et le statut de publication.
2. **Modifier un article** : depuis la liste `/admin/posts`, utilisez l'action "Modifier" pour ajuster le contenu ou le statut, puis sauvegardez.
3. **Supprimer un article** : cliquez sur "Supprimer" dans la ligne concernée et confirmez la suppression.

## Notes supplémentaires
- Le hero 3D utilise des versions compatibles de `three`, `@react-three/fiber` et `@react-three/drei` pour éviter les warnings `PlaneBufferGeometry` de `troika-three-text`.
- Les routes `/portfolio` redirigent vers la convention unique `/projects`.

## Commandes Prisma utiles
- Pousser le schéma vers la base : `npx prisma db push`
- Générer le client : `npx prisma generate`
- Visualiser les données : `npx prisma studio`

## Améliorations futures proposées
- Design : enrichir les pages publiques (services/projets/blog) avec plus de visuels et d'animations micro-interactions.
- Animations 3D : affiner les matériaux/éclairages du hero et proposer des variantes mobiles plus légères.
- CMS : ajouter la prévisualisation côté public, la gestion des brouillons/publications programmées et une recherche plein texte.
