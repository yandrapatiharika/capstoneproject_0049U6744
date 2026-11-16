import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { BookService } from '../../core/services/book.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { BookCoverComponent } from '../../shared/components/book-cover/book-cover.component';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';
import { BreadcrumbComponent, Crumb } from '../../shared/components/breadcrumb/breadcrumb.component';
import { GenreLinksComponent } from '../../shared/components/genre-links/genre-links.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';

const MAX_REVIEW = 100;

@Component({
  selector: 'app-product-details-page',
  standalone: true,
  imports: [
    RouterLink,
    BookCoverComponent,
    BookCardComponent,
    BreadcrumbComponent,
    GenreLinksComponent,
    IconComponent,
    StarRatingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-details.page.html',
  styleUrl: './product-details.page.scss',
})
export class ProductDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly books = inject(BookService);
  private readonly cart = inject(CartService);
  private readonly toast = inject(ToastService);
  readonly wishlist = inject(WishlistService);

  readonly maxReview = MAX_REVIEW;

  private readonly id = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), { initialValue: '' });

  readonly book = computed(() => this.books.getById(this.id()));
  readonly related = computed(() => {
    const b = this.book();
    return b ? this.books.getRelated(b, 3) : [];
  });
  readonly bio = computed(() => {
    const b = this.book();
    return b ? this.books.getAuthorBio(b.author) : '';
  });
  readonly reviews = computed(() => {
    const b = this.book();
    return b ? this.books.getReviews(b.id) : [];
  });
  readonly inWishlist = computed(() => {
    const b = this.book();
    return !!b && this.wishlist.ids().includes(b.id);
  });
  readonly crumbs = computed<Crumb[]>(() => {
    const b = this.book();
    if (!b) {
      return [];
    }
    return [
      { label: 'Home', link: '/' },
      { label: b.genres[0], link: '/', query: { q: b.genres[0] } },
      { label: b.genres[1] ?? b.title, link: b.genres[1] ? '/' : undefined, query: b.genres[1] ? { q: b.genres[1] } : undefined },
    ];
  });

  // review form state
  readonly reviewText = signal('');
  readonly reviewRating = signal(0);
  readonly reviewError = signal<string | null>(null);

  addToCart(): void {
    const b = this.book();
    if (b) {
      this.cart.add(b.id);
      this.toast.show(`"${b.title}" added to cart`);
    }
  }

  toggleWishlist(): void {
    const b = this.book();
    if (b) {
      const adding = !this.inWishlist();
      this.wishlist.toggle(b.id);
      this.toast.show(adding ? 'Added to wishlist' : 'Removed from wishlist');
    }
  }

  onReviewInput(value: string): void {
    this.reviewText.set(value.slice(0, MAX_REVIEW));
  }

  submitReview(): void {
    const b = this.book();
    if (!b) {
      return;
    }
    if (!this.reviewText().trim() || this.reviewRating() === 0) {
      this.reviewError.set('Please add a rating and a few words.');
      return;
    }
    this.books.addReview(b.id, { name: 'You', rating: this.reviewRating(), text: this.reviewText().trim() });
    this.reviewText.set('');
    this.reviewRating.set(0);
    this.reviewError.set(null);
    this.toast.show('Thanks for your review!');
  }

  goHome(): void {
    this.router.navigateByUrl('/');
  }
}
