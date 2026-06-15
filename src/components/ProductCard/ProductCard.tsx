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

type Props = {
  product: Product;
};

export const ProductCard = ({ product }: Props) => {
  const [justAdded, setJustAdded] = useState(false);
  const [sparkleBurst, setSparkleBurst] = useState<'favorite' | 'add'>();
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
    setSparkleBurst('add');
    window.setTimeout(() => setJustAdded(false), 700);
    window.setTimeout(() => setSparkleBurst(undefined), 520);

    if (!hasMilestone('first-item')) {
      markMilestone('first-item');
      impactHaptic('medium');
      toast.success('Первый товар в корзине', {
        description: 'Теперь можно собрать комнату вокруг него.',
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
      description: 'Корзина стала ближе к заказу.',
    });
  };

  const handleFavorite = () => {
    toggleFavorite(product.id);
    impactHaptic('light');
    setSparkleBurst('favorite');
    window.setTimeout(() => setSparkleBurst(undefined), 520);
    toast.success(isFavorite ? 'Убрано из сохраненного' : 'Сохранено');
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
        <motion.img
          layoutId={`product-image-${product.id}`}
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          decoding="async"
        />
      </Link>
      <div className="product-card__veil" aria-hidden="true" />
      <AnimatePresence>
        {sparkleBurst && (
          <motion.span
            className={`product-card__sparkles product-card__sparkles--${sparkleBurst}`}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.16 }}
            aria-hidden="true"
          >
            <i />
            <i />
            <i />
            <i />
          </motion.span>
        )}
      </AnimatePresence>
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
              onClick={handleFavorite}
              aria-label="Сохранить"
            >
              <Heart size={20} strokeWidth={2.6} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            <AnimatedButton
              variant="primary-dopamine"
              type="button"
              className={`add-button ${currentQuantity > 0 ? 'add-button--in-order' : ''}`}
              onClick={handleAdd}
            >
              <Plus size={20} strokeWidth={2.7} />
              {currentQuantity > 0 ? 'В заказе' : 'Добавить'}
            </AnimatedButton>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
