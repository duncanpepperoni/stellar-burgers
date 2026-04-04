/// <reference types="cypress" />

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов', () => {
    it('должен добавлять булку в конструктор', () => {
      cy.get('[data-testid="ingredient-item"]').first().find('button').click();

      // счётчик на карточке — булка добавлена в конструктор
      cy.get('[data-testid="ingredient-item"]')
        .first()
        .find('.counter')
        .should('exist');

      // булка содержится именно в конструкторе
      cy.get('[data-testid="burger-constructor"]')
        .contains('Краторная булка N-200i')
        .should('exist');
    });

    it('должен добавлять начинку в конструктор', () => {
      cy.get('[data-testid="ingredient-item"]').eq(1).find('button').click();

      // счётчик на карточке — начинка добавлена в конструктор
      cy.get('[data-testid="ingredient-item"]')
        .eq(1)
        .find('.counter')
        .should('exist');

      // начинка содержится именно в конструкторе
      cy.get('[data-testid="burger-constructor"]')
        .contains('Биокотлета из марсианской Магнолии')
        .should('exist');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('открывается при клике на ингредиент', () => {
      cy.get('[data-testid="ingredient-item"]').first().find('a').click();

      cy.get('[data-testid="modal"]').should('exist');
      cy.get('[data-testid="modal"]').contains('Краторная булка N-200i');
    });

    it('закрывается по клику на крестик', () => {
      cy.get('[data-testid="ingredient-item"]').first().find('a').click();
      cy.get('[data-testid="modal"]').should('exist');

      cy.get('[data-testid="modal-close-button"]').click({ force: true });
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('закрывается по клику на оверлей', () => {
      cy.get('[data-testid="ingredient-item"]').first().find('a').click();
      cy.get('[data-testid="modal"]').should('exist');

      cy.get('[data-testid="modal-overlay"]').click({ force: true });
      cy.get('[data-testid="modal"]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as(
        'getUser'
      );
      cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
        'createOrder'
      );

      window.localStorage.setItem('refreshToken', 'test-refresh-token');
      cy.setCookie('accessToken', 'Bearer test-access-token');

      cy.visit('/');
      cy.wait('@getIngredients');
      cy.wait('@getUser');
    });

    afterEach(() => {
      window.localStorage.removeItem('refreshToken');
      cy.clearCookie('accessToken');
    });

    it('должен создавать заказ и показывать номер', () => {
      // Добавляем булку и начинку в конструктор
      cy.get('[data-testid="ingredient-item"]').first().find('button').click();
      cy.get('[data-testid="ingredient-item"]').eq(1).find('button').click();

      // убеждаемся, что элементы есть именно в конструкторе
      cy.get('[data-testid="burger-constructor"]')
        .contains('Краторная булка N-200i')
        .should('exist');
      cy.get('[data-testid="burger-constructor"]')
        .contains('Биокотлета из марсианской Магнолии')
        .should('exist');

      // Оформляем заказ
      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      // Проверяем модальное окно с номером заказа
      cy.get('[data-testid="modal"]').should('exist');
      cy.get('[data-testid="modal"]').contains('12345');

      // Закрываем модалку
      cy.get('[data-testid="modal-close-button"]').click({ force: true });
      cy.get('[data-testid="modal"]').should('not.exist');

      // Проверяем, что конструктор очистился:
      // добавленных элементов больше нет в конструкторе
      cy.get('[data-testid="burger-constructor"]')
        .contains('Краторная булка N-200i')
        .should('not.exist');
      cy.get('[data-testid="burger-constructor"]')
        .contains('Биокотлета из марсианской Магнолии')
        .should('not.exist');
    });
  });
});
