import { Injectable, computed, effect, signal } from '@angular/core';
import { Address, Order, PaymentMethod } from '../models/order.model';
import { CartLine } from './cart.service';

const STORAGE_KEY = 'bookworm.orders';

export interface PendingCheckout {
  address: Address;
  lines: CartLine[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly _orders = signal<Order[]>(this.load());
  private readonly _pending = signal<PendingCheckout | null>(null);
  private readonly _lastOrderId = signal<string | null>(null);

  readonly orders = this._orders.asReadonly();
  readonly pending = this._pending.asReadonly();
  readonly lastOrder = computed(() => this._orders().find((o) => o.id === this._lastOrderId()) ?? null);

  constructor() {
    effect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(this._orders())));
  }

  startCheckout(checkout: PendingCheckout): void {
    this._pending.set(checkout);
  }

  /** Simulated payment: turns the pending checkout into an order. */
  placeOrder(method: PaymentMethod): Order | null {
    const pending = this._pending();
    if (!pending) {
      return null;
    }
    const order: Order = {
      id: 'BW' + Date.now().toString().slice(-8),
      placedOn: new Date().toISOString(),
      status: 'Processing',
      lines: pending.lines.map((l) => ({ bookId: l.book.id, quantity: l.quantity, price: l.book.price })),
      total: pending.total,
      paymentMethod: method,
      address: pending.address,
    };
    this._orders.update((orders) => [order, ...orders]);
    this._lastOrderId.set(order.id);
    this._pending.set(null);
    return order;
  }

  private load(): Order[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Order[];
    } catch {
      return [];
    }
  }
}
