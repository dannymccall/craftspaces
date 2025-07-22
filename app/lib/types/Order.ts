export type Order = {

  order_id: string;
  user_id: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total_amount: number;
  shipping_address?: string;
  billing_address: string;
  payment_method: string;
  created_at: Date;
  order_date:Date;
  payment_status: "paid" | "refunded";
  id?:number
};

export type Orders = {
  orders: Order[];
};


export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  title?:string;
  description?:string;
  avatar?:string;
  total_amount?:string;
  category?:string;
};


export type OrderRequestProps = {
  userId?: number;
  page?: number;
  limit?: number;
  searchTerm?: string;
};