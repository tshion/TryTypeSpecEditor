import { Directive } from '@angular/core';
import { ButtonBaseDirective } from './base/button-base.directive';

/**
 * 中立的な文脈で使うボタン
 *
 * @example
 * ``` html
 * <a appNeutralButton href="#">Link Text</a>
 * <button appNeutralButton>Button Text</button>
 * ```
 */
@Directive({
  selector: '[appNeutralButton]',
  standalone: true,
})
export class NeutralButtonDirective extends ButtonBaseDirective {

  constructor() {
    super();

    const dom = this.dom;
    if (dom) {
      dom.style.backgroundColor = '#cccccc';
      dom.style.color = '#000000';
    }
  }
}
