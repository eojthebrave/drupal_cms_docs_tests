/**
 * @file
 * Screenshots for "Create basic pages".
 */

import { faker } from '@faker-js/faker';

describe('Create basic pages', () => {
  it('Works', () => {
    cy.viewport(1280,1024);
    cy.window().then((win => win.localStorage.setItem('Drupal.navigation.sidebarExpanded', 'false')));

    cy.drupalLogin('admin@example.com');
    cy.get('body').should('contain.text', 'Dashboard');

    cy.get('.admin-toolbar').contains('Create')
      .click();
    cy.get('.toolbar-popover__menu a').contains('Basic page')
      .click();

    // Verify some text from the tutorial.
    cy.contains('Create Basic page');
    cy.findByLabelText('Save as').should('have.value', 'draft');

    cy.findByLabelText('Title')
      .type('About Us');
    cy.get('#edit-field-description-wrapper').findByLabelText('Description')
      .type('Learn more about our mission, values, and our team.');
    cy.get('#edit-field-content-wrapper')
      .should('exist')
      .should('contain.text', 'Content');
    // cy.type doesn't fill ckeditor fields.
    // See https://github.com/cypress-io/cypress/issues/26155
    cy.window().then(win => {
      const lipsum = '<p>Nestled in the heart of scenic wine country, our tours offer an unforgettable journey through rolling vineyards, historic wineries, and the art of winemaking. Whether you’re a seasoned sommelier or a curious novice, our carefully curated experiences are designed to immerse you in the rich culture and flavors of the region. From sipping award-winning vintages to learning the stories behind every bottle, you’ll leave with a deeper appreciation for the craft and a glass of joy in hand.</p>'
        + '<p>At every stop, you’ll be greeted by passionate winemakers eager to share their expertise and personal touches that make their wines truly unique. Stroll through picturesque estates, savor expertly paired tastings, and relax in the warm hospitality of our team. Our wine tours are more than a visit—they’re an invitation to connect with the traditions, innovations, and people who pour their hearts into every sip. Let us take you on a journey worth toasting to!</p>'
      win.Drupal.CKEditor5Instances.forEach(editor => editor.setData(lipsum))
    });

    // Generic steps for adding a media element using the media reference
    // button.
    cy.get('#field_featured_image-media-library-wrapper').contains('Add media')
      .click();
    cy.findByLabelText('Add file')
      .selectFile('cypress/support/files/wine-tours-ipsum.jpg');
    cy.contains('Add or select media');
    cy.findByLabelText('Alternative text')
      .type('A photo of our team in front of the big house.');
    cy.get('.ui-dialog-buttonpane button').contains('Save')
      .click();
    cy.get('.ui-dialog-buttonpane').contains('1 of 1 item selected');
    cy.get('.ui-dialog-buttonpane button').contains('Insert selected')
      .click();
    // Wait for the preview to show in the form.
    cy.get('#edit-field-featured-image-wrapper').contains('wine-tours-ipsum.jpg')
    // Give the image preview a second to load so the thumbnail displays.
    cy.wait(1000);

    cy.get('.page-wrapper__node-edit-form').screenshot('basic-page--create-form');
    cy.get('#edit-meta').screenshot('basic-page--edit-meta-draft', {padding: [60, 0, 60, 60]});

    cy.get('details').contains('Menu settings')
      .click();
    cy.findByLabelText('Provide a menu link')
      .check();
    cy.get('body').focus();
    cy.get('#edit-menu').screenshot('basic-page--edit-menu', {padding: [60, 0, 60, 60]});

    cy.get('details').contains('URL alias')
      .click();
    // Wait a moment for section to open.
    cy.wait(1000);
    // Move focus because Gin highlights the sidebar in a weird way.
    cy.get('body').click();
    cy.get('#edit-path-0').screenshot('basic-page--edit-url-automatic', {padding: [60, 0, 60, 60]});
    cy.findByLabelText('Generate automatic URL alias')
      .uncheck();
    cy.findByLabelText('URL alias')
      .type('/about');
    cy.get('#edit-path-0').screenshot('basic-page--edit-url-manual', {padding: [60, 0, 60, 60]});

    cy.get('.form-submit').contains('Save')
      .click();

    // Publish it.
    cy.get('.tabs a').contains('Edit')
      .click();

    // Fix things so the top of the element we want to screenshot doesn't scroll
    // out of view.
    cy.get('#gin_sidebar').invoke('css', 'height', 'auto');

    cy.findByLabelText('Change to')
      .select('published')
    cy.get('#edit-meta').screenshot('basic-page--edit-meta-published', {padding: [0, 0, 60, 60]});
    cy.get('.form-submit').contains('Save')
      .click();

    cy.drupalLogout();
    cy.visit('/about');
    cy.screenshot('basic-page--about-page');

    // Now change the layout.
    cy.drupalLogin('admin@example.com');

    // This looks better with a couple of profile nodes, so create those first.
    let count = 1;
    while (count <= 3) {
      const description = faker.lorem.paragraph();
      cy.visit('/node/add/person');
      cy.findByLabelText('Name')
        .type(faker.person.fullName());
      cy.findByLabelText('Description')
        .type(description);
      cy.findByLabelText('Role or job title')
        .type(faker.person.jobTitle());
      cy.get('#edit-field-person-email-0-value')
        .type(faker.internet.email());
      cy.get('#edit-field-person-phone-number-0-value')
        .type(faker.phone.number());
      // Add a portrait.
      cy.get('#field_featured_image-media-library-wrapper').contains('Add media')
        .click();
      cy.findByLabelText('Add file')
        .selectFile(`cypress/support/files/person-${count}.jpg`);
      cy.contains('Add or select media');
      cy.findByLabelText('Alternative text')
        .type('A photo of our team in front of the big house.');
      cy.get('.ui-dialog-buttonpane button').contains('Save')
        .click();
      cy.get('.ui-dialog-buttonpane').contains('1 of 1 item selected');
      cy.get('.ui-dialog-buttonpane button').contains('Insert selected')
        .click();
      // Wait for the preview to show in the form.
      cy.get('#edit-field-featured-image-wrapper').contains(`person-${count}.jpg`)

      cy.window().then(win => {
        win.Drupal.CKEditor5Instances.forEach(editor => editor.setData(description))
      });
      cy.findByLabelText('Save as')
        .select('published');
      cy.get('.form-submit').contains('Save').click();
      count++;
    }

    cy.visit('/about');
    cy.get('.tabs a').contains('Layout')
      .click();
    cy.get('a').contains('Add section at end of layout')
      .click();
    cy.get('.layout-selection li').contains('One column')
      .should('be.visible')
      .click();
    cy.findByLabelText('Administrative label')
      .type('Team profiles');
    cy.get('.form-submit').contains('Add section')
      .click();
    cy.get('[aria-label="Content region in Team profiles"] a').contains('Add block')
      .click();
    cy.get('.block-categories a').contains('Person profiles: All profiles')
      .click();
    cy.get('form.layout-builder-add-block').findByLabelText('Override title')
      .check();
    cy.get('form.layout-builder-add-block').findByLabelText('Title')
      .clear()
      .type('Team');
    cy.get('form.layout-builder-add-block .form-submit').contains('Add block')
      .click();
    cy.contains('You have unsaved changes.')
    cy.get('.form-submit').contains('Save layout')
      .click();
    cy.contains('The layout override has been saved.');

    cy.get('.tabs a').contains('Layout')
      .click();
    // This will show up multiple times in the screenshot because of scrolling
    // so just hide it.
    cy.get('.gin-secondary-toolbar').invoke('css', 'display', 'none');
    cy.get('.main-content').screenshot('basic-page--edit-layout');

    cy.drupalLogout();
    cy.visit('/about');
    cy.screenshot('basic-page--about-page-with-layout');
  });
});
