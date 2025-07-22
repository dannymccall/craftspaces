export type Product = {
  id: number;
  avatar: string;
  title: string;
  price: number;
  category: string;
  description: string;
  product_id: string;
  createdAt: Date;
  updatedAt: Date;
};


export interface ProductProps {
  product: Product;
}

export interface Products {
  products: Product[]
}

export interface AllProductsProps {
  allProducts: Product[];
  recentProducts: Product[];
  ratedProducts: Product[]
}

export type Cart = {
  avatar: string;
  productId: string;
  title: string;
  quantity?: number;
  price: number;
  id:number
}