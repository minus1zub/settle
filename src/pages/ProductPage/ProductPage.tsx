import { Heart, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { AnimatedButton } from '../../components/AnimatedButton/AnimatedButton';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { getCategory } from '../../data/categories';
import { getRoom } from '../../data/rooms';
import { productService } from '../../services/productService';
import { useFavoriteStore } from '../../stores/favoriteStore';
import { useOrderStore } from '../../stores/orderStore';
import { formatPrice } from '../../utils/price';
import { impactHaptic } from '../../utils/telegram';

export const ProductPage = () => {
  const { productId } = useParams();
  const product = productService.getById(productId);
  const addProduct = useOrderStore((state) => state.addProduct);
  const currentQuantity = useOrderStore((state) => (product ? state.items.find((item) => item.productId === product.id)?.quantity ?? 0 : 0));
  const toggleFavorite = useFavoriteStore((state) => state.toggle);
  const isFavorite = useFavoriteStore((state) => (product ? state.has(product.id) : false));

  if (!product) {
    return (
      <div className="page">
        <section className="empty-state">
          <h1>Товар не найден</h1>
          <Link to="/rooms" className="primary-button">
            Посмотреть комнаты
          </Link>
        </section>
      </div>
    );
  }

  const room = getRoom(product.room);
  const category = getCategory(product.category);
  const related = productService.getRelated(product);

  return (
    <div className="page">
      <section className="product-detail">
        <motion.img
          className="product-detail__image"
          layoutId={`product-image-${product.id}`}
          src={product.imageUrl}
          alt={product.title}
        />
        <span className="eyebrow">
          {room?.title} · {category?.title}
        </span>
        <h1>{product.title}</h1>
        <strong className="price-large">{formatPrice(product.price)}</strong>
        <p>{product.detailDescription}</p>
        <div className="detail-actions">
          <AnimatedButton
            type="button"
            variant="primary-dopamine"
            className="primary-button"
            onClick={() => {
              addProduct(product);
              impactHaptic('light');
              toast.success('Добавили', {
                description: 'Заказ стал на один предмет убедительнее.',
              });
            }}
          >
            <Plus size={18} />
            {currentQuantity > 0 ? 'В заказе' : 'Добавить в заказ'}
          </AnimatedButton>
          <AnimatedButton
            type="button"
            variant="utility"
            className={`secondary-button ${isFavorite ? 'active' : ''}`}
            onClick={() => {
              toggleFavorite(product.id);
              toast.success(isFavorite ? 'Убрано из сохраненного' : 'Сохранено');
            }}
          >
            <Heart size={18} />
            Сохранить
          </AnimatedButton>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Хорошо добавить к заказу</h2>
        </div>
        <div className="product-grid">
          {related.map((item) => (
            <ProductCard product={item} key={item.id} />
          ))}
        </div>
      </section>
    </div>
  );
};
