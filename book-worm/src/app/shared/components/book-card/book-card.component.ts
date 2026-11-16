import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from '../../../core/models/book.model';
import { BookCoverComponent } from '../book-cover/book-cover.component';
import { GenreLinksComponent } from '../genre-links/genre-links.component';

export type BookCardSize = 'sm' | 'md' | 'lg';

const COVER_WIDTH: Record<BookCardSize, number> = { sm: 104, md: 128, lg: 176 };

/**
 * Reusable horizontal book card (cover + meta).
 * Content projected into the card is rendered below the meta (e.g. quantity stepper).
 */
@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [RouterLink, BookCoverComponent, GenreLinksComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss',
})
export class BookCardComponent {
  readonly book = input.required<Book>();
  readonly size = input<BookCardSize>('md');
  /** Make cover & title navigate to the product details page. */
  readonly linked = input(true);
  readonly showDescription = input(true);

  readonly coverWidth = computed(() => COVER_WIDTH[this.size()] + 'px');
  readonly deliveryDate = 'Mon, 21 Jul';
}
