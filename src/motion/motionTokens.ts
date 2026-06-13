import type { Transition } from 'framer-motion';

export const motionTokens = {
  easeOut: [0.16, 1, 0.3, 1] as const,
  easeInOut: [0.65, 0, 0.35, 1] as const,

  durationFast: 0.16,
  durationBase: 0.24,
  durationSlow: 0.38,

  springSoft: {
    type: 'spring',
    stiffness: 420,
    damping: 32,
  } satisfies Transition,

  springPop: {
    type: 'spring',
    stiffness: 520,
    damping: 24,
  } satisfies Transition,

  springLayout: {
    type: 'spring',
    stiffness: 360,
    damping: 34,
  } satisfies Transition,
};

export const pageTransition = {
  duration: motionTokens.durationSlow,
  ease: motionTokens.easeOut,
} satisfies Transition;
