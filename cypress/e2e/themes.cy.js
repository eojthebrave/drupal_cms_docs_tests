/**
 * @file
 * Screenshots for "Choose and configure a theme".
 */

describe('Choose and configure a theme', () => {
  it('Works', () => {
    cy.viewport(1920,1280);
    cy.window().then((win => win.localStorage.setItem('Drupal.navigation.sidebarExpanded', 'false')));

    cy.visit('/user/login');
    cy.get('input[name="name"]').type('admin@example.com');
    cy.findByLabelText('Password').type('password');
    cy.findByDisplayValue('Log in').click();
    cy.get('body').should('contain.text', 'Dashboard');

    cy.get('.admin-toolbar').contains('Appearance')
      .click();

    cy.contains('Installed themes');
    cy.screenshot('themes--list');
    cy.get('.theme-default')
      .within(($card) => {
        cy.contains('Olivero for Drupal CMS');
        cy.screenshot('themes--card', {padding: 60});

        cy.get('a').contains('Settings')
          .click();
      });

    cy.contains('Logo image');
    cy.contains('Olivero Utilities');
    cy.contains('Primary base color');
    cy.contains('Olivero Color Scheme Settings');
    cy.contains('input.form-submit', 'Save configuration');
    cy.get('.page-content').screenshot('themes--settings');

  });
});
