import { motion, useReducedMotion } from 'framer-motion';
import type { PropsWithChildren } from 'react';
import { pageTransition } from '../../motion/motionTokens';

type Props = PropsWithChildren<{
  className?: string;
}>;

export const MotionPage = ({ children, className = 'motion-page' }: Props) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.985 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.99 }}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};
