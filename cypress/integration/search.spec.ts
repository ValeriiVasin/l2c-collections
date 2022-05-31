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

  it('search updates title', () => {
    cy.get(selectors.filter).type('Hello World');
    cy.title().should('equal', 'Hello World - L2 Classic Collections');
    cy.get(selectors.filter).clear();
    cy.title().should('equal', 'L2 Classic Collections');
  });
});
