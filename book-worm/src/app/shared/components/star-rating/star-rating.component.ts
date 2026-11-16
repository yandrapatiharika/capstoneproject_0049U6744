import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

/** Display (read-only) or interactive 5-star rating. */
@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="stars" [attr.role]="readonly() ? 'img' : 'radiogroup'" [attr.aria-label]="value() + ' out of 5 stars'">
      @for (n of [1, 2, 3, 4, 5]; track n) {
        @if (readonly()) {
          <app-icon [name]="n <= value() ? 'star' : 'star-outline'" [size]="size()" [class.on]="n <= value()" />
        } @else {
          <button type="button" class="star-btn" [attr.aria-label]="n + ' star'" (click)="value.set(n)">
            <app-icon [name]="n <= value() ? 'star' : 'star-outline'" [size]="size()" [class.on]="n <= value()" />
          </button>
        }
      }
    </span>
  `,
  styles: `
    .stars {
      display: inline-flex;
      gap: 2px;
      color: var(--bw-text);
    }
    .on {
      color: var(--bw-star);
    }
    .star-btn {
      background: none;
      border: 0;
      padding: 2px;
      cursor: pointer;
      color: inherit;
      &:hover app-icon {
        color: var(--bw-star);
      }
    }
  `,
})
export class StarRatingComponent {
  readonly value = model(0);
  readonly readonly = input(true);
  readonly size = input(14);
}
