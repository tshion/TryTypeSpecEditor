import { Directive, effect, input } from '@angular/core';
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
  public appPositiveLinkButton = input<string | null>();


  constructor() {
    super();

    const dom = this.dom;
    if (dom) {
      dom.style.backgroundColor = '#0078e7';
      dom.style.color = '#ffffff';
    }

    effect(() => {
      this.url = this.appPositiveLinkButton() || '';
    });
  }
}
