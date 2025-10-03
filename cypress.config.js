const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:3001',
    specPattern: 'cypress/e2e/**/*spec.py.{js,jsx,ts,tsx}',
  },

  component: {
    setupNodeEvents(on, config) {},
    specPattern: 'cypress/component/**/*spec.py.{js,jsx,ts,tsx}',
  },

  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },
});
