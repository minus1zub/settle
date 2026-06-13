export type SettleAddressSource = 'telegram_location' | 'dadata' | 'map' | 'manual';

export type SettleAddress = {
  source?: SettleAddressSource;
  formatted?: string;
  publicLabel?: string;
  formattedAddress?: string;
  country?: string;
  region?: string;
  city?: string;
  settlement?: string;
  street?: string;
  house?: string;
  lat?: number;
  lon?: number;
  fiasId?: string;
  geoPrecision?: 'exact' | 'street' | 'manual' | 'manual_without_coordinates' | string;
  note?: string;
  raw?: unknown;
};

export type AddressSuggestion = {
  id: string;
  label: string;
  main?: string;
  secondary?: string;
  chip?: string;
  address: SettleAddress;
};
