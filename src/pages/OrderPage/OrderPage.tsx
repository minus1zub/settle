import { Minus, Plus, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AnimatedValue } from '../../components/AnimatedValue/AnimatedValue';
import { AnimatedButton } from '../../components/AnimatedButton/AnimatedButton';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { OrderPassport } from '../../components/OrderPassport/OrderPassport';
import { ProductPlaceholder } from '../../components/ProductPlaceholder/ProductPlaceholder';
import { StatusSticker } from '../../components/StatusSticker/StatusSticker';
import { getAddressFormatted } from '../../features/address/address.privacy';
import { useOrderStore } from '../../stores/orderStore';
import { formatPrice, pluralizeProducts } from '../../utils/price';
import { impactHaptic } from '../../utils/telegram';

export const OrderPage = () => {
  const navigate = useNavigate();
  const items = useOrderStore((state) => state.items);
  const address = useOrderStore((state) => state.address);
  const increment = useOrderStore((state) => state.increment);
  const decrement = useOrderStore((state) => state.decrement);
  const removeProduct = useOrderStore((state) => state.removeProduct);
  const clearOrder = useOrderStore((state) => state.clearOrder);
  const totalPrice = useOrderStore((state) => state.getTotalPrice());
  const orderTitle = useOrderStore((state) => state.getOrderTitle());
  const orderPhrase = useOrderStore((state) => state.getOrderPhrase());
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const draftOrder = useMemo(
    () => ({
      orderNumber: '',
      title: orderTitle,
      phrase: orderPhrase,
      items,
      address,
      totalPrice,
      status: 'draft' as const,
    }),
    [address, items, orderPhrase, orderTitle, totalPrice],
  );

  const handleReview = () => {
    if (items.length === 0) {
      toast.error('Добавьте хотя бы один товар');
      return;
    }
    if (!address) {
      toast.error('Выберите адрес');
      return;
    }
    navigate('/review');
  };

  const handleIncrement = (productId: string) => {
    increment(productId);
    impactHaptic('light');
  };

  const handleDecrement = (productId: string) => {
    decrement(productId);
    impactHaptic('light');
  };

  const handleRemove = (productId: string) => {
    removeProduct(productId);
    impactHaptic('medium');
  };

  const handleClearOrder = () => {
    clearOrder();
    impactHaptic('medium');
    toast.success('Заказ очищен', {
      description: 'Можно собрать следующий.',
    });
    navigate('/rooms');
  };

  if (items.length === 0) {
    return (
      <div className="page">
        <EmptyState
          title="Мой заказ"
          text="Пока здесь пусто. Добавьте пару вещей, чтобы собрать заказ для дома."
          action={
            <Link to="/rooms" className="primary-button">
              Начать с комнаты
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="page">
      <section className="page-heading">
        <span className="eyebrow">Заказ собирается</span>
        <h1>Заказ стал серьезнее</h1>
        <p className="animated-line">
          <AnimatedValue value={pluralizeProducts(itemCount)} />
          <span>·</span>
          <AnimatedValue value={formatPrice(totalPrice)} />
        </p>
      </section>

      <OrderPassport order={draftOrder} variant="draft" />

      <section className="progress-card">
        <div className="progress-step done">Товары</div>
        <div className={`progress-step ${address ? 'done' : ''}`}>Адрес</div>
        <div className="progress-step">Карточка</div>
        <div className="progress-step">Поделиться</div>
      </section>

      <AnimatePresence>
        {itemCount >= 3 && (
          <motion.section
            className="order-milestone"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          >
            <StatusSticker tone="mint">уже похоже</StatusSticker>
            <span>Заказ уже выглядит собранным</span>
            <strong>{pluralizeProducts(itemCount)}</strong>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.div className="order-list" layout>
        <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            className="order-item"
            key={item.productId}
            layout
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -18, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
          >
            <ProductPlaceholder category={item.image ?? item.category} size="sm" />
            <div>
              <strong>{item.title}</strong>
              <span>
                <AnimatedValue value={formatPrice(item.price * item.quantity)} />
              </span>
              <div className="quantity">
                <motion.button
                  type="button"
                  onClick={() => handleDecrement(item.productId)}
                  aria-label="Уменьшить"
                  whileTap={{ scale: 0.82 }}
                >
                  <Minus size={16} />
                </motion.button>
                <AnimatedValue value={item.quantity} className="quantity-value" />
                <motion.button
                  type="button"
                  onClick={() => handleIncrement(item.productId)}
                  aria-label="Увеличить"
                  whileTap={{ scale: 0.82 }}
                >
                  <Plus size={16} />
                </motion.button>
              </div>
            </div>
            <AnimatedButton
              type="button"
              className="icon-button"
              variant="destructive"
              onClick={() => handleRemove(item.productId)}
              aria-label="Удалить"
            >
              <Trash2 size={18} />
            </AnimatedButton>
          </motion.div>
        ))}
        </AnimatePresence>
      </motion.div>

      <section className="summary-block">
        <div>
          <span>Итого</span>
          <strong>
            <AnimatedValue value={formatPrice(totalPrice)} />
          </strong>
        </div>
        <div>
          <span>Адрес</span>
          <div className="address-summary">
            {address ? <strong>{getAddressFormatted(address)}</strong> : <strong>Адрес не выбран</strong>}
            <Link to="/address">{address ? 'Изменить адрес' : 'Выбрать адрес'}</Link>
          </div>
        </div>
      </section>

      <div className="sticky-actions">
        <AnimatedButton type="button" variant="destructive" className="secondary-button" onClick={handleClearOrder}>
          Очистить
        </AnimatedButton>
        <AnimatedButton type="button" variant="primary-dopamine" className="primary-button" onClick={handleReview}>
          Проверить заказ
        </AnimatedButton>
      </div>
    </div>
  );
};
