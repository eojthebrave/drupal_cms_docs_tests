/**
 * @file
 * Screenshots for "Getting Around Drupal CMS".
 */

import { faker } from '@faker-js/faker';

describe('Getting Around Drupal CMS', () => {
  it('Works', () => {
    cy.viewport(1920,1280);
    cy.visit('/user/login');
    cy.get('input[name="name"]').type('admin@example.com');
    cy.findByLabelText('Password').type('password');
    cy.findByDisplayValue('Log in').click();
    cy.get('body').should('contain.text', 'Dashboard');

    cy.visit('/admin/dashboard');
    cy.screenshot('getting-around--dashboard');

    // Resize for better screenshot.
    cy.viewport(1920,800);
    cy.get('#admin-toolbar').screenshot('getting-around--toolbar');
    cy.viewport(1920,1280);

    cy.window().then((win => win.localStorage.setItem('Drupal.navigation.sidebarExpanded', 'false')));
    cy.screenshot('getting-around--dashboard');

    cy.get('#admin-toolbar a').contains('Content').click();
    cy.screenshot('getting-around--content', {capture: 'viewport'});

    cy.visit('/admin/structure/types/manage/event/fields');
    cy.contains('Manage fields');
    cy.screenshot('getting-around--structure', {capture: 'viewport'});

    cy.visit('/admin/appearance');
    cy.contains('Olivero');
    cy.screenshot('getting-around--appearance', {capture: 'viewport'});

    // Add a couple of users so there is more to show in this screenshot.
    let count = 0;
    while (count < 5) {
      cy.visit('/admin/people/create');
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName();
      const email = faker.internet.email(firstName, lastName, 'example.com');
      const username= `${firstName}${lastName}`.replace(/\s+/g, '');

      cy.findByLabelText('Email address')
        .type(email);
      cy.findByLabelText('Username')
        .type(username);

      const editor = Math.floor(Math.random() * 2);
      if (editor === 1) {
        cy.findByLabelText('Content editor').check();
      }

      cy.get('.form-submit').contains('Create new account')
        .click();
      cy.contains('A welcome message with further instructions has been emailed to the new user');
      count++;
    }

    cy.visit('/admin/people');
    cy.contains('.page-content', 'People');
    cy.screenshot('getting-around--people', {capture: 'viewport'});

    // Enable the SEO recipe so we can get a screenshot of it in action.
    cy.visit('/admin/modules/browse/recipes');
    cy.get('.pb-project').contains('SEO Tools')
      .parentsUntil('.pb-project')
      .parent()
      .find('button')
      .contains('Install')
      .click();

    cy.get('.pb-project').contains('SEO Tools')
      .parentsUntil('.pb-project')
      .parent()
      .find('button')
      .contains('Installed', {timeout: 20000});

    cy.visit('/news/2025-01/drupal-cms-strategic-initiative-future');
    cy.get('.tabs a').contains('Edit').click();
    cy.get('#group-seo').click();
    cy.get('#group-seo').should('have.attr', 'open');
    cy.findByLabelText('SEO title')
      .type('Drupal CMS: A strategic initiative for the future');
    cy.findByLabelText('Focus keyword')
      .type('drupal cms, launch, future');
    cy.get('.form-submit').contains('Seo preview').click();
    cy.get('#yoast-snippet').should('exist');
    cy.get('#group-seo').screenshot('getting-around--seo', {padding: 60});

    cy.visit('/admin/dashboard');
    cy.get('body').type('{alt}d');
    cy.get('#coffee-q').type('medi');

    cy.viewport(1280, 720);
    cy.screenshot('getting-around--coffee', { capture: 'viewport'});
    cy.viewport(1920,1280);
  });
});
