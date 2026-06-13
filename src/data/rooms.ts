import type { Room } from '../types/product';

export const rooms: Room[] = [
  {
    id: 'living-room',
    title: 'Гостиная',
    shortTitle: 'Гостиная',
    description: 'Для дивана, света, столика и вещей, которые собирают комнату.',
    image: new URL('../../img/rooms/Гостиная.webp', import.meta.url).href,
    orderTitleTemplate: 'Заказ для гостиной',
    defaultPhrase: 'Кажется, здесь было бы спокойно.',
  },
  {
    id: 'bedroom',
    title: 'Спальня',
    shortTitle: 'Спальня',
    description: 'Для мягкого света, хранения и спокойного завершения дня.',
    image: new URL('../../img/rooms/Спальня.webp', import.meta.url).href,
    orderTitleTemplate: 'Заказ для спальни',
    defaultPhrase: 'Пока просто смотрю, но мне нравится.',
  },
  {
    id: 'kitchen',
    title: 'Кухня',
    shortTitle: 'Кухня',
    description: 'Для простых завтраков, ужинов и вещей, которые всегда под рукой.',
    image: new URL('../../img/rooms/Кухня.webp', import.meta.url).href,
    orderTitleTemplate: 'Заказ для кухни',
    defaultPhrase: 'Светло, просто, без лишнего.',
  },
  {
    id: 'workspace',
    title: 'Рабочее место',
    shortTitle: 'Работа',
    description: 'Для стола, нормального стула, света и пары полезных мелочей.',
    image: new URL('../../img/rooms/Рабочее место.webp', import.meta.url).href,
    orderTitleTemplate: 'Заказ для рабочего места',
    defaultPhrase: 'Так работать было бы чуть проще.',
  },
  {
    id: 'hallway',
    title: 'Прихожая',
    shortTitle: 'Прихожая',
    description: 'Для вещей, которые встречают дома первыми.',
    image: new URL('../../img/rooms/Прихожая.webp', import.meta.url).href,
    orderTitleTemplate: 'Заказ для прихожей',
    defaultPhrase: 'Хорошо, когда у входа все на месте.',
  },
  {
    id: 'bathroom',
    title: 'Ванная',
    shortTitle: 'Ванная',
    description: 'Для хранения, текстиля и спокойного порядка у раковины.',
    image: new URL('../../img/rooms/Ванная.webp', import.meta.url).href,
    orderTitleTemplate: 'Заказ для ванной',
    defaultPhrase: 'Меньше лишнего, больше чистого утра.',
  },
  {
    id: 'balcony',
    title: 'Балкон',
    shortTitle: 'Балкон',
    description: 'Для маленького места, где можно поставить свет, столик и плед.',
    image: new URL('../../img/rooms/Балкон.webp', import.meta.url).href,
    orderTitleTemplate: 'Заказ для балкона',
    defaultPhrase: 'Небольшое место, но уже похоже на план.',
  },
];

export const getRoom = (id?: string) => rooms.find((room) => room.id === id);
