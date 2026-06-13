import clsx from 'clsx';
import { motion, useReducedMotion } from 'framer-motion';
import { motionTokens } from '../../motion/motionTokens';

type StickerTone = 'blue' | 'mint' | 'orange' | 'lilac' | 'dark' | 'green';

type Props = {
  children: string;
  tone?: StickerTone;
  className?: string;
};

export const StatusSticker = ({ children, tone = 'blue', className }: Props) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className={clsx('status-sticker', `status-sticker--${tone}`, className)}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.18, rotate: -8 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: -1.2 }}
      transition={motionTokens.springPop}
    >
      {children}
    </motion.span>
  );
};
