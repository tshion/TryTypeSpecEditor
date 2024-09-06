import { Component } from '@angular/core';

/**
 * 肯定的な文脈で使うリンクボタン
 */
@Component({
  selector: 'app-positive-link-button',
  standalone: true,
  template: `
    <a class="pure-button">
      <ng-content />
    </a>
  `,
  styles: [
    `a {
      background-color: #0078e7;
      color: #ffffff;
    }`,
  ],
})
export class PositiveLinkButtonComponent {
}
