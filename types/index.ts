export interface Variant {
  size: string;
  id: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  image: string;
  tag: string;
  description: string;
  variants: Variant[];
}

export interface CartItem extends Product {
  quantity: number;
  size: string; // The specific size selected for this item
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id?: string;
  customer: CustomerDetails;
  items: CartItem[];
  total: number;
  paymentId: string;
  orderId: string;
  createdAt: any; // Firestore Timestamp
  status: 'PAID' | 'SHIPPED' | 'DELIVERED';
}