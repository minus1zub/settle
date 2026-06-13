import { Armchair, BedDouble, Boxes, ChefHat, Lamp, PanelsTopLeft, Sofa, Table2 } from 'lucide-react';
import type { ProductCategory } from '../../types/product';

type Props = {
  category: ProductCategory;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
};

const iconMap = {
  'sofas-armchairs': Sofa,
  'tables-chairs': Table2,
  'beds-mattresses': BedDouble,
  storage: Boxes,
  lighting: Lamp,
  textile: PanelsTopLeft,
  decor: Armchair,
  kitchenware: ChefHat,
} satisfies Record<ProductCategory, typeof Sofa>;

export const ProductPlaceholder = ({ category, title, size = 'md' }: Props) => {
  const Icon = iconMap[category];

  return (
    <div className={`product-placeholder product-placeholder--${size}`} aria-label={title}>
      <Icon size={size === 'sm' ? 22 : size === 'lg' ? 46 : 34} />
    </div>
  );
};
