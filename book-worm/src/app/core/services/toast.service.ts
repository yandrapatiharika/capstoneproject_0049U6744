import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _message = signal<string | null>(null);
  private timer?: ReturnType<typeof setTimeout>;

  readonly message = this._message.asReadonly();

  show(message: string, durationMs = 2500): void {
    clearTimeout(this.timer);
    this._message.set(message);
    this.timer = setTimeout(() => this._message.set(null), durationMs);
  }
}
