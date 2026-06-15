import { ExternalLink, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { AnimatedButton } from '../../components/AnimatedButton/AnimatedButton';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { OrderCard } from '../../components/OrderCard/OrderCard';
import { OrderPassport } from '../../components/OrderPassport/OrderPassport';
import { orderService } from '../../services/orderService';
import { createPublicOrderUrl, createTelegramOrderUrl, shareService } from '../../services/shareService';
import { useOrderStore } from '../../stores/orderStore';
import type { SettleOrder } from '../../types/order';
import { notificationHaptic } from '../../utils/telegram';

export const OrderReadyPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<SettleOrder>();
  const [isLoading, setIsLoading] = useState(true);
  const hasMilestone = useOrderStore((state) => state.hasMilestone);
  const markMilestone = useOrderStore((state) => state.markMilestone);
  const clearOrder = useOrderStore((state) => state.clearOrder);
  const publicUrl = useMemo(() => (order?.slug ? createPublicOrderUrl(order.slug) : ''), [order]);
  const telegramUrl = useMemo(() => (order?.slug ? createTelegramOrderUrl(order.slug) : undefined), [order]);
  const shareUrl = telegramUrl ?? publicUrl;

  const notifyLinkReady = () => {
    if (!hasMilestone('link-ready')) {
      markMilestone('link-ready');
      notificationHaptic('success');
      toast.success('Ссылка готова', {
        description: 'Можно отправлять.',
      });
      return;
    }

    toast.success('Ссылка готова');
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!slug) return;
      try {
        const loaded = await orderService.getOrderBySlug(slug);
        if (active) setOrder(loaded);
      } catch (error) {
        console.error(error);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="page">
        <section className="empty-state">
          <h1>Открываем карточку</h1>
          <p>Секунду, заказ уже почти на экране.</p>
        </section>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page">
        <EmptyState
          title="Карточка не найдена"
          text="Похоже, заказ еще не собран или ссылка устарела."
          action={
            <Link to="/order" className="primary-button">
              Вернуться к заказу
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="page ready-page">
      <motion.section
        className="ready-hero"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
      >
        <span className="success-badge">
          <Sparkles size={16} />
          Заказ собран
        </span>
        <h1>Заказ собран</h1>
        <p>{order.orderNumber} выглядит убедительно. Теперь его можно отправить.</p>
      </motion.section>

      <OrderPassport order={order} variant="ready" />

      <OrderCard order={order} />

      <section className="share-panel">
        <AnimatedButton
          type="button"
          variant="primary-dopamine"
          className="primary-button full-width glow-button"
          onClick={async () => {
            await shareService.shareOrder(order, shareUrl);
            notifyLinkReady();
          }}
        >
          <Sparkles size={18} />
          Поделиться заказом
        </AnimatedButton>
        <AnimatedButton type="button" variant="utility" className="secondary-button full-width" onClick={() => navigate(`/order/${order.slug}`)}>
          <ExternalLink size={18} />
          Открыть заказ
        </AnimatedButton>
        <AnimatedButton
          type="button"
          variant="utility"
          className="secondary-button full-width"
          onClick={() => {
            clearOrder();
            navigate('/rooms');
          }}
        >
          Собрать следующий заказ
        </AnimatedButton>
      </section>
    </div>
  );
};
