import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Crumb {
  label: string;
  link?: string | unknown[];
  query?: Record<string, string>;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="crumbs" aria-label="Breadcrumb">
      @for (crumb of items(); track $index; let last = $last) {
        @if (crumb.link && !last) {
          <a class="link" [routerLink]="crumb.link" [queryParams]="crumb.query">{{ crumb.label }}</a>
        } @else {
          <span>{{ crumb.label }}</span>
        }
        @if (!last || trailingSlash()) {
          <span class="sep">/</span>
        }
      }
    </nav>
  `,
  styles: `
    .crumbs {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      padding: 12px 0;
    }
    .sep {
      color: var(--bw-text-2);
    }
    .link {
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  `,
})
export class BreadcrumbComponent {
  readonly items = input.required<Crumb[]>();
  readonly trailingSlash = input(false);
}
