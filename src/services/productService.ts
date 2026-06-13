import { getProduct, getProductsByRoom, getRelatedProducts, popularProducts, products } from '../data/products';

export const productService = {
  getAll: () => products,
  getPopular: () => popularProducts,
  getById: getProduct,
  getByRoom: getProductsByRoom,
  getRelated: getRelatedProducts,
};
