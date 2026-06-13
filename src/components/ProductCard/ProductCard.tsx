import { Heart, Plus } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useFavoriteStore } from '../../stores/favoriteStore';
import { useOrderStore } from '../../stores/orderStore';
import type { Product } from '../../types/product';
import { impactHaptic } from '../../utils/telegram';
import { formatPrice } from '../../utils/price';
import { motionTokens } from '../../motion/motionTokens';
import { AnimatedButton } from '../AnimatedButton/AnimatedButton';
import { ProductPlaceholder } from '../ProductPlaceholder/ProductPlaceholder';

type Props = {
  product: Product;
};

export const ProductCard = ({ product }: Props) => {
  const [justAdded, setJustAdded] = useState(false);
  const reduceMotion = useReducedMotion();
  const itemCount = useOrderStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const currentQuantity = useOrderStore((state) => state.items.find((item) => item.productId === product.id)?.quantity ?? 0);
  const addProduct = useOrderStore((state) => state.addProduct);
  const hasMilestone = useOrderStore((state) => state.hasMilestone);
  const markMilestone = useOrderStore((state) => state.markMilestone);
  const toggleFavorite = useFavoriteStore((state) => state.toggle);
  const isFavorite = useFavoriteStore((state) => state.has(product.id));

  const handleAdd = () => {
    const nextItemCount = itemCount + 1;
    addProduct(product);
    impactHaptic('light');
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 700);

    if (!hasMilestone('first-item')) {
      markMilestone('first-item');
      impactHaptic('medium');
      toast.success('Заказ начался', {
        description: 'Первый предмет на месте.',
      });
      return;
    }

    if (nextItemCount >= 3 && !hasMilestone('three-items')) {
      markMilestone('three-items');
      impactHaptic('medium');
      toast.success('Уже выглядит как заказ', {
        description: 'Можно добавить адрес — или еще немного улучшить.',
      });
      return;
    }

    toast.success('Добавили', {
      description: 'Заказ стал на один предмет убедительнее.',
    });
  };

  return (
    <motion.article
      className={`product-card ${justAdded ? 'product-card--added' : ''}`}
      layout
      layoutId={`product-card-${product.id}`}
      animate={justAdded ? { y: [0, -4, 0], scale: [1, 1.015, 1] } : { y: 0, scale: 1 }}
      transition={motionTokens.springSoft}
    >
      <AnimatePresence>
        {justAdded && !reduceMotion && (
          <motion.div
            className="product-card__echo"
            initial={{ opacity: 0.72, scale: 0.7, x: 0, y: 0 }}
            animate={{ opacity: 0, scale: 0.38, x: 92, y: -42 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.42, ease: motionTokens.easeOut }}
          />
        )}
      </AnimatePresence>
      <Link to={`/products/${product.id}`} className="product-card__media">
        <motion.div layoutId={`product-image-${product.id}`}>
          <ProductPlaceholder category={product.image} title={product.title} />
        </motion.div>
      </Link>
      <div className="product-card__body">
        <div>
          <Link to={`/products/${product.id}`} className="product-card__title">
            {product.title}
          </Link>
          <p>{product.shortDescription}</p>
        </div>
        <div className="product-card__footer">
          <strong>{formatPrice(product.price)}</strong>
          <div className="inline-actions">
            <button
              type="button"
              className={`icon-button ${isFavorite ? 'active' : ''}`}
              onClick={() => {
                toggleFavorite(product.id);
                toast.success(isFavorite ? 'Убрано из сохраненного' : 'Сохранено');
              }}
              aria-label="Сохранить"
            >
              <Heart size={18} />
            </button>
            <AnimatedButton
              variant="primary-dopamine"
              type="button"
              className={`add-button ${currentQuantity > 0 ? 'add-button--in-order' : ''}`}
              onClick={handleAdd}
            >
              <Plus size={17} />
              {currentQuantity > 0 ? 'В заказе' : 'Добавить'}
            </AnimatedButton>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
