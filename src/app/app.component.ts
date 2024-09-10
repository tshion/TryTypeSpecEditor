import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk, faPlus, faRotateRight, faTrash } from '@fortawesome/free-solid-svg-icons';
import { InputSchemaDto, schemaData } from '../schema';
import { NegativeButtonDirective } from './atoms/negative-button.directive';
import { NeutralButtonDirective } from './atoms/neutral-button.directive';
import { PositiveButtonDirective } from './atoms/positive-button.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    NegativeButtonDirective,
    NeutralButtonDirective,
    ReactiveFormsModule,
    PositiveButtonDirective,
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
        <input type="text" id="meta-title" class="pure-input-1" />

        <a appPositiveButton>
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
      <form [formGroup]="form" class="pure-form pure-form-aligined">
        @for (group of schemaData.groups; track group) {
          <hgroup>
            <h2>{{ group.name }}</h2>
            <p>{{ group.description }}</p>
          </hgroup>
          @for (item of group.items; track item) {
            <div [formArrayName]="item.key">
              <hgroup>
                <h3>{{ item.key }}</h3>
                <p>{{ item.label }}</p>
                @if (item.isArray) {
                  <button appNeutralButton type="button" (click)="addControl(item)">
                    <fa-icon [icon]="faPlus" />入力欄追加
                  </button>
                }
                @if (hasChange(item)) {
                  <button appNeutralButton type="button" (click)="resetControl(item)">
                    <fa-icon [icon]="faRotateRight" />既定に戻す
                  </button>
                }
              </hgroup>
              <div *ngFor="let _ of getControl(item.key).controls; let i = index" class="pure-control-group">
                @switch (item.inputType) {
                  @case ('checkbox') {
                    <label for="{{ item.key }}-{{ i }}" class="pure-checkbox">
                      <input type="checkbox" id="{{ item.key }}-{{ i }}" [formControlName]="i" />
                    </label>
                  }
                  @case ('color') {
                    <input type="color" id="{{ item.key }}-{{ i }}" [formControlName]="i" />
                    <span class="pure-form-message-inline">{{ getControl(item.key).controls[i].getRawValue() }}</span>
                  }
                  @case ('number') {
                    <input type="number" [formControlName]="i"
                      id="{{ item.key }}-{{ i }}" class="pure-input-3-4"
                      [min]="item.min ?? null" [max]="item.max ?? null" [step]="item.step" />
                  }
                  @case ('select') {
                    <select id="{{ item.key }}-{{ i }}" [formControlName]="i">
                      @for (opt of item.options; track opt) {
                        <option [value]="opt">{{ opt }}</option>
                      }
                    </select>
                  }
                  @case ('textbox') {
                    <input type="text" [formControlName]="i"
                      id="{{ item.key }}-{{ i }}" class="pure-input-3-4"
                      [pattern]="item.pattern ?? ''" />
                  }
                  @case ('url') {
                    <input type="url" [formControlName]="i"
                      id="{{ item.key }}-{{ i }}" class="pure-input-3-4" />
                  }
                }
                @if (item.isArray) {
                  <button appNegativeButton type="button" (click)="removeControl(item.key, i)">
                    <fa-icon [icon]="faTrash" />入力欄削除
                  </button>
                }
              </div>
            </div>
          }
        }
      </form>
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

  public readonly faFloppyDisk = faFloppyDisk;

  public readonly faPlus = faPlus;

  public readonly faRotateRight = faRotateRight;

  public readonly faTrash = faTrash;

  public form!: FormGroup;

  public readonly schemaData = schemaData;


  ngOnInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const controls: any = {};
    this.schemaData.groups.flatMap(group => group.items).forEach(item => {
      const children = item.value.map(value => new FormControl(value));
      controls[item.key] = new FormArray(children);
    });
    this.form = new FormGroup(controls);
  }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public addControl(schema: InputSchemaDto, value?: any) {
    let v = value;
    if (!value) {
      switch (schema.inputType) {
        case 'checkbox':
          v = false;
          break;
        case 'color':
          v = '#FFFFFF'
          break;
        case 'number':
          v = 0;
          break
        case 'select':
          v = schema.options?.[0];
          break;
        case 'textbox':
        case 'url':
          v = '';
          break;
      }
    }
    this.getControl(schema.key).push(new FormControl(v));
  }

  public getControl(key: string) {
    return this.form.controls[key] as FormArray;
  }

  public hasChange(schema: InputSchemaDto) {
    const input = this.getControl(schema.key).getRawValue();
    let hasChanged = input.length !== schema.value.length;
    if (!hasChanged) {
      for (let i = 0; i < schema.value.length; i++) {
        if (input[i] != schema.value[i]) {
          hasChanged = true;
          break;
        }
      }
    }
    return hasChanged;
  }

  public removeControl(key: string, index: number) {
    this.getControl(key).removeAt(index);
  }

  public resetControl(schema: InputSchemaDto) {
    this.getControl(schema.key).clear();
    schema.value.forEach(x => this.addControl(schema, x));
  }
}
