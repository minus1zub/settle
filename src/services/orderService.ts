import type { SettleOrder } from '../types/order';
import { createOrderNumber } from '../utils/orderNumber';
import { createOrderSlug } from '../utils/slug';
import { getTelegramUser } from '../utils/telegram';
import { isSupabaseConfigured, supabase } from './supabaseClient';

type OrderRow = {
  id?: string;
  slug: string;
  order_number: string;
  title: string;
  phrase?: string;
  status?: 'draft' | 'assembled';
  author_name?: string;
  telegram_user_id?: string;
  address?: SettleOrder['address'];
  items?: SettleOrder['items'];
  total_price?: number;
  created_at?: string;
};

const LOCAL_ORDERS_KEY = 'settle-local-orders';

const readLocalOrders = (): SettleOrder[] => {
  if (typeof window === 'undefined') return [];

  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_ORDERS_KEY) ?? '[]') as SettleOrder[];
  } catch {
    return [];
  }
};

const writeLocalOrder = (order: SettleOrder) => {
  if (typeof window === 'undefined') return;

  const orders = readLocalOrders().filter((item) => item.slug !== order.slug);
  window.localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([order, ...orders].slice(0, 20)));
};

const toOrderRow = (order: SettleOrder) => ({
  slug: order.slug,
  order_number: order.orderNumber,
  title: order.title,
  phrase: order.phrase,
  status: order.status,
  author_name: order.authorName,
  telegram_user_id: order.telegramUserId,
  address: order.address ?? null,
  courier_comment: order.address?.note ?? null,
  items: order.items,
  total_price: order.totalPrice,
});

const fromOrderRow = (row: OrderRow): SettleOrder => ({
  id: row.id,
  slug: row.slug,
  orderNumber: row.order_number,
  title: row.title,
  phrase: row.phrase,
  status: row.status ?? 'assembled',
  authorName: row.author_name,
  telegramUserId: row.telegram_user_id,
  address: row.address,
  items: row.items ?? [],
  totalPrice: row.total_price ?? 0,
  createdAt: row.created_at,
});

export const orderService = {
  prepareOrder(order: SettleOrder): SettleOrder {
    const orderNumber = order.orderNumber || createOrderNumber();
    const telegramUser = getTelegramUser();

    return {
      ...order,
      orderNumber,
      slug: order.slug || createOrderSlug(orderNumber),
      status: 'assembled',
      authorName: order.authorName || telegramUser?.firstName || telegramUser?.username,
      telegramUserId: order.telegramUserId || telegramUser?.id,
    };
  },

  async saveOrder(order: SettleOrder): Promise<SettleOrder> {
    const preparedOrder = this.prepareOrder(order);

    if (!isSupabaseConfigured || !supabase) {
      writeLocalOrder(preparedOrder);
      return preparedOrder;
    }

    const { data, error } = await supabase.from('orders').insert(toOrderRow(preparedOrder)).select('*').single();

    if (error) throw error;
    const savedOrder = fromOrderRow(data);
    writeLocalOrder(savedOrder);
    return savedOrder;
  },

  async getOrderBySlug(slug: string): Promise<SettleOrder | undefined> {
    const localOrder = readLocalOrders().find((order) => order.slug === slug);
    if (!isSupabaseConfigured || !supabase) return localOrder;

    const { data, error } = await supabase.from('orders').select('*').eq('slug', slug).single();
    if (error) throw error;

    return data ? fromOrderRow(data) : localOrder;
  },
};
