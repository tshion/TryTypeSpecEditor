import { ElementRef } from '@angular/core';
import { ButtonBaseDirective } from './button-base.directive';

/**
 * リンクボタンの基礎実装
 *
 * @example
 * ``` typescript
 * export class ???Directive extends LinkButtonBaseDirective {
 *   // your code
 *   @Input()
 *   public set ???(url: string) {
 *     this.url = url;
 *   }
 *
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
export abstract class LinkButtonBaseDirective extends ButtonBaseDirective {

  constructor(
    elementRef: ElementRef,
  ) {
    super(elementRef);
  }


  /** 遷移先URL */
  protected set url(value: string) {
    if (this.dom?.tagName !== 'A') {
      return;
    }

    const dom = this.dom as HTMLAnchorElement;
    this.enabled = !!value;
    dom.href = value;
  }
}
