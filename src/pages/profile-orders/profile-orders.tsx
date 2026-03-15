// src/pages/profile-orders/profile-orders.tsx
import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { fetchProfileOrders } from '../../services/slices/profileOrdersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector(
    (state) => state.profileOrders
  );

  useEffect(() => {
    if (!orders.length) {
      dispatch(fetchProfileOrders());
    }
  }, [dispatch, orders.length]);

  if (isLoading && !orders.length) {
    return (
      <p className='text text_type_main-medium pt-4'>Загрузка заказов...</p>
    );
  }

  if (error) {
    return (
      <p className='text text_type_main-medium pt-4'>
        Ошибка загрузки заказов: {error}
      </p>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
