import { Directive, ElementRef } from '@angular/core';

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
export class PositiveButtonDirective {

  constructor(
    private readonly elementRef: ElementRef,
  ) {
    const ref: HTMLElement = this.elementRef.nativeElement;
    ref.classList.add('pure-button');
    ref.style.backgroundColor = '#0078e7';
    ref.style.color = '#ffffff';

    if (ref.tagName === 'A') {
      const refA = ref as HTMLAnchorElement;
      if (!refA.href) {
        ref.classList.add('pure-button-disabled');
      }
    }
  }
}
