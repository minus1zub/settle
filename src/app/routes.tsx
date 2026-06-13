import { Navigate, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { HomePage } from '../pages/HomePage/HomePage';
import { RoomsPage } from '../pages/RoomsPage/RoomsPage';
import { CatalogPage } from '../pages/CatalogPage/CatalogPage';
import { ProductPage } from '../pages/ProductPage/ProductPage';
import { OrderPage } from '../pages/OrderPage/OrderPage';
import { AddressPage } from '../pages/AddressPage/AddressPage';
import { ReviewOrderPage } from '../pages/ReviewOrderPage/ReviewOrderPage';
import { OrderReadyPage } from '../pages/OrderReadyPage/OrderReadyPage';
import { PublicOrderPage } from '../pages/PublicOrderPage/PublicOrderPage';
import { SavedPage } from '../pages/SavedPage/SavedPage';
import { MotionPage } from '../components/MotionPage/MotionPage';

const withPage = (element: ReactNode) => <MotionPage>{element}</MotionPage>;

export const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={withPage(<HomePage />)} />
        <Route path="/rooms" element={withPage(<RoomsPage />)} />
        <Route path="/rooms/:roomId" element={withPage(<CatalogPage />)} />
        <Route path="/products/:productId" element={withPage(<ProductPage />)} />
        <Route path="/order" element={withPage(<OrderPage />)} />
        <Route path="/address" element={withPage(<AddressPage />)} />
        <Route path="/review" element={withPage(<ReviewOrderPage />)} />
        <Route path="/order-ready/:slug" element={withPage(<OrderReadyPage />)} />
        <Route path="/order/:slug" element={withPage(<PublicOrderPage />)} />
        <Route path="/saved" element={withPage(<SavedPage />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};
