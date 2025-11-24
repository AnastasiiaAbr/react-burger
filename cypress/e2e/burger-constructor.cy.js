/// <reference types="cypress" />

const SELECTORS = {
  ingredientCard: '[data-test="ingredient-card"]',
  constructorDrop: '[data-test="constructor-drop-area"]',
  modalContent: '[data-test="modal"]',
  modalOverlay: '[data-test="modal-overlay"]',
  modalClose: '[data-test="modal-close"]',
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
    cy.get('[data-test="ingredient-bun"]').should('not.exist');
    cy.get('[data-test="ingredient-card"][data-test-type="bun"]').first().click();
    cy.get('[data-test="constructor-drop-area"]').contains('верх').should('exist');
    cy.get(SELECTORS.modalClose).click();


    cy.get('[data-test="ingredient-filling"]').should('have.length', 0);
    cy.get('[data-test="ingredient-card"][data-test-type="main"]').first().click();
    cy.get('[data-test="ingredient-filling"]').should('have.length', 1);
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

    cy.get('[data-test="ingredient-card"][data-test-type="bun"]').first().click();
    cy.get('[data-test="constructor-drop-area"]').contains('верх').should('exist');
    cy.get(SELECTORS.modalClose).click();

    cy.get('[data-test="ingredient-card"][data-test-type="main"]').first().click();
    cy.get('[data-test="ingredient-filling"]').should('have.length.at.least', 1);
    cy.get(SELECTORS.modalClose).click();

    cy.get('[data-test="button-order"]').click();

    cy.wait('@makeOrder');

    cy.get('[data-test="modal"]').should('be.visible');
    cy.get('[data-test="modal"]').contains('12345').should('exist');
  });
});

describe('burger constructor without login', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients').as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  })
  it('перенаправляет на страницу логина при отсутствии пользователя', () => {
    cy.get('[data-test="ingredient-card"][data-test-type="bun"]').first().click();
    cy.get(SELECTORS.modalClose).click();
    cy.get('[data-test="ingredient-card"][data-test-type="main"]').first().click();
    cy.get(SELECTORS.modalClose).click();
    cy.get('[data-test="button-order"]').click();

    cy.url().should('include', '/login');
  });

})