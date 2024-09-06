import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { schemaData } from '../schema';
import { NegativeButtonComponent } from './atoms/negative-button.component';
import { NeutralButtonComponent } from './atoms/neutral-button.component';
import { PositiveLinkButtonComponent } from './atoms/positive-link-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    NegativeButtonComponent,
    NeutralButtonComponent,
    ReactiveFormsModule,
    PositiveLinkButtonComponent,
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

        <app-positive-link-button>
          <fa-icon [icon]="faFloppyDisk" />新規作成
        </app-positive-link-button>

        <app-neutral-button>aaa</app-neutral-button>
        <app-negative-button>bbb</app-negative-button>
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
              </hgroup>
              <div *ngFor="let _ of getControls(item.key).controls; let i = index" class="pure-control-group">
                <input type="text" id="{{ item.key }}-{{ i }}" [formControlName]="i" [pattern]="item.pattern ?? ''" />
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
}
