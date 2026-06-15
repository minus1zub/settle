import { Check, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const phases = ['Сверяем корзину', 'Банк улыбается', 'Карточка готова'];

export const BankPaymentRitual = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase(1), 620),
      window.setTimeout(() => setPhase(2), 1280),
    ];

    return () => timers.forEach(window.clearTimeout);
  }, []);

  return (
    <div className="page bank-ritual">
      <motion.section
        className="bank-ritual__card"
        initial={{ opacity: 0, y: 22, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 250, damping: 24 }}
      >
        <div className="bank-ritual__glow bank-ritual__glow--blue" />
        <div className="bank-ritual__glow bank-ritual__glow--mint" />
        <div className="bank-ritual__stars" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="bank-ritual__top">
          <span>Settle pay</span>
          <Sparkles size={17} />
        </div>
        <div className={`bank-ritual__orb ${phase === 2 ? 'bank-ritual__orb--done' : ''}`}>
          <span className="bank-ritual__ring" />
          <AnimatePresence mode="wait">
            {phase === 2 ? (
              <motion.span
                key="check"
                className="bank-ritual__check"
                initial={{ opacity: 0, scale: 0.35, rotate: -18 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 360, damping: 18 }}
              >
                <Check size={42} strokeWidth={3.2} />
              </motion.span>
            ) : (
              <motion.span
                key="dots"
                className="bank-ritual__dots"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <i />
                <i />
                <i />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            className="bank-ritual__copy"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <h1>{phases[phase]}</h1>
            <p>{phase === 2 ? 'Галочка на месте. Сейчас покажем заказ.' : 'Кружок крутится красиво, данные складываются в карточку.'}</p>
          </motion.div>
        </AnimatePresence>
        <div className="bank-ritual__chips" aria-hidden="true">
          <span>почти как банк</span>
          <span>без списаний</span>
          <span>+ кайф</span>
        </div>
      </motion.section>
    </div>
  );
};
