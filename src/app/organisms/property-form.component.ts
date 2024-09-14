import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faRotateRight, faTrash } from '@fortawesome/free-solid-svg-icons';
import { InputSchemaDto, schemaData } from '../../schema';
import { NegativeButtonDirective } from '../atoms/negative-button.directive';
import { NeutralButtonDirective } from '../atoms/neutral-button.directive';
import { PositivLinkeButtonDirective } from '../atoms/positive-link-button.directive';

/**
 * 各項目の入力フォーム
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
  `,
})
export class PropertyFormComponent {

  protected readonly faPlus = faPlus;

  protected readonly faRotateRight = faRotateRight;

  protected readonly faTrash = faTrash;

  @Input()
  public formGroup!: FormGroup;

  protected readonly schemaData = schemaData;


  protected addControl(schema: InputSchemaDto, value?: unknown) {
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

  protected getControl(key: string) {
    return this.formGroup.controls[key] as FormArray;
  }

  protected hasChange(schema: InputSchemaDto) {
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

  protected removeControl(key: string, index: number) {
    this.getControl(key).removeAt(index);
  }

  protected resetControl(schema: InputSchemaDto) {
    this.getControl(schema.key).clear();
    schema.value.forEach(x => this.addControl(schema, x));
  }
}
