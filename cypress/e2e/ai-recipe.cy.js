/**
 * @file
 * Screenshots for "Getting Around Drupal CMS".
 */

describe('Adding Functionality With Smart Defaults', () => {
  it('Works', () => {
    cy.viewport(1920,1280);
    cy.window().then((win => win.localStorage.setItem('Drupal.navigation.sidebarExpanded', 'false')));

    cy.visit('/user/login');
    cy.get('input[name="name"]').type('admin@example.com');
    cy.findByLabelText('Password').type('password');
    cy.findByDisplayValue('Log in').click();
    cy.get('body').should('contain.text', 'Dashboard');

    // Navigate from Dashboard to browsing modules.
    cy.visit('/admin/dashboard');
    cy.get('.admin-toolbar').contains('a', 'Extend')
      .click();
    cy.get('.tabs a').contains('Recipes').click();

    // Wait a few seconds for the PB images to load.
    cy.wait(2000);
    cy.screenshot('adding-functionality-with-smart-defaults--recipes-grid');

    cy.get('.pb-project').contains('AI Assistant')
      .parentsUntil('.pb-project')
      .parent()
      .find('button')
      .contains('Install')
      .click();

    const content = cy.get('.page-content');
    // Verify text of the page matches what is in the documentation.
    content.should('contain.text', 'Provider');
    content.should('contain.text', 'OpenAI');
    content.should('contain.text', 'API Key');
    content.get('input').contains('Continue');

    // Doesn't need to be as wide for the next few screenshots.
    cy.viewport(1024,720);
    cy.get('.page-content').screenshot('ai-overview--installer', {padding: 60});

    content.get('#edit-drupal-cms-ai-openai-api-key').type('password-1234-asdf');
    content.get('input').contains('Continue').click();

    // Verify the installer page shows.
    cy.contains('Applying AI Assistant');
    cy.screenshot('ai-overview--apply', {capture: 'viewport'});

    // Wait for installer to finish. Current you end up back on the recipe
    // browser page when it's done.
    cy.get('body', { timeout: 120000 }).should('contain.text', 'Browse projects');
  });
});

describe('AI Tools in Drupal CMS', () => {
  it('Works', () => {
    cy.viewport(1920,1280);
    cy.window().then((win => win.localStorage.setItem('Drupal.navigation.sidebarExpanded', 'false')));

    cy.visit('/user/login');
    cy.get('input[name="name"]').type('admin@example.com');
    cy.findByLabelText('Password').type('password');
    cy.findByDisplayValue('Log in').click();
    cy.get('body').should('contain.text', 'Dashboard');

    // Verify AI chatbot tab text, and screenshot of it closed.
    cy.get('.chat-container').screenshot('ai-overview--closed', {padding: 60});
    cy.contains('Drupal Agent Chatbot').click();
    // Screenshot of chatbot expanded with privacy policy button showing.
    cy.get('.chat-container').screenshot('ai-overview--confirm-first-time', {padding: 60});
    // Expand the chat window.
    cy.get('.chat-container').click();
    // Confirm UI text for the privacy policy the first time it is opened.
    cy.get('.chat-container').should('contain.text', 'Load service chatbot Deepchat');
    cy.get('.chat-container button').contains('Yes (this time)')
      .click();

    cy.wait(1000);
    // Screenshot of the open AI chatbot interface.
    cy.get('.chat-container').screenshot('ai-overview--open', {padding: 60});

    // Verify steps for using the AI generate alt text option.
    cy.get('.admin-toolbar a').contains('Create')
    cy.get('.admin-toolbar').contains('a', 'Image');
    cy.visit('/media/add/image');
    cy.findByLabelText('Name').type('Example image');
    cy.findByLabelText('Add a new file').selectFile('web/core/tests/fixtures/files/image-2.jpg');
    cy.get('#media-image-add-form').contains('Alternative text');

    cy.viewport(1024, 960);
    // The Klaro confirmation text takes a moment to appear because of a fade
    // in effect.
    cy.wait(1000);
    cy.get('#media-image-add-form').should('contain.text', 'Transfer image and meta data to chosen AI service?')
    cy.get('#media-image-add-form').screenshot('ai-overview--alt-text-privacy', {padding: 60});
    cy.get('#media-image-add-form button').should('contain.text', 'Yes (this time)').click();
    cy.get('#media-image-add-form input.form-submit').contains('Generate with AI');
    cy.get('#media-image-add-form').screenshot('ai-overview--alt-text-generate', {padding: 60});

  });
});
