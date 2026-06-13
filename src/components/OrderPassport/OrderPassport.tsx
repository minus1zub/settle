import { motion } from 'framer-motion';
import { ProductPlaceholder } from '../ProductPlaceholder/ProductPlaceholder';
import { StatusSticker } from '../StatusSticker/StatusSticker';
import type { SettleOrder } from '../../types/order';
import { formatPrice, pluralizeProducts } from '../../utils/price';

type PassportVariant = 'draft' | 'review' | 'ready' | 'public';

type Props = {
  order: SettleOrder;
  variant?: PassportVariant;
  className?: string;
};

const getItemCount = (order: SettleOrder) => order.items.reduce((sum, item) => sum + item.quantity, 0);

const getDisplayNumber = (order: SettleOrder) => order.orderNumber || 'ST-собирается';

const getEmotionalStatus = (order: SettleOrder, variant: PassportVariant) => {
  const count = getItemCount(order);

  if (variant === 'public') return 'Можно отправлять';
  if (variant === 'ready' || order.status === 'assembled') return 'Собран';
  if (variant === 'review' && order.address) return 'Готов к карточке';
  if (order.address && count > 0) return 'Почти собран';
  if (count >= 3) return 'Уже похож';
  if (count > 0) return 'Начался';
  return 'Пустой';
};

const getStickers = (order: SettleOrder, variant: PassportVariant) => {
  const count = getItemCount(order);
  const stickers: Array<{ label: string; tone: 'blue' | 'mint' | 'orange' | 'lilac' | 'dark' | 'green' }> = [];

  if (count > 0) stickers.push({ label: 'товары на месте', tone: 'blue' });
  if (count >= 3) stickers.push({ label: 'уже похоже', tone: 'mint' });
  if (order.address) stickers.push({ label: 'адрес закреплен', tone: 'orange' });
  if (variant === 'review') stickers.push({ label: 'карточка ждет', tone: 'lilac' });
  if (variant === 'ready' || variant === 'public' || order.status === 'assembled') {
    stickers.push({ label: 'выглядит убедительно', tone: 'green' });
    stickers.push({ label: 'можно отправлять', tone: 'dark' });
  } else if (order.totalPrice > 0) {
    stickers.push({ label: 'сумма выглядит важно', tone: 'lilac' });
  }

  return stickers.slice(0, 5);
};

export const OrderPassport = ({ order, variant = 'draft', className }: Props) => {
  const itemCount = getItemCount(order);
  const status = getEmotionalStatus(order, variant);
  const stickers = getStickers(order, variant);
  const visibleItems = order.items.slice(0, 4);

  return (
    <motion.section
      className={`order-passport order-passport--${variant} ${className ?? ''}`}
      layout
      layoutId="order-passport"
      initial={{ opacity: 0, y: 14, rotate: -0.8 }}
      animate={{ opacity: 1, y: 0, rotate: variant === 'review' ? -0.8 : 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
    >
      <div className="order-passport__top">
        <div>
          <span className="order-passport__brand">Settle passport</span>
          <strong>{getDisplayNumber(order)}</strong>
        </div>
        <div className="order-passport__status">{status}</div>
      </div>

      <div className="order-passport__metrics">
        <div>
          <span>Товары</span>
          <strong>{pluralizeProducts(itemCount)}</strong>
        </div>
        <div>
          <span>Сумма</span>
          <strong>{formatPrice(order.totalPrice)}</strong>
        </div>
        <div>
          <span>Адрес</span>
          <strong>{order.address ? 'добавлен' : 'ждет'}</strong>
        </div>
      </div>

      <div className="order-passport__items">
        {visibleItems.map((item) => (
          <div className="order-passport__item" key={item.productId}>
            <ProductPlaceholder category={item.image ?? item.category} size="sm" />
            <div>
              <strong>{item.title}</strong>
              <span>
                {item.quantity} шт. · {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          </div>
        ))}
        {order.items.length > visibleItems.length && (
          <div className="order-passport__more">+ еще {order.items.length - visibleItems.length}</div>
        )}
      </div>

      <div className="order-passport__stickers">
        {stickers.map((sticker) => (
          <StatusSticker key={sticker.label} tone={sticker.tone}>
            {sticker.label}
          </StatusSticker>
        ))}
      </div>

      {(variant === 'ready' || variant === 'public' || order.status === 'assembled') && (
        <motion.div
          className="order-passport__stamp"
          initial={{ opacity: 0, scale: 1.4, rotate: -18 }}
          animate={{ opacity: 1, scale: 1, rotate: -10 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 18 }}
        >
          собран
        </motion.div>
      )}
    </motion.section>
  );
};
