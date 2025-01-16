/**
 * @file
 * Contains support code for end-to-end tests.
 */

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
  cy.get('.page-title').should('contain.text', name);
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

