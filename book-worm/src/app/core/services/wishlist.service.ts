import { Injectable, effect, signal } from '@angular/core';

const STORAGE_KEY = 'bookworm.wishlist';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly _ids = signal<string[]>(this.load());
  readonly ids = this._ids.asReadonly();

  constructor() {
    effect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(this._ids())));
  }

  has(bookId: string): boolean {
    return this._ids().includes(bookId);
  }

  toggle(bookId: string): void {
    this._ids.update((ids) => (ids.includes(bookId) ? ids.filter((i) => i !== bookId) : [...ids, bookId]));
  }

  remove(bookId: string): void {
    this._ids.update((ids) => ids.filter((i) => i !== bookId));
  }

  private load(): string[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as string[];
    } catch {
      return [];
    }
  }
}
