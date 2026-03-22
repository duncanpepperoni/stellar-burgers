import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
  clearOrderModal,
  createOrder
} from '../constructorSlice';
import type { ConstructorState } from '../constructorSlice';
import type { TConstructorIngredient } from '../../../utils/types';

describe('constructorSlice', () => {
  const initialState: ConstructorState = {
    items: {
      bun: null,
      ingredients: []
    },
    orderRequest: false,
    orderModalData: null,
    error: null
  };

  const bun: TConstructorIngredient = {
    _id: 'bun-id',
    id: 'bun-id',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 100,
    image: '',
    image_mobile: '',
    image_large: ''
  };

  const ingredient: TConstructorIngredient = {
    _id: 'ingredient-id',
    id: 'ingredient-id',
    name: 'Тестовая начинка',
    type: 'main',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 50,
    image: '',
    image_mobile: '',
    image_large: ''
  };

  it('должен возвращать начальное состояние по умолчанию', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  it('addIngredient с типом bun должен устанавливать булку', () => {
    const state = constructorReducer(initialState, addIngredient(bun));

    expect(state.items.bun).toEqual(bun);
    expect(state.items.ingredients).toHaveLength(0);
  });

  it('addIngredient должен добавлять начинку', () => {
    const state = constructorReducer(initialState, addIngredient(ingredient));

    expect(state.items.ingredients).toHaveLength(1);
    expect(state.items.ingredients[0]).toEqual(ingredient);
  });

  it('removeIngredient должен удалять ингредиент по id', () => {
    const startState: ConstructorState = {
      ...initialState,
      items: {
        bun: null,
        ingredients: [ingredient]
      }
    };

    const state = constructorReducer(
      startState,
      removeIngredient(ingredient.id)
    );

    expect(state.items.ingredients).toHaveLength(0);
  });

  it('moveIngredient должен менять порядок ингредиентов', () => {
    const ingredient2: TConstructorIngredient = {
      ...ingredient,
      _id: 'ingredient-id-2',
      id: 'ingredient-id-2',
      name: 'Вторая начинка'
    };

    const startState: ConstructorState = {
      ...initialState,
      items: {
        bun: null,
        ingredients: [ingredient, ingredient2]
      }
    };

    const state = constructorReducer(
      startState,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(state.items.ingredients[0]).toEqual(ingredient2);
    expect(state.items.ingredients[1]).toEqual(ingredient);
  });

  it('resetConstructor должен очищать только items', () => {
    const startState: ConstructorState = {
      items: {
        bun,
        ingredients: [ingredient]
      },
      orderRequest: true,
      orderModalData: { number: 123 } as any,
      error: 'error'
    };

    const state = constructorReducer(startState, resetConstructor());

    expect(state.items).toEqual(initialState.items);
    expect(state.orderRequest).toBe(true);
    expect(state.orderModalData).toEqual(startState.orderModalData);
    expect(state.error).toBe('error');
  });

  it('clearOrderModal должен чистить модалку и ошибку', () => {
    const startState: ConstructorState = {
      ...initialState,
      orderModalData: { number: 123 } as any,
      error: 'error'
    };

    const state = constructorReducer(startState, clearOrderModal());

    expect(state.orderModalData).toBeNull();
    expect(state.error).toBeNull();
  });

  describe('createOrder extraReducers', () => {
    it('createOrder.pending', () => {
      const state = constructorReducer(
        initialState,
        createOrder.pending('', undefined as any)
      );

      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    it('createOrder.fulfilled', () => {
      const orderPayload = {
        _id: 'order-id',
        status: 'done',
        name: 'Тестовый заказ',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        number: 12345,
        ingredients: ['id1', 'id2']
      };

      const state = constructorReducer(
        initialState,
        createOrder.fulfilled(orderPayload as any, '', undefined as any)
      );

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(orderPayload);
      expect(state.items).toEqual(initialState.items);
      expect(state.error).toBeNull();
    });

    it('createOrder.rejected', () => {
      const state = constructorReducer(
        initialState,
        createOrder.rejected(
          new Error('Ошибка заказа'),
          '',
          undefined as any,
          'Ошибка заказа'
        )
      );

      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe('Ошибка заказа');
    });
  });
});
