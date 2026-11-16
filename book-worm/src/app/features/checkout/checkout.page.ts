import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Address } from '../../core/models/order.model';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';
import { BreadcrumbComponent, Crumb } from '../../shared/components/breadcrumb/breadcrumb.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { QuantityStepperComponent } from '../../shared/components/quantity-stepper/quantity-stepper.component';

const SAVED_ADDRESS: Address = {
  firstName: 'Daniel',
  lastName: 'Reed',
  address: '221B Baker Street, Koramangala',
  email: 'daniel.reed@example.com',
  city: 'Bengaluru',
  pin: '560034',
  phoneCode: '+91',
  phone: '9876543210',
  state: 'Karnataka',
  country: 'India',
};

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    BookCardComponent,
    BreadcrumbComponent,
    IconComponent,
    QuantityStepperComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checkout.page.html',
  styleUrl: './checkout.page.scss',
})
export class CheckoutPage {
  readonly cart = inject(CartService);
  private readonly orders = inject(OrderService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly countries = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia'];
  readonly phoneCodes = ['+91', '+1', '+44', '+61'];

  readonly couponCode = signal('');
  readonly couponMessage = signal<{ ok: boolean; text: string } | null>(null);
  readonly submitted = signal(false);
  readonly useSaved = signal(false);

  readonly crumbs = computed<Crumb[]>(() => {
    const first = this.cart.lines()[0]?.book;
    const items: Crumb[] = [{ label: 'Home', link: '/' }];
    if (first) {
      items.push(
        { label: first.genres[0], link: '/', query: { q: first.genres[0] } },
        { label: first.genres[1] ?? '', link: '/', query: { q: first.genres[1] ?? '' } },
        { label: first.title, link: ['/book', first.id] },
      );
    }
    items.push({ label: 'Checkout' });
    return items;
  });

  readonly form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    city: ['', Validators.required],
    pin: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    phoneCode: ['+91'],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    state: ['', Validators.required],
    country: ['India', Validators.required],
  });

  toggleSaved(checked: boolean): void {
    this.useSaved.set(checked);
    if (checked) {
      this.form.setValue(SAVED_ADDRESS);
    } else {
      this.form.reset({ phoneCode: '+91', country: 'India' });
      this.submitted.set(false);
    }
  }

  invalid(name: keyof Address): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || this.submitted());
  }

  applyCoupon(): void {
    const code = this.couponCode();
    if (!code.trim()) {
      this.couponMessage.set({ ok: false, text: 'Enter a coupon code.' });
      return;
    }
    this.couponMessage.set(
      this.cart.applyCoupon(code)
        ? { ok: true, text: 'Coupon applied.' }
        : { ok: false, text: 'Invalid coupon. Try BOOKWORM100.' },
    );
  }

  payNow(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.orders.startCheckout({
      address: this.form.getRawValue(),
      lines: this.cart.lines(),
      total: this.cart.total(),
    });
    this.router.navigateByUrl('/payment');
  }
}
