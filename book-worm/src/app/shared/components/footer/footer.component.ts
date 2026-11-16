import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="footer__inner">
        <a routerLink="/" class="footer__brand">Book Worm</a>
        <nav class="footer__links" aria-label="Footer">
          <a routerLink="/">Catalog</a>
          <a routerLink="/orders">My Orders</a>
          <a routerLink="/wishlist">My Wishlist</a>
          <a routerLink="/writers">My Writers</a>
        </nav>
        <p class="footer__copy">© {{ year }} Book Worm. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: `
    .footer {
      background: var(--bw-layer);
      border-top: 1px solid var(--bw-border);
      margin-top: auto;
    }
    .footer__inner {
      max-width: 1440px;
      margin: 0 auto;
      padding: 20px 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px 32px;
      font-size: 12px;
      color: var(--bw-text-2);
    }
    .footer__brand {
      font-weight: 600;
      font-size: 14px;
      color: var(--bw-text);
    }
    .footer__links {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 20px;
      a:hover {
        color: var(--bw-text);
        text-decoration: underline;
      }
    }
    .footer__copy {
      margin-left: auto;
    }
    @media (max-width: 767px) {
      .footer__copy {
        margin-left: 0;
        width: 100%;
      }
    }
  `,
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
