/// <reference types="cypress" />
import { DndSimulatorDataTransfer } from "./dndSimulator";

Cypress.Commands.add('addIngredient', (index) => {
  const dt = new DndSimulatorDataTransfer();
  cy.get('[data-test="ingredient-card-draggable"]').eq(index)
    .trigger('mousedown', { which: 1 })
    .trigger('dragstart', { dataTransfer: dt })
    .trigger('drag', {});

  cy.get('[data-test="constructor-drop-area"]')
    .trigger('dragover', { dataTransfer: dt })
    .trigger('drop', { dataTransfer: dt })
    .trigger('dragend', { dataTransfer: dt })
    .trigger('mouseup', { which: 1 });
});



