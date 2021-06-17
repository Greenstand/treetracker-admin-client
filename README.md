# Greenstand Treetracker Admin Panel – Client

The Admin Panel is the part of the Treetracker project for verifying, processing and managing data collected by the Treetracker app.

This is the React web frontend of Admin Panel, built with [create-react-app](https://github.com/facebook/create-react-app), [Rematch](http://rematch.gitbooks.io/), and [Material UI](https://material-ui.com/).

The Admin Panel API is managed separately under [Greenstand/treetracker-admin-api](https://github.com/Greenstand/treetracker-admin-api).

Please add any missing content to this readme.

## Development Environment Quick Start

There are three main options for development in the Admin Panel:

1. For frontend work only
   1. Fork and clone this repo as described below
2. For API work only
   1. Follow setup instructions in the [treetracker-admin-api](https://github.com/Greenstand/treetracker-admin-api) project
3. As a completely local development environment
   1. Install postgres and postgis locally, install a database seed, and run database migrations
   1. Install and run the backend API, configured to use your local database
   1. Install and run the frontend, configured to user you local backend API

### Step 1: Install git

See https://git-scm.com/downloads for instructions.

### Step 2: Install Node.js

_Node.js version 12.x works best for now; later versions have exhibited some strange behaviour with this project.
If you encounter issues with the server, check your version of Node.js first. This includes CORS related issues when fetching the API._

We recommend using [nvm](https://github.com/nvm-sh/nvm) to install and manage your Node.js instances. More details here: https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/

1. Make sure a profile exists for your terminal, run `touch ~/.profile; touch ~/.zshrc`
2. Install nvm: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash`
3. Install the latest version of Node.js 12: `nvm install 12`
4. Use the installed Node.js: `nvm use 12`

Alternatively, you can install Node.js directly from https://nodejs.org/dist/latest-v12.x/

_On MacOS, you can alleviate the need to run as sudo by using nvm or by [following John Papa's instructions](http://jpapa.me/nomoresudo)._

### Step 3: Fork and clone this repository

1. Click _Fork_ on this GitHub repo and follow the steps to fork the repo to your account
1. Open terminal
1. Go to a folder where you would like to install the project. Then type the following, replacing `<username>` with your GitHub username:

```
git clone https://github.com/<username>/treetracker-admin-client
```

Move into the new source code directory and add Greenstand as a remote:

```
cd cd treetracker-admin-client
git remote add upstream https://github.com/Greenstand/treetracker-admin-client
```

### Step 4: Get configuration files

_Only required if you are also developing and running the backend/API locally_

1. Add a `.env.local` file in the root directory containing the following line:

```
REACT_APP_API_ROOT=http://localhost:3000
```

### Step 5: Install npm dependencies

```
npm install
```

### Step 6: Start the client

```
npm start
```

### Step 7: View the Treetracker Admin Panel

Visit http://localhost:3001

Valid login credentials for the Admin Panel within the development environment can be found pinned to the #admin_panel_chat channel in Slack.

### Step 8: Start developing!

## Commit Message and PR Title Format

We use automatic semantic versioning, which looks at commit messages to determine how to increment the version number for deployment.

Your commit messages will need to follow the [Conventional Commits](https://www.conventionalcommits.org/) format, for example:

```
feat: add new button
```

Since we squash commits on merging PRs into `master`, this applies to PR titles as well.

## Keeping Your Fork in Sync

Your forked repo won't automatically stay in sync with Greenstand, so you'll need to occassionally sync manually (typically before starting work on a new feature).

```
git pull upstream master --rebase
git push origin master
```

You might also need to sync and merge `master` into your feature branch before submitting a PR to resolve any conflicts.

```
git checkout <feature_branch>
git merge master
```

## Code style guide

We follow the Airbnb JavaScript style guide. The superficial aspects of this style are enforced by a pre-commit hook in the project that runs [Prettier](https://prettier.io/) when you commit a change.

If you are using VSCode as your IDE, please follow [this guide](https://www.digitalocean.com/community/tutorials/how-to-format-code-with-prettier-in-visual-studio-code) to set up Prettier and automatically format your code on file save.

You can also manually run `npm run prettier`. Configuration files are already included in this repo.

### Rules

**Indention** 2 Spaces for indentation

**Semicolon** Use semicolons at the end of each line

**Characters** 80 characters per line

**Quotes** Use single quotes unless you are writing JSON

```js
const foo = 'bar';
```

**Braces** Opening braces go on the same line as the statement

```js
if (true) {
  console.log('here');
}
```

**Variable declaration** Declare one Variable per statement

```js
const dog = ['bark', 'woof'];
let cat = ['meow', 'sleep'];
```

**Variable, properties and function names** Use lowerCamelCase for variables, properties and function names

```js
const adminUser = db.query('SELECT * From users ...');
```

**Class names** Use UpperCamelCase for class names

```js
class Dog {
  bark() {
    console.log('woof');
  }
}
```

**Descriptive conditions** Make sure to have a descriptive name that tells the use and meaning of the code

```js
const isValidPassword =
  password.length >= 4 && /^(?=.*\d).{4,}$/.test(password);
```

**Object/Array creation** Use trailing commas and put short declarations on a single line. Only quote keys when your interpreter complains:

```js
var a = ['hello', 'world'];
var b = {
  good: 'code',
  'is generally': 'pretty',
};
```

## Testing

We follow the React/Jest convention for writng tests. All test file are located at the same directory with the file under test, named `xxx.test.js`.

Please ensure that at least all the _model_ unit tests under `./src/model/` pass.

To run tests:

`npm test`

## How to log

We use [loglevel](<(https://github.com/pimterry/loglevel)>) for logging, with some conventions. Using loglevel, we will be able to open/close a single file's log by chaining the level of log on the fly, even in production env.

The default of log level is set in the file: ./src/init.js

```js
log.setDefaultLevel('info');
```

To use loglevel in js file, we recommend following this convention:

```js
import * as loglevel from 'loglevel'

const log = loglevel.getLogger('../components/TreeImageScrubber')

... ...

	log.debug('render TreeImageScrubber...')
```

The convention is: call `the loglevel.getLogger()` function with argument of 'the path to current file'. In the above example, the js file is: `/src/components/TreeImageScrumbber.js`, so pass the path string: `../components/TreeImageScrubber` in, just like what we do in 'import' statement, but the path just points to itself.

Actually, we can pass in any string, following this convention is just for a UNIQUE key for the log object, now we can set the log level in browser to open/close log. To do so, open DevTools -> application -> localstorage -> add a key: 'loglevel:[the path]' and value: [the log level] (e.g. loglevel:../components/TreeImageScrubber -> DEBUG )
<img alt="snapshot" src="https://raw.githubusercontent.com/Greenstand/treetracker-admin-client/master/docs/loglevel.gif" width="600" >

## About Material-UI

We use Material-UI (4.0 currently) to build our UI.

We made some custom by setting the theme of Material-UI to fit our UI design. The customized theme file is located at `./src/components/common/theme.js`. If you find components do not work as you expect, please check section: overrides and props in theme, we override some default styles and behaviors.

We create some basic components, such as 'alert', 'confirm', 'form', feel free to pick what you want or copy the sample code. You can find them in our Storybook components gallery.

You can also pick the typographies and colors as you want in Storybook -> MaterialUITheme -> theme/typography/palette.

## About Storybook

We use [Storybook](https://storybook.js.org/) to develop/test components independently.

Run the following command to start Storybook:

```
npm run storybook
```

Visit this URL in the browser: http://localhost:9009

All the stories are located at `./src/stories/`

## About Redux/Rematch

We use [Rematch](https://github.com/rematch/rematch), it is a simple shell on Redux. In contrast to vanilla Redux, Rematch has less boilerplate code.

If you are not familiar with Redux/Rematch, please check our [simple tutorial](docs/rematchTutorial.md), there is a REAL example about how to convert a original React component to a Redux-connected component, and how to test it.

## Advanced local development using docker _## Currently broken ##_

For developers familiar with docker, we offer a dockerized setup for local development.

To run docker on a local machine, you will have to install Docker first.
Docker is a linux container technology, so running it on Mac or Windows requires an application with an attached linux VM.
Docker provides one for each OS by default.

### Mac

Install Docker for Mac using homebrew, using the following command

```
$ brew cask install docker
```

You can alternatively install Docker via: [Docker for Mac](https://docs.docker.com/docker-for-mac/install/)

Once Docker is installed, lauch Docker from the Applications GUI.

### Windows

For most versions of Windows: [Docker for Windows](https://docs.docker.com/docker-for-windows/install/)

For some older versions or Win10 Home: [Docker Toolbox](https://docs.docker.com/toolbox/toolbox_install_windows/).
At least on one machine, to get this to work, when you get to the step to do QuickStart terminal script, instead, run:

```
docker-machine create default --virtualbox-no-vtx-check
```

then re-run the QuickStart terminal script.

> If you use Docker Toolbox, check the IP address in the output of the QuickStart terminal script.
> You will use this IP address later instead of `localhost`.

### Linux

To install on linux, you can run
`sudo apt-get install -y docker-ce`
but there is [additional setup](https://docs.docker.com/install/linux/docker-ce/ubuntu/#set-up-the-repository) to verify keys, etc.

### Install, build docker containers and go

Run the setup script. This script installs node modules, builds docker containers, and starts them

```
./dev/scripts/setup.sh
```

You can now view the Treetracker Admin Panel at http://localhost:8080.

> Note: If you try to access the site on port 3001 you will recieve a CORS error

> Note: If you used Docker Toolbox, you may need to use the IP address it reported, such as http://192.168.99.100:8080_

It may take a few seconds for the web and api servers to come up. You can monitor them using the docker logs commands as:

```
docker logs -f treetracker-admin-web
docker logs -f treetracker-admin-api
```

Also see [Scripts](#scripts) below

The REST API documentation can be viewed and explored by visiting http://localhost:3000/api/explorer

To stop the dev environment use

```
./dev/scripts/down.sh
```

To start the dev environment back up use

```
./dev/scripts/up.sh
```

Just edit as you normally would to view changes in your development environment.

### Alternative setup for MS Windows (Works on Linux and Mac also)

On Windows the easiest way to develop and debug Node.js applications is using Visual Studio Code.
It comes with Node.js support out of the box.

https://code.visualstudio.com/docs

### Still can not figure it out?

Here is our [wiki page for troubleshooting](https://github.com/Greenstand/treetracker-admin/wiki/Set-Up-Issues), take a look.

Help us to improve it by adding your experience solving this problem.

### Scripts

Useful scripts are contained in /dev/scripts. Their uses are described here. Scripts are run from the repository root as /dev/scripts/{script-name}.sh

**install.sh** install or update npm modules for server and client projects

**build.sh** build docker images

**up.sh** bring up docker containers in docker as described by docker-compose.yml

**setup.sh** run install.sh, build.sh, and up.sh

**down.sh** bring down docker containers

**logs-api.sh** show logs for api server

**logs-web.sh** show logs for React.js dev server

**docker-clear-images.sh** clear out _all_ docker images

**docker-remove-containers.sh** clear out _all_ docker containers

## Further reading

See [Contributing to the Cause](https://github.com/Greenstand/Development-Overview#contributing-to-the-cause)
