import type { SettleAddress } from '../types/address';
import { normalizeAddress } from '../features/address/address.privacy';

export const manualAddressProvider = {
  createAddress(value: SettleAddress): SettleAddress {
    return normalizeAddress({
      ...value,
      source: 'manual',
      formatted: (value.formatted ?? value.formattedAddress ?? '').trim(),
      geoPrecision: value.lat && value.lon ? 'manual' : 'manual_without_coordinates',
    });
  },
};
