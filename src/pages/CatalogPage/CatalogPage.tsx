import { Link, useParams } from 'react-router-dom';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { categories } from '../../data/categories';
import { getRoom, rooms } from '../../data/rooms';
import { productService } from '../../services/productService';
import { useMemo, useState } from 'react';

export const CatalogPage = () => {
  const { roomId } = useParams();
  const room = getRoom(roomId);
  const [categoryId, setCategoryId] = useState<string>('all');
  const products = useMemo(() => {
    const byRoom = productService.getByRoom(roomId);
    return categoryId === 'all' ? byRoom : byRoom.filter((product) => product.category === categoryId);
  }, [roomId, categoryId]);

  if (!room) {
    return (
      <div className="page">
        <section className="empty-state">
          <h1>Комната не найдена</h1>
          <Link to="/rooms" className="primary-button">
            Посмотреть комнаты
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="page-heading">
        <span className="eyebrow">Комната</span>
        <h1>{room.title}</h1>
        <p>{room.description}</p>
      </section>

      <div className="chips">
        <button type="button" className={categoryId === 'all' ? 'active' : ''} onClick={() => setCategoryId('all')}>
          Все
        </button>
        {categories.map((category) => (
          <button
            type="button"
            className={categoryId === category.id ? 'active' : ''}
            onClick={() => setCategoryId(category.id)}
            key={category.id}
          >
            {category.title}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>

      <section className="section muted-block">
        <span>Другие комнаты</span>
        <div className="link-row">
          {rooms
            .filter((item) => item.id !== room.id)
            .slice(0, 4)
            .map((item) => (
              <Link to={`/rooms/${item.id}`} key={item.id}>
                {item.shortTitle}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
};
