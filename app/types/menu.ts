export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'coffee' | 'pastries' | 'sandwiches' | 'beverages';
  available: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  cost: number;
  imageUrl?: string;
  isActive: boolean;
  description?: string;
  category?: string;
  stock?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  createdAt: Date;
  customerName?: string;
  customerEmail?: string;
}
