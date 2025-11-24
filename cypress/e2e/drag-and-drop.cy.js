// воспользовалась способом, который нашла тут https://github.com/cypress-io/cypress/issues/1752, иначе не получалось пройти тесты

function DndSimulatorDataTransfer() {
  this.data = {};
  this.dropEffect = "move";
  this.effectAllowed = "all";
  this.files = [];
  this.items = [];
  this.types = [];
}

DndSimulatorDataTransfer.prototype.clearData = function(format) {
  if (format) {
    delete this.data[format];
    const index = this.types.indexOf(format);
    delete this.types[index];
    delete this.data[index];
  } else {
    this.data = {};
  }
};

DndSimulatorDataTransfer.prototype.setData = function(format, data) {
  this.data[format] = data;
  this.items.push(data);
  this.types.push(format);
};

DndSimulatorDataTransfer.prototype.getData = function(format) {
  return this.data[format] || "";
};

DndSimulatorDataTransfer.prototype.setDragImage = function(img, xOffset, yOffset) {};

describe('drag-and-drop', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients').as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('добавляет элементы и меняет их между собой при drag and drop', () => {
    const addIngredient = (index) => {
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
    };

    addIngredient(2);
    addIngredient(3);

    const elementsSelector = '[data-test="ingredient-filling"]';

    cy.get(elementsSelector).should('have.length', 2);

    cy.get(elementsSelector).then(elements => {
      const textsBefore = [...elements].map(el => el.innerText);
      const dt = new DndSimulatorDataTransfer();

      cy.wrap(elements[0])
        .trigger('dragstart', { dataTransfer: dt });

      cy.wrap(elements[1])
        .trigger('dragover', { dataTransfer: dt })
        .trigger('drop', { dataTransfer: dt })
        .trigger('dragend', { dataTransfer: dt });

      cy.get(elementsSelector).then(newElements => {
        const textsAfter = [...newElements].map(el => el.innerText);
        expect(textsAfter[0]).to.eq(textsBefore[1]);
        expect(textsAfter[1]).to.eq(textsBefore[0]);
      });
    });
  });
});
