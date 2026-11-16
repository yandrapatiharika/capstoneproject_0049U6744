import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [RouterLink, BookCardComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container page">
      <h1 class="page-title">My Wishlist</h1>
      @if (books().length) {
        <div class="grid">
          @for (b of books(); track b.id) {
            <app-book-card [book]="b" size="md">
              <div class="row">
                <button type="button" class="btn btn-gap-sm" (click)="addToCart(b.id, b.title)">
                  Add to Cart <app-icon name="cart" [size]="14" />
                </button>
                <button type="button" class="btn btn-secondary btn-gap-sm" (click)="wishlist.remove(b.id)">
                  Remove <app-icon name="trash" [size]="14" />
                </button>
              </div>
            </app-book-card>
          }
        </div>
      } @else {
        <div class="panel empty-state">
          <h2>Your wishlist is empty</h2>
          <p>Tap “Add to Wishlist” on any book to save it for later.</p>
          <a routerLink="/" class="btn btn-gap-sm">Browse books</a>
        </div>
      }
    </div>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px 32px; }
    .row { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 12px; }
    .row .btn { min-height: 32px; font-size: 12px; }
  `,
})
export class WishlistPage {
  private readonly bookService = inject(BookService);
  private readonly cart = inject(CartService);
  private readonly toast = inject(ToastService);
  readonly wishlist = inject(WishlistService);

  readonly books = computed(() => this.bookService.getByIds(this.wishlist.ids()));

  addToCart(id: string, title: string): void {
    this.cart.add(id);
    this.toast.show(`"${title}" added to cart`);
  }
}
