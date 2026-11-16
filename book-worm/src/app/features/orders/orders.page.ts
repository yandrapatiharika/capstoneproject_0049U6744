import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { OrderService } from '../../core/services/order.service';
import { BookCoverComponent } from '../../shared/components/book-cover/book-cover.component';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [RouterLink, DatePipe, BookCoverComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container page">
      <h1 class="page-title">My Orders</h1>
      @for (order of orders(); track order.id) {
        <section class="panel order">
          <header class="order__head">
            <div><span class="muted">Order</span> <strong>#{{ order.id }}</strong></div>
            <div><span class="muted">Placed on</span> {{ order.placedOn | date: 'mediumDate' }}</div>
            <div><span class="muted">Status</span> {{ order.status }}</div>
            <div><span class="muted">Total</span> <strong>₹{{ order.total }}</strong></div>
          </header>
          <ul class="order__lines">
            @for (l of order.lines; track l.bookId) {
              @if (book(l.bookId); as b) {
                <li class="line">
                  <a class="line__cover" [routerLink]="['/book', b.id]"><app-book-cover [book]="b" /></a>
                  <div>
                    <a [routerLink]="['/book', b.id]" class="line__title">{{ b.title }}</a>
                    <p class="muted">by {{ b.author }}</p>
                    <p class="muted">Qty {{ l.quantity }} · ₹{{ l.price }}</p>
                  </div>
                </li>
              }
            }
          </ul>
        </section>
      } @empty {
        <div class="panel empty-state">
          <h2>No orders yet</h2>
          <p>Your purchases will show up here.</p>
          <a routerLink="/" class="btn btn-gap-sm">Start shopping</a>
        </div>
      }
    </div>
  `,
  styles: `
    .order { margin-bottom: 16px; }
    .order__head { display: flex; flex-wrap: wrap; gap: 8px 32px; font-size: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--bw-border-strong); margin-bottom: 16px; }
    .order__head .muted { margin-right: 4px; }
    .order__lines { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
    .line { display: flex; gap: 12px; font-size: 12px; }
    .line__cover { width: 64px; flex: none; }
    .line__title { font-size: 14px; &:hover { text-decoration: underline; } }
  `,
})
export class OrdersPage {
  private readonly books = inject(BookService);
  readonly orders = inject(OrderService).orders;
  readonly book = (id: string) => this.books.getById(id);
}
