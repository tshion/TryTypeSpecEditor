/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { tap } from 'rxjs';
import { schemaData } from '../../schema';
import { PositivLinkeButtonDirective } from '../atoms/positive-link-button.directive';
import { SaveFormatDto } from '../save-format.dto';
import { TargetBlankDirective } from '../target-blank.directive';

/**
 * サイドメニュー
 *
 * * 以前に保存したファイルから入力内容を復元
 * * 入力内容のファイル保存
 */
@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    PositivLinkeButtonDirective,
    TargetBlankDirective,
  ],
  template: `
    <nav class="pure-menu pure-menu-scrollable">
      <hgroup>
        <h1>TypeSpecEditor</h1>
        {{ schemaData.version }}
      </hgroup>
      <hr />
      <form class="pure-form pure-form-stacked">
        <label for="meta-file">以前に保存したファイルの読み込み</label>
        <input type="file" id="meta-file" name="meta-file"
          accept="application/json" (change)="fileChanged($event)" />

        <hr />

        <label for="meta-title">タイトル</label>
        <input type="text" id="meta-title" name="meta-title" class="pure-input-1"
          required="" [(ngModel)]="metaTitle" />

        <a class="pure-input-1" download="sample.json" [appPositiveLinkButton]="downloadUrl">
          <fa-icon [icon]="faFloppyDisk" />ファイル保存
        </a>
      </form>
      <hr />
      <ul class="pure-menu-list">
        @for (link of links; track link) {
          <li class="pure-menu-item">
            <a class="pure-menu-link" target="_blank" [href]="link.url">
              {{ link.title }}<fa-icon [icon]="faUpRightFromSquare" />
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
  styles: [
    `fa-icon {
      margin-left: 4px;
      margin-right: 4px;
    }`,
    `nav {
      background-color: var(--app-color-main);
      color:  var(--app-color-main-on);
      height: 100vh;
      width: 360px;
    }`,
    `nav.pure-menu-scrollable {
      overflow-y: auto;
    }`,
    `nav > form {
      padding: 8px;
    }`,
    `nav > hgroup {
      padding: 16px;
    }`,
    `nav > hgroup > h1 {
      margin: 0 0 8px 0;
    }`,
  ],
})
export class SideMenuComponent implements OnInit {

  protected downloadUrl: string | null = null;

  protected readonly faFloppyDisk = faFloppyDisk;

  protected readonly faUpRightFromSquare = faUpRightFromSquare;

  @Input()
  public formGroup!: FormGroup;

  /** 関連するリンク一覧 */
  protected readonly links = [
    { title: 'Google Map', url: 'https://www.google.com/maps' },
  ];

  /** タイトル */
  private _metaTitle = '';

  protected get metaTitle() {
    return this._metaTitle;
  }

  protected set metaTitle(value: string) {
    this._metaTitle = value;
    this.updateDownloadUrl();
  }

  protected readonly schemaData = schemaData;


  ngOnInit(): void {
    this.formGroup.valueChanges.pipe(
      tap(() => this.updateDownloadUrl()),
    ).subscribe();
  }


  protected fileChanged(event: Event) {
    const dom = event.target as HTMLInputElement;
    const file = dom?.['files']?.[0];
    if (file?.type !== 'application/json') {
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (file?.type !== 'application/json') {
        return;
      }

      const result = reader.result;
      if (!result) {
        return;
      }

      // const data: [string, any][] = JSON.parse(result.toString());
      // Object.entries(data).forEach(([k, v]) => {
      //     const s = this.schemas?.find(x => x.key === k);
      //     if (s) {
      //         this.getControls(s).clear();
      //         if (s.isArray) {
      //             v.forEach(x => this.addControl(s, x));
      //         } else {
      //             this.addControl(s, v);
      //         }
      //     }
      // });
    }, false);
    reader.readAsText(file, 'UTF-8');
  }

  private updateDownloadUrl() {
    const title = this._metaTitle;
    if (!title) {
      this.downloadUrl = null;
      return;
    }

    const rawValue: [string, any[]][] = this.formGroup.getRawValue();
    const saveData: any = {};
    for (const [k, v] of Object.entries(rawValue)) {
      const target = this.schemaData.groups.flatMap(x => x.items).find(x => x.key === k);
      if (!target) {
        continue;
      }

      // FIXME: 無効な値の取り扱い
      // FIXME: 型の調整
      saveData[k] = target.isArray
        ? v.filter(x => !!x)
        : v[0];
    }

    const obj: SaveFormatDto = {
      title: title,
      items: saveData,
    };
    const blob = new Blob(
      [JSON.stringify(obj, null, 4)],
      { type: 'application/json' },
    );
    this.downloadUrl = window.URL.createObjectURL(blob);
  }
}
