import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

/** Labelled native select styled like the reference filter dropdowns. */
@Component({
  selector: 'app-filter-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="field">
      <span class="field-label">{{ label() }}</span>
      <select class="field-input" [value]="value()" (change)="value.set($any($event.target).value)">
        @for (option of options(); track option) {
          <option [value]="option" [selected]="option === value()">{{ option }}</option>
        }
      </select>
    </label>
  `,
  styles: ':host{display:block}',
})
export class FilterSelectComponent {
  readonly label = input.required<string>();
  readonly options = input.required<string[]>();
  readonly value = model('');
}
