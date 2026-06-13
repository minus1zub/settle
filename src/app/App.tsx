import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LayoutGroup } from 'framer-motion';
import { Toaster } from 'sonner';
import { BottomNav } from '../components/BottomNav/BottomNav';
import { FloatingOrderPill } from '../components/FloatingOrderPill/FloatingOrderPill';
import { Header } from '../components/Header/Header';
import { useOrderStore } from '../stores/orderStore';
import { initTelegramApp } from '../utils/telegram';
import { AppRoutes } from './routes';

export const App = () => {
  useEffect(() => {
    initTelegramApp();
  }, []);

  useEffect(() => {
    const clearDraftOrder = () => {
      useOrderStore.getState().clearOrder();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        clearDraftOrder();
      }
    };

    window.addEventListener('pagehide', clearDraftOrder);
    window.addEventListener('beforeunload', clearDraftOrder);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pagehide', clearDraftOrder);
      window.removeEventListener('beforeunload', clearDraftOrder);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <LayoutGroup>
        <div className="app-shell">
          <Header />
          <main className="app-main">
            <AppRoutes />
          </main>
          <FloatingOrderPill />
          <BottomNav />
          <Toaster richColors position="top-center" />
        </div>
      </LayoutGroup>
    </BrowserRouter>
  );
};
