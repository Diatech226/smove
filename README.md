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
DATABASE_URL="mongodb+srv://diaexpressofficial:Smove@cluster0.wxdxz04.mongodb.net/smove?retryWrites=true&w=majority&appName=Cluster0"
DIRECT_DATABASE_URL="mongodb+srv://diaexpressofficial:Smove@cluster0.wxdxz04.mongodb.net/smove?retryWrites=true&w=majority&appName=Cluster0"
SMOVE_ADMIN_PASSWORD=change-me
SMOVE_ADMIN_SECRET=any-strong-random-string
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_BRAND_NAME=SMOVE
```

- **Toujours** inclure le nom de base de données `/smove` dans le chemin. Les erreurs `P2010` / "empty database name" viennent généralement d'une URL tronquée.
- Le client Prisma est initialisé via `env("DATABASE_URL")` (voir `prisma/schema.prisma` et `lib/prisma.ts`).
- Pour MongoDB, les identifiants utilisent `String @id @default(auto()) @map("_id") @db.ObjectId`.

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

## Modèles de données
Les modèles Prisma/MongoDB sont définis dans `prisma/schema.prisma` :
- `Service` : slug unique, nom, description, catégorie/type et `image` pour les cartes.
- `Project` : slug unique, client, titre, secteur, résumé, corps, résultats, catégorie/type et `coverImage`.
- `Post` : slug unique, titre, extrait, contenu, `tags` (catégories), `coverImage`, `gallery`, `videoUrl`, statut `published`, dates de création/mise à jour.
- `Event` : slug unique, titre, date, lieu, description, catégorie/type et `coverImage`.

## Gestion du contenu
- `admin/services` : lister, créer, mettre à jour et supprimer les services.
- `admin/projects` : CRUD projets (slug, client, secteur, résumé, description, résultats).
- `admin/posts` : CRUD articles (slug, titre, catégorie, extrait, contenu, publication).

Les données sont persistées via Prisma/MongoDB et utilisées par les pages publiques (`/projects`, `/blog`, etc.).

## Blog & CMS
- Pages publiques : `/blog` (listing éditorial) et `/blog/[slug]` (détail de l'article).
- Administration : `/admin/posts` pour gérer les articles (création, édition, suppression).

Flux de gestion :
1. **Créer un article** : cliquez sur "Nouvel article" dans `/admin/posts`, renseignez le titre/slug (auto-généré), la catégorie, l'extrait, le contenu et le statut de publication.
2. **Modifier un article** : depuis la liste `/admin/posts`, utilisez l'action "Modifier" pour ajuster le contenu ou le statut, puis sauvegardez.
3. **Supprimer un article** : cliquez sur "Supprimer" dans la ligne concernée et confirmez la suppression.

## Notes supplémentaires
- Le hero 3D utilise des versions compatibles de `three`, `@react-three/fiber` et `@react-three/drei` pour éviter les warnings `PlaneBufferGeometry` de `troika-three-text`.
- Les routes `/portfolio` redirigent vers la convention unique `/projects`.

## Améliorations futures proposées
- Design : enrichir les pages publiques (services/projets/blog) avec plus de visuels et d'animations micro-interactions.
- Animations 3D : affiner les matériaux/éclairages du hero et proposer des variantes mobiles plus légères.
- CMS : ajouter la prévisualisation côté public, la gestion des brouillons/publications programmées et une recherche plein texte.
