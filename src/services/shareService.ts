import type { SettleOrder } from '../types/order';
import { formatPrice, pluralizeProducts } from '../utils/price';

export const getPublicAppUrl = () => {
  const configuredUrl = import.meta.env.VITE_PUBLIC_APP_URL as string | undefined;
  return configuredUrl?.replace(/\/$/, '') || window.location.origin;
};

export const createPublicOrderUrl = (slug: string) => `${getPublicAppUrl()}/order/${slug}`;

export const createTelegramOrderUrl = (slug: string) => {
  const botUsername = (import.meta.env.VITE_TELEGRAM_BOT_USERNAME as string | undefined)?.replace(/^@/, '');
  const appName = import.meta.env.VITE_TELEGRAM_APP_NAME as string | undefined;

  if (!botUsername || !appName) return undefined;

  return `https://t.me/${botUsername}/${appName}?startapp=${encodeURIComponent(`order_${slug}`)}`;
};

export const createShareMessage = (order: SettleOrder, url: string) => {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return [
    `${order.title || 'Заказ Settle'} · № ${order.orderNumber}`,
    `${pluralizeProducts(itemCount)} · ${formatPrice(order.totalPrice)}`,
    '',
    'Открыть заказ:',
    url,
  ].join('\n');
};

export const shareService = {
  async copyLink(url: string) {
    await navigator.clipboard.writeText(url);
  },

  async copyMessage(order: SettleOrder, url: string) {
    await navigator.clipboard.writeText(createShareMessage(order, url));
  },

  async shareOrder(order: SettleOrder, url: string) {
    const text = createShareMessage(order, url);

    if (navigator.share) {
      await navigator.share({
        title: order.title,
        text,
      });
      return true;
    }

    await navigator.clipboard.writeText(text);
    return false;
  },
};
