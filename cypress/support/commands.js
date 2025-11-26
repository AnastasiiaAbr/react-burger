/// <reference types="cypress" />
import { DndSimulatorDataTransfer } from "./dndSimulator";

const SELECTORS = {
  constructorDropArea: '[data-test="constructor-drop-area"]',
  ingredientCardDraggable: '[data-test="ingredient-card-draggable"]',
};

Cypress.Commands.add('addIngredient', (index) => {
  const dt = new DndSimulatorDataTransfer();
  cy.get(SELECTORS.ingredientCardDraggable).eq(index)
    .trigger('mousedown', { which: 1 })
    .trigger('dragstart', { dataTransfer: dt })
    .trigger('drag', {});

  cy.get(SELECTORS.constructorDropArea)
    .trigger('dragover', { dataTransfer: dt })
    .trigger('drop', { dataTransfer: dt })
    .trigger('dragend', { dataTransfer: dt })
    .trigger('mouseup', { which: 1 });
});



