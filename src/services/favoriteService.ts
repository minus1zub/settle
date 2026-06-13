import { products } from '../data/products';

export const favoriteService = {
  getProductsByIds(ids: string[]) {
    return products.filter((product) => ids.includes(product.id));
  },
};
