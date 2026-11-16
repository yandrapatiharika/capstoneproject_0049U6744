import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="field">
      <span class="field-label">{{ label() }}</span>
      <span class="wrap">
        <input
          class="field-input"
          type="search"
          [placeholder]="placeholder()"
          [value]="value()"
          (input)="value.set($any($event.target).value)"
          aria-label="Search books"
        />
        <app-icon name="search" [size]="16" />
      </span>
    </label>
  `,
  styles: `
    :host {
      display: block;
    }
    .wrap {
      position: relative;
      display: block;
    }
    .field-input {
      padding-right: 40px;
      &::-webkit-search-cancel-button {
        display: none;
      }
    }
    app-icon {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
    }
  `,
})
export class SearchBarComponent {
  readonly value = model('');
  readonly label = input('Search you want to read here');
  readonly placeholder = input('Search');
}
