import { CommonModule } from '@angular/common';
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
            <header class="item-menu">
              <hgroup>
                <h3>{{ item.key }}</h3>
                <p>{{ item.label }}</p>
              </hgroup>
              @if (item.isArray) {
                <button appNeutralButton type="button" (click)="formService.addControl(formGroup, item)">
                  <fa-icon [icon]="faPlus" />入力欄追加
                </button>
              }
              @if (formService.hasChange(formGroup, item)) {
                <button appNeutralButton type="button" (click)="formService.resetControl(formGroup, item)">
                  <fa-icon [icon]="faRotateRight" />既定に戻す
                </button>
              }
            </header>
            <div *ngFor="let _ of formService.getControl(formGroup, item.key).controls; let i = index" class="pure-control-group">
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
                  <input type="text" [formControlName]="i"
                    id="{{ item.key }}-{{ i }}" class="pure-input-3-4"
                    pattern="^\\d+\\.\\d+$" />
                }
                @case ('number') {
                  <input type="number" [formControlName]="i"
                    id="{{ item.key }}-{{ i }}" class="pure-input-3-4"
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
                <button appNegativeButton type="button" (click)="formService.removeControl(formGroup, item.key, i)">
                  <fa-icon [icon]="faTrash" />入力欄削除
                </button>
              }
            </div>
          </div>
        }
      }
    </form>
  `,
  styles: [
    `.item-menu {
      align-items: center;
      display: flex;
      flex-direction: row;
    }`,
    `.item-menu > button {
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
