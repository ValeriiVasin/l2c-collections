import { testId } from '../helpers/test-id';

const selectors = {
  filter: testId('filter'),
  content: testId('content'),
};

describe('search', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('pressing slash key focuses search when input not active', () => {
    cy.get(selectors.filter).should('exist').should('not.have.focus');
    cy.get('body').type('/');
    cy.get(selectors.filter).should('have.focus').should('have.value', '');
  });

  it('pressing slash key when input is active', () => {
    cy.get(selectors.filter).focus().type('/').should('have.value', '/');
  });

  // test is not stable in CI
  it('pressing escape key resets filter and removes focus', { retries: { runMode: 3 } }, () => {
    // Cypress does not clean the value of input after pressing ESC inside of input[type=search]
    // https://github.com/cypress-io/cypress/issues/21313
    cy.get(selectors.filter).focus().type('{esc}').should('not.have.focus');
  });
});
