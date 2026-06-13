import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { OrderCard } from '../../components/OrderCard/OrderCard';
import { OrderPassport } from '../../components/OrderPassport/OrderPassport';
import { ProductPlaceholder } from '../../components/ProductPlaceholder/ProductPlaceholder';
import { buildPublicAddressLabel } from '../../features/address/address.privacy';
import { orderService } from '../../services/orderService';
import type { SettleOrder } from '../../types/order';
import { formatPrice } from '../../utils/price';

export const PublicOrderPage = () => {
  const { slug } = useParams();
  const [order, setOrder] = useState<SettleOrder>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadOrder = async () => {
      if (!slug) return;

      try {
        const loadedOrder = await orderService.getOrderBySlug(slug);
        if (active) {
          setOrder(loadedOrder);
          setError(loadedOrder ? '' : 'Заказ не найден');
        }
      } catch (loadError) {
        console.error(loadError);
        if (active) setError('Не получилось открыть заказ');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadOrder();

    return () => {
      active = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="page">
        <section className="empty-state">
          <h1>Открываем заказ</h1>
          <p>Секунду, проверяем ссылку.</p>
        </section>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page">
        <EmptyState
          title="Заказ не найден"
          text={error || 'Похоже, ссылка устарела или заказ еще не сохранен.'}
          action={
            <Link to="/" className="primary-button">
              Собрать свой заказ
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="page public-page">
      <section className="page-heading">
        <span className="eyebrow">Заказ в Settle</span>
        <h1>{order.title}</h1>
        <p>
          № {order.orderNumber} · выглядит убедительно
        </p>
      </section>

      <OrderPassport order={order} variant="public" />

      <OrderCard order={order} />

      <section className="section">
        <div className="section-heading">
          <h2>Товары</h2>
          <strong>{formatPrice(order.totalPrice)}</strong>
        </div>
        <div className="order-list">
          {order.items.map((item) => (
            <div className="order-item" key={item.productId}>
              <ProductPlaceholder category={item.image ?? item.category} size="sm" />
              <div>
                <strong>{item.title}</strong>
                <span>
                  {item.quantity} шт. · {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="summary-block">
        <div>
          <span>Адрес</span>
          <strong>{order.address ? buildPublicAddressLabel(order.address) : 'Скрыт на публичной странице'}</strong>
        </div>
      </section>

      <div className="sticky-actions">
        <Link to="/" className="primary-button full-width">
          Собрать свой заказ
        </Link>
      </div>
    </div>
  );
};
