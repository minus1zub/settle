import { ShoppingBag } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useOrderStore } from '../../stores/orderStore';
import { formatPrice, pluralizeProducts } from '../../utils/price';
import { motionTokens } from '../../motion/motionTokens';
import { AnimatedValue } from '../AnimatedValue/AnimatedValue';
import { StatusSticker } from '../StatusSticker/StatusSticker';

const hiddenRoutes = ['/address', '/order', '/review', '/order-ready'];

const shouldHideOnRoute = (pathname: string) =>
  hiddenRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`)) || /^\/order\/[^/]+/.test(pathname);

export const FloatingOrderPill = () => {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const items = useOrderStore((state) => state.items);
  const totalPrice = useOrderStore((state) => state.getTotalPrice());
  const hasAddress = useOrderStore((state) => Boolean(state.address));
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const isVisible = itemCount > 0 && !shouldHideOnRoute(location.pathname);
  const statusTone = hasAddress ? 'orange' : itemCount >= 3 ? 'mint' : 'blue';
  const statusLabel = hasAddress ? 'проверить' : itemCount >= 3 ? 'добавить адрес' : 'выбираем';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="floating-order-pill-wrap"
          layoutId="order-passport"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 22, scale: 0.94 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
          transition={motionTokens.springLayout}
        >
          <Link to="/order" className="floating-order-pill" aria-label="Открыть заказ">
            <span className="floating-order-pill__icon">
              <ShoppingBag size={18} />
            </span>
            <span className="floating-order-pill__body">
              <strong>
                <AnimatedValue value={pluralizeProducts(itemCount)} />
                <span> · </span>
                <AnimatedValue value={formatPrice(totalPrice)} />
              </strong>
              <StatusSticker tone={statusTone}>{statusLabel}</StatusSticker>
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
