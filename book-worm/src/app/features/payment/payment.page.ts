import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentMethod } from '../../core/models/order.model';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './payment.page.html',
  styleUrl: './payment.page.scss',
})
export class PaymentPage {
  private readonly orders = inject(OrderService);
  private readonly cart = inject(CartService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly methods: PaymentMethod[] = ['Credit Card', 'Debit card', 'UPI', 'Wallet'];
  readonly method = signal<PaymentMethod>('Credit Card');
  readonly submitted = signal(false);
  readonly amount = computed(() => this.orders.pending()?.total ?? 0);
  readonly isCard = computed(() => this.method() === 'Credit Card' || this.method() === 'Debit card');

  readonly cardForm = this.fb.group({
    cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4}-?\d{4}-?\d{4}-?\d{4}$/)]],
    name: ['', Validators.required],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{4}$/)]],
  });

  readonly upiControl = this.fb.control('', [Validators.required, Validators.pattern(/^[\w.-]+@[\w]+$/)]);
  readonly walletControl = this.fb.control('Paytm', Validators.required);
  readonly wallets = ['Paytm', 'PhonePe', 'Amazon Pay'];

  select(method: PaymentMethod): void {
    this.method.set(method);
    this.submitted.set(false);
  }

  invalid(name: 'cardNumber' | 'name' | 'cvv' | 'expiry'): boolean {
    const c = this.cardForm.controls[name];
    return c.invalid && (c.touched || this.submitted());
  }

  upiInvalid(): boolean {
    return this.upiControl.invalid && (this.upiControl.touched || this.submitted());
  }

  pay(): void {
    this.submitted.set(true);
    const valid = this.isCard()
      ? this.cardForm.valid
      : this.method() === 'UPI'
        ? this.upiControl.valid
        : this.walletControl.valid;
    if (!valid) {
      this.cardForm.markAllAsTouched();
      this.upiControl.markAsTouched();
      return;
    }
    if (this.orders.placeOrder(this.method())) {
      this.cart.clear();
      this.router.navigateByUrl('/order-confirmation');
    }
  }
}
