import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { BookService } from '../../core/services/book.service';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';

@Component({
  selector: 'app-writers-page',
  standalone: true,
  imports: [BookCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container page">
      <h1 class="page-title">My Writers</h1>
      @for (name of authors(); track name) {
        <section class="panel writer" [class.is-highlighted]="name === highlighted()">
          <h2 class="writer__name">{{ name }}</h2>
          <p class="writer__bio muted">{{ bio(name) }}</p>
          <div class="grid">
            @for (b of booksBy(name); track b.id) {
              <app-book-card [book]="b" size="sm" [showDescription]="false" />
            }
          </div>
        </section>
      }
    </div>
  `,
  styles: `
    .writer { margin-bottom: 16px; }
    .writer.is-highlighted { outline: 2px solid var(--bw-primary); }
    .writer__name { font-size: 16px; margin-bottom: 8px; }
    .writer__bio { font-size: 12px; margin-bottom: 16px; max-width: 900px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px 24px; }
  `,
})
export class WritersPage {
  private readonly route = inject(ActivatedRoute);
  private readonly bookService = inject(BookService);

  readonly highlighted = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('name') ?? '')), {
    initialValue: '',
  });

  /** Highlighted writer (from a deep-link) is listed first. */
  readonly authors = computed(() => {
    const h = this.highlighted();
    const all = this.bookService.authors();
    return h && all.includes(h) ? [h, ...all.filter((a) => a !== h)] : all;
  });

  bio = (name: string) => this.bookService.getAuthorBio(name);
  booksBy = (name: string) => this.bookService.getByAuthor(name);
}
