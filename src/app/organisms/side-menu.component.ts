/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { tap } from 'rxjs';
import { schemaData } from '../../schema';
import { PositivLinkeButtonDirective } from '../atoms/positive-link-button.directive';
import { SaveFormatDto } from '../save-format.dto';
import { TargetBlankDirective } from '../target-blank.directive';

/**
 * サイドメニュー
 */
@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [
    FontAwesomeModule,
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
        <input type="file" accept="application/json" class="pure-input-1" />

        <label for="meta-title">タイトル</label>
        <input type="text" id="meta-title" class="pure-input-1" (change)="fileChanged($event)" />

        <a [appPositiveLinkButton]="downloadUrl" download="sample.json">
          <fa-icon [icon]="faFloppyDisk" />新規作成
        </a>
      </form>
      <hr />
      <ul class="pure-menu-list">
        <li class="pure-menu-item">
          <a href="https://www.google.com/maps" class="pure-menu-link" target="_blank">
            Google Map <fa-icon [icon]="faUpRightFromSquare" />
          </a>
        </li>
      </ul>
    </nav>
  `,
  styles: [
    `:host {
      height: inherit;
    }`,
    `nav {
      background-color: var(--app-color-main);
      color:  var(--app-color-main-on);
      height: inherit;
    }`,
    `nav > form {
      padding: 8px 16px;
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

  protected readonly schemaData = schemaData;


  ngOnInit(): void {
    this.formGroup.valueChanges.pipe(
      tap(() => this.updateDownloadUrl()),
    ).subscribe();

    this.updateDownloadUrl();
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
      title: '',
      items: saveData,
    };
    const blob = new Blob(
      [JSON.stringify(obj, null, 4)],
      { type: 'application/json' },
    );
    this.downloadUrl = window.URL.createObjectURL(blob);
  }
}
