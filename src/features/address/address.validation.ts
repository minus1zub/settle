import type { SettleAddress } from '../../types/address';
import { getAddressFormatted } from './address.privacy';

export const validateAddress = (address: SettleAddress) => {
  const formatted = getAddressFormatted(address);
  const hasPlace = Boolean(address.city || address.settlement);
  const hasStreet = Boolean(address.street || formatted);
  const needsHouse = Boolean(address.street);
  const hasHouse = Boolean(address.house);

  if (!hasPlace) return 'Укажите город или населенный пункт.';
  if (!hasStreet) return 'Укажите улицу или адрес.';
  if (needsHouse && !hasHouse) return 'Укажите дом или подтвердите адрес без точного дома.';

  return '';
};
