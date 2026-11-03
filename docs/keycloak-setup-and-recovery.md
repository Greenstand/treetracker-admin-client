# Admin Client: Keycloak Setup and Recovery

This guide covers the Keycloak-based admin client: local configuration, development login, role and organization access, account recovery, and BDD prerequisites.

It applies to the `keycloak` branch. The `master` branch may use a different authentication and API configuration.

For general project setup, available scripts, testing commands, and contribution guidance, see the repository [README](../README.md). This document supplements the README with Keycloak-specific configuration, roles, test-account access, and recovery guidance. The related README documentation is being tracked in [PR #1269](https://github.com/Greenstand/treetracker-admin-client/pull/1269).

## Service overview

When the admin client runs locally, the frontend normally uses the shared development services:

| Service      | Development endpoint                                 |
| ------------ | ---------------------------------------------------- |
| Admin client | `http://localhost:3001`                              |
| Keycloak     | `https://dev-k8s.treetracker.org/keycloak`           |
| Admin API    | `https://dev-k8s.treetracker.org/api/keycloak-admin` |
| Wallet API   | `https://dev-k8s.treetracker.org/wallet/keycloak`    |

Starting the frontend locally does not start the remote Keycloak or API services.

## Configuration

The Keycloak values are read at build time from `.env.development`:

```env
REACT_APP_KEYCLOAK_URL=https://dev-k8s.treetracker.org/keycloak
REACT_APP_KEYCLOAK_REALM=treetracker
REACT_APP_KEYCLOAK_CLIENT_ID=treetracker-admin-client-fe
```

The same environment file configures the API roots:

```env
REACT_APP_API_ROOT=https://dev-k8s.treetracker.org/api/keycloak-admin
REACT_APP_WALLET_API_ROOT=https://dev-k8s.treetracker.org/wallet/keycloak
```

These are frontend configuration values. User passwords, client secrets, bearer tokens, and other private credentials are provided through the team’s approved access process.

The implementation reads these values in `src/auth/keycloak.js` and attaches the Keycloak access token to protected API requests through `src/api/httpClient.js`.

## Local setup

1. Check out the Keycloak branch:

   ```bash
   git switch keycloak
   ```

2. Confirm `.env.development` contains the correct development values.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run start:dev
   ```

5. Open:

   ```text
   http://localhost:3001
   ```

If the app redirects to an unexpected realm or API, inspect the loaded environment file before troubleshooting the account.

## Keycloak client and redirect URI

The Keycloak client used by the admin app is:

```text
treetracker-admin-client-fe
```

The client must allow the local application URL according to the realm’s client policy. A typical local redirect pattern is:

```text
http://localhost:3001/*
```

The exact redirect URI must match the Keycloak client configuration. A mismatch can cause login to fail after the credentials are accepted.

## Authentication flow

The client uses `keycloak-js` with:

- Realm: `treetracker`.
- Client: `treetracker-admin-client-fe`.
- PKCE: `S256`.
- Startup session check: `check-sso`.
- Access-token refresh before expiry.

Unauthenticated users are redirected to Keycloak. After login, Keycloak returns the browser to the admin client, which initializes the application session and sends requests with:

```http
Authorization: Bearer <access-token>
```

When token refresh fails, the client clears the local authentication state and redirects back to login. The current implementation disables Keycloak’s login iframe check, so a stale browser session may require an explicit sign-out and sign-in.

## Roles and organization access

Keycloak authentication and application authorization are separate. A user can successfully sign in but still lack access to particular menus or API operations.

Confirm the exact role names in the `treetracker` realm. Common access areas include:

- Platform administration.
- Organization management.
- Wallet administration.
- Verify and capture access.
- Organization-scoped features.

Organization-scoped features also require the appropriate organization membership or organization claim. If the user can log in but expected menu items are missing, check roles and organization access before resetting the password.

## Development test account

A maintainer with Keycloak administration access can prepare a test account as follows:

1. Open the Keycloak administration console.
2. Select the `treetracker` realm.
3. Create or select a development user.
4. Set or reset the password.
5. Assign the required realm or client roles.
6. Add organization membership when testing organization-scoped features.
7. Sign in at `http://localhost:3001`.
8. Confirm that the expected menu items and protected pages are available.

The shared development admin site is available at:

```text
https://dev-admin.treetracker.org/
```

For the current shared test-account details, refer to the pinned `admin_panel` Slack message or request the current details from a maintainer. If the account no longer works, ask a maintainer to reset or replace it.

## Keycloak administration

Maintainers with the appropriate access can open the Keycloak administration console at:

```text
https://dev-k8s.treetracker.org/keycloak/admin/master/console/
```

The console initially opens the `master` realm. Select `treetracker` before managing admin-client users, roles, or organization-related access.

## Account recovery

Use the following recovery path:

| Symptom                             | Check or action                                                      |
| ----------------------------------- | -------------------------------------------------------------------- |
| Invalid username or password        | Reset the user password in Keycloak.                                 |
| Account locked or disabled          | Unlock or enable the user.                                           |
| Login succeeds but access is denied | Verify realm/client roles and organization membership.               |
| Redirect error                      | Verify the realm, client ID, and registered redirect URI.            |
| Stale or expired browser session    | Sign out, clear the browser session if necessary, and sign in again. |
| Token refresh failure               | Confirm Keycloak is reachable, then start a new login session.       |
| All admin accounts unavailable      | Use the team’s approved maintainer recovery process.                 |

## Troubleshooting checklist

Before reporting an authentication problem, verify:

- The intended `keycloak` branch is checked out.
- `npm run start:dev` is loading `.env.development`.
- The Keycloak URL, realm, and client ID are correct.
- The local redirect URI is registered for `treetracker-admin-client-fe`.
- The configured Admin API is reachable.
- The user is enabled and not locked.
- Required roles are assigned.
- Organization membership is configured where required.
- The browser is not using a stale session.
- `401` responses are treated as authentication/session problems and `403` responses as permission problems, unless the API documents a more specific error.

## BDD and test references

BDD scenarios are stored under `features/` and run against a live application. Before running them, confirm the required browser driver, frontend, Keycloak instance, API services, credentials, and test data are available.

Generated videos and reports are useful for diagnosing login and protected-page failures. Store them through the team’s normal test-report process and do not use them as a substitute for documenting repeatable setup steps.
