# New Admin Panel: test guide (dev)

## 1. What you are testing

The Admin Panel is the Greenstand web tool to verify tree captures and to manage organizations, growers, species and wallets.

The new version brings:

- one Greenstand account for everyone (Keycloak), the same login as the wallet app, with Google or GitHub sign-in,
- self-service for organizations: apply for a new one, or join an existing one,
- three roles: Greenstand admin, organization member, wallet admin.

You test on the **dev** environment. It has test data and the same code as the release.
Click freely, nothing reaches real data. Do not test on https://beta-admin.treetracker.org, that is production.

## 2. Quick start

1. Open https://dev-beta-admin.treetracker.org
2. Click **Register** (or sign in with **Google** or **GitHub**). You land on Home.
3. Post your username and the role you want in Slack (https://greenstand.slack.com/archives/C8W6GT9MZ). Mahdi assigns it.
4. Run the tests of section 5 for your role.
5. Report problems on GitHub (section 6).

## 3. Roles

| Role                        | For                               | Menu you see                                                     | How to get it                                                 |
| --------------------------- | --------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------- |
| none                        | every new account                 | Home, Account                                                    | automatic                                                     |
| `greenstand-admin`          | Greenstand staff                  | Home, Verify, Captures, Growers, Species, Organizations, Account | ask in Slack                                                  |
| organization member (`org`) | people of a planting organization | Home, Verify, Captures, Growers, Share App, Account              | apply for an organization or join one yourself (tests F2, F3) |
| `wallet-admin`              | wallet management                 | Home, Wallets, Account                                           | ask in Slack                                                  |

Everyone tests with their own account. There are no shared passwords, and the Keycloak administration login is not part of this guide.

## 4. Before you start

- Your menu shows only the pages that are ready for your role.
- The version number is on the Home page. Put it in every report.
- Menu missing? Click the three lines at the top left.
- Log out: menu **Account**, button **LOG OUT**.
- "You are not authorized to view this page" on a page that is not in your menu is correct.
- Put your name in what you create, for example an organization `test-anna-1`. Do not edit what is not yours.
- Approving or rejecting captures on dev is fine.

## 5. What is ready

| #   | Feature                                      | Role                      | Definition (BDD)                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Video                                                                                                                                                                                                                                           |
| --- | -------------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1  | Account: register, sign in, update, password | any                       | [registration](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/registration.feature), [update-account](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/update-account.feature), [change-password](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/change-password.feature), [forgot-password](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/forgot-password.feature) | [Google and GitHub sign-in](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/reports-manual/github-google-oauth-keycloak.mp4)                                                                                               |
| F2  | Apply for an organization                    | new account               | [organization](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/organization.feature)                                                                                                                                                                                                                                                                                                                                                                             | [organization](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/reports/video/organization/run.mp4)                                                                                                                         |
| F3  | Join an existing organization                | new account + admin       | [org-binding](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/org-binding.feature), [org-binding-rejected](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/org-binding-rejected.feature)                                                                                                                                                                                                                                           | [approved](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/reports/video/org-binding/run.mp4), [rejected](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/reports/video/org-binding-rejected/run.mp4) |
| F4  | Organizations, Verify, Species               | `greenstand-admin`        | [admin](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/admin.feature), [species-management](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/species-management.feature)                                                                                                                                                                                                                                                           | [species](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/reports/video/species-management/run.mp4)                                                                                                                        |
| F5  | Verify and Share App of my organization      | `org`                     | [organization](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/organization.feature)                                                                                                                                                                                                                                                                                                                                                                             | [organization](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/reports/video/organization/run.mp4)                                                                                                                         |
| F6  | Wallets: list, detail, bind an account       | `wallet-admin`            | [wallet/admin](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/wallet/admin.feature)                                                                                                                                                                                                                                                                                                                                                                             | [wallet-admin](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/reports/video/wallet-admin/run.mp4)                                                                                                                         |
| F7  | Home cards: captures and growers counts      | `greenstand-admin`, `org` | [home](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/home.feature)                                                                                                                                                                                                                                                                                                                                                                                             | [home](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/reports/video/home/run.mp4)                                                                                                                                         |
| F8  | Captures page                                | `greenstand-admin`, `org` | [capture](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/capture.feature)                                                                                                                                                                                                                                                                                                                                                                                       | [capture](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/reports/video/capture/run.mp4)                                                                                                                                   |
| F9  | Growers page                                 | `greenstand-admin`, `org` | [grower](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/features/grower.feature)                                                                                                                                                                                                                                                                                                                                                                                         | [grower](https://github.com/Greenstand/treetracker-admin-client/blob/keycloak/reports/video/grower/run.mp4)                                                                                                                                     |

Each test below says what to click and what you see. Anything different is a finding.

### F1. Account (any account)

1. Sign-in page: type your username and a wrong password. You see: "Invalid username or password."
2. Sign in with the right password. You see: Home, with the menu of your role.
3. **Account**, **UPDATE ACCOUNT**: change your last name, Submit. You see: "Your account information has been updated." and the new name.
4. **Account**, **CHANGE**: new password twice, Submit. You see: "Your password has been changed." If your login is older than 5 minutes, Keycloak first asks your current password.
5. **Account**, **LOG OUT**, then open the panel again. You see: the sign-in page, no automatic login.
6. Sign in with the old password: "Invalid username or password." With the new one: Home.
7. Sign-in page, **Forgot Password?**, your email, Submit. You see: "You should receive an email shortly with further instructions." and a reset email in your mailbox (real email addresses only).
8. Register again with your username or your email. You see: "Username already exists." or "Email already exists."

### F2. Apply for an organization (your own account, no organization yet)

1. Home: click "Apply to become a Greenstand associated organization". You see: the form "Apply for an organization" (Organization Name, Email, Phone Number, Map Name, Website, Logo URL).
2. Click **Create Organization** with the form empty. You see: "Organization name is required", "Email is required".
3. Fill in a name that contains your name, and an email. Click **Create Organization**. You see: Home with "You are the member of organization: <name>", the menu Home, Verify, Captures, Growers, Share App, Account, no new login.
4. Open **Verify** and **Growers**. You see: empty lists. A new organization has no captures and no growers.

There is no approval step, the organization exists at once. This is intended for now.

### F3. Join an existing organization (a new account, plus a Greenstand admin)

1. Home: click "Request to bind to an existing organization", choose an organization, **Submit Request**. You see: "You are waiting for approval of organization binding: <organization>".
2. As admin: **Organizations**, tab **Users requesting to bind to an organization**. You see: the request with **Approve** and **Reject**.
3. Click **Approve**. You see: the row disappears, no confirmation dialog.
4. Sign in with the first account again. You see: Home "You are the member of organization: <organization>" and the organization menu.
5. Repeat steps 1 and 2 with another new account and click **Reject**. Sign in with it. You see: Home shows the two links again, and the bind page says "Your request to join <organization> was rejected" and lets you ask again.

### F4. Greenstand admin (`greenstand-admin`)

Organizations

1. **Organizations**, tab **Organizations**. You see: the list with pages, "Search by name or phone", a sort box, an Edit column.
2. Search a part of a name, change the sort. You see: the list follows.
3. **Edit** the organization you created in F2, change Map Name, Save. You see: "Organization updated".

Verify

4. **Verify**. You see: the captures "Awaiting Verification", their count, and filters (Verification Status, dates, Grower ID, Capture ID, Species, Tag, Organization).
5. Click two captures. You see: the panel "Selected Captures" with them. On a phone a floating button opens the panel.
6. **APPROVE**, **SUBMIT**. You see: they leave the list. Set Verification Status = Approved: they are there.
7. Select others, **REJECT**, a reason (for example "Not a tree"), **SUBMIT**. You see: the same with Rejected.
8. Use the Organization filter. You see: only the captures of that organization.

Species

9. **Species** (from the menu). You see: the species list with the "Tagged Captures" column.
10. Open a species, change the description, save, reopen. You see: the new text.
11. Press F5 on the Species page. You see: the list loads again.

### F5. Organization member (`org`)

1. **Verify**. You see: only the captures of your organization. The Organization filter offers only "All" and your organization.
2. **Share App**. You see: "Here is your link to share with your planter", the link, a **copy** button, the QR code and **download your QR code**.
3. Click **copy**. You see: "copied". The link ends with `org_name=...&org_id=...`.
4. Click **download your QR code**. You see: "Downloading your QR code..." and an image file.
5. Type /organization-management, /species and /wallets after the panel address. You see: "You are not authorized to view this page".

### F6. Wallet admin (`wallet-admin`)

1. **Wallets**. You see: the list ("1-25 of ..."), "Search by name", a sort box, pages.
2. Search a part of a name, next page, rows per page. You see: the list follows.
3. Open a wallet. You see: Name, "Keycloak id", "Keycloak account" and the button **Bind Keycloak Account**.
4. Open a wallet with an empty "Keycloak id", click **Bind Keycloak Account**. You see: the dialog "Bind keycloak account" with "Search by email or user name".
5. Type a text that matches nobody. You see: "No accounts found."
6. Type a part of your own username, click your account, **Bind**. You see: the dialog closes, the detail page shows the Keycloak id, then your account name.
7. Optional: open https://wallet-dev.treetracker.org with your account. The wallet is listed there.
8. Type /verify, /species and /organization-management after the panel address. You see: "You are not authorized to view this page".

Bind only wallets with an empty "Keycloak id", so you do not take a wallet away from another account.

### F7. Home cards (`greenstand-admin` and `org`)

1. **Home** as Greenstand admin. You see: four cards with a number each: "Total Captures", "Untagged Captures", "Verified Captures", "Growers".
2. **Home** as an organization member. You see: the same four cards with the numbers of your organization only. Each number is smaller than, or equal to, the admin's number.

### F8. Captures page (`greenstand-admin` and `org`)

1. **Captures**. You see: a table of captures with the columns Capture ID, Grower ID, Device Identifier, Planter Identifier, Verification Status, Species, Token ID, Capture Tags, Notes, Created, Longitude, Latitude, Image URL, and pages at the bottom.
2. Click a column title, for example Created. You see: the table sorts by that column.
3. Change rows per page and go to the next page. You see: the table follows.
4. Click **Filter**. You see: the filter panel hides, click again and it is back. Set a filter and apply it. You see: the table follows and the Filter button shows the number of active filters.
5. Click a row. You see: the detail window of that capture with Capture Data, Country, the status, Species and Tags.
6. Click **Export Captures**. You see: the dialog "Export Captures" with "Select the columns to download:". Cancel.
7. Open **Captures** as an organization member. You see: only the captures of your organization.

### F9. Growers page (`greenstand-admin` and `org`)

1. **Growers**. You see: the title "Growers", a filter panel (Grower ID, Person ID, Device ID, Organization, First Name, Last Name, Email, Phone Number), one card per grower with the photo, the name and "ID: ...", and pages at the bottom.
2. Filter by First Name and submit. You see: only matching growers. Reset. You see: all growers again.
3. Change rows per page and go to the next page. You see: the cards follow.
4. Click a card. You see: the window "Grower Detail" with Email address, Phone number, Person ID, Organization, Country, Registered and the device identifiers.
5. Click the pencil icon in that window. You see: the dialog "Edit Grower" (First Name, Last Name, Grower-entered organization). Cancel.
6. Open **Growers** as an organization member. You see: only the growers of your organization. Empty for a new organization.

## 6. Report a problem

1. Check the open issues first, it may be known: https://github.com/Greenstand/treetracker-admin-client/issues
2. Open an issue:
   - panel (screens, buttons, texts): https://github.com/Greenstand/treetracker-admin-client/issues/new
   - server error or wrong data behind the panel: https://github.com/Greenstand/treetracker-admin-api/issues/new
   - not sure: use the panel repository.
3. Title: short and precise. Example: "Verify: reject with reason Dead does not remove the capture".
4. Text: what you did (numbered steps), what you expected, what you saw (screenshot), your username, role, time and panel version.
5. Never paste a password. Not sure it is a bug? Ask in the Slack channel first.

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
