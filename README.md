# Greenstand Treetracker Admin Panel

The Treetracker Admin Panel is the operational dashboard used to review, verify, process, and manage data collected through the Treetracker ecosystem.

The platform currently supports workflows including:

- Tree verification
- Capture review and quality assurance
- Planter and grower administration
- Earnings and payment review
- Reporting and exports
- Data analysis and operational oversight

This repository contains the React-based frontend application for the Admin Panel.

The platform is built using:

- React
- Material UI
- Redux
- REST APIs and Greenstand microservices

---

## Current Stack

- React
- Material UI
- Redux
- Jest
- Cypress
- Storybook
- REST APIs
- Docker (optional)

---

## Architecture Overview

The Admin Panel frontend communicates with several Greenstand backend services through REST APIs.

Typical flow:

Treetracker Mobile App  
→ Greenstand APIs  
→ Admin Panel  
→ Verification / Reporting / Management workflows

The platform is gradually transitioning toward a more service-oriented architecture.

---

## Related Services

The Admin Panel integrates with multiple Greenstand services including:

- treetracker-api
- treetracker-query-api
- treetracker-field-data
- treetracker-earnings-api
- treetracker-stakeholder-api
- treetracker-regions-api
- treetracker-reporting

API specifications can typically be found in the `docs/api/spec` directory of each service repository.

---

## Future Platform Direction

The Admin Panel is actively evolving and future functionality may include:

- organization management
- project management
- regional administration
- stakeholder coordination
- advanced reporting and analytics
- operational dashboards
- permissions and role management
- API integrations and exports

Contributors are encouraged to propose workflow, usability, and UX improvements.

---

## Quick Start (Frontend Development)

Most contributors only need the frontend running locally.

```bash
git clone https://github.com/<your-username>/treetracker-admin-client
cd treetracker-admin-client
npm install
npm start
```

Then open:

http://localhost:3001

The frontend connects to shared development APIs by default.

---

# Development Environment Setup

## Step 1: Install Git

See:

https://git-scm.com/downloads

---

## Step 2: Install Node.js

Recommended versions:

- Node.js 18 LTS (preferred)
- Node.js 16 LTS (legacy compatibility)

We recommend using `nvm` to manage Node.js versions.

If you encounter dependency or build issues, try switching between Node 18 and Node 16 before troubleshooting further.

Install nvm:

```bash
touch ~/.profile
touch ~/.zshrc

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Install Node.js:

```bash
nvm install 18
nvm use 18
```

Alternatively:

https://nodejs.org/

---

## Step 3: Fork and Clone this Repository

Fork this repository to your GitHub account.

Then clone it locally:

```bash
git clone https://github.com/<your-username>/treetracker-admin-client
```

Move into the project directory:

```bash
cd treetracker-admin-client
```

Add Greenstand as upstream:

```bash
git remote add upstream https://github.com/Greenstand/treetracker-admin-client
```

---

## Step 4: Environment Variables

Most contributors do not need additional configuration.

If you are running backend services locally, create a `.env.local` file:

```env
REACT_APP_API_ROOT=http://localhost:3000
```

Additional environment variables may be required depending on the services you are working with.

---

## Step 5: Install Dependencies

```bash
npm install
```

---

## Step 6: Start the Client

```bash
npm start
```

---

## Step 7: Open the Admin Panel

Visit:

http://localhost:3001

Development credentials and environment access are provided through the contributor onboarding process.

If you need access, ask in the `#admin_panel_chat` Slack channel.

---

# Ways to Contribute

Contributors are welcome across multiple areas:

- Frontend React development
- UI/UX improvements
- Verification workflows
- Reporting and analytics
- API integration
- Accessibility improvements
- Documentation
- Testing and QA

You do not need to understand the entire Greenstand ecosystem before contributing.

---

# Recommended First Contributions

Good starting points include:

- UI cleanup
- improving responsiveness
- fixing accessibility issues
- improving loading states
- documentation improvements
- Storybook cleanup
- test coverage improvements

You can also look for:

- `good first issue`
- `size: small`
- `help wanted`

labels in GitHub issues.

---

# Getting an Issue Assigned

1. Browse the open GitHub issues
2. Comment on an issue you would like to work on
3. Ask questions if requirements are unclear
4. A maintainer will assign the issue and help guide you if needed

If you are unsure where to start, ask in the `#admin_panel_chat` Slack channel.

---

# Working on an Issue

1. Create a feature branch
2. Make your changes
3. Test locally
4. Push changes to your fork
5. Open a Pull Request into `master`
6. Include screenshots or videos where relevant
7. Address review feedback if requested

Please keep separate issues on separate branches.

---

# Commit Message and PR Title Format

We use automatic semantic versioning.

Please follow the Conventional Commits format:

```text
feat(account): add organization filter
```

This also applies to Pull Request titles.

See:

https://www.conventionalcommits.org/

---

# Keeping Your Fork in Sync

Update your local master branch:

```bash
git checkout master
git pull upstream master --rebase
git push origin master
```

Rebase feature branches if necessary:

```bash
git checkout <feature_branch>
git pull upstream master --rebase
git push origin <feature_branch> --force
```

---

# Code Style Guide

We follow the Airbnb JavaScript style guide.

Formatting is enforced using Prettier.

## Core Rules

- 2-space indentation
- semicolons required
- single quotes preferred
- trailing commas allowed
- lowerCamelCase for variables/functions
- UpperCamelCase for classes

Example:

```js
const adminUser = db.query('SELECT * FROM users');
```

Run formatting manually:

```bash
npm run prettier
```

---

# Testing

We use Jest and React Testing Library for unit testing.

Run tests:

```bash
npm test
```

## Cypress

To run Cypress tests, create:

```text
/cypress/fixtures/login.json
```

containing valid credentials.

---

# Logging

We use `loglevel` for browser logging.

Example:

```js
import * as loglevel from 'loglevel';

const log = loglevel.getLogger(
  '../components/TreeImageScrubber'
);

log.debug('render TreeImageScrubber...');
```

Default log level is configured in:

```text
./src/init.js
```

Browser log levels can be overridden using localStorage.

---

# Material UI

The project uses Material UI with a customized theme.

Theme configuration:

```text
./src/components/common/theme.js
```

Please check theme overrides before modifying component behavior.

---

# Storybook

Storybook is used for isolated UI component development.

Run:

```bash
npm run storybook
```

Then open:

http://localhost:9009

Stories are located in:

```text
./src/stories/
```

---

# Known Development Issues

Current areas under active transition include:

- API migration between legacy and newer services
- authentication and environment configuration
- Docker-based local infrastructure
- some older Storybook components

Contributors are encouraged to ask questions in Slack when blocked.

---

# Advanced Local Infrastructure Setup (Experimental)

For developers who need a completely local environment:

- PostgreSQL + PostGIS
- local APIs
- docker-compose infrastructure
- database migrations

This setup is optional and not required for most frontend contributors.

---

# Docker Setup

## Install Docker

Documentation:

https://docs.docker.com/get-docker/

---

## Build and Start Containers

```bash
./dev/scripts/setup.sh
```

View the application:

http://localhost:8080

---

## Logs

```bash
docker logs -f treetracker-admin-web
docker logs -f treetracker-admin-api
```

---

## Shutdown

```bash
./dev/scripts/down.sh
```

Restart:

```bash
./dev/scripts/up.sh
```

---

# Troubleshooting

If you encounter setup issues:

https://github.com/Greenstand/treetracker-admin/wiki/Set-Up-Issues

Please help improve troubleshooting documentation when you solve issues.

---

# Useful Scripts

Scripts are located in:

```text
/dev/scripts
```

Examples:

- `install.sh`
- `build.sh`
- `up.sh`
- `down.sh`
- `logs-api.sh`
- `logs-web.sh`

---

# Screenshots

Add screenshots or GIFs showing:

- Dashboard
- Verification workflow
- Reporting tools
- Review interfaces
- Analytics views

Visual documentation greatly improves onboarding.

---

# Further Reading

- https://github.com/Greenstand/Development-Overview
- https://docs.greenstand.org/
