/**
 * @file
 * Screenshots for privacy and consent management content.
 */

describe('The Drupal CMS consent manager UI', () => {
  it ('Works', () => {
    cy.viewport(1280,1024);
    cy.window().then((win => win.localStorage.setItem('Drupal.navigation.sidebarExpanded', 'false')));

    cy.drupalLogin('admin@example.com');

    // Install the Google Analytics recipe, and the Events recipe, if they are
    // not already installed. They make the screenshots more interesting.
    cy.visit('/admin/modules/browse/recipes');
    // Written like this the "test" will install the Events recipe if it's not
    // already installed, but NOT fail the test if it's already installed.
    cy.get('.pb-project').contains('Events')
      .parentsUntil('.pb-project')
      .parent()
      .then(($parent) => {
        const $button = $parent.find('button.pb__action_button.select_button');
        if ($button.length) {
          cy.wrap($button).click();
          // Wait for the installer.
          cy.get('body', { timeout: 120000 }).should('contain.text', 'Browse projects');
        }
      });

    cy.get('.pb-project').contains('Google Analytics')
      .parentsUntil('.pb-project')
      .parent()
      .then(($parent) => {
        const $button = $parent.find('button.pb__action_button.select_button');
        if ($button.length) {
          cy.wrap($button).click();

          // Wait for config form to appear and interact if it exists.
          cy.get('form').contains('Google Tag ID').should('exist');
          cy.get('input[name="drupal_cms_google_analytics[property_id]"]').type('GT-xxxxxx');
          cy.get('input[type="submit"]').contains('Continue').click();

          // Wait for the installer.
          cy.get('body', { timeout: 120000 }).should('contain.text', 'Browse projects');
        }
      });

    cy.drupalLogout();
    cy.visit('/');

    // Verify some text in the consent manager.
    cy.get('#klaro-cookie-notice')
      .should('be.visible')
      .contains('We use cookies and process personal data for the following purposes:');
    cy.get('#klaro-cookie-notice button')
      .contains('Accept');
    cy.get('#klaro-cookie-notice button')
      .contains('Decline');
    cy.get('#klaro-cookie-notice a')
      .contains('Customize');

    // Screenshot of the automatic cookie notice dialog that pops up.
    cy.get('#klaro-cookie-notice')
      .screenshot('consent--cookie-notice-dialog', {padding: 200});

    cy.get('#klaro-cookie-notice button')
      .contains('Accept')
      .click();

    // Verify the link for the consent manager in the footer, and then open it
    // and take a screenshot.
    cy.get('footer a').contains('My privacy settings')
      .screenshot('constent--footer-link', {padding: [400, 400, 100, 100]});

    cy.get('footer a').contains('My privacy settings')
      .click();
    cy.get('#klaro .cm-modal')
      .should('be.visible')
      .screenshot('consent--cm-modal', {padding: 80});

    // Verify that leaflet maps are blocked by default, and that there is a
    // consent widget that allows you to choose to view the map.
    cy.visit('/events/drupalcon-atlanta-2025');
    cy.get('.field--name-field-geofield .leaflet-map-pane').should('not.exist');
    cy.get('.field--name-field-geofield')
      .should('contain.text', 'Load external content supplied by External Map (Leaflet)?');
    cy.get('.field--name-field-geofield button')
      .should('contain.text', 'Always');
    cy.get('.field--name-field-geofield')
      .screenshot('consent--leaflet-blocked');

    // Choosing yes reveals the map.
    cy.get('.field--name-field-geofield button')
      .contains('Yes (this time)')
      .click();
    cy.get('.field--name-field-geofield .leaflet-map-pane').should('exist');

  });
});

describe('The Drupal CMS privacy policy page', () => {
  it ('Exists as described in the documentation', () => {
    cy.viewport(1280,1024);
    // We don't need any screenshots of this right now, but these steps verify
    // that the steps in the documentation are accurate.
    cy.visit('/');

    // Accept cookies so this doesn't show in screenshots.
    cy.get('#klaro-cookie-notice button')
      .contains('Accept')
      .click();

    // First verify the privacy link doesn't exist for anon users.
    cy.get('footer a').contains('Privacy policy').should('not.exist');

    cy.window().then((win => win.localStorage.setItem('Drupal.navigation.sidebarExpanded', 'false')));
    cy.drupalLogin('admin@example.com');

    cy.visit('/');
    cy.get('footer a')
      .contains('Privacy policy')
      .click();

    cy.get('.tabs a').contains('Edit')
      .click();
    cy.get('label').should('contain.text', 'Content');
    cy.get('label').should('contain.text', 'Description');
    cy.findByLabelText('Change to').should('have.value', 'draft')
      .select('published');
    cy.get('.form-submit').contains('Save')
      .click();

    // Logout and verify the link is visible to anon users now.
    cy.drupalLogout();
    cy.visit('/');
    cy.get('footer a').contains('Privacy policy');
  });
});
