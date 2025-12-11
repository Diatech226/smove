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

## Variables d'environnement (`.env.local`)
Créez un fichier `.env.local` à la racine avec :

```
SMOVE_ADMIN_PASSWORD=change-me
SMOVE_ADMIN_SECRET=any-strong-random-string
DATABASE_URL="mongodb+srv://user:pass@cluster0.xxxxxx.mongodb.net/smove?retryWrites=true&w=majority"
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_BRAND_NAME=SMOVE
```

> Assurez-vous que `DATABASE_URL` utilise `mongodb://` ou `mongodb+srv://` et inclut le nom de la base.

> Avec MongoDB, déclarez les identifiants de modèle comme `String @id @default(auto()) @map("_id") @db.ObjectId`. La base utilisée est `smove` et l'URL ressemble à :
> `DATABASE_URL="mongodb+srv://USER:PASS@cluster0.wxdxz04.mongodb.net/smove?retryWrites=true&w=majority"`.

## Mise en route
1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Créer `.env.local` avec les variables ci-dessus.
3. Pousser le schéma vers MongoDB :
   ```bash
   npx prisma db push
   ```
4. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```

## Accès à l'admin
- URL : `/admin/login`
- Définissez `SMOVE_ADMIN_PASSWORD` pour le mot de passe d'accès.
- `SMOVE_ADMIN_SECRET` est utilisé pour signer le cookie de session (middleware `/admin/**`).
- Après connexion, vous êtes redirigé vers `/admin/dashboard`.

## Modèles de données
Les modèles Prisma/MongoDB sont définis dans `prisma/schema.prisma` :
- `Service` : nom, slug, description
- `Project` : slug, client, titre, secteur, résumé, corps, résultats
- `Post` : slug, titre, extrait, contenu, tags, date de publication

## Gestion du contenu
- `admin/services` : lister, créer, mettre à jour et supprimer les services.
- `admin/projects` : CRUD projets (slug, client, secteur, résumé, description, résultats).
- `admin/posts` : CRUD articles (slug, titre, extrait, contenu, tags, date de publication).

Les données sont persistées via Prisma/MongoDB et utilisées par les pages publiques (`/projects`, `/blog`, etc.).

## Notes supplémentaires
- Le hero 3D utilise des primitives Three compatibles pour éviter les erreurs Troika/Text.
- Les routes `/portfolio` redirigent vers la convention unique `/projects`.
