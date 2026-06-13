import type { ProductCategory } from '../../types/product';
import { ProductPlaceholder } from '../ProductPlaceholder/ProductPlaceholder';

type ProductThumbProps = {
  category: ProductCategory;
  imageUrl?: string;
  title?: string;
  size?: 'sm' | 'md';
};

export const ProductThumb = ({ category, imageUrl, title, size = 'sm' }: ProductThumbProps) => {
  if (!imageUrl) {
    return <ProductPlaceholder category={category} title={title} size={size} />;
  }

  return (
    <img
      className={`product-thumb product-thumb--${size}`}
      src={imageUrl}
      alt={title ?? ''}
      loading="lazy"
      decoding="async"
    />
  );
};
