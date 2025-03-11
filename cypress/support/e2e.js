import '@testing-library/cypress/add-commands';

Cypress.Screenshot.defaults({
  overwrite: true,
  onBeforeScreenshot($el) {
    // Prevent the toolbar from showing up multiple times if the screenshot
    // requires scrolling to capture the full page.
    if ($el.find('#admin-toolbar').length) {
      $el.find('#admin-toolbar').css('position', 'absolute');
    }

    // Prevent the sticky header in Gin from overlapping elements in screenshots
    // when taking screenshots of a specific element and not the whole page.
    if ($el.find('.region-sticky').length) {
      $el.find('.region-sticky').css('position', 'relative');
      cy.document().find('.region-sticky').invoke('css', 'position', 'relative');
      $el.find('.sticky-shadow').css('display', 'none');
      cy.document().find('.sticky-shadow').invoke('css', 'display', 'none');
    }
  },
  onAfterScreenshot($el, props) {
    if ($el.find('#admin-toolbar').length) {
      $el.find('#admin-toolbar').css('position', 'fixed');
    }
  },
});

/**
 * Log in as a specific Drupal user by username.
 *
 * Account password is hard-coded to "password". See drupalCreateUser below.
 *
 * @param {string} name
 *   The username to log in with.
 *
 * @example
 * cy.drupalLogin('admin');
 */
Cypress.Commands.add('drupalLogin', (name) => {
  Cypress.log({
    name: 'drupalLogin',
    displayName: 'login',
    message: `Logging in as ${name}`,
  });
  cy.visit('/user/login');
  cy.get('input[name="name"]').type(name);
  cy.findByLabelText('Password').type('password');
  cy.findByDisplayValue('Log in').click();
});

/**
 * Log out the currently logged-in user.
 *
 * @example
 * cy.drupalLogout();
 */
Cypress.Commands.add('drupalLogout', () => {
  cy.visit('/user/logout');
  cy.findByDisplayValue('Log out').click();
});
