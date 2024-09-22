import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { InputSchemaDto, InputValueType, schemaData } from '../../schema';

/**
 * 編集項目データを司るForm モデルの操作サービス
 */
@Injectable({
  providedIn: 'root',
})
export class SchemaFormService {

  private readonly schemaItems = schemaData.groups.flatMap(group => group.items);


  /** FormArray に項目追加 */
  public addFormArray(base: FormGroup, schema: InputSchemaDto) {
    const control = this.newFormControl(schema);
    this.getFormArray(base, schema).push(control);
  }

  /** 指定したキーに対応するFormArray の取得 */
  public getFormArray(base: FormGroup, schema: InputSchemaDto) {
    return base.controls[schema.key] as FormArray;
  }

  /** FormControl 向けのID 取得 */
  public getFormControlId(schema: InputSchemaDto, index: number) {
    return `${schema.key}-${index}`;
  }

  /** FormArray の設定値に変更点があるかどうか */
  public hasChangedFormArray(base: FormGroup, schema: InputSchemaDto) {
    const input = this.getFormArray(base, schema).getRawValue();
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

  /** FormControl インスタンスの新規作成 */
  private newFormControl(schema: InputSchemaDto, value?: InputValueType) {
    let v = value;
    if (v === undefined) {
      switch (schema.inputFormat) {
        case 'checkbox':
          v = false;
          break;
        case 'color':
          v = '#888888'
          break;
        case 'double':
          v = '0.0';
          break;
        case 'number':
          v = 0;
          break;
        case 'select_int':
        case 'select_text':
          v = schema.options?.[0];
          break;
        case 'text':
        case 'url':
          v = '';
          break;
        default:
          throw Error(`想定外の入力形式です: ${schema.key} -> ${schema.inputFormat}`);
      }
    }
    // FIXME: 検証ルールの設定
    return new FormControl(v);
  }

  /** FormGroup の新規作成 */
  public newFormGroup() {
    const controls: Record<string, FormArray> = {};
    this.schemaItems.forEach(schema => {
      const children = schema.value.map(value => this.newFormControl(schema, value));
      controls[schema.key] = new FormArray(children);
    });
    return new FormGroup(controls);
  }

  /** 指定したFormArray の要素を削除する */
  public removeFromFormArray(base: FormGroup, schema: InputSchemaDto, index: number) {
    this.getFormArray(base, schema).removeAt(index);
  }

  /** FormArray の入力内容をリセットする */
  public resetFormArray(base: FormGroup, schema: InputSchemaDto) {
    const children = schema.value.map(value => this.newFormControl(schema, value));
    const target = this.getFormArray(base, schema);
    target.clear();
    target.controls = children;
  }
}
