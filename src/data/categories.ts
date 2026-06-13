import type { Category } from '../types/product';

export const categories: Category[] = [
  {
    id: 'sofas-armchairs',
    title: 'Диваны и кресла',
    description: 'Крупные вещи, вокруг которых собирается комната.',
  },
  {
    id: 'tables-chairs',
    title: 'Столы и стулья',
    description: 'Для кухни, работы и обычных домашних дел.',
  },
  {
    id: 'beds-mattresses',
    title: 'Кровати и матрасы',
    description: 'Для спальни и спокойного завершения дня.',
  },
  {
    id: 'storage',
    title: 'Хранение',
    description: 'Шкафы, комоды, тумбы и полки.',
  },
  {
    id: 'lighting',
    title: 'Освещение',
    description: 'Лампы, торшеры и свет, который меняет комнату.',
  },
  {
    id: 'textile',
    title: 'Текстиль',
    description: 'Пледы, шторы, полотенца, коврики и мягкие детали.',
  },
  {
    id: 'decor',
    title: 'Декор',
    description: 'Небольшие вещи, которые делают пространство собраннее.',
  },
  {
    id: 'kitchenware',
    title: 'Кухня и посуда',
    description: 'Посуда, хранение и полезные кухонные мелочи.',
  },
];

export const getCategory = (id?: string) => categories.find((category) => category.id === id);
