import { ButtonBaseDirective } from './button-base.directive';

/**
 * リンクボタンの基礎実装
 *
 * @example
 * ``` typescript
 * export class ???Directive extends LinkButtonBaseDirective {
 *   // your code
 * }
 * ```
 */
export abstract class LinkButtonBaseDirective extends ButtonBaseDirective {

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
