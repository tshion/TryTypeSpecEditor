import { ElementRef } from '@angular/core';

/**
 * ボタンの基礎実装
 *
 * @example
 * ``` typescript
 * export class ???Directive extends ButtonBaseDirective {
 *   // your code
 *   @Input()
 *   public set ???(enabled: boolean) {
 *     this.enabled = enabled;
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
export abstract class ButtonBaseDirective {

  protected readonly dom: HTMLElement | null;


  constructor(
    elementRef: ElementRef,
  ) {
    const dom = elementRef.nativeElement as HTMLElement;
    switch (dom.tagName) {
      case 'A':
      case 'BUTTON': {
        dom.classList.add('pure-button');
        this.dom = dom;
        break;
      }
      default:
        this.dom = null;
        break;
    }
  }


  /** 有効かどうか */
  protected set enabled(value: boolean) {
    const dom = this.dom;
    if (!dom) { return; }

    const className = 'pure-button-disabled';
    if (value) {
      dom.classList.remove(className);
    } else {
      dom.classList.add(className);
    }
  }
}
