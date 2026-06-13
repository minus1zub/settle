import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LayoutGroup } from 'framer-motion';
import { Toaster } from 'sonner';
import { BottomNav } from '../components/BottomNav/BottomNav';
import { FloatingOrderPill } from '../components/FloatingOrderPill/FloatingOrderPill';
import { Header } from '../components/Header/Header';
import { initTelegramApp } from '../utils/telegram';
import { AppRoutes } from './routes';

export const App = () => {
  useEffect(() => {
    initTelegramApp();
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
