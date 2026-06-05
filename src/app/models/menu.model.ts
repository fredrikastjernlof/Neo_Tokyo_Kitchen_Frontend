export interface MenuCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    filename: string;
    path: string;
    altText?: string;
  };
  sortOrder?: number;
  isActive: boolean;
}

export interface DietaryOptions {
  vegan: boolean;
  vegetarian: boolean;
  glutenFree: boolean;
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  category: MenuCategory | string;
  price: number;
  dietary?: DietaryOptions;
  protein?: string;
  spiceLevel?: number;
  tags?: string[];
  isAvailable: boolean;
  sortOrder?: number;
}

export interface EditableCategory {
  id: string;
  name: string;
  description: string;

  image?: {
    filename: string;
    path: string;
    altText?: string;
  };
}

export interface EditableMenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  protein: string;
  spiceLevel: number;
  isAvailable: boolean;
}