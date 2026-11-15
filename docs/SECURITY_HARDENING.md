# Security hardening: request authorization

## What this change closes

1. Removed the obsolete anonymous admin bathroom-delete route. It did not check
   an authenticated session, an admin role, or record ownership.
2. The bathroom edit route now requires a logged-in session and ownership.
   Legacy third-party imported bathrooms without a creator cannot be edited
   through this endpoint.
3. Review edits use an allowlist: clients can no longer submit arbitrary model
   fields such as UserId, BathroomId, or record timestamps.
4. Review and bathroom deletes now include the logged-in user in the database
   mutation condition. This reduces the risk of a stale permission check.
5. The public user endpoint only fetches and returns id/name/photo, instead
   of serializing the full user model (which includes password hashes).

## Verification

- Run `node --check server-side/server.js`.
- Run `node --test server-side/tests/security.test.cjs`.
- GitHub Actions runs those checks without provider keys or a database.
- **Not** a full integration test: verify login, CRUD, and PostgreSQL behavior
  in a staging environment before relying on this in production.

## Remaining risks

- The server uses Express's default in-memory session store, which is unsuitable
  for production or a multi-instance deployment; configure Redis/Postgres-backed
  sessions and secure cookies.
- Session-authenticated write routes need CSRF defenses and explicit rate limits.
- Legacy password and account endpoints need schema validation, auth audit,
  and consistent error handling.
- Review rating aggregation currently mixes concerns with a bathroom PATCH.
  Recalculate ratings based on persisted reviews in a future transactional fix.
- Public API keys and database credentials should never be stored in Git.
  Audit previous commit history and rotate any credentials previously exposed.
- Validate whether the original production domain is still operational; a README
  link is not evidence of a working deployment.

This work is a focused vulnerability reduction milestone, not a claim that the
overall application is security-audited or production-ready.
