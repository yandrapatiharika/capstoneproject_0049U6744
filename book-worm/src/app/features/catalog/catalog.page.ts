import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import {
  CATEGORIES,
  FORMATS,
  LANGUAGES,
  PRICE_RANGES,
  SECTION_ORDER,
  SECTION_TITLES,
  SORT_OPTIONS,
} from '../../core/data/catalog-options';
import { Book } from '../../core/models/book.model';
import { BookService, DEFAULT_FILTERS } from '../../core/services/book.service';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';
import { FilterSelectComponent } from '../../shared/components/filter-select/filter-select.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';

interface Section {
  key: string;
  title: string;
  books: Book[];
}

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [BookCardComponent, FilterSelectComponent, SearchBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './catalog.page.html',
  styleUrl: './catalog.page.scss',
})
export class CatalogPage {
  private readonly bookService = inject(BookService);
  private readonly route = inject(ActivatedRoute);

  readonly categories = CATEGORIES;
  readonly languages = LANGUAGES;
  readonly formats = FORMATS;
  readonly priceRanges = PRICE_RANGES.map((r) => r.label);
  readonly sortOptions = SORT_OPTIONS;

  readonly query = signal(DEFAULT_FILTERS.query);
  readonly category = signal(DEFAULT_FILTERS.category);
  readonly language = signal(DEFAULT_FILTERS.language);
  readonly format = signal(DEFAULT_FILTERS.format);
  readonly priceRange = signal(DEFAULT_FILTERS.priceRange);
  readonly sort = signal(DEFAULT_FILTERS.sort);

  private readonly queryParams = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('q') ?? '')), {
    initialValue: '',
  });

  readonly results = computed(() =>
    this.bookService.search({
      query: this.query(),
      category: this.category(),
      language: this.language(),
      format: this.format(),
      priceRange: this.priceRange(),
      sort: this.sort(),
    }),
  );

  readonly isFiltered = computed(
    () =>
      !!this.query().trim() ||
      this.category() !== 'All' ||
      this.language() !== 'All' ||
      this.format() !== 'All' ||
      this.priceRange() !== 'All' ||
      this.sort() !== 'Relevance',
  );

  /** Default view shows editorial sections; any filter/sort collapses to a single result list. */
  readonly sections = computed<Section[]>(() => {
    const results = this.results();
    if (this.isFiltered()) {
      return results.length ? [{ key: 'results', title: `Results (${results.length})`, books: results }] : [];
    }
    return SECTION_ORDER.map((key) => ({
      key,
      title: SECTION_TITLES[key],
      books: results.filter((b) => b.section === key),
    })).filter((s) => s.books.length);
  });

  constructor() {
    // Allow ?q=genre links (e.g. genre links on cards) to drive the search box.
    effect(() => {
      const q = this.queryParams();
      untracked(() => this.query.set(q));
    });
  }

  clearFilters(): void {
    this.query.set(DEFAULT_FILTERS.query);
    this.category.set(DEFAULT_FILTERS.category);
    this.language.set(DEFAULT_FILTERS.language);
    this.format.set(DEFAULT_FILTERS.format);
    this.priceRange.set(DEFAULT_FILTERS.priceRange);
    this.sort.set(DEFAULT_FILTERS.sort);
  }
}
