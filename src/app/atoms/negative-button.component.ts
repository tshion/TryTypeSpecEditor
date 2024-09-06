import { Component } from '@angular/core';

/**
 * 否定的な文脈で使うボタン
 */
@Component({
  selector: 'app-negative-button',
  standalone: true,
  template: `
    <button class="pure-button">
      <ng-content />
    </button>
  `,
  styles: [
    `button {
      background-color: #ca3c3c;
      color: #ffffff;
    }`,
  ],
})
export class NegativeButtonComponent {
}
