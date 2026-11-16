import { Routes } from '@angular/router';
import { checkoutGuard, confirmationGuard } from './core/guards/checkout.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Book Worm – Catalog',
    loadComponent: () => import('./features/catalog/catalog.page').then((m) => m.CatalogPage),
  },
  {
    path: 'book/:id',
    title: 'Book Worm – Book Details',
    loadComponent: () =>
      import('./features/product-details/product-details.page').then((m) => m.ProductDetailsPage),
  },
  {
    path: 'cart',
    title: 'Book Worm – Shopping Cart',
    loadComponent: () => import('./features/checkout/checkout.page').then((m) => m.CheckoutPage),
  },
  { path: 'checkout', redirectTo: 'cart', pathMatch: 'full' },
  {
    path: 'payment',
    title: 'Book Worm – Payment',
    canActivate: [checkoutGuard],
    loadComponent: () => import('./features/payment/payment.page').then((m) => m.PaymentPage),
  },
  {
    path: 'order-confirmation',
    title: 'Book Worm – Order Confirmed',
    canActivate: [confirmationGuard],
    loadComponent: () =>
      import('./features/order-confirmation/order-confirmation.page').then((m) => m.OrderConfirmationPage),
  },
  {
    path: 'orders',
    title: 'Book Worm – My Orders',
    loadComponent: () => import('./features/orders/orders.page').then((m) => m.OrdersPage),
  },
  {
    path: 'wishlist',
    title: 'Book Worm – My Wishlist',
    loadComponent: () => import('./features/wishlist/wishlist.page').then((m) => m.WishlistPage),
  },
  {
    path: 'writers',
    title: 'Book Worm – My Writers',
    loadComponent: () => import('./features/writers/writers.page').then((m) => m.WritersPage),
  },
  {
    path: '**',
    title: 'Book Worm – Not Found',
    loadComponent: () => import('./features/not-found/not-found.page').then((m) => m.NotFoundPage),
  },
];
