import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (toast.message(); as message) {
      <div class="toast" role="status">{{ message }}</div>
    }
  `,
  styles: `
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: #f4f4f4;
      color: #161616;
      padding: 12px 20px;
      font-size: 13px;
      border-left: 4px solid var(--bw-success);
      z-index: 100;
      max-width: calc(100vw - 32px);
    }
  `,
})
export class ToastComponent {
  readonly toast = inject(ToastService);
}
