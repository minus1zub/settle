import type { AddressSuggestion, SettleAddress } from '../types/address';
import { searchAddressSuggestions } from '../features/address/address.api';
import { manualAddressProvider } from './manualAddressProvider';

export const addressService = {
  async search(query: string): Promise<AddressSuggestion[]> {
    try {
      return await searchAddressSuggestions(query);
    } catch (error) {
      console.warn('Address search fallback is active', error);
      return [];
    }
  },

  createManualAddress(address: SettleAddress) {
    return manualAddressProvider.createAddress(address);
  },
};
