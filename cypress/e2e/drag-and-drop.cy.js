/// <reference types="cypress" />

const SELECTORS = {
  ingredientByUid: (uid) => `[data-uid="${uid}"]`,
  ingredientFilling: '[data-test="ingredient-filling"]',
  ingredientCardDraggable: '[data-test="ingredient-card-draggable"]',
  constructorDropArea: '[data-test="constructor-drop-area"]',
};

describe('Swap ingredients and check keywords', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients').as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.addIngredient(2);
    cy.addIngredient(3);
    cy.addIngredient(4);

    cy.get(SELECTORS.ingredientFilling).should('have.length', 3);
  });

  it('меняет порядок ингредиентов через drag-and-drop и проверяет ключевые слова', () => {
    cy.get(SELECTORS.ingredientFilling).then(elements => {
      cy.wrap(elements[0].dataset.uid).as('uid0');
      cy.wrap(elements[1].dataset.uid).as('uid1');
      cy.wrap(elements[2].dataset.uid).as('uid2');
    });

    cy.get('@uid1').then(uid1 => {
      cy.get('@uid2').then(uid2 => {
        const dt = new DataTransfer();

        cy.get(SELECTORS.ingredientByUid(uid1))
          .scrollIntoView()
          .trigger('mousedown', { which: 1 })
          .trigger('dragstart', { dataTransfer: dt });

        cy.get(SELECTORS.ingredientByUid(uid2))
          .scrollIntoView()
          .trigger('dragenter', { dataTransfer: dt })
          .trigger('dragover', { dataTransfer: dt })
          .trigger('drop', { dataTransfer: dt });

        cy.get(SELECTORS.ingredientByUid(uid1))
          .trigger('dragend', { dataTransfer: dt })
          .trigger('mouseup', { which: 1 });

        cy.get(SELECTORS.constructorDropArea)
          .find(SELECTORS.ingredientFilling)
          .then(children => {
            const arr = [...children];

            cy.get('@uid0').then(uid0 => {
              cy.wrap(arr.find(el => el.dataset.uid === uid0)).invoke('text')
                .should('contain', 'Spicy');
            });

            cy.get('@uid1').then(uid1 => {
              cy.wrap(arr.find(el => el.dataset.uid === uid1)).invoke('text')
                .should('contain', 'Space');
            });

            cy.get('@uid2').then(uid2 => {
              cy.wrap(arr.find(el => el.dataset.uid === uid2)).invoke('text')
                .should('contain', 'галактический');
            });
          });
      });
    });
  });
});
