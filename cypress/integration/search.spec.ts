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
});
