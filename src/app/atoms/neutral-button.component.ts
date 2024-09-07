import { Component, Input } from '@angular/core';

/**
 * 中立的な文脈で使うボタン
 */
@Component({
  selector: 'app-neutral-button',
  standalone: true,
  template: `
    <button class="pure-button" [type]="type">
      <ng-content />
    </button>
  `,
  styles: [
    `button {
      background-color: #cccccc;
      color: #000000;
    }`,
  ],
})
export class NeutralButtonComponent {

  @Input()
  public type: 'submit' | 'reset' | 'button' = 'button';
}
