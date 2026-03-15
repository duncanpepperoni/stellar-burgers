// src/components/burger-constructor/burger-constructor.tsx
import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearOrderModal,
  createOrder
} from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorState = useSelector((state) => state.burgerConstructor);

  const constructorItems = constructorState ? constructorState.items : null;
  const orderRequest = constructorState ? constructorState.orderRequest : false;
  const orderModalData = constructorState
    ? constructorState.orderModalData
    : null;

  const onOrderClick = () => {
    if (!constructorItems || !constructorItems.bun || orderRequest) return;
    dispatch(createOrder());
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(() => {
    if (!constructorItems) {
      return 0;
    }
    return (
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      )
    );
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems || { bun: null, ingredients: [] }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
