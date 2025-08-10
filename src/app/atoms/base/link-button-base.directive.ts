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
 * }
 * ```
 */
export abstract class LinkButtonBaseDirective extends ButtonBaseDirective {

  constructor() {
    super();
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
