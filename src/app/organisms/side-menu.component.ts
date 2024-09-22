/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { tap } from 'rxjs';
import { schemaData } from '../../schema';
import { PositivLinkeButtonDirective } from '../atoms/positive-link-button.directive';
import { SaveFormatDto } from '../services/save-format.dto';
import { SchemaFormService } from '../services/schema-form.service';
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
          accept="application/json" (change)="onFileChanged($event)" />

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


  constructor(
    private readonly formService: SchemaFormService,
  ) {
  }


  ngOnInit(): void {
    this.formGroup.valueChanges.pipe(
      tap(() => this.updateDownloadUrl()),
    ).subscribe();
  }


  protected onFileChanged(event: Event) {
    const dom = event.target as HTMLInputElement;
    const file = dom?.['files']?.[0];
    if (file?.type !== 'application/json') {
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (file?.type !== 'application/json') { return; }

      const result = reader.result;
      if (!result) { return; }

      const data: SaveFormatDto = JSON.parse(result.toString());
      this._metaTitle = data.title;
      this.formService.restore(this.formGroup, data.items);
    }, false);
    reader.readAsText(file, 'UTF-8');
  }

  private updateDownloadUrl() {
    const saveData = this.formService.toSaveFormat(this.formGroup, this._metaTitle);
    if (!saveData) {
      this.downloadUrl = null;
      return;
    }

    const blob = new Blob(
      [JSON.stringify(saveData, null, 4)],
      { type: 'application/json' },
    );
    this.downloadUrl = window.URL.createObjectURL(blob);
  }
}
