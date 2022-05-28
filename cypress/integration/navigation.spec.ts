import { testId } from '../helpers/test-id';

const selectors = {
  activeNavItem: `${testId('navigation')} [class*="is-selected"]`,
  navItemAttack: `${testId('nav-attack')}`,
  collection: testId('collection'),
};

describe('navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('ALL is selected by default', () => {
    cy.get(selectors.activeNavItem).contains('Все');
  });

  it('change active nav item', () => {
    cy.get(selectors.navItemAttack).click();
    cy.get(selectors.activeNavItem).contains('Атака');
  });

  it('nav item change updates URL', () => {
    cy.get(selectors.navItemAttack).click();
    cy.url().should('contain', 'tab=attack');
  });

  it('preserves selected navigation from query', () => {
    cy.visit('?tab=attack');
    cy.get(selectors.activeNavItem).contains('Атака');
    cy.get(selectors.collection).should('have.length', 61);
  });

  it('filters items by tags', () => {
    cy.get(selectors.collection).should('have.length', 300);
    cy.get(selectors.navItemAttack).click();
    cy.get(selectors.collection).should('have.length', 61);
  });
});
