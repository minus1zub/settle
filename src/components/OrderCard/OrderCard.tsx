import type { SettleOrder } from '../../types/order';
import { buildPublicAddressLabel } from '../../features/address/address.privacy';
import { formatPrice, pluralizeProducts } from '../../utils/price';
import { ProductPlaceholder } from '../ProductPlaceholder/ProductPlaceholder';

type Props = {
  order: SettleOrder;
};

export const OrderCard = ({ order }: Props) => {
  const sortedItems = [...order.items].sort((a, b) => b.price * b.quantity - a.price * a.quantity);
  const visibleItems = sortedItems.slice(0, 5);
  const hiddenCount = sortedItems.length - visibleItems.length;
  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <article className="order-card-preview">
      <div className="order-card-preview__inner">
        <div className="order-card-preview__top">
          <span className="wordmark">Settle</span>
          <span className="status-pill">Статус: собран</span>
        </div>
        <div>
          <h2>{order.title || 'Мой заказ'}</h2>
          <p>№ {order.orderNumber || 'ST-0000'}</p>
        </div>
        <div className="order-card-preview__items">
          {visibleItems.map((item) => (
            <div className="order-card-row" key={item.productId}>
              <ProductPlaceholder category={item.image ?? item.category} size="sm" />
              <div>
                <span>{item.title}</span>
                <small>
                  {item.quantity} шт. · {formatPrice(item.price * item.quantity)}
                </small>
              </div>
            </div>
          ))}
          {hiddenCount > 0 && <div className="more-line">+ еще {hiddenCount} товара</div>}
        </div>
        <div className="order-card-preview__total">
          <span>{pluralizeProducts(totalQuantity)}</span>
          <strong>{formatPrice(order.totalPrice)}</strong>
        </div>
        <p className="order-phrase">{order.phrase || 'Кажется, здесь было бы спокойно.'}</p>
        {order.address && <p className="order-phrase">{buildPublicAddressLabel(order.address)}</p>}
        <div className="order-card-preview__cta">Собрать свой заказ</div>
      </div>
    </article>
  );
};
