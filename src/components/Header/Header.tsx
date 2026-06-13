import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOrderStore } from '../../stores/orderStore';
import { motionTokens } from '../../motion/motionTokens';
import { AnimatedValue } from '../AnimatedValue/AnimatedValue';

export const Header = () => {
  const itemCount = useOrderStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <header className="app-header">
      <Link to="/" className="wordmark" aria-label="Settle">
        <img src="/settle-logo.svg" alt="Settle" />
      </Link>
      <motion.div animate={itemCount > 0 ? { scale: [1, 1.08, 1] } : { scale: 1 }} transition={motionTokens.springPop}>
        <Link to="/order" className={`header-order ${itemCount > 0 ? 'has-items' : ''}`} aria-label="Открыть заказ">
        <ShoppingBag size={18} />
          <AnimatedValue value={itemCount} />
        </Link>
      </motion.div>
    </header>
  );
};
