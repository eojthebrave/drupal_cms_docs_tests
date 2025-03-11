# Automated Screenshots for Drupal CMS Documentation

This project consists of the configuration necessary to set up a DDEV (Docker) environment for executing the tests in _cypress/e2e/_ against an installation of Drupal CMS. These tests validate the steps in the Drupal CMS User Guide. As well as generate screenshots for the guide.

## Usage

- [Install DDEV](https://ddev.readthedocs.io/en/latest/)
- Clone this repository
- Execute `ddev start` from the root directory
- Followed by `ddev composer install` (This will install Drupal CMS)
- Then `ddev npm install`

## Run the tests

For now, just run the tests locally. Maybe eventually we can wire it up with GitLab CI on Drupal.org. ?\_(?)_/?

Screenshot generation currently works best with Firefox.

```shell
ddev exec npx cypress run --browser=firefox
```

Screenshots will be saved in _cypress/screenshots/_.

Alternatively you can use the Cypress UI to run tests, and watch them execute, by visiting https://drupal-cms-docs-tests.ddev.site:6081/vnc.html.

Start the cypress UI:

```shell
ddev exec npx cypress open --config watchForFileChanges=false
```

## Additional information

Tip: Run the installer.cy.js spec first to install Drupal CMS so the other tests have a working site to navigate.

These tests DO NOT create a separate clean install of Drupal CMS to run. Rather, they run against your site at https://drupal-cms.ddev.site. They will make changes to that site. The tests do not always clean up after themselves and can leave artifacts.

These are not intended to be _tests_, or to follow any testing best-practices. Think of it more like automating the steps that someone following along with the documentation would take. The goal is to ease the burden of keeping screenshots up-to-date as the UI evolves.

In addition to making screenshots the test files can check for things like text in the UI, or specific navigation steps that appear in the documentation to help point out when documentation might need updates.
