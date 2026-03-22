// src/services/slices/constructorSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { orderBurgerApi } from '../../utils/burger-api';
import { TConstructorIngredient, TIngredient, TOrder } from '../../utils/types';
import { RootState } from '../root-reducer';

export type ConstructorItems = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export type ConstructorState = {
  items: ConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: ConstructorState = {
  items: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  error: null
};

type TCreateOrderRejectValue = string;

export const createOrder = createAsyncThunk<
  TOrder,
  void,
  {
    state: RootState;
    rejectValue: TCreateOrderRejectValue;
  }
>('constructor/createOrder', async (_, { getState, rejectWithValue }) => {
  try {
    const { items } = getState().burgerConstructor;
    const bun = items.bun;
    const ingredients = items.ingredients;

    if (!bun) {
      return rejectWithValue('Булка не выбрана');
    }

    const ingredientsIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    const data = await orderBurgerApi(ingredientsIds);
    const now = new Date().toISOString();

    const order: TOrder = {
      _id: data.order._id,
      status: data.order.status,
      name: data.order.name,
      createdAt: data.order.createdAt || now,
      updatedAt: data.order.updatedAt || now,
      number: data.order.number,
      ingredients: ingredientsIds
    };

    return order;
  } catch (err) {
    const error = err as { message?: string } | null;
    const message = error?.message || 'Не удалось оформить заказ';

    return rejectWithValue(message);
  }
});

type TMovePayload = {
  fromIndex: number;
  toIndex: number;
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      const ingredient = action.payload;

      if (ingredient.type === 'bun') {
        state.items.bun = ingredient;
        return;
      }

      state.items.ingredients.push(ingredient);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.items.ingredients = state.items.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (state, action: PayloadAction<TMovePayload>) => {
      const { fromIndex, toIndex } = action.payload;
      const ingredients = [...state.items.ingredients];

      const [removed] = ingredients.splice(fromIndex, 1);
      ingredients.splice(toIndex, 0, removed);

      state.items.ingredients = ingredients;
    },
    resetConstructor: (state) => {
      state.items = {
        bun: null,
        ingredients: []
      };
    },
    clearOrderModal: (state) => {
      state.orderModalData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.items = {
          bun: null,
          ingredients: []
        };
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload || 'Ошибка оформления заказа';
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
  clearOrderModal
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;

export const addIngredientWithId = (ingredient: TIngredient) => {
  const ingredientWithId: TConstructorIngredient = {
    ...ingredient,
    id: uuidv4()
  };

  return addIngredient(ingredientWithId);
};
