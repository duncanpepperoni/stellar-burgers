import { ingredientsReducer, fetchIngredients } from '../ingredientsSlice';
import type { IngredientsState } from '../ingredientsSlice';
import type { TIngredient } from '../../../utils/types';

describe('ingredientsSlice', () => {
  const initialState: IngredientsState = {
    items: [],
    isLoading: false,
    error: null
  };

  const ingredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 0,
      fat: 0,
      carbohydrates: 0,
      calories: 0,
      price: 100,
      image: '',
      image_mobile: '',
      image_large: ''
    },
    {
      _id: '2',
      name: 'Начинка',
      type: 'main',
      proteins: 0,
      fat: 0,
      carbohydrates: 0,
      calories: 0,
      price: 50,
      image: '',
      image_mobile: '',
      image_large: ''
    }
  ];

  it('должен возвращать начальное состояние по умолчанию', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  it('fetchIngredients.pending: isLoading true, error null', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.pending('', undefined as any)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchIngredients.fulfilled: кладёт данные и выключает isLoading', () => {
    const payload = ingredients;

    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      fetchIngredients.fulfilled(payload, '', undefined as any)
    );

    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(payload);
    expect(state.error).toBeNull();
  });

  it('fetchIngredients.rejected: сохраняет ошибку и выключает isLoading', () => {
    const action = fetchIngredients.rejected(
      new Error('Ошибка загрузки'),
      '',
      undefined as any,
      'Ошибка загрузки'
    );

    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      action
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
