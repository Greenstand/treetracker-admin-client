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
