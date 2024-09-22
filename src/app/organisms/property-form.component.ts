import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faRotateRight, faTrash } from '@fortawesome/free-solid-svg-icons';
import { schemaData } from '../../schema';
import { NegativeButtonDirective } from '../atoms/negative-button.directive';
import { NeutralButtonDirective } from '../atoms/neutral-button.directive';
import { PositivLinkeButtonDirective } from '../atoms/positive-link-button.directive';
import { SchemaFormService } from '../services/schema-form.service';

/**
 * 各編集項目の入力フォーム
 */
@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [
    CommonModule,
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
                <button appNeutralButton type="button" (click)="formService.addFormArray(formGroup, item)">
                  <fa-icon [icon]="faPlus" />入力欄追加
                </button>
              }
              <hgroup>
                <h3>{{ item.key }}</h3>
                <p>{{ item.label }}</p>
              </hgroup>
              @if (formService.hasChangedFormArray(formGroup, item)) {
                <button appNeutralButton type="button" (click)="formService.resetFormArray(formGroup, item)">
                  <fa-icon [icon]="faRotateRight" />既定に戻す
                </button>
              }
            </header>
            <div *ngFor="let control of formService.getFormArray(formGroup, item).controls; let i = index" class="pure-control-group">
              @if (item.isArray) {
                <button appNegativeButton type="button" (click)="formService.removeFromFormArray(formGroup, item, i)">
                  <fa-icon [icon]="faTrash" />入力欄削除
                </button>
              }
              @switch (item.inputFormat) {
                @case ('checkbox') {
                  <label [for]="formService.getFormControlId(item, i)" class="pure-checkbox">
                    <input type="checkbox" [formControlName]="i" [id]="formService.getFormControlId(item, i)" />
                  </label>
                }
                @case ('color') {
                  <input type="color" [formControlName]="i" [id]="formService.getFormControlId(item, i)" />
                  <span class="pure-form-message-inline">{{ control.getRawValue() }}</span>
                }
                @case ('double') {
                  <input type="text" [formControlName]="i" [id]="formService.getFormControlId(item, i)"
                    pattern="^\\d+\\.\\d+$" />
                }
                @case ('number') {
                  <input type="number" [formControlName]="i" [id]="formService.getFormControlId(item, i)"
                    [min]="item.min ?? null" [max]="item.max ?? null" [step]="item.step" />
                }
                @case ('select_int') {
                  <select [formControlName]="i" [id]="formService.getFormControlId(item, i)">
                    @for (opt of item.options; track opt) {
                      <option [value]="opt">{{ opt }}</option>
                    }
                  </select>
                }
                @case ('select_text') {
                  <select [formControlName]="i" [id]="formService.getFormControlId(item, i)">
                    @for (opt of item.options; track opt) {
                      <option [value]="opt">{{ opt }}</option>
                    }
                  </select>
                }
                @case ('text') {
                  <input type="text" [formControlName]="i" [id]="formService.getFormControlId(item, i)"
                    [pattern]="item.pattern ?? ''" />
                }
                @case ('url') {
                  <input type="url" [formControlName]="i"  [id]="formService.getFormControlId(item, i)" />
                }
              }
              </div>
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
    protected readonly formService: SchemaFormService,
  ) {
  }
}
