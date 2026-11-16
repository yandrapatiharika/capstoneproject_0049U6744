import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type IconName =
  | 'menu'
  | 'cart'
  | 'user'
  | 'search'
  | 'chevron-down'
  | 'check'
  | 'plus'
  | 'minus'
  | 'arrow-right'
  | 'star'
  | 'star-outline'
  | 'language'
  | 'currency'
  | 'bookmark'
  | 'heart'
  | 'list'
  | 'close'
  | 'trash'
  | 'card';

const PATHS: Record<IconName, string> = {
  menu: 'M4 5h16v14H4zM9 5v14M4 10h5M4 14h5',
  cart: 'M3 4h2l2.4 11h10.2l2-8H6.2M9 20a1 1 0 100-2 1 1 0 000 2zM17 20a1 1 0 100-2 1 1 0 000 2z',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 19.5c1.2-3 4-4.5 7.5-4.5s6.3 1.5 7.5 4.5M12 22a10 10 0 110-20 10 10 0 010 20z',
  search: 'M10.5 17a6.5 6.5 0 100-13 6.5 6.5 0 000 13zM15.5 15.5L21 21',
  'chevron-down': 'M6 9l6 6 6-6',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  'arrow-right': 'M4 12h16M14 6l6 6-6 6',
  star: 'M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4-5.7-3.1-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z',
  'star-outline': 'M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4-5.7-3.1-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z',
  language: 'M4 5h9M8.5 3v2M6 5c0 4 3 7 6 8M11 5c0 3-3 7-7 9M13 20l4-9 4 9M14.4 17h5.2',
  currency: 'M12 3v18M16.5 7.5C16 6 14.3 5 12 5c-2.5 0-4 1.2-4 3s1.5 2.6 4 3.2 4 1.4 4 3.3-1.6 3-4 3c-2.4 0-4.2-1-4.7-2.8',
  bookmark: 'M6 3h12v18l-6-4-6 4z',
  heart: 'M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0112 7a4.5 4.5 0 017.5 3c0 5.4-7.5 10-7.5 10z',
  list: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 6l12 12M18 6L6 18',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6',
  card: 'M3 6h18v12H3zM3 10h18M7 15h4',
};

const FILLED: IconName[] = ['star'];

@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      [attr.fill]="filled() ? 'currentColor' : 'none'"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path [attr.d]="path()" />
    </svg>
  `,
  styles: [':host{display:inline-flex;line-height:0;flex:none}'],
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input(16);
  readonly path = computed(() => PATHS[this.name()]);
  readonly filled = computed(() => FILLED.includes(this.name()));
}
