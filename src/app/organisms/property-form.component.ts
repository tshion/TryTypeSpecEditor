import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faRotateRight, faTrash } from '@fortawesome/free-solid-svg-icons';
import { schemaData } from '../../schema';
import { NegativeButtonDirective } from '../atoms/negative-button.directive';
import { NeutralButtonDirective } from '../atoms/neutral-button.directive';
import { PositivLinkeButtonDirective } from '../atoms/positive-link-button.directive';
import { PropertyFormService } from '../services/property-form.service';

/**
 * 各項目の入力フォーム
 */
@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [
    FontAwesomeModule,
    NegativeButtonDirective,
    NeutralButtonDirective,
    ReactiveFormsModule,
    PositivLinkeButtonDirective,
  ],
  template: `
    <form [formGroup]="formGroup" class="pure-form pure-form-aligined">
      @for (group of schemaData.groups; track group) {
        <hgroup>
          <h2>{{ group.name }}</h2>
          <p>{{ group.description }}</p>
        </hgroup>
        @for (item of group.items; track item) {
          <div [formArrayName]="item.key" class="item">
            <header class="item-menu">
              @if (item.isArray) {
                <button appNeutralButton type="button" (click)="formService.addControl(formGroup, item)">
                  <fa-icon [icon]="faPlus" />入力欄追加
                </button>
              }
              <hgroup>
                <h3>{{ item.key }}</h3>
                <p>{{ item.label }}</p>
              </hgroup>
              @if (formService.hasChange(formGroup, item)) {
                <button appNeutralButton type="button" (click)="formService.resetControl(formGroup, item)">
                  <fa-icon [icon]="faRotateRight" />既定に戻す
                </button>
              }
            </header>
            @for (_ of formService.getControl(formGroup, item.key).controls; track $index; let i = $index) {
              <div class="pure-control-group">
                @if (item.isArray) {
                  <button appNegativeButton type="button" (click)="formService.removeControl(formGroup, item.key, i)">
                    <fa-icon [icon]="faTrash" />入力欄削除
                  </button>
                }
                @switch (item.inputFormat) {
                  @case ('checkbox') {
                    <label for="{{ item.key }}-{{ i }}" class="pure-checkbox">
                      <input type="checkbox" id="{{ item.key }}-{{ i }}" [formControlName]="i" />
                    </label>
                  }
                  @case ('color') {
                    <input type="color" id="{{ item.key }}-{{ i }}" [formControlName]="i" />
                    <span class="pure-form-message-inline">{{ formService.getControl(formGroup, item.key).controls[i].getRawValue() }}</span>
                  }
                  @case ('double') {
                    <input type="text" id="{{ item.key }}-{{ i }}" [formControlName]="i"
                      pattern="^\\d+\\.\\d+$" />
                  }
                  @case ('number') {
                    <input type="number" id="{{ item.key }}-{{ i }}" [formControlName]="i"
                      [min]="item.min ?? null" [max]="item.max ?? null" [step]="item.step" />
                  }
                  @case ('select_int') {
                    <select id="{{ item.key }}-{{ i }}" [formControlName]="i">
                      @for (opt of item.options; track opt) {
                        <option [value]="opt">{{ opt }}</option>
                      }
                    </select>
                  }
                  @case ('select_text') {
                    <select id="{{ item.key }}-{{ i }}" [formControlName]="i">
                      @for (opt of item.options; track opt) {
                        <option [value]="opt">{{ opt }}</option>
                      }
                    </select>
                  }
                  @case ('text') {
                    <input type="text" id="{{ item.key }}-{{ i }}" [formControlName]="i"
                      [pattern]="item.pattern ?? ''" />
                  }
                  @case ('url') {
                    <input type="url" id="{{ item.key }}-{{ i }}" [formControlName]="i" />
                  }
                }
              </div>
            }
          </div>
        }
      }
    </form>
  `,
  styles: [
    `.item {
      margin: 16px 0;
    }`,
    `.item > .pure-control-group {
      align-items: center;
      display: flex;
      flex-direction: row;
    }`,
    `.item > .pure-control-group input {
      flex-grow: 1;
    }`,
    `.item > .pure-control-group select {
      flex-grow: 1;
    }`,
    `.item-menu {
      align-items: center;
      display: flex;
      flex-direction: row;
    }`,
    `button {
      margin: 0 8px;
    }`,
  ],
})
export class PropertyFormComponent {

  protected readonly faPlus = faPlus;

  protected readonly faRotateRight = faRotateRight;

  protected readonly faTrash = faTrash;

  @Input()
  public formGroup!: FormGroup;

  protected readonly schemaData = schemaData;


  constructor(
    protected readonly formService: PropertyFormService,
  ) {
  }
}
