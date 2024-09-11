import { ElementRef } from '@angular/core';

/**
 * ボタンの基礎実装
 *
 * @example
 * ``` typescript
 * export class ???Directive extends ButtonBaseDirective {
 *   // your code
 *   constructor(
 *     // your code
 *     elementRef: ElementRef,
 *     // your code
 *   ) {
 *     super(elementRef);
 *     // your code
 *   }
 *   // your code
 * }
 * ```
 */
export abstract class ButtonBaseDirective {

  protected readonly dom: HTMLElement | null;


  constructor(
    elementRef: ElementRef,
  ) {
    const ref = elementRef.nativeElement;
    switch (ref.tagName) {
      case 'A': {
        const dom = ref as HTMLAnchorElement;
        if (!dom.href) {
          dom.classList.add('pure-button-disabled');
        }
        this.dom = dom;
        break;
      }
      case 'BUTTON': {
        const dom = ref as HTMLButtonElement;
        this.dom = dom;
        break;
      }
      default:
        this.dom = null;
        break;
    }

    this.dom?.classList.add('pure-button');
  }
}
