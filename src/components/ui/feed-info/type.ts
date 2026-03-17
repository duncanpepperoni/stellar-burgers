import { TOrder } from '@utils-types';

export type TFeedSummary = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type FeedInfoUIProps = {
  feed: TFeedSummary;
  readyOrders: number[];
  pendingOrders: number[];
};

export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: string;
};

export type TColumnProps = {
  title: string;
  content: number;
};
