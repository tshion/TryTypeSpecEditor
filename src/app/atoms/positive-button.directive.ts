import { Directive, ElementRef } from '@angular/core';
import { ButtonBaseDirective } from './button-base.directive';

/**
 * 肯定的な文脈で使うボタン
 *
 * @example
 * ``` html
 * <a appPositiveButton href="#">Link Text</a>
 * <button appPositiveButton>Button Text</button>
 * ```
 */
@Directive({
  selector: '[appPositiveButton]',
  standalone: true,
})
export class PositiveButtonDirective extends ButtonBaseDirective {

  constructor(
    elementRef: ElementRef,
  ) {
    super(elementRef);

    const dom = this.dom;
    if (dom) {
      dom.style.backgroundColor = '#0078e7';
      dom.style.color = '#ffffff';
    }
  }
}
