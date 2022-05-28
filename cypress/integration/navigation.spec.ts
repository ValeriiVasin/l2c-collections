import { testId } from '../helpers/test-id';

const selectors = {
  activeNavItem: `${testId('navigation')} [class*="is-selected"]`,
  navItemAttack: `${testId('nav-attack')}`,
  collection: testId('collection'),
  filter: testId('filter'),
  notification: testId('notification'),
};

describe('navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('tab', () => {
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

  describe('filter text', () => {
    it('updates URL when typing', () => {
      cy.get(selectors.filter).type('Клана');
      cy.url().should('contain', `query=${encodeURI('Клана')}`);
    });

    it('syncs filter from URL to state', () => {
      cy.visit(`/?query=${encodeURI('Клана')}`);
      cy.get(selectors.filter).should('have.value', 'Клана');
    });

    it('preserves selected tab with the text', () => {
      cy.get(selectors.navItemAttack).click();
      cy.get(selectors.filter).type('Клана');
      cy.url()
        .should('contain', `query=${encodeURI('Клана')}`)
        .should('contain', 'tab=attack');
    });

    it('filters items', () => {
      cy.get(selectors.collection).should('contain', 'Коллекционер костей');
      cy.get(selectors.filter).type('Клана');
      cy.get(selectors.collection)
        .should('not.contain', 'Коллекционер костей')
        .should('contain', 'Храбрость ветеранов клана');
    });

    it('filter nothing', () => {
      cy.get(selectors.filter).type('whatever');
      cy.get(selectors.notification).should('contain', 'Ничего не найдено');
    });
  });
});
