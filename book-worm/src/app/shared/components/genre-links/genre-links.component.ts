import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Comma-separated genre links that jump to a filtered catalog search. */
@Component({
  selector: 'app-genre-links',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (genre of genres(); track genre; let last = $last) {
      <a class="link" routerLink="/" [queryParams]="{ q: genre }">{{ genre }}</a>@if (!last) {<span>, </span>}
    }
  `,
  styles: ':host{font-size:inherit}',
})
export class GenreLinksComponent {
  readonly genres = input.required<string[]>();
}
