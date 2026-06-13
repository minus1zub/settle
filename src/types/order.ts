import type { SettleAddress } from './address';
import type { ProductCategory, ProductRoom } from './product';

export type OrderStatus = 'draft' | 'assembled';

export type SettleOrderItem = {
  productId: string;
  title: string;
  price: number;
  image?: ProductCategory;
  category: ProductCategory;
  room: ProductRoom;
  quantity: number;
};

export type SettleOrder = {
  id?: string;
  slug?: string;
  orderNumber: string;
  title: string;
  phrase?: string;
  authorName?: string;
  telegramUserId?: string;
  items: SettleOrderItem[];
  address?: SettleAddress;
  totalPrice: number;
  status: OrderStatus;
  createdAt?: string;
};
