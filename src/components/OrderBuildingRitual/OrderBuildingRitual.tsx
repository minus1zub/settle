import { Check, PackageCheck } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { OrderPassport } from '../OrderPassport/OrderPassport';
import type { SettleOrder } from '../../types/order';
import { motionTokens } from '../../motion/motionTokens';

type Props = {
  order: SettleOrder;
  steps: string[];
  stepIndex: number;
};

export const OrderBuildingRitual = ({ order, steps, stepIndex }: Props) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="page building-page">
      <motion.section
        className="building-card"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={motionTokens.springSoft}
      >
        <div className="orbital-mark">
          <PackageCheck size={34} />
        </div>
        <span className="eyebrow">Почти как документ</span>
        <h1>Собираем заказ</h1>
        <p>Проверяем товары, прикрепляем адрес и собираем карточку слоями.</p>

        <div className="building-passport">
          <OrderPassport order={order} variant="review" className="order-passport--building" />
        </div>

        <div className="assembly-visual" aria-hidden="true">
          <motion.div
            className="assembly-card assembly-card--back"
            animate={reduceMotion ? undefined : { y: [0, -8, 0], rotate: [-7, -4, -7] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="assembly-card assembly-card--middle"
            animate={reduceMotion ? undefined : { y: [0, 7, 0], rotate: [5, 2, 5] }}
            transition={{ duration: 1.25, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="assembly-card assembly-card--front"
            animate={reduceMotion ? undefined : { scale: [1, 1.035, 1] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span />
            <span />
            <span />
          </motion.div>
        </div>

        <div className="build-progress">
          <motion.div
            initial={{ width: '12%' }}
            animate={{ width: `${Math.min(100, 18 + stepIndex * 28)}%` }}
            transition={{ duration: motionTokens.durationBase }}
          />
        </div>
        <div className="build-steps">
          {steps.map((step, index) => (
            <motion.div
              className={`build-step ${index <= stepIndex ? 'done' : ''}`}
              key={step}
              initial={reduceMotion ? { opacity: 0.55 } : { opacity: 0.55, x: -8 }}
              animate={reduceMotion ? { opacity: index <= stepIndex ? 1 : 0.55 } : { opacity: index <= stepIndex ? 1 : 0.55, x: 0 }}
              transition={motionTokens.springSoft}
            >
              <Check size={16} />
              {step}
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};
