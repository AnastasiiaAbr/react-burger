/// <reference types="cypress" />

const SELECTORS = {
  ingredientCard: '[data-test="ingredient-card"]',
  ingredientBun: '[data-test="ingredient-bun"]',
  ingredientFilling: '[data-test="ingredient-filling"]',
  constructorDrop: '[data-test="constructor-drop-area"]',
  buttonOrder: '[data-test="button-order"]',
  modalContent: '[data-test="modal"]',
  modalOverlay: '[data-test="modal-overlay"]',
  modalClose: '[data-test="modal-close"]',
  ingredientCardBun: '[data-test="ingredient-card"][data-test-type="bun"]',
  ingredientCardMain: '[data-test="ingredient-card"][data-test-type="main"]',
}


describe('Burger Constructor', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: {
          email: 'test@test.ru',
          name: 'Test User'
        }
      }
    }).as('getUser');
    cy.intercept('GET', '/api/ingredients').as('getIngredients');
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('accessToken', 'fake-access-token');
        win.localStorage.setItem('refreshToken', 'fake-refresh-token');
      }
    });
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  it('открывает и закрывает модальное окно', () => {
    cy.get(SELECTORS.ingredientCard).first().click();
    cy.get(SELECTORS.modalContent).should('be.visible');

    cy.get(SELECTORS.modalClose).click();
    cy.get(SELECTORS.modalContent).should('not.exist');

    cy.get(SELECTORS.ingredientCard).first().click();
    cy.get('body').type('{esc}');
    cy.get(SELECTORS.modalContent).should('not.exist');
  });

  it('добавляет ингредиент из списка в конструктор по клику', () => {
    cy.get(SELECTORS.ingredientBun).should('not.exist');
    cy.get(SELECTORS.ingredientCardBun).first().click();
    cy.get(SELECTORS.constructorDrop).contains('верх').should('exist');
    cy.get(SELECTORS.modalClose).click();


    cy.get(SELECTORS.ingredientFilling).should('have.length', 0);
    cy.get(SELECTORS.ingredientCardMain).first().click();
    cy.get(SELECTORS.ingredientFilling).should('have.length', 1);
    cy.get(SELECTORS.modalClose).click();
  });

  it('создает заказ при наличии булки и начинки для авторизованного пользователя', () => {
    cy.intercept('POST', '/api/orders', {
      statusCode: 200,
      body: {
        success: true,
        order: { number: 12345 }
      }
    }).as('makeOrder');

    cy.get(SELECTORS.ingredientCardBun).first().click();
    cy.get(SELECTORS.constructorDrop).contains('верх').should('exist');
    cy.get(SELECTORS.modalClose).click();

    cy.get(SELECTORS.ingredientCardMain).first().click();
    cy.get(SELECTORS.ingredientFilling).should('have.length.at.least', 1);
    cy.get(SELECTORS.modalClose).click();

    cy.get(SELECTORS.buttonOrder).click();

    cy.wait('@makeOrder');

    cy.get(SELECTORS.modalContent).should('be.visible');
    cy.get(SELECTORS.modalContent).contains('12345').should('exist');
  });
});

describe('burger constructor without login', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients').as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  })
  it('перенаправляет на страницу логина при отсутствии пользователя', () => {
    cy.get(SELECTORS.ingredientCardBun).first().click();
    cy.get(SELECTORS.modalClose).click();
    cy.get(SELECTORS.ingredientCardMain).first().click();
    cy.get(SELECTORS.modalClose).click();
    cy.get(SELECTORS.buttonOrder).click();

    cy.url().should('include', '/login');
  });

})