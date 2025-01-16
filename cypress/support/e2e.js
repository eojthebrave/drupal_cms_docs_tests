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
