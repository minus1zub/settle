import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTelegramStartParam } from '../../utils/telegram';

export const TelegramStartParamRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const startParam = getTelegramStartParam();
    if (!startParam?.startsWith('order_')) return;

    const slug = startParam.replace(/^order_/, '');
    if (slug) navigate(`/order/${slug}`, { replace: true });
  }, [navigate]);

  return null;
};
