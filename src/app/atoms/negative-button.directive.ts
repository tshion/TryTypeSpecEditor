import { Directive, ElementRef } from '@angular/core';
import { ButtonBase } from './button-base';

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
export class NegativeButtonDirective extends ButtonBase {

  constructor(
    elementRef: ElementRef,
  ) {
    super(elementRef);

    const dom = this.dom;
    if (dom) {
      dom.style.backgroundColor = '#ca3c3c';
      dom.style.color = '#ffffff';
    }
  }
}