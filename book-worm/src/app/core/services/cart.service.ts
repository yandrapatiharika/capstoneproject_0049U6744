import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { CartItem } from '../models/order.model';
import { Book } from '../models/book.model';
import { BookService } from './book.service';

const STORAGE_KEY = 'bookworm.cart';
/** Matches the reference design: ₹62 tax on a ₹508 subtotal. */
const TAX_RATE = 0.122;
const COUPONS: Record<string, number> = { BOOKWORM100: 100, WELCOME50: 50 };

export interface CartLine {
  book: Book;
  quantity: number;
  lineTotal: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly bookService = inject(BookService);

  private readonly _items = signal<CartItem[]>(this.load());
  private readonly _coupon = signal<string | null>(null);

  readonly items = this._items.asReadonly();
  readonly coupon = this._coupon.asReadonly();

  readonly lines = computed<CartLine[]>(() =>
    this._items()
      .map((item) => {
        const book = this.bookService.getById(item.bookId);
        return book ? { book, quantity: item.quantity, lineTotal: book.price * item.quantity } : null;
      })
      .filter((l): l is CartLine => !!l),
  );

  readonly count = computed(() => this._items().reduce((sum, i) => sum + i.quantity, 0));
  readonly subtotal = computed(() => this.lines().reduce((sum, l) => sum + l.lineTotal, 0));
  readonly tax = computed(() => Math.round(this.subtotal() * TAX_RATE));
  readonly deliveryCharge = computed(() => 0);
  readonly discount = computed(() => {
    const code = this._coupon();
    return code ? Math.min(COUPONS[code] ?? 0, this.subtotal()) : 0;
  });
  readonly total = computed(() =>
    Math.max(0, this.subtotal() + this.tax() + this.deliveryCharge() - this.discount()),
  );

  constructor() {
    effect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items())));
  }

  quantityOf(bookId: string): number {
    return this._items().find((i) => i.bookId === bookId)?.quantity ?? 0;
  }

  add(bookId: string, quantity = 1): void {
    this._items.update((items) => {
      const existing = items.find((i) => i.bookId === bookId);
      return existing
        ? items.map((i) => (i.bookId === bookId ? { ...i, quantity: i.quantity + quantity } : i))
        : [...items, { bookId, quantity }];
    });
  }

  setQuantity(bookId: string, quantity: number): void {
    const q = Math.min(Math.max(Math.floor(quantity) || 1, 1), 99);
    this._items.update((items) => items.map((i) => (i.bookId === bookId ? { ...i, quantity: q } : i)));
  }

  remove(bookId: string): void {
    this._items.update((items) => items.filter((i) => i.bookId !== bookId));
  }

  clear(): void {
    this._items.set([]);
    this._coupon.set(null);
  }

  /** Returns true when the coupon code is valid. */
  applyCoupon(code: string): boolean {
    const normalised = code.trim().toUpperCase();
    if (!(normalised in COUPONS)) {
      return false;
    }
    this._coupon.set(normalised);
    return true;
  }

  private load(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as CartItem[];
      }
    } catch {
      /* ignore corrupted storage */
    }
    // Demo cart so the checkout screen mirrors the reference design on first load.
    return [
      { bookId: 'the-joy-of-minimalism', quantity: 1 },
      { bookId: 'the-path-to-success', quantity: 1 },
    ];
  }
}
