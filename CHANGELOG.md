# Changelog

## [Unreleased]
### Added
- Added `.env.example` template for safe local setup.
- Seed now creates default categories and optional bootstrap admin.
- Slug availability suggestions for services, projects, and events.
- Added content status (`draft/published/archived`) for services, projects, and events with quick actions.
- Added taxonomy-driven dropdowns in CMS for services/projects and category dropdown for events.
- Added media upload limits (size/count) and documented media env settings.

### Changed
- Auth login and activation now use `safePrisma` with retries/timeouts.
- `safePrisma` includes retry/backoff for transient DB errors.
- README updated with `.env.example` setup and bootstrap seed notes.
- Admin dashboard counters now read from the `json.data` payload.
- Public services/projects listings filter to published content (legacy data without status still visible).

### Detailed changes (files / raison)
- `prisma/schema.prisma` : ajout du statut `ContentStatus` pour Service/Project/Event.
- `lib/validation/admin.ts` : validation Zod étendue (status + slugs taxonomies).
- `app/api/admin/services|projects|events/*` : support des statuts, slugs taxonomies, PATCH rapide.
- `app/admin/services|projects|events/page.tsx` : dropdowns taxonomies + status quick actions.
- `app/admin/dashboard/page.tsx` : correction des compteurs (payload `json.data`).
- `app/services/*`, `app/projects/*` : filtrage des contenus non publiés.
- `app/api/admin/media/route.ts`, `lib/media/config.ts` : limites d’upload.
- `.env.example`, `README.md` : documentation env + checklist prod + roadmap.
