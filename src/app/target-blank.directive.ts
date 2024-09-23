import { Directive, HostBinding } from '@angular/core';

/**
 * `<a taget="_blank">` のセキュリティ問題を自動で回避するディレクティブ
 *
 * ※{@link https://dev.to/azrizhaziq/secure-your-apps-with-angular-directive-for-target-blank-fi9 | 参考文献}
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'a[target=_blank]',
  standalone: true,
})
export class TargetBlankDirective {

  @HostBinding('attr.rel')
  public rel = 'noopener noreferrer';
}
