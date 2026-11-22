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

Sessions show compact UTC dates, grower and organization names, counts, review states, duration and recorded polygon area. Review captures opens details and location links. Verification submission still needs its domain-service workflow.

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

The /growers route now opens the domain Growers module instead of mounting the legacy GrowerProvider and /planter requests. It includes server-side search, organization scope, mugshots, date-only registration, capture review counts and the shared account dialog with projects and linked session history. The new account view is read-only; legacy editing endpoints are not invoked.

### Verify and project grower membership

Verify uses the NDM queue and decision API. Restored original workflow controls include small/large images, shift-click ranges, selected highlighting, page selection/reset, grower details, capture metadata, capture location, session maps, morphology/age, rejection presets and form reset after each review. Legacy webmap links based on old tree IDs are replaced by NDM coordinates/session geometry. No legacy Undo or automatic grower flagging is implied.

Use **Verify a session** inside Verify, **Verify this session** on a card, or the Tracking sessions link. **Change session** searches by grower, organization, project or UUID; **All sessions** clears that restriction. The sidebar displays the complete session UUID and whole-session counts/progress, grower/org/project, first/last capture times, capture span and available area above Selected captures. Summary counts refresh after a review. Approval records a pending matching event; publication to the matching queue is still a deployment dependency.

Projects → **Manage growers** (also in Edit project) lists assignments and eligible organization growers. Assign/remove requires `manage_projects` and a mandatory audit reason. Growers may belong to several projects. Removing a membership retains historical sessions/captures and the trail; reassignment records another event. Only active organization membership qualifies for an assignment, not a past session link. The trail includes authenticated actor, UTC time, action, reason and project-management/organization-transfer source. Organization transfers automatically record the project memberships they close. Existing membership dates remain visible without fabricating old audit actors.

Tracking sessions → Project opens Session project allocation; unassigned rows show Assign project. The same control is available above the decision panel in Verify's session summary. Search active projects in the session's organization, select another project or clear the allocation, and supply a reason. Manage-projects permission is required to save. The full session ID, current project and paged actor/time/reason/previous→new trail are visible. Corrections update session-based capture reporting without enrolling/removing the grower or changing verification. Stale changes are rejected and all affected domain views refresh after saving.

Automatic app-selected allocation still requires the Field Data upload contract and mobile client to send/validate `project_id`; the current upstream upload schema does not accept it. A grower having several projects must not cause an arbitrary automatic choice.

NDM verification does not offer legacy leaf/tree classification categories or remembered form choices. New submissions send only explicitly entered optional text tags; no classification tag is added automatically. The form resets after successful review.
