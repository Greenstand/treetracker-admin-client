# Domain administration views

Adds Dashboard, Projects, Tracking sessions, Contracts, Organization species, Organization users, Subscription plans and platform SaaS Users, Organizations and Admin species management to the existing Keycloak client.

The views reuse JavaScript, Material UI 4, routing, authentication interceptors, layout and React Query. Requests use /api/admin-domain. Set REACT_APP_DOMAIN_API_ROOT for a separate API origin; otherwise REACT_APP_API_ROOT is used.

## Local comparison

The draft uses port 3001, the upstream client uses http://127.0.0.1:3002, and the domain API uses http://127.0.0.1:3003. Local settings belong in the ignored .env.development.local file.

```dotenv
HOST=127.0.0.1
PORT=3002
BROWSER=none
REACT_APP_DOMAIN_API_ROOT=http://127.0.0.1:3003
REACT_APP_KEYCLOAK_CLIENT_ID=treetracker-admin-local
```

The OIDC client needs a matching redirect wildcard, origin and approved organization claim mapper. API expected-client settings must match. Start CRA directly with node node_modules/react-scripts/scripts/start.js to honor PORT, because the existing npm start script forces port 3001. WATCHPACK_POLLING=2000 and CHOKIDAR_USEPOLLING=true can avoid local watcher limits.

Keep database and service secrets outside the tracked upstream .env. The comparison setup loads work/dev-db-tools/domain-api.local.env using DOTENV_CONFIG_PATH.

## Scope

Projects support search, column sorting, create/edit, description, geography, targets and image URLs. Blank project logos inherit the organization logo. Species navigation carries project scope.

Sessions show compact UTC dates, grower and organization names, counts, review states, duration and recorded polygon area. Review captures opens details and location links. Verification writes use the NDM review workflow; matching queue publication remains a deployment dependency.

Contracts show actual agreements, workers, capture payment rates and linked documents. Contract signing, payouts and creation continue through their owning workflows.

Species inheritance is project, organization, default catalog. Selections and local names save transactionally. Platform catalog editing controls defaults, visibility, descriptions and references.

Organization users manage permissions for approved members. Platform SaaS users show organization-level billing. The subscription comparison uses the existing Stripe tiers and marks higher-tier allowances as proposals. The confirmed capture basis is total managed inventory.

Deploy the matching API and migrations before release. Routes outside these views retain existing service contracts. Keycloak administrative credentials and Stripe credentials are separate operational setup.

The subscription table reads amounts, currency and intervals from Stripe through the API. Choose buttons open Stripe Checkout for a first subscription or the customer portal for an existing one. The organization must be selected for platform-admin billing actions. Ordinary members can review plans; billing actions require an organization administrator or platform administrator.

The API requires STRIPE_RETURN_URL and the documented Stripe permissions and portal configuration. A tier role manually assigned in Keycloak does not create a Stripe subscription.

## Species selection and context toolbar

Select all includes all matching catalog pages; Unselect all clears the complete current scope. Both remain drafts until Save selection. A saved empty selection is distinct from Use default list / inheritance. Local-name dropdowns combine catalog common names with the organization name library; + Add local name creates a draft option below the picker. Save persists the selected alias plus new options through existing NDM common_name / organization_species relationships.

The shared layout includes Org user / Admin, settings, account and sign-out controls. Platform admins choose an organization before entering organization preview; platform navigation is hidden there. This is a UI workspace preview, not impersonation or a reduced-privilege security session. The real user and server authorization remain unchanged. Organization users cannot gain platform access through the control.

## Session map preview

Tracking Sessions has a map icon that opens an on-demand Leaflet preview. Only the server-generated outer envelope is rendered; individual capture markers/photos are not loaded. The preview is approximate and is not the recorded segment-area measurement shown in the list. Missing coordinates and unavailable background tiles have explicit UI states. Leaflet is lazy-loaded, and each map is disposed when closed.

Basemap defaults to OpenStreetMap with visible attribution and normal browser caching. Configure REACT_APP_MAP_TILE_URL and REACT_APP_MAP_ATTRIBUTION for another tile provider. No tile prefetching or bulk download is performed. See https://operations.osmfoundation.org/policies/tiles/ and https://leafletjs.com/reference-1.9.4.html .

Grower names in Tracking Sessions open a scoped NDM grower account dialog with mugshot, contact/account fields, last-uploaded app version and associated projects. Explicit and former project assignments are distinguished from project session activity. Missing grower links are shown as unavailable. Review captures remains a separate action.

The /growers route now opens the domain Growers module instead of mounting the legacy GrowerProvider and /planter requests. It includes server-side search, organization scope, mugshots, date-only registration, capture review counts and the shared account dialog with projects and linked session history. The account view uses audited domain actions for transfers and project assignments; legacy editing endpoints are not invoked.

### Verify and project grower membership

Verify uses the NDM queue and decision API. Restored original workflow controls include small/large images, shift-click ranges, selected highlighting, page selection/reset, grower details, capture metadata, capture location, session maps, morphology/age, rejection presets and form reset after each review. Legacy webmap links based on old tree IDs are replaced by NDM coordinates/session geometry. No legacy Undo or automatic grower flagging is implied.

Use **Verify a session** inside Verify, **Verify this session** on a card, or the Tracking sessions link. **Change session** searches by grower, organization, project or UUID; **All sessions** clears that restriction. The sidebar displays the complete session UUID and whole-session counts/progress, grower/org/project, first/last capture times, capture span and available area above Selected captures. Summary counts refresh after a review. Approval records a pending matching event; publication to the matching queue is still a deployment dependency.

Projects → **Manage growers** (also in Edit project) lists assignments and eligible organization growers. Assign/remove requires `manage_projects` and a mandatory audit reason. Growers may belong to several projects. Removing a membership retains historical sessions/captures and the trail; reassignment records another event. Only active organization membership qualifies for an assignment, not a past session link. The trail includes authenticated actor, UTC time, action, reason and project-management/organization-transfer source. Organization transfers automatically record the project memberships they close. Existing membership dates remain visible without fabricating old audit actors.

Tracking sessions → Project opens Session project allocation; unassigned rows show Assign project. The same control is available above the decision panel in Verify's session summary. Search active projects in the session's organization, select another project or clear the allocation, and supply a reason. Manage-projects permission is required to save. The full session ID, current project and paged actor/time/reason/previous→new trail are visible. Corrections update session-based capture reporting without enrolling/removing the grower or changing verification. Stale changes are rejected and all affected domain views refresh after saving.

Automatic app-selected allocation still requires the Field Data upload contract and mobile client to send/validate `project_id`; the current upstream upload schema does not accept it. A grower having several projects must not cause an arbitrary automatic choice.

NDM verification does not offer legacy leaf/tree classification categories or remembered form choices. New submissions send only explicitly entered optional text tags; no classification tag is added automatically. The form resets after successful review.

### Organization capture tags and verification performance

Additional tags is a searchable multi-select with free text creation. Suggestions use only the current organization (or the single organization represented by the selection/page). With mixed organizations and no explicit scope, the picker is disabled rather than listing everyone's tags. Changing organization clears selected/pending tags. Already-used names are suggested, including legacy unowned public names only where the scoped API proves NDM usage by this organization. Optional Suggest tags used in this project narrows suggestions; it does not change tag ownership. Another organization's public flag does not make its tags visible.

Tags are created/reused when approval succeeds; selecting/type-ahead does not write data. Uncommitted text is included at submission. No hidden classification tags are added. After the API confirms the transaction, form reset/success feedback is immediate and queue/session/tag refreshes run in the background. The API's batched writes reduced the dev 25-capture/two-tag test from 74.49 seconds to 4.12 seconds. Tree matching publication remains a separate dependency.

### Subscription quota usage

Subscription plans shows Projects, Captures and Growers used/allowed for the selected organization's current tier. Over-limit cards have red borders/text/bars and explicit Over quota text; a red account warning lists exceeded resources. At-limit usage is labeled At quota and is not treated as exceeding the limit. An Upgrade button selects the lowest higher tier that can accommodate all three current counts through the existing hosted Stripe confirmation flow. If none fits, the message directs the organization to Greenstand for more capacity. Members without billing permission are directed to their administrator.

Capture usage is the total managed dataset (pending/rejected included, raw and approved UUIDs counted once); growers match the organization's Growers list; archived projects count toward project usage. Missing plan or usage information shows an unavailable limit/error rather than a false zero or over-quota warning. Proposed allowances retain their existing proposed label. Refresh subscription and usage refreshes both sources. The feature displays warnings and guidance; it does not add quota blocking or change a subscription automatically.

### Share App (reused upstream feature)

The existing upstream feature is `src/views/ShareAppView.js` (introduced in commit `6bc930b0691678a5de985f00fbbad5112e2d023f`), with link generation in `src/common/shareLink.js` and Android app/install-referrer routing in `public/app.html`. Verified upstream source: https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/src/views/ShareAppView.js .

The `/share-app` route now uses `features/domain/ShareApp.js` to resolve the selected/approved Stakeholder organization through the scoped domain API, then embeds the original screen. It reuses the upstream layout, copy notification, QR canvas and 300×300 PNG download; it does not duplicate those implementations. Platform administrators can select an organization, and organization users use their approved organization. The menu entry is enabled for domain organization access rather than requiring a numeric claim on the platform administrator's account.

The current mobile link contract is `app.html?org_name=...&org_id=<numeric ID>`. The adapter uses Stakeholder's existing `keycloak_organization_id` mapping for this mobile-facing numeric value; it never substitutes a UUID or creates a legacy entity. Missing mapping/name blocks invite generation with an explanatory message. The supplied organization bypasses the legacy organization API. Both link and QR update when the organization ID changes, even when names are identical.

`REACT_APP_SHARE_APP_BASE` can point to a publicly reachable existing app redirect page. Local dev is configured privately to use `https://dev-beta-admin.treetracker.org/app.html` (HTTP 200 verified); this avoids phone invites pointing to localhost. Deployment defaults to its own origin's existing `/app.html`. Local-only URLs show a warning. No database, Keycloak or mobile application changes were made. Physical device installation/join behavior remains the upstream app contract.

Validation: 20 tests pass across the reused view, domain adapter, link builder and redirect page; changed-source lint and production build pass. Tests cover copy, PNG export, no legacy lookup with supplied Stakeholder data, ID changes with unchanged names, missing selection/mapping, URL encoding, app deep link and Play install referrer. The browser preview reaches the existing Keycloak sign-in page; authenticated visual verification requires sign-in.

## Independent Herbarium names

The global Herbarium and scoped Species tables display `herbarium_name` (eight uppercase letters) separately from `scientific_name` (full Latin name). The editor offers an explicit first-four-genus plus first-four-species suggestion when possible. Historical codes remain unchanged when taxonomy is edited. Missing botanical names show Not recorded; imported labels remain read-only provenance. Search and verification choices support both names. Deploy the Herbarium name-split migration before this client/API change.

BDD acceptance specifications and traceability: [features/domain](../features/domain/README.md). The new specifications have syntax validation, not browser step automation.

## Allocated verification species and binding compatibility

Verify reads `/species-choices`, not the global catalogue used by catalogue allocation screens. It follows each capture's project override, organization allocation and default fallback; saved empty scopes remain empty. Mixed-project selections use the intersection of permitted species. Scope changes clear the draft species. The server revalidates submitted species against the actual selected capture contexts.

Org binding retains the existing request component and approve/reject service, with Requests and Organizations tabs. The Organizations tab uses the NDM Stakeholder view. Both the retained `/organization-management` URL and Org binding open the workflow. Binding requests use `REACT_APP_DOMAIN_API_ROOT` when configured, falling back to the existing API root, so local login tokens are sent to the matching local API. Runtime local settings must point both API roots at the same matching API when testing retained legacy views too.

Read-only browser validation: authenticated binding screen showed No pending requests, NDM organizations loaded, and ESEA verification choices displayed its single allocated species. No real binding decisions or capture approvals were made during this check.


### Explicit ownerless capture allocation (27 November 2026)

Grower organization changes remain Greenstand-admin only, including first allocation. The dialog previews eligible ownerless/projectless sessions and processed captures, warns that raw/processed counts overlap, and requires explicit confirmation. An optional active destination project assigns the eligible sessions. A membership-only save never adopts observations implicitly. Already owned data and tree/token-linked assets are excluded; changing membership does not transfer those assets. Same-organization allocation is allowed when ownerless observations remain. The transaction records exact affected IDs and previous ownership in the transfer trail and rejects stale previews. Existing session/project corrections are now restricted to Greenstand admins in both UI and API. Project membership management is distinct from historical observation ownership.

Greenstand admins can separately select `reallocate_existing` to include existing organization/project allocations in the preview. This requires the same destination-bound confirmation and audit; changing the mode clears UI confirmation. Tree/token-linked assets and sessions containing another grower's processed captures remain excluded in both modes. Unchecking the option preserves existing allocations.

Local development routing: on loopback hosts in development mode, the domain client can read `/domain-api-config.local.json` with `domainApiRoot` pointing to a loopback HTTP API. This untracked per-machine file allows a running CRA development panel (including port 3002) to use the current backend without restarting a separate older API. Production ignores this override and uses the build-time API environment. Missing or invalid local configuration falls back to the environment root. No tokens or credentials belong in this file.
