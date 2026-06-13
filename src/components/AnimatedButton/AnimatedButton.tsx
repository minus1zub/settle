import clsx from 'clsx';
import { motion, useReducedMotion } from 'framer-motion';
import type { MouseEventHandler, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { motionTokens } from '../../motion/motionTokens';

type AnimatedButtonVariant = 'primary-dopamine' | 'ritual' | 'utility' | 'navigation' | 'destructive' | 'sticker-chip';

type Props = PropsWithChildren<
  {
    className?: string;
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    type?: 'button' | 'submit' | 'reset';
    variant?: AnimatedButtonVariant;
    to?: string;
    'aria-label'?: string;
  }
>;

const MotionLink = motion.create(Link);

const getInteraction = (variant: AnimatedButtonVariant, reduceMotion: boolean) => {
  if (reduceMotion) {
    return {
      whileTap: { opacity: 0.82 },
      whileHover: undefined,
    };
  }

  const byVariant = {
    'primary-dopamine': {
      whileTap: { scale: 0.965 },
      whileHover: { y: -1, boxShadow: '0 18px 42px rgba(59, 91, 255, 0.32)' },
    },
    ritual: {
      whileTap: { scale: 0.955 },
      whileHover: { y: -2, boxShadow: '0 22px 54px rgba(142, 125, 255, 0.34)' },
    },
    utility: {
      whileTap: { scale: 0.975 },
      whileHover: { y: -1 },
    },
    navigation: {
      whileTap: { scale: 0.97, y: 1 },
      whileHover: { y: -1 },
    },
    destructive: {
      whileTap: { scale: 0.92, rotate: -4 },
      whileHover: { y: -1 },
    },
    'sticker-chip': {
      whileTap: { scale: 0.94, rotate: -2 },
      whileHover: { rotate: 0 },
    },
  } satisfies Record<AnimatedButtonVariant, { whileTap: object; whileHover?: object }>;

  return byVariant[variant];
};

export const AnimatedButton = ({ children, className, variant = 'utility', to, type = 'button', ...props }: Props) => {
  const reduceMotion = useReducedMotion();
  const interaction = getInteraction(variant, Boolean(reduceMotion));
  const classes = clsx('animated-button', `animated-button--${variant}`, className);

  if (to) {
    return (
      <MotionLink
        to={to}
        className={classes}
        whileTap={interaction.whileTap}
        whileHover={interaction.whileHover}
        transition={motionTokens.springSoft}
      >
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button
      {...props}
      type={type}
      className={classes}
      whileTap={interaction.whileTap}
      whileHover={interaction.whileHover}
      transition={motionTokens.springSoft}
    >
      {children}
    </motion.button>
  );
};
