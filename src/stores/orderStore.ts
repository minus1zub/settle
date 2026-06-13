import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getRoom } from '../data/rooms';
import type { Product } from '../types/product';
import type { SettleAddress } from '../types/address';
import type { SettleOrder, SettleOrderItem } from '../types/order';

type OrderStore = {
  items: SettleOrderItem[];
  address?: SettleAddress;
  lastOrderSlug?: string;
  seenMilestones: string[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  setAddress: (address: SettleAddress) => void;
  setLastOrderSlug: (slug?: string) => void;
  markMilestone: (milestone: string) => void;
  hasMilestone: (milestone: string) => boolean;
  clearOrder: () => void;
  getTotalPrice: () => number;
  getOrderTitle: () => string;
  getOrderPhrase: () => string;
  toDraftOrder: () => SettleOrder;
};

const getMainRoom = (items: SettleOrderItem[]) => {
  const roomScores = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.room] = (acc[item.room] ?? 0) + item.quantity;
    return acc;
  }, {});
  const mainRoomId = Object.entries(roomScores).sort((a, b) => b[1] - a[1])[0]?.[0];
  return getRoom(mainRoomId);
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      items: [],
      seenMilestones: [],
      addProduct: (product) =>
        set((state) => {
          const existing = state.items.find((item) => item.productId === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                category: product.category,
                room: product.room,
                quantity: 1,
              },
            ],
          };
        }),
      removeProduct: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      increment: (productId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        })),
      decrement: (productId) =>
        set((state) => ({
          items: state.items
            .map((item) => (item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item))
            .filter((item) => item.quantity > 0),
        })),
      setAddress: (address) => set({ address }),
      setLastOrderSlug: (slug) => set({ lastOrderSlug: slug }),
      markMilestone: (milestone) =>
        set((state) => ({
          seenMilestones: (state.seenMilestones ?? []).includes(milestone)
            ? state.seenMilestones
            : [...(state.seenMilestones ?? []), milestone],
        })),
      hasMilestone: (milestone) => (get().seenMilestones ?? []).includes(milestone),
      clearOrder: () => set({ items: [], address: undefined, seenMilestones: [], lastOrderSlug: undefined }),
      getTotalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      getOrderTitle: () => getMainRoom(get().items)?.orderTitleTemplate ?? 'Мой заказ',
      getOrderPhrase: () => getMainRoom(get().items)?.defaultPhrase ?? 'Так обычно все и начинается.',
      toDraftOrder: () => ({
        orderNumber: '',
        title: get().getOrderTitle(),
        phrase: get().getOrderPhrase(),
        items: get().items,
        address: get().address,
        totalPrice: get().getTotalPrice(),
        status: 'draft',
      }),
    }),
    {
      name: 'settle-draft-order',
      partialize: (state) => ({
        items: state.items,
        address: state.address,
        lastOrderSlug: state.lastOrderSlug,
        seenMilestones: state.seenMilestones,
      }),
    },
  ),
);
