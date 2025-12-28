# Changelog

## [Unreleased]
### Added
- Added `.env.example` template for safe local setup.
- Seed now creates default categories and optional bootstrap admin.
- Slug availability suggestions for services, projects, and events.

### Changed
- Auth login and activation now use `safePrisma` with retries/timeouts.
- `safePrisma` includes retry/backoff for transient DB errors.
- README updated with `.env.example` setup and bootstrap seed notes.
