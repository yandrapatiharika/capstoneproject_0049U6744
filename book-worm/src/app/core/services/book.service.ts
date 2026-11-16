import { Injectable, computed, signal } from '@angular/core';
import { BOOKS } from '../data/mock-books';
import { AUTHOR_BIOS } from '../data/authors';
import { PRICE_RANGES } from '../data/catalog-options';
import { Book, Review } from '../models/book.model';

export interface BookFilters {
  query: string;
  category: string;
  language: string;
  format: string;
  priceRange: string;
  sort: string;
}

export const DEFAULT_FILTERS: BookFilters = {
  query: '',
  category: 'All',
  language: 'All',
  format: 'All',
  priceRange: 'All',
  sort: 'Relevance',
};

const SEED_REVIEWS: Review[] = [
  {
    id: 'r1',
    name: 'John Smith',
    rating: 5,
    text: 'The accordion component delivers large amounts of content in a small space through progressive disclosure. The user gets key details about the underlying content and can choose to expand that content within the constraints of the accordion.',
  },
];

/**
 * Mock data access. All methods are synchronous for simplicity; swap the
 * implementation for HttpClient calls (returning Observables) when a backend exists.
 */
@Injectable({ providedIn: 'root' })
export class BookService {
  private readonly _books = signal<Book[]>(BOOKS);
  private readonly _reviews = signal<Record<string, Review[]>>({});

  readonly books = this._books.asReadonly();
  readonly authors = computed(() => [...new Set(this._books().map((b) => b.author))]);

  getById(id: string): Book | undefined {
    return this._books().find((b) => b.id === id);
  }

  getByIds(ids: string[]): Book[] {
    return ids.map((id) => this.getById(id)).filter((b): b is Book => !!b);
  }

  getRelated(book: Book, limit = 3): Book[] {
    const sameGenre = this._books().filter(
      (b) => b.id !== book.id && b.genres.some((g) => book.genres.includes(g)),
    );
    const others = this._books().filter((b) => b.id !== book.id && !sameGenre.includes(b));
    return [...sameGenre, ...others].slice(0, limit);
  }

  getByAuthor(author: string): Book[] {
    return this._books().filter((b) => b.author === author);
  }

  getAuthorBio(author: string): string {
    return AUTHOR_BIOS[author] ?? `${author} is a bestselling author on Book Worm.`;
  }

  getReviews(bookId: string): Review[] {
    return this._reviews()[bookId] ?? (bookId === 'the-joy-of-minimalism' ? SEED_REVIEWS : []);
  }

  addReview(bookId: string, review: Omit<Review, 'id'>): void {
    const current = this.getReviews(bookId);
    this._reviews.update((all) => ({
      ...all,
      [bookId]: [{ ...review, id: crypto.randomUUID() }, ...current],
    }));
  }

  search(filters: BookFilters): Book[] {
    const q = filters.query.trim().toLowerCase();
    const range = PRICE_RANGES.find((r) => r.label === filters.priceRange) ?? PRICE_RANGES[0];

    const result = this._books().filter((b) => {
      const matchesQuery =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genres.some((g) => g.toLowerCase().includes(q));
      const matchesCategory = filters.category === 'All' || b.categories.includes(filters.category);
      const matchesLanguage = filters.language === 'All' || b.language === filters.language;
      const matchesFormat = filters.format === 'All' || b.format === filters.format;
      const matchesPrice = b.price >= range.min && b.price <= range.max;
      return matchesQuery && matchesCategory && matchesLanguage && matchesFormat && matchesPrice;
    });

    switch (filters.sort) {
      case 'Price: Low to High':
        return [...result].sort((a, b) => a.price - b.price);
      case 'Price: High to Low':
        return [...result].sort((a, b) => b.price - a.price);
      case 'Title: A to Z':
        return [...result].sort((a, b) => a.title.localeCompare(b.title));
      case 'Top Rated':
        return [...result].sort((a, b) => b.rating - a.rating || b.sold - a.sold);
      default:
        return result;
    }
  }
}
