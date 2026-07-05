# AGENTS Guide: treetracker-admin-client

This file is for autonomous/agentic coding agents working in this repository.
Follow these instructions before making code changes.

## Project Snapshot

- Stack: React 18 + Create React App + Material-UI v4 + Jest + Cypress + WDIO/Cucumber.
- Language: JavaScript (no TypeScript in this repo).
- Module resolution: `src` is a base URL (see `jsconfig.json`), so absolute imports like `views/...` are valid.
- Node: use Node 18+ (`package.json` engines and CI use Node 18).

## Source Layout

- App code: `src/`
- API helpers: `src/api/`
- Context providers/state: `src/context/`
- UI components: `src/components/`
- Page-level views: `src/views/`
- Models/filter logic: `src/models/`
- Jest tests: colocated, `*.test.js`
- Cypress tests: `cypress/component/` and `cypress/integration/`, file pattern `*.spec.py.js`
- BDD features: `features/**/*.feature`
- WDIO step definitions: `features/step-definitions/**/*.js`

## Setup Commands

- Install deps: `npm ci --legacy-peer-deps` (matches CI)
- Alternative local install: `npm install`
- When adding/updating npm packages, use `npm install --legacy-peer-deps <package>` to avoid peer dependency resolution failures in this repo.
- Start dev server (default env): `npm start`
- Start dev server with explicit env: `npm run start:dev`
- Start with local env file: `npm run start:local`

## Build Commands

- Production build: `npm run build`
- Dev build: `npm run build:dev`
- Test-env build: `npm run build:test`
- Staging build: `npm run build:staging`

## Lint / Format Commands

- Lint source: `npm run lint`
- Lint with autofix: `npm run lint:fix`
- Format `src/` with Prettier: `npm run prettier:fix`
- Pre-commit hook runs `pretty-quick --staged` automatically.

## Test Commands (Jest / React Testing Library)

- Run all Jest tests (watch mode by CRA): `npm test`
- CI-style run once: `CI=true npm test -- --watchAll=false`
- Run one test file:
  - `npm test -- src/api/httpClient.test.js --watchAll=false`
  - or `CI=true npm test -- src/api/httpClient.test.js`
- Run tests matching a name:
  - `npm test -- --watchAll=false --testNamePattern="stores post login path"`
- Debug tests: `npm run test:debug`

## Test Commands (Cypress)

- Open Cypress UI: `npm run cypress`
- Run a single spec headless:
  - `npx cypress run --spec cypress/integration/login.spec.py.js`
  - `npx cypress run --spec cypress/component/Login.spec.py.js`
- Base URL defaults to `http://localhost:3001` (`cypress.json`).

## Test Commands (WDIO + Cucumber)

- Run all BDD features: `npm run wdio`
- Run one feature:
  - `npx wdio run wdio.conf.js --spec ./features/login.feature`
- Run by tag:
  - `WDIO_TAGS='@smoke' npm run wdio`
- Generate/open Allure report: `npm run wdio:report`

## CI Expectations

- PR CI runs: install, `npm run lint`, `npm run build`, `npm test`.
- Keep local changes green for at least lint + build before opening PR.
- Tests are sometimes expensive; run targeted tests first, then broader suites.

## Existing Repo Guardrails (carry-forward)

1. Do not add new backend API calls/endpoints during refactors unless explicitly requested.
2. Preserve existing network behavior and endpoint contracts during refactors.
3. If an expected endpoint is missing, stop and ask for clarification; do not invent one.
4. Keep refactors behaviorally equivalent unless functional change is requested.
5. No new network side effects without explicit user approval.

## Code Style: Formatting

- Prettier is authoritative (`.prettierrc`):
  - `printWidth: 80`
  - `tabWidth: 2`
  - `singleQuote: true`
  - `semi: true`
  - `trailingComma: es5`
  - `arrowParens: always`
- Do not manually reformat unrelated lines/files.
- Keep imports and object literals tidy; let Prettier handle final shape.

## Code Style: ESLint

- ESLint config: `.eslintrc.js` with recommended React + Cypress rules.
- Important active rules:
  - `no-unused-vars`: warning (still fix warnings in touched code).
  - `react/display-name`: warning.
  - `react/prop-types`: off.
- Ignore patterns include tests and stories in `.eslintignore`; lint command targets `src`.

## Code Style: Imports

- Prefer import grouping order used across the codebase:
  1. third-party packages,
  2. absolute `src` imports,
  3. relative local imports.
- Keep one blank line between logical import groups.
- Use named imports where available; keep default imports aligned with file exports.
- Preserve existing module style in a file (avoid mixing require/import unless already present).

## Code Style: Naming

- React components/files: PascalCase (`LoginRoute`, `CaptureMatchingView`).
- Context providers: `XxxContext` / `XxxProvider`.
- Variables/functions: camelCase.
- Constants: UPPER_SNAKE_CASE for shared enums/constants.
- Test files: colocated `*.test.js`; Cypress specs `*.spec.py.js` (project convention).

## Code Style: Types and Data Shapes

- This repo is JavaScript-first; do not introduce TypeScript unless explicitly requested.
- For complex objects, preserve existing shape contracts used by API/model code.
- Validate assumptions at boundaries (API responses, route state, local/session storage).
- Prefer optional chaining and null-safe checks when reading nested data.

## Code Style: React Patterns

- Functional components + hooks are the norm.
- Keep state close to usage; lift only when needed by siblings/routes.
- Respect existing context architecture in `src/context`.
- Avoid unnecessary re-renders in hot paths (use memoization only where justified).

## Code Style: Error Handling and Logging

- Wrap async API calls in `try/catch` when failure is expected.
- Use `loglevel`/existing logging conventions for operational errors.
- Do not silently swallow errors unless cancellation/abort is intentional.
- Re-throw when upstream handling is required; otherwise return safe fallback values.
- Keep user-facing error messages actionable and non-sensitive.

## Auth / Networking Notes

- Respect dual auth paths: Keycloak-enabled vs legacy token mode.
- `authAxios` interceptors manage token refresh/redirect flows; avoid bypassing casually.
- Keep `Authorization` header behavior consistent with existing helpers.

## Commit / PR Hygiene

- Follow Conventional Commits (enforced by commitlint hook).
- PR titles should also follow Conventional Commits (squash merge flow).
- Keep diffs focused; avoid drive-by refactors in unrelated files.

## Cursor/Copilot Rule Files

- No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` were found at time of writing.
- If any are added later, treat them as higher-priority guidance and update this file.

## Agent Workflow Checklist

1. Read nearby code and follow local patterns before editing.
2. Make the smallest safe change that solves the requested problem.
3. Run targeted tests for touched behavior.
4. Run `npm run lint` for touched `src` code.
5. If change is broad/risky, run full `CI=true npm test -- --watchAll=false` and `npm run build`.
