export interface Address {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  city: string;
  pin: string;
  phoneCode: string;
  phone: string;
  state: string;
  country: string;
}

export interface CartItem {
  bookId: string;
  quantity: number;
}

export interface OrderLine {
  bookId: string;
  quantity: number;
  price: number;
}

export type PaymentMethod = 'Credit Card' | 'Debit card' | 'UPI' | 'Wallet';

export interface Order {
  id: string;
  placedOn: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  lines: OrderLine[];
  total: number;
  paymentMethod: PaymentMethod;
  address: Address | null;
}
