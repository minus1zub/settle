import { Link } from 'react-router-dom';
import { rooms } from '../../data/rooms';
import { productService } from '../../services/productService';
import { useOrderStore } from '../../stores/orderStore';
import { formatPrice, pluralizeProducts } from '../../utils/price';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { RoomCard } from '../../components/RoomCard/RoomCard';

export const HomePage = () => {
  const items = useOrderStore((state) => state.items);
  const totalPrice = useOrderStore((state) => state.getTotalPrice());
  const popularProducts = productService.getPopular().slice(0, 4);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="page">
      <section className="hero-section">
        <span className="eyebrow">Почти заказ для дома</span>
        <h1>Соберите заказ для дома</h1>
        <p>Выберите товары, добавьте адрес и отправьте заказ друзьям.</p>
        <Link to="/rooms" className="primary-button">
          Начать с комнаты
        </Link>
      </section>

      {items.length > 0 && (
        <Link to="/order" className="continue-order">
          <span>Продолжить заказ</span>
          <strong>
            {pluralizeProducts(itemCount)} · {formatPrice(totalPrice)}
          </strong>
        </Link>
      )}

      <section className="section">
        <div className="section-heading">
          <h2>Комнаты</h2>
          <Link to="/rooms">Все</Link>
        </div>
        <div className="room-grid compact">
          {rooms.map((room) => (
            <RoomCard room={room} key={room.id} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Популярно для заказа</h2>
        </div>
        <div className="product-grid">
          {popularProducts.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </section>
    </div>
  );
};
