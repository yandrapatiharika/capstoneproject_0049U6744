import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OrderService } from '../services/order.service';

/** Payment is only reachable after a valid address has been submitted at checkout. */
export const checkoutGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(OrderService).pending() ? true : router.createUrlTree(['/checkout']);
};

/** Confirmation is only reachable after an order has been placed. */
export const confirmationGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(OrderService).lastOrder() ? true : router.createUrlTree(['/']);
};
