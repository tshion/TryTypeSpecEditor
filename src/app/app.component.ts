/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { tap } from 'rxjs';
import { schemaData } from '../schema';
import { PositivLinkeButtonDirective } from './atoms/positive-link-button.directive';
import { PropertyFormComponent } from './organisms/property-form.component';
import { SaveFormatDto } from './save-format.dto';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    PositivLinkeButtonDirective,
    PropertyFormComponent,
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
          <a href="https://www.google.com/maps" class="pure-menu-link">Google Map</a>
        </li>
      </ul>
    </nav>
    <main>
      <app-property-form [formGroup]="form" />
    </main>
  `,
  styles: [
    `:host {
      display: flex;
      flex-direction: row;
    }`,
    `main {
      background-color: var(--app-color-base);
      color: var(--app-color-base-on);
      flex-grow: 1;
      height: 100vh;
      overflow-y: auto;
      padding: 0 16px;
    }`,
    `nav {
      background-color: var(--app-color-main);
      color:  var(--app-color-main-on);
      height: 100vh;
      overflow-y: auto;
      width: 360px;
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
export class AppComponent implements OnInit {

  public downloadUrl: string | null = null;

  public readonly faFloppyDisk = faFloppyDisk;

  public form!: FormGroup;

  public readonly schemaData = schemaData;


  ngOnInit(): void {
    const controls: any = {};
    this.schemaData.groups.flatMap(group => group.items).forEach(item => {
      const children = item.value.map(value => new FormControl(value));
      controls[item.key] = new FormArray(children);
    });
    this.form = new FormGroup(controls);

    this.form.valueChanges.pipe(
      tap(() => this.updateDownloadUrl()),
    ).subscribe();

    this.updateDownloadUrl();
  }


  public fileChanged(event: Event) {
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
    const rawValue: [string, any[]][] = this.form.getRawValue();
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
