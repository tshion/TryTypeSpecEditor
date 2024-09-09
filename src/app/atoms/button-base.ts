import { ElementRef } from "@angular/core";

/**
 * ボタンの基礎実装
 */
export abstract class ButtonBase {

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
