import { Home, Heart, LayoutGrid, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { motionTokens } from '../../motion/motionTokens';
import { selectionHaptic } from '../../utils/telegram';

const navItems = [
  { to: '/', label: 'Главная', icon: Home },
  { to: '/rooms', label: 'Комнаты', icon: LayoutGrid },
  { to: '/order', label: 'Заказ', icon: ShoppingBag },
  { to: '/saved', label: 'Сохраненное', icon: Heart },
];

export const BottomNav = () => (
  <nav className="bottom-nav" aria-label="Основная навигация">
    {navItems.map((item) => {
      const Icon = item.icon;
      return (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `bottom-nav__item ${isActive ? 'active' : ''}`}
          onClick={selectionHaptic}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  className="bottom-nav__active-pill"
                  layoutId="bottom-nav-active-pill"
                  transition={motionTokens.springLayout}
                />
              )}
              <motion.span className="bottom-nav__icon" whileTap={{ y: -2, scale: 0.94 }} transition={motionTokens.springSoft}>
                <Icon size={20} />
              </motion.span>
          <span>{item.label}</span>
            </>
          )}
        </NavLink>
      );
    })}
  </nav>
);
