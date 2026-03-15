// src/pages/feed/feed.tsx
import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.feed);

  useEffect(() => {
    if (!orders.length) {
      dispatch(fetchFeed());
    }
  }, [dispatch, orders.length]);

  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='text text_type_main-medium pt-4'>
        Ошибка загрузки ленты: {error}
      </div>
    );
  }

  return <FeedUI orders={orders as TOrder[]} handleGetFeeds={handleGetFeeds} />;
};
