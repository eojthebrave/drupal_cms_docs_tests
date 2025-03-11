/**
 * @file
 * Configuration for using Cypress to take documentation screenshots.
 */
const { defineConfig } = require("cypress");
const path = require('node:path');

const {
  DDEV_DOCROOT,
  DDEV_PRIMARY_URL,
  SIMPLETEST_DB,
  WEB_SERVER_USER,
} = process.env;

module.exports = defineConfig({
  e2e: {
    baseUrl: DDEV_PRIMARY_URL,
    specPattern: [
      'cypress/e2e/installer.cy.js',
      'cypress/e2e/getting-around.cy.js',
      'cypress/e2e/enable-module.cy.js',
      'cypress/e2e/themes.cy.js',
      'cypress/e2e/basic-page.cy.js',
      'cypress/e2e/privacy.cy.js',
      'cypress/e2e/ai-recipe.cy.js',
      'cypress/e2e/**/*.cy.js',
    ],
    //supportFile: 'docs/tests/e2e.js',
    trashAssetsBeforeRuns: false,
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome' && browser.isHeadless) {
          // fullPage screenshot size is 1400x1200 on non-retina screens
          // and 2800x2400 on retina screens
          launchOptions.args.push('--window-size=1920,1280')

          // force screen to be non-retina (1400x1200 size)
          launchOptions.args.push('--force-device-scale-factor=1')

          // force screen to be retina (2800x2400 size)
          // launchOptions.args.push('--force-device-scale-factor=2')
        }

        if (browser.name === 'electron' && browser.isHeadless) {
          launchOptions.preferences.width = 1920
          launchOptions.preferences.height = 1280
        }

        if (browser.name === 'firefox' && browser.isHeadless) {
          launchOptions.args.push('--width=1920')
          launchOptions.args.push('--height=1280')
        }

        return launchOptions
      })
    },
  },
  env: {
    execOptions: {
      env: {
        SIMPLETEST_BASE_URL: DDEV_PRIMARY_URL,
        SIMPLETEST_DB: SIMPLETEST_DB,
      },
      workingDir: DDEV_DOCROOT,
      user: WEB_SERVER_USER,
    },
  }
});
