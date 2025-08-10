import { Directive } from '@angular/core';
import { ButtonBaseDirective } from './base/button-base.directive';

/**
 * 否定的な文脈で使うボタン
 *
 * @example
 * ``` html
 * <a appNegativeButton href="#">Link Text</a>
 * <button appNegativeButton>Button Text</button>
 * ```
 */
@Directive({
  selector: '[appNegativeButton]',
  standalone: true,
})
export class NegativeButtonDirective extends ButtonBaseDirective {

  constructor() {
    super();

    const dom = this.dom;
    if (dom) {
      dom.style.backgroundColor = '#ca3c3c';
      dom.style.color = '#ffffff';
    }
  }
}
