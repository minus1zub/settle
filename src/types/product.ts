export type ProductRoom =
  | 'living-room'
  | 'bedroom'
  | 'kitchen'
  | 'workspace'
  | 'hallway'
  | 'bathroom'
  | 'balcony';

export type ProductCategory =
  | 'sofas-armchairs'
  | 'tables-chairs'
  | 'beds-mattresses'
  | 'storage'
  | 'lighting'
  | 'textile'
  | 'decor'
  | 'kitchenware'
  | 'home-goods';

export type ProductMood =
  | 'calm'
  | 'light'
  | 'practical'
  | 'warm'
  | 'minimal'
  | 'soft'
  | 'everyday';

export type Room = {
  id: ProductRoom;
  title: string;
  shortTitle: string;
  description: string;
  image: string;
  orderTitleTemplate: string;
  defaultPhrase: string;
};

export type Category = {
  id: ProductCategory;
  title: string;
  description: string;
};

export type Product = {
  id: string;
  title: string;
  category: ProductCategory;
  room: ProductRoom;
  price: number;
  oldPrice?: number;
  image: ProductCategory;
  imageUrl?: string;
  shortDescription: string;
  detailDescription: string;
  orderLine: string;
  tags: string[];
  mood: ProductMood;
  isPopular?: boolean;
  isNew?: boolean;
  isHero?: boolean;
};
