import { ArrowRight, Check, CreditCard, ShieldCheck, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AnimatedButton } from '../AnimatedButton/AnimatedButton';

type Props = {
  canContinue: boolean;
  onContinue: () => void;
};

const phases = ['Проверяем заказ', 'Банк думает красиво', 'Почти готово', 'Оплата прошла'];

export const BankPaymentRitual = ({ canContinue, onContinue }: Props) => {
  const [phase, setPhase] = useState(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');

  const startPayment = () => {
    if (status !== 'idle') return;
    setStatus('processing');
    setPhase(1);
  };

  useEffect(() => {
    if (status !== 'processing') return undefined;

    const timers = [
      window.setTimeout(() => setPhase(2), 1500),
      window.setTimeout(() => setPhase(3), 3000),
      window.setTimeout(() => setStatus('done'), 3900),
    ];

    return () => timers.forEach(window.clearTimeout);
  }, [status]);

  const isDone = status === 'done';
  const isProcessing = status === 'processing';

  return (
    <div className={`page bank-ritual bank-ritual--${status}`}>
      <motion.section
        className="bank-ritual__card"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 230, damping: 24 }}
      >
        <div className="bank-ritual__glow bank-ritual__glow--blue" />
        <div className="bank-ritual__glow bank-ritual__glow--mint" />
        <div className="bank-ritual__stars" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>

        <div className="bank-ritual__top">
          <span>Settle bank</span>
          <span className="bank-ritual__secure">
            <ShieldCheck size={16} />
            безопасно
          </span>
        </div>

        <div className="bank-ritual__terminal">
          <div>
            <span>К оплате</span>
            <strong>0 ₽</strong>
          </div>
          <CreditCard size={28} />
        </div>

        <div className={`bank-ritual__orb ${isDone ? 'bank-ritual__orb--done' : ''}`}>
          <span className="bank-ritual__ring" />
          <AnimatePresence mode="wait">
            {isDone ? (
              <motion.span
                key="check"
                className="bank-ritual__check"
                initial={{ opacity: 0, scale: 0.35, rotate: -18 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 360, damping: 16 }}
              >
                <Check size={48} strokeWidth={3.2} />
              </motion.span>
            ) : (
              <motion.span
                key={status}
                className={isProcessing ? 'bank-ritual__dots' : 'bank-ritual__card-icon'}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {isProcessing ? (
                  <>
                    <i />
                    <i />
                    <i />
                  </>
                ) : (
                  <CreditCard size={42} strokeWidth={2.4} />
                )}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            className="bank-ritual__copy"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24 }}
          >
            <h1>{phases[phase]}</h1>
            <p>
              {isDone
                ? 'Галочка есть. Деньги не списали, зато заказ выглядит так, будто все серьезно.'
                : isProcessing
                  ? 'Кружок крутится, звездочки сверяются, приложение банка делает важный вид.'
                  : 'Это фейковая оплата для настроения. Нажми кнопку, и банк красиво соберет карточку.'}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="bank-ritual__chips" aria-hidden="true">
          <span>как в банке</span>
          <span>без списаний</span>
          <span>+ дофамин</span>
        </div>

        <AnimatePresence mode="wait">
          {!isDone ? (
            <motion.div
              key="pay"
              className="bank-ritual__actions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AnimatedButton
                type="button"
                variant="primary-dopamine"
                className="bank-ritual__pay-button"
                disabled={isProcessing}
                onClick={startPayment}
              >
                <Sparkles size={20} />
                {isProcessing ? 'Оплачиваем' : 'Оплатить'}
              </AnimatedButton>
            </motion.div>
          ) : (
            <motion.div
              key="continue"
              className="bank-ritual__actions"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AnimatedButton
                type="button"
                variant="primary-dopamine"
                className="bank-ritual__continue-button"
                disabled={!canContinue}
                onClick={onContinue}
              >
                Перейти в магазин
                <ArrowRight size={20} />
              </AnimatedButton>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </div>
  );
};
