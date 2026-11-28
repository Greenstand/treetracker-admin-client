# Domain administration BDD acceptance catalogue

These are reviewable Gherkin acceptance specifications for the admin-panel integration. They cover views, service boundaries, audit trails and remaining requests. **They are not newly automated browser tests.** Existing Jest/API and legacy Cucumber checks are linked as partial evidence; none of those links claims that every scenario is automated.

## Delivery status and automation

Every scenario has one stable `@UC-AREA-001` identifier and exactly one status:

- `@implemented`: observable behavior supported by the current integration. This does not mean the new Gherkin step is bound or production is deployed.
- `@legacy_contract`: retained upstream behavior using an existing contract. This is explicitly not a completed NDM migration.
- `@pending`: requested behavior not complete in the current integration, or a dependency/policy decision still needed.

Every new feature is tagged `@acceptance_spec @manual @ndm`. Existing WebdriverIO runs exclude `@acceptance_spec` by default so unbound specifications cannot break the legacy browser suite or accidentally perform live billing/identity mutations. Do not override that exclusion for these features until real fixture-backed step definitions are implemented. No placeholder step returns a fake pass.

Run the offline specification validator from the repository root:

```sh
npm run bdd:check
```

It uses the installed Cucumber Gherkin parser and checks syntax, scenario IDs, statuses, example placeholders and local traceability paths. It expands scenario outlines, but **does not execute their steps, contact Stripe/Keycloak, or mutate a database**. Current delivery counts are printed by this command; they must not be described as passing end-to-end acceptance tests.

For manual acceptance, choose a scenario by ID, create its disposable non-production fixtures, verify both visible and API/audit outcomes, and record the result, commit and environment. For automation, implement actual page/API steps with deterministic setup/cleanup, link their checks to the ID, and remove the acceptance-only tag only when the scenario is runnable safely.

## Roles and fixtures

| Business role | Actual authorization |
| --- | --- |
| Platform administrator | `greenstand-admin`; platform APIs still enforce this server-side |
| Organization administrator | `org-admin-saas` plus approved `organization_id` membership |
| Ordinary / verification-only member | `org` and approved organization; default `verify_captures` unless an explicit grant changes it |
| Project manager | scoped `manage_projects` |
| Species manager | scoped `manage_species` |
| Membership manager | scoped `manage_members` |
| Contract reader | scoped `view_contracts` |
| Wallet administrator | existing wallet-admin capability; no automatic grant from a proposal or preview |

Organization A and B are isolated disposable Stakeholder organizations. Their numeric Keycloak/mobile mappings are distinct from UUID identities. Project A1/A2 belong to A; B1 belongs to B. Grower accounts are not automatically admin logins. Use empty, pending, rejected, approved, unmatched, missing-metadata and conflicting-version fixtures as each scenario specifies. Existing unowned/public tag names need proven scoped NDM usage before suggestion. No actual credentials, production customer IDs, real grower contacts or secret keys belong in feature files.

Identity and Stripe interactions must use explicitly approved non-production fixtures/sandbox configuration. Signatures and environment mismatches should be tested against a local harness. Do not send automated tests to the live PHP endpoint or mutate shared dev Keycloak as a side effect of running these specifications. External workflow setup and cleanup must be designed before browser automation is enabled.

## Current boundaries that acceptance must preserve

- NDM writes use Stakeholder, Herbarium, Field Data, Treetracker and Contracts ownership. Existing legacy screens are labelled rather than silently called migrated.
- Org user / Admin is a UI preview, not impersonation or reduced server privilege. Audit actors remain the real signed-in identity.
- A saved empty species selection is different from inheritance; new projects start empty.
- Approval records a raised matching event; event publication/tree matching is a pending dependency.
- Mobile session `project_id` upload support is pending; admin allocation correction is implemented.
- Captures export retains a legacy contract; its complete NDM migration and remaining legacy global-tag consumers are pending.
- The Users view is the `org-admin-saas` directory, not a general grower or every-Keycloak-user list. No subscription and unavailable billing are distinct.
- Configured allowance proposals remain labelled. Quota warnings are implemented; server quota enforcement and subscription-gated wallet/admin policy are pending.
- Project media currently uses URLs. Managed file upload, contract creation/signing/payout and richer Account billing/login-session information remain pending.
- Historical actors, Latin names, organization mappings, coordinates and other missing fields must not be invented.

## View and use-case index

Paths marked `api:` refer to Greenstand/treetracker-admin-api (draft PR #699). Other paths are in this repository (draft PR #1315). Referenced tests are partial evidence, not new step bindings. An empty check column means manual acceptance currently has no matching automated check in this index.

| Feature / use-case IDs | View or workflow | Entry points | Main sources | Referenced checks (partial) |
| --- | --- | --- | --- | --- |
| [Access, organization context and navigation](access-and-navigation.feature)<br>`ACC` (8 scenarios) | Access, organization context and navigation | `all domain views` | `src/features/domain/DomainContext.js`<br>`src/features/domain/UserToolbar.js`<br>`src/context/AppContext.js`<br>`src/components/common/Menu.js` | `api:src/domain/service.test.ts`<br>`api:src/domain/router.test.ts` |
| [Organization and platform dashboard](dashboard.feature)<br>`DASH` (5 scenarios) | Organization and platform dashboard | `/` | `src/features/domain/Dashboard.js` | `api:src/domain/service.test.ts` |
| [Project directory and project editor](projects.feature)<br>`PROJ` (8 scenarios) | Project directory and project editor | `/projects` | `src/features/domain/Projects.js` | `api:src/domain/service.test.ts` |
| [Grower assignment to projects and its trail](project-growers.feature)<br>`PG` (7 scenarios) | Grower assignment to projects and its trail | `/projects` | `src/features/domain/ProjectGrowers.js` | `api:src/domain/projectGrowers.test.ts` |
| [Grower directory and account details](growers.feature)<br>`GR` (6 scenarios) | Grower directory and account details | `/growers` | `src/features/domain/Growers.js`<br>`src/features/domain/GrowerAccount.js` | `api:src/domain/service.test.ts` |
| [Platform grower organization transfers](grower-transfers.feature)<br>`MOVE` (4 scenarios) | Platform grower organization transfers | `/growers`<br>`/organizations` | `src/features/domain/GrowerTransfer.js` | `api:src/domain/verification.test.ts` |
| [Tracking session directory and review navigation](tracking-sessions.feature)<br>`SES` (5 scenarios) | Tracking session directory and review navigation | `/tracking-sessions` | `src/features/domain/TrackingSessions.js` | `api:src/domain/service.test.ts` |
| [Session map preview and recorded area](session-map.feature)<br>`MAP` (5 scenarios) | Session map preview and recorded area | `/tracking-sessions`<br>`/verify` | `src/features/domain/SessionMap.js` | Manual only |
| [Correcting a session project allocation](session-projects.feature)<br>`ALLOC` (6 scenarios) | Correcting a session project allocation | `/tracking-sessions`<br>`/verify` | `src/features/domain/SessionProject.js` | `src/features/domain/SessionProject.test.js`<br>`api:src/domain/sessionProject.test.ts` |
| [NDM capture approval and rejection](verification.feature)<br>`VER` (10 scenarios) | NDM capture approval and rejection | `/verify` | `src/features/domain/Verify.js` | `src/features/domain/Verify.test.js`<br>`api:src/domain/verification.test.ts` |
| [Session selection and verification statistics](session-verification.feature)<br>`VS` (4 scenarios) | Session selection and verification statistics | `/verify` | `src/features/domain/VerificationSession.js` | `src/features/domain/VerificationSession.test.js`<br>`api:src/domain/service.test.ts` |
| [Organization capture tags and project suggestions](capture-tags.feature)<br>`TAG` (6 scenarios) | Organization capture tags and project suggestions | `/verify` | `src/features/domain/CaptureTagPicker.js` | `src/features/domain/CaptureTagPicker.test.js`<br>`api:src/domain/captureTags.test.ts` |
| [Capture matching handoff](capture-matching.feature)<br>`MATCH` (2 scenarios) | Capture matching handoff | `/verify`<br>`/tracking-sessions` | `api:src/domain/verification.ts` | `api:src/domain/verification.test.ts` |
| [Capture search and export](captures-and-export.feature)<br>`CAP` (4 scenarios) | Capture search and export | `/captures` | `src/views/CapturesView.js`<br>`src/components/Captures/CaptureTable.js` | `features/capture.feature` |
| [Contracts and authorized documents](contracts.feature)<br>`CON` (10 scenarios) | Contracts and authorized documents | `/contracts` | `src/features/domain/Contracts.js`<br>`src/features/domain/ContractActions.js`<br>`src/features/domain/Agreements.js` | `api:src/domain/contracts.test.ts` |
| [Organization and project species selections](organization-species.feature)<br>`SP` (8 scenarios) | Organization and project species selections | `/organization-species` | `src/features/domain/Species.js`<br>`src/features/domain/LocalNamePicker.js` | `src/features/domain/LocalNamePicker.test.js`<br>`api:src/domain/service.test.ts` |
| [Platform Herbarium catalogue and botanical identity](herbarium.feature)<br>`HERB` (8 scenarios) | Platform Herbarium catalogue and botanical identity | `/admin-species` | `src/features/domain/Species.js`<br>`src/features/domain/SpeciesSources.js` | `src/features/domain/SpeciesSources.test.js`<br>`api:src/domain/service.test.ts` |
| [Organization users and permission grants](organization-users.feature)<br>`MEM` (6 scenarios) | Organization users and permission grants | `/organization-users` | `src/features/domain/OrganizationUsers.js` | `api:src/domain/service.test.ts` |
| [Platform organization management](organizations.feature)<br>`ORG` (4 scenarios) | Platform organization management | `/organizations` | `src/features/domain/Organizations.js`<br>`src/features/domain/OrganizationGrowers.js` | `api:src/domain/service.test.ts` |
| [Platform SaaS organization-admin directory](platform-users.feature)<br>`SAAS` (6 scenarios) | Platform SaaS organization-admin directory | `/saas/users` | `src/features/domain/SaasUsers.js` | `api:src/domain/router.test.ts` |
| [Subscription plans and quota usage](subscription-plans.feature)<br>`QUOTA` (7 scenarios) | Subscription plans and quota usage | `/subscription-plans` | `src/features/domain/SubscriptionPlans.js`<br>`src/features/domain/SubscriptionUsage.js` | `src/features/domain/SubscriptionUsage.test.js`<br>`api:src/domain/subscriptionUsage.test.ts`<br>`api:src/domain/plans.test.ts` |
| [Hosted Stripe Checkout and billing portal](hosted-billing.feature)<br>`BILL` (5 scenarios) | Hosted Stripe Checkout and billing portal | `/subscription-plans` | `src/features/domain/SubscriptionPlans.js`<br>`api:src/domain/checkout.ts` | `api:src/domain/checkout.test.ts` |
| [Stripe webhook reconciliation and identity linking](stripe-webhook.feature)<br>`HOOK` (6 scenarios) | Stripe webhook reconciliation and identity linking | `external PHP webhook` | `api:examples/stripe-keycloak-webhook.php` | Manual only |
| [Share App organization invitations](share-app.feature)<br>`SHARE` (5 scenarios) | Share App organization invitations | `/share-app` | `src/features/domain/ShareApp.js`<br>`src/views/ShareAppView.js`<br>`src/common/shareLink.js`<br>`public/app.html` | `src/features/domain/ShareApp.test.js`<br>`src/views/ShareAppView.test.js`<br>`src/common/shareLink.test.js`<br>`src/common/appRedirectPage.test.js` |
| [Account identity and authentication details](account.feature)<br>`ACCT` (4 scenarios) | Account identity and authentication details | `/account` | `src/components/Account.js` | `features/account/update-account.feature`<br>`features/account/change-password.feature` |
| [Organization binding requests](org-binding.feature)<br>`BIND` (4 scenarios) | Organization binding requests | `/organization-binding-requests` | `src/features/domain/BindingRequests.js`<br>`src/components/OrganizationBindingRequests.js` | `features/organization/org-binding.feature` |
| [Wallet entry points and subscription integration](wallet-access.feature)<br>`WAL` (3 scenarios) | Wallet entry points and subscription integration | `/wallets` | `src/context/AppContext.js`<br>`src/views/WalletsView.js` | `features/wallet/admin.feature` |
| [NDM migrations, references and audit integrity](ndm-integrity.feature)<br>`NDM` (4 scenarios) | NDM migrations, references and audit integrity | `all domain writes` | `api:docs/domain-admin-api.md`<br>`docs/domain-admin-views.md` | `api:src/domain/service.test.ts`<br>`api:src/domain/verification.test.ts` |

Machine-readable index: [manifest.json](manifest.json). Stable IDs should be retained when scenarios are refined; new scenarios should receive new IDs.

## Remaining migration and video work

[Issue #1316](https://github.com/Greenstand/treetracker-admin-client/issues/1316) records the delivered feature matrix, retained legacy contracts and the TODO checklist for real BDD step automation and recorded evidence. The existing WDIO hook can stitch screenshots into MP4, but these manual domain specifications do not yet execute browser steps or generate their own videos.
