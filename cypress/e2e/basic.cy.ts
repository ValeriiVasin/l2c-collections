import { cy, describe } from 'local-cypress';

describe('basic tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('having proper tytle', () => {
    cy.title().should('equal', 'L2 Classic Collections');
  });
});
