/**
 * @file
 * Screenshots for "Enabling Functionality with Modules".
 */

describe('Enabling Functionality With Modules', () => {
  it('Works', () => {
    cy.viewport(1920,1280);
    cy.window().then((win => win.localStorage.setItem('Drupal.navigation.sidebarExpanded', 'false')));

    cy.visit('/user/login');
    cy.get('input[name="name"]').type('admin@example.com');
    cy.findByLabelText('Password').type('password');
    cy.findByDisplayValue('Log in').click();
    cy.get('body').should('contain.text', 'Dashboard');

    cy.get('.admin-toolbar').contains('a', 'Extend')
      .click();
    cy.contains('.tabs a', 'List');
    cy.contains('.tabs a', 'Recommended');
    cy.screenshot('extend--overview', { capture: 'viewport' });

    cy.get('label').contains('Comment').click();
    cy.get('#edit-submit').contains('Install').click();

    cy.viewport(960,540);
    cy.get('.messages-list', {timeout: 10000}).contains('Module Comment has been installed')
      .screenshot('extend--install-success', {padding: 60});
    cy.viewport(1920,1280);

    cy.contains('.tabs a', 'Browse')
      .click();
    cy.contains('Browse projects');
    cy.get('.pb-layout :first-child .pb-project__maintenance-icon').should('be.visible', {timeout: 20000});
    cy.screenshot('extend--browse-projects');

    // Then uninstall Comment.
    cy.contains('.tabs a', 'Uninstall').click();
    cy.get('label').contains('Comment');
    cy.get('#edit-uninstall-comment').check();
    cy.get('#edit-submit').contains('Uninstall').click();
    // Confirm uninstall.
    cy.contains('Confirm uninstall');

    cy.viewport(960,540);
    cy.get('.page-content').screenshot('extend--uninstall-confirm');
    cy.get('#edit-submit').contains('Uninstall').click();
    cy.get('.messages-list').contains('The selected modules have been uninstalled')
      .screenshot('extend--uninstall-success', {padding: 60});
  });
});
