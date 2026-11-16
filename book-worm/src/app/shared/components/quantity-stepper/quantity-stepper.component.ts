import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

/** "1 | − | +" stepper from the cart design. */
@Component({
  selector: 'app-quantity-stepper',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stepper" role="group" aria-label="Quantity">
      <span class="stepper__value" aria-live="polite">{{ value() }}</span>
      <button type="button" aria-label="Decrease quantity" [disabled]="value() <= min()" (click)="step(-1)">
        <app-icon name="minus" [size]="14" />
      </button>
      <button type="button" aria-label="Increase quantity" [disabled]="value() >= max()" (click)="step(1)">
        <app-icon name="plus" [size]="14" />
      </button>
    </div>
  `,
  styles: `
    .stepper {
      display: inline-flex;
      align-items: stretch;
      height: 36px;
      border-bottom: 1px solid var(--bw-border-strong);
      min-width: 150px;
    }
    .stepper__value {
      flex: 1;
      display: flex;
      align-items: center;
      padding-left: 4px;
      font-size: 12px;
    }
    button {
      width: 40px;
      background: none;
      border: 0;
      cursor: pointer;
      display: grid;
      place-items: center;
      &:first-of-type {
        border-right: 1px solid var(--bw-border-strong);
        margin: 8px 0;
      }
      &:hover:not(:disabled) {
        background: var(--bw-layer-hover);
      }
      &:disabled {
        color: var(--bw-text-3);
        cursor: not-allowed;
      }
    }
  `,
})
export class QuantityStepperComponent {
  readonly value = model(1);
  readonly min = input(1);
  readonly max = input(99);

  step(delta: number): void {
    const next = this.value() + delta;
    if (next >= this.min() && next <= this.max()) {
      this.value.set(next);
    }
  }
}
