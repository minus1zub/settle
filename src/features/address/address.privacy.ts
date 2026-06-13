import type { SettleAddress } from '../../types/address';

export const getAddressFormatted = (address?: SettleAddress) =>
  address?.formatted ?? address?.formattedAddress ?? '';

export const buildPublicAddressLabel = (address: Partial<SettleAddress>) => {
  if (address.publicLabel) return address.publicLabel;

  const city = address.city ?? address.settlement;
  const street = address.street ? `ул. ${address.street.replace(/^ул\.?\s*/i, '')}` : undefined;

  return [city, street].filter(Boolean).join(' · ') || city || 'выбранный адрес';
};

export const normalizeAddress = (address: SettleAddress): SettleAddress => {
  const formatted = getAddressFormatted(address).trim();

  return {
    ...address,
    formatted,
    formattedAddress: formatted,
    publicLabel: buildPublicAddressLabel({ ...address, formatted }),
  };
};
