import { AnimatePresence, motion } from 'framer-motion';

type Props = {
  value: string | number;
  className?: string;
};

export const AnimatedValue = ({ value, className }: Props) => (
  <AnimatePresence mode="wait" initial={false}>
    <motion.span
      key={value}
      className={`animated-value ${className ?? ''}`}
      initial={{ opacity: 0, y: 8, scale: 0.92, filter: 'blur(3px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -8, scale: 0.92, filter: 'blur(3px)' }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
    >
      {value}
    </motion.span>
  </AnimatePresence>
);
