import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Book, CoverSpec } from '../../../core/models/book.model';

/**
 * Renders a generated SVG book cover so the app needs no external image assets.
 * The cover scales with its container (fixed 2:3 aspect ratio).
 */
@Component({
  selector: 'app-book-cover',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './book-cover.component.html',
  styleUrl: './book-cover.component.scss',
})
export class BookCoverComponent {
  readonly book = input.required<Book>();

  readonly spec = computed<CoverSpec>(() => this.book().cover);
  readonly uid = computed(() => 'c-' + this.book().id);
  readonly size = computed(() => Math.round((this.spec().titleSize ?? 28) * 0.8));
  readonly author = computed(() => this.book().author.toUpperCase());
  readonly titleY = computed(() => 18 + this.size());
  readonly titleFill = computed(() => this.spec().fg);
  readonly authorFill = computed(() => this.spec().authorColor ?? this.spec().fg);
  readonly lineHeight = computed(() => this.size() * 1.05);
}
