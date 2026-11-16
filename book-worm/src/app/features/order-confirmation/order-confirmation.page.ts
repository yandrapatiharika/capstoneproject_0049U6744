import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { OrderService } from '../../core/services/order.service';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-order-confirmation-page',
  standalone: true,
  imports: [RouterLink, BookCardComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './order-confirmation.page.html',
  styleUrl: './order-confirmation.page.scss',
})
export class OrderConfirmationPage {
  private readonly orders = inject(OrderService);
  private readonly books = inject(BookService);

  readonly order = this.orders.lastOrder;
  readonly purchased = computed(() => {
    const o = this.order();
    return o ? this.books.getByIds(o.lines.map((l) => l.bookId)) : [];
  });
}
