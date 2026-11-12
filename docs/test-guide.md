# New Admin Panel: test guide (dev)

## 1. What you are testing

The Admin Panel is the Greenstand web tool to verify tree captures and to manage organizations, growers, species and wallets. The new version brings one Greenstand account for everyone (Keycloak, the same login as the wallet app, with Google or GitHub sign-in), self-service for organizations (apply for a new one, or join an existing one) and three roles: Greenstand admin, organization member, wallet admin.

You test on **dev**: test data, same code as the release, click freely. Production is https://beta-admin.treetracker.org, do not test there.

## 2. Quick start

1. Open https://dev-beta-admin.treetracker.org
2. Click **Register**, or sign in with **Google** or **GitHub**. You land on Home.
3. Post your username and the role you want in Slack (https://greenstand.slack.com/archives/C8W6GT9MZ). Mahdi assigns it.
4. Run the tests of section 5 for your role. Report problems as in section 6.

## 3. Roles

| Role                        | For                               | Menu you see                                                     | How to get it                                  |
| --------------------------- | --------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------- |
| none                        | every new account                 | Home, Account                                                    | automatic                                      |
| `greenstand-admin`          | Greenstand staff                  | Home, Verify, Captures, Growers, Species, Organizations, Account | ask in Slack                                   |
| `org` (organization member) | people of a planting organization | Home, Verify, Captures, Growers, Share App, Account              | apply for an organization or join one (F2, F3) |
| `wallet-admin`              | wallet management                 | Home, Wallets, Account                                           | ask in Slack                                   |

Everyone tests with their own account. There are no shared passwords.

## 4. Good to know

- The version number is on the Home page. Put it in every report.
- Menu hidden? Click the three lines at the top left. Log out: **Account**, **LOG OUT**.
- "You are not authorized to view this page" on a page outside your menu is correct.
- Put your name in what you create, for example an organization `test-anna-1`. Do not edit what is not yours. Approving or rejecting captures on dev is fine.

## 5. What is ready

| #   | Feature                                      | Role                      | Definition (BDD)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Video                                                                                                                                                                                                                                           |
| --- | -------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1  | Account: register, sign in, update, password | any                       | [registration](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/account/registration.feature), [update-account](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/account/update-account.feature), [change-password](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/account/change-password.feature), [forgot-password](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/account/forgot-password.feature) | [Google and GitHub sign-in](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/reports-manual/github-google-oauth-keycloak.mp4)                                                                                               |
| F2  | Apply for an organization                    | new account               | [organization](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/organization/organization.feature)                                                                                                                                                                                                                                                                                                                                                                                                | [organization](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/reports/video/organization/run.mp4)                                                                                                                         |
| F3  | Join an existing organization                | new account + admin       | [org-binding](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/organization/org-binding.feature)                                                                                                                                                                                                                                                                                                                                                                                                  | [approved](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/reports/video/org-binding/run.mp4), [rejected](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/reports/video/org-binding-rejected/run.mp4) |
| F4  | Organizations, Verify, Species               | `greenstand-admin`        | [admin](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/greenstand-admin/admin.feature), [species-management](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/species-management.feature)                                                                                                                                                                                                                                                                          | [species](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/reports/video/species-management/run.mp4)                                                                                                                        |
| F5  | Verify and Share App of my organization      | `org`                     | [organization](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/organization/organization.feature)                                                                                                                                                                                                                                                                                                                                                                                                | [organization](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/reports/video/organization/run.mp4)                                                                                                                         |
| F6  | Wallets: list, detail, bind an account       | `wallet-admin`            | [wallet/admin](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/wallet/admin.feature)                                                                                                                                                                                                                                                                                                                                                                                                             | [wallet-admin](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/reports/video/wallet-admin/run.mp4)                                                                                                                         |
| F7  | Home cards: captures and growers counts      | `greenstand-admin`, `org` | [home](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/home.feature)                                                                                                                                                                                                                                                                                                                                                                                                                             | [home](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/reports/video/home/run.mp4)                                                                                                                                         |
| F8  | Captures page                                | `greenstand-admin`, `org` | [capture](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/capture.feature)                                                                                                                                                                                                                                                                                                                                                                                                                       | [capture](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/reports/video/capture/run.mp4)                                                                                                                                   |
| F9  | Growers page                                 | `greenstand-admin`, `org` | [grower](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/grower.feature)                                                                                                                                                                                                                                                                                                                                                                                                                         | [grower](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/reports/video/grower/run.mp4)                                                                                                                                     |

Each test says what to click and what you see. Anything different is a finding.

### F1. Account (any account)

1. Sign in with a wrong password. You see: "Invalid username or password." With the right one: Home, with the menu of your role.
2. **Account**, **UPDATE ACCOUNT**, change your last name, Submit. You see: "Your account information has been updated."
3. **Account**, **CHANGE**, new password twice, Submit. You see: "Your password has been changed." Keycloak may first ask your current password.
4. **LOG OUT**, open the panel again. You see: the sign-in page. The old password is refused, the new one opens Home.
5. **Forgot Password?**, your email, Submit. You see: "You should receive an email shortly with further instructions." and the email in your mailbox (real addresses only).
6. Register again with the same username or email. You see: "Username already exists." or "Email already exists."

### F2. Apply for an organization (new account, no organization yet)

1. Home, click "Apply to become a Greenstand associated organization". You see: the form (Organization Name, Email, Phone Number, Map Name, Website, Logo URL).
2. **Create Organization** with the form empty. You see: "Organization name is required", "Email is required".
3. Fill in a name with your name in it, and an email, **Create Organization**. You see: Home with "You are the member of organization: <name>" and the organization menu, no new login.
4. **Verify** and **Growers**. You see: empty lists, a new organization has nothing yet.

There is no approval step, the organization exists at once. This is intended for now.

### F3. Join an existing organization (new account, plus a Greenstand admin)

1. Home, click "Request to bind to an existing organization", choose an organization, **Submit Request**. You see: "You are waiting for approval of organization binding: <organization>".
2. As admin: **Organizations**, tab **Users requesting to bind to an organization**, **Approve**. You see: the row disappears.
3. Sign in with the first account again. You see: Home with "You are the member of organization: <organization>" and the organization menu.
4. Same with another new account and **Reject**. You see: Home shows the two links again, and the bind page says "Your request to join <organization> was rejected" and lets you ask again.

### F4. Greenstand admin (`greenstand-admin`)

1. **Organizations**, tab **Organizations**. You see: the list, "Search by name or phone", a sort box, an Edit column. Search and sort: the list follows. **Edit** your organization from F2, change Map Name, Save: "Organization updated".
2. **Verify**. You see: the captures "Awaiting Verification", their count and the filters. Click two captures: the panel "Selected Captures". **APPROVE**, **SUBMIT**: they leave the list and show under Verification Status = Approved. Same with **REJECT** and a reason. The Organization filter shows only that organization's captures.
3. **Species**. You see: the list with the "Tagged Captures" column. Open a species, change the description, save, reopen: the new text. Press F5: the list loads again.

### F5. Organization member (`org`)

1. **Verify**. You see: only your organization's captures. The Organization filter offers only "All" and your organization.
2. **Share App**. You see: "Here is your link to share with your planter", the link, **copy**, the QR code and **download your QR code**. Copy: "copied", the link ends with `org_name=...&org_id=...`. Download: "Downloading your QR code..." and an image file.
3. Type /organization-management, /species and /wallets after the panel address. You see: "You are not authorized to view this page".

### F6. Wallet admin (`wallet-admin`)

1. **Wallets**. You see: the list "1-25 of ...", "Search by name", a sort box. Search, sort, next page: the list follows, and the address keeps page, search and sort (for example `/wallets?page=1`).
2. Open a wallet. You see: Name, "Keycloak id", "Keycloak account" and **Bind Keycloak Account**. Browser Back: the list, on the same page.
3. On a wallet with an empty "Keycloak id", **Bind Keycloak Account**. You see: the dialog "Bind keycloak account" with "Search by email or user name". A text that matches nobody: "No accounts found." Part of your username, click your account, **Bind**: the dialog closes and the page shows your account.
4. Optional: open https://wallet-dev.treetracker.org with your account. The wallet is listed there.
5. Type /verify, /species and /organization-management after the panel address. You see: "You are not authorized to view this page".

Bind only wallets with an empty "Keycloak id", so you do not take a wallet away from another account.

### F7. Home cards (`greenstand-admin` and `org`)

1. **Home** as Greenstand admin. You see: four cards with a number each: "Total Captures", "Untagged Captures", "Verified Captures", "Growers".
2. **Home** as organization member. You see: the same four cards with your organization's numbers, each smaller than or equal to the admin's.

### F8. Captures page (`greenstand-admin` and `org`)

1. **Captures**. You see: the table (Capture ID, Grower ID, Device Identifier, Planter Identifier, Verification Status, Species, Token ID, Capture Tags, Notes, Created, Longitude, Latitude, Image URL), "1-25 of ..." and a **Filter** button with a badge "2" (two filters are on by default).
2. Click **Filter**: the panel hides, click again: it is back. Change a filter, **Apply**: the table follows and the badge counts the active filters.
3. Click a column title, change rows per page, next page: the table follows.
4. Click a row (not the Capture ID link). You see: the capture window with Capture Data, Country, Species and Tags.
5. **Export Captures**. You see: "Select the columns to download:". Cancel.
6. As organization member: only your organization's captures ("0-0 of 0" for a new one).

### F9. Growers page (`greenstand-admin` and `org`)

1. **Growers**. You see: the filters (Grower ID, Person ID, Device ID, Organization, First Name, Last Name, Email, Phone Number), one card per grower with photo, name and "ID: ...", and "1-24 of ...".
2. First Name = a name, **Apply**: only matching growers. **Reset**: all again. Rows per page, next page: the cards follow.
3. Click a card. You see: the window "Grower Detail" with Email address, Phone number, Person ID, Organization, Country, Registered and Device Identifier. Close it.
4. As organization member: only your organization's growers.

## 6. Report a problem

1. Check the open issues first, it may be known: https://github.com/Greenstand/treetracker-admin-client/issues
2. Panel problem (screens, buttons, texts): new issue in [treetracker-admin-client](https://github.com/Greenstand/treetracker-admin-client/issues/new). Server error or wrong data behind the panel: [treetracker-admin-api](https://github.com/Greenstand/treetracker-admin-api/issues/new). Not sure: the panel repository.
3. Title short and precise, for example "Verify: reject with reason Dead does not remove the capture". Text: your steps, what you expected, what you saw (screenshot), your username, role, time and panel version. Never paste a password.
4. Not sure it is a bug? Ask in the Slack channel first.

## 7. For developers

| Item        | Value                                                                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Panel       | https://dev-beta-admin.treetracker.org, branch `keycloak`                                                                                          |
| Admin API   | https://dev-k8s.treetracker.org/api/keycloak-admin, [treetracker-admin-api](https://github.com/Greenstand/treetracker-admin-api) branch `keycloak` |
| Login       | Keycloak 23, https://dev-k8s.treetracker.org/keycloak, realm `treetracker`, client `treetracker-admin-client-fe`                                   |
| Wallet API  | https://dev-k8s.treetracker.org/wallet/keycloak                                                                                                    |
| Roles       | realm roles `greenstand-admin`, `org`, `wallet-admin`; the organization is the user attribute `organization_id`                                    |
| BDD tests   | folder `features/` on branch `keycloak`, how to run: README section "BDD Tests"                                                                    |
| Design note | [docs/organization-onboarding.md](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/docs/organization-onboarding.md)            |

Questions about accounts, roles or access: Mahdi on Slack.
