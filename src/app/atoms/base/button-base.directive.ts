import { ElementRef, inject } from '@angular/core';

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
 * }
 * ```
 */
export abstract class ButtonBaseDirective {

  protected readonly dom: HTMLElement | null;

  private readonly elementRef = inject(ElementRef);


  constructor() {
    const dom = this.elementRef.nativeElement as HTMLElement;
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
