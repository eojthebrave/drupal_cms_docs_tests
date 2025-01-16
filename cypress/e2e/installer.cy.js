/**
 * @file
 * Screenshots of the installer.
 */

describe('The Drupal CMS installer', () => {
  it('Works', () => {
    cy.viewport(1280,960);

    cy.visit('/');
    cy.contains('Blog').click();
    cy.contains('Events').click();
    cy.contains('News').click();
    cy.get('.cms-installer__main')
      .screenshot('installer--one', {padding: 60});

    cy.contains('Next').click();

    cy.findByLabelText('Site name')
      .clear()
      .type('Wine Tours')
      .blur();
    cy.get('.cms-installer__main')
      .screenshot('installer--two', {padding: 60});

    cy.contains('Next').click();

    cy.findByLabelText('Email')
      .clear()
      .type('admin@example.com')
      .blur();
    cy.findByLabelText('Password')
      .clear()
      .type('password')
      .blur();
    cy.get('.cms-installer__main')
      .screenshot('installer--three', {padding: 60});

    cy.contains('Finish').click();

    // Wait a couple of seconds for the installer to start.
    cy.wait(2000);

    cy.get('.cms-installer__main', {padding: 100})
      .screenshot('installer--four');

    // Wait for the installer to finish, this could take a few minutes.
    cy.get('body', { timeout: 120000 }).should('contain.text', 'Recent content');
  });
});
