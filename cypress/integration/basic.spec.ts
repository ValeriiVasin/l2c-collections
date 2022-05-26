describe('basic tests', () => {
  it('having proper tytle', () => {
    cy.visit('/');
    cy.title().should('equal', 'L2 Classic Collections');
  });
});
