import { MapPin, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AnimatedButton } from '../../components/AnimatedButton/AnimatedButton';
import { OrderBuildingRitual } from '../../components/OrderBuildingRitual/OrderBuildingRitual';
import { OrderPassport } from '../../components/OrderPassport/OrderPassport';
import { ProductThumb } from '../../components/ProductThumb/ProductThumb';
import { getAddressFormatted } from '../../features/address/address.privacy';
import { orderService } from '../../services/orderService';
import { useOrderStore } from '../../stores/orderStore';
import { createOrderNumber } from '../../utils/orderNumber';
import { formatPrice, pluralizeProducts } from '../../utils/price';
import { notificationHaptic } from '../../utils/telegram';

const buildSteps = ['Проверяем товары', 'Прикрепляем адрес', 'Считаем сумму', 'Собираем карточку'];

export const ReviewOrderPage = () => {
  const navigate = useNavigate();
  const items = useOrderStore((state) => state.items);
  const address = useOrderStore((state) => state.address);
  const totalPrice = useOrderStore((state) => state.getTotalPrice());
  const toDraftOrder = useOrderStore((state) => state.toDraftOrder);
  const setLastOrderSlug = useOrderStore((state) => state.setLastOrderSlug);
  const hasMilestone = useOrderStore((state) => state.hasMilestone);
  const markMilestone = useOrderStore((state) => state.markMilestone);
  const [isBuilding, setIsBuilding] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const orderNumber = useMemo(() => createOrderNumber(), []);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const draftOrder = { ...toDraftOrder(), orderNumber };

  useEffect(() => {
    if (!isBuilding) return;

    const timers = buildSteps.map((_, index) =>
      window.setTimeout(() => setStepIndex(index), 350 + index * 420),
    );

    return () => {
      timers.forEach(window.clearTimeout);
    };
  }, [isBuilding]);

  const handleBuildOrder = async () => {
    if (items.length === 0) {
      navigate('/order');
      return;
    }

    if (!address) {
      toast.error('Выберите адрес');
      navigate('/address');
      return;
    }

    setIsBuilding(true);
    if (!hasMilestone('review-order')) {
      markMilestone('review-order');
    }

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 2100));
      const savedOrder = await orderService.saveOrder({
        ...toDraftOrder(),
        orderNumber,
      });
      setLastOrderSlug(savedOrder.slug);
      if (!hasMilestone('order-built')) {
        markMilestone('order-built');
      }
      notificationHaptic('success');
      toast.success('Заказ собран', {
        description: 'Карточка выглядит убедительно.',
      });
      navigate(`/order-ready/${savedOrder.slug}`);
    } catch (error) {
      console.error(error);
      toast.error('Не удалось собрать заказ');
      setIsBuilding(false);
    }
  };

  if (isBuilding) {
    return <OrderBuildingRitual order={draftOrder} steps={buildSteps} stepIndex={stepIndex} />;
  }

  return (
    <div className="page">
      <section className="review-hero">
        <div>
          <span className="eyebrow">Финальный шаг</span>
          <h1>Проверить заказ</h1>
          <p>Остался финальный штрих — соберем карточку.</p>
        </div>
        <div className="review-ticket">
          <span>№ {orderNumber}</span>
          <strong>{formatPrice(totalPrice)}</strong>
        </div>
      </section>

      <OrderPassport order={draftOrder} variant="review" />

      <section className="progress-card progress-card--hero">
        <div className="progress-step done">Товары ✓</div>
        <div className="progress-step done">Адрес ✓</div>
        <div className="progress-step active">Карточка</div>
        <div className="progress-step">Поделиться</div>
      </section>

      <section className="review-summary-card">
        <div className="summary-metric">
          <span>Товары</span>
          <strong>{pluralizeProducts(itemCount)}</strong>
        </div>
        <div className="summary-metric">
          <span>Итого</span>
          <strong>{formatPrice(totalPrice)}</strong>
        </div>
        <div className="summary-metric wide">
          <span>Адрес</span>
          <strong>{address ? getAddressFormatted(address) : 'Адрес не выбран'}</strong>
          <Link to="/address">
            <MapPin size={15} />
            Изменить
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>В заказе</h2>
          <Link to="/order">Изменить</Link>
        </div>
        <div className="order-list compact-list">
          {items.slice(0, 5).map((item) => (
            <div className="order-item" key={item.productId}>
              <ProductThumb category={item.image ?? item.category} imageUrl={item.imageUrl} title={item.title} />
              <div>
                <strong>{item.title}</strong>
                <span>
                  {item.quantity} шт. · {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
          {items.length > 5 && <div className="more-line">+ еще {items.length - 5} товара</div>}
        </div>
      </section>

      <div className="sticky-actions single">
        <AnimatedButton type="button" variant="ritual" className="primary-button glow-button" onClick={handleBuildOrder}>
          <Sparkles size={18} />
          Собрать заказ
        </AnimatedButton>
      </div>
    </div>
  );
};
