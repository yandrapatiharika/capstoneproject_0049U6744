import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container page empty-state">
      <h2>404 – Page not found</h2>
      <p>The page you are looking for does not exist.</p>
      <a routerLink="/" class="btn btn-gap-sm">Back to catalog</a>
    </div>
  `,
})
export class NotFoundPage {}
