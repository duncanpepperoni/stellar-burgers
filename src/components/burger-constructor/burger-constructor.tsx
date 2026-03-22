import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearOrderModal,
  createOrder
} from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorState = useSelector((state) => state.burgerConstructor);
  const user = useSelector((state) => state.user.user);

  const constructorItems = constructorState ? constructorState.items : null;
  const orderRequest = constructorState ? constructorState.orderRequest : false;
  const orderModalData = constructorState
    ? constructorState.orderModalData
    : null;

  const onOrderClick = () => {
    if (!constructorItems || !constructorItems.bun || orderRequest) return;

    // если пользователь не авторизован — уводим на логин
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

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
