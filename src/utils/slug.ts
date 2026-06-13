import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('23456789abcdefghjkmnpqrstuvwxyz', 4);

export const createOrderSlug = (orderNumber: string) =>
  `${orderNumber.toLowerCase()}-${nanoid()}`.replace(/[^a-z0-9-]/g, '-');
