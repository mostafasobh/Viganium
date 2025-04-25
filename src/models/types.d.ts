export interface ProductType {
  id: number;
  name: string;
  price: number;
  discount_price?: number
  description?: string;
}

export interface CategoryType {
  id: number;
  name: string;
  description?: string;
}