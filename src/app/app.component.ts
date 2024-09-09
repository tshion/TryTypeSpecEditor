import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk, faPlus, faRotateRight, faTrash } from '@fortawesome/free-solid-svg-icons';
import { schemaData } from '../schema';
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
                  <button appNeutralButton type="button">
                    <fa-icon [icon]="faPlus" />入力欄追加
                  </button>
                }
                <!--
                @if (hasChange(item)) {
                -->
                  <button appNeutralButton type="button">
                    <fa-icon [icon]="faRotateRight" />既定に戻す
                  </button>
                <!--
                  <span style="color: red;">※変更中</span>
                }
                -->
              </hgroup>
              <div *ngFor="let _ of getControls(item.key).controls; let i = index" class="pure-control-group">
                <input type="text" id="{{ item.key }}-{{ i }}" [formControlName]="i" class="pure-input-3-4" [pattern]="item.pattern ?? ''" />
                @if (item.isArray) {
                  <button appNegativeButton type="button" (click)="a()">
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


  public getControls(key: string) {
    return this.form.controls[key] as FormArray;
  }

  public a() {
    alert();
  }
}
