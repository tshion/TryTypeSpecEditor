import { Directive, ElementRef, Input } from '@angular/core';
import { LinkButtonBaseDirective } from './base/link-button-base.directive';

/**
 * 肯定的な文脈で使うリンクボタン
 *
 * @example
 * ``` html
 * <a [appPositiveLinkButton]="#">Link Text</a>
 * ```
 */
@Directive({
  selector: '[appPositiveLinkButton]',
  standalone: true,
})
export class PositivLinkeButtonDirective extends LinkButtonBaseDirective {

  /**
   * @param 遷移先URL
   */
  @Input()
  public set appPositiveLinkButton(url: string | null) {
    this.url = url || '';
  }


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
