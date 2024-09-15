import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { InputSchemaDto, InputValueType, schemaData } from '../../schema';
import { SaveFormatDto } from './save-format.dto';

/**
 * 書式項目の入力データを司るサービス
 */
@Injectable({
  providedIn: 'root',
})
export class PropertyFormService {

  private readonly schemaItems = schemaData.groups.flatMap(group => group.items);


  public addControl(
    base: FormGroup,
    schema: InputSchemaDto,
    value?: InputValueType,
  ) {
    let v = value;
    if (v === undefined) {
      switch (schema.inputType) {
        case 'checkbox':
          v = false;
          break;
        case 'color':
          v = '#888888'
          break;
        case 'number':
          v = 0;
          break;
        case 'select':
          v = schema.options?.[0];
          break;
        case 'textbox':
        case 'url':
          v = '';
          break;
        default:
          throw Error(`想定外の入力形式です: ${schema.key} -> ${schema.inputType}`);
      }
    }
    // FIXME: 検証ルールの設定
    this.getControl(base, schema.key).push(new FormControl(v));
  }

  public getControl(base: FormGroup, key: string) {
    return base.controls[key] as FormArray;
  }

  public hasChange(base: FormGroup, schema: InputSchemaDto) {
    const input = this.getControl(base, schema.key).getRawValue();
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

  public removeControl(base: FormGroup, key: string, index: number) {
    this.getControl(base, key).removeAt(index);
  }

  public resetControl(base: FormGroup, schema: InputSchemaDto) {
    this.getControl(base, schema.key).clear();
    schema.value.forEach(x => this.addControl(base, schema, x));
  }

  public restore(base: FormGroup, items: Record<string, InputValueType | InputValueType[]>) {
    for (const [k, v] of Object.entries(items)) {
      const schema = this.schemaItems.find(x => x.key === k);
      if (schema === undefined) { continue; }

      this.getControl(base, schema.key).clear();
      if (schema.isArray) {
        (v as InputValueType[]).forEach(x => this.addControl(base, schema, x));
      } else {
        this.addControl(base, schema, (v as InputValueType));
      }
    }
  }

  public toFormGroup() {
    const controls: Record<string, FormArray> = {};
    this.schemaItems.forEach(schema => {
      const children = schema.value.map(value => new FormControl(value));
      controls[schema.key] = new FormArray(children);
    });
    return new FormGroup(controls);
  }

  public toSaveFormat(base: FormGroup, title: string) {
    if (!base.valid || !title) { return; }

    const data: Record<string, InputValueType | InputValueType[]> = {};
    for (const [k, v] of Object.entries<InputValueType[]>(base.getRawValue())) {
      const schema = this.schemaItems.find(x => x.key === k);
      if (schema === undefined) { continue; }

      // FIXME
      const values = v.map(x => {
        switch (schema.inputType) {
          case 'checkbox':
            return !!x;
          case 'color':
          case 'textbox':
          case 'url':
            return `${x}`;
          case 'number':
            return Number(x);
          case 'select':
            return x; // FIXME: 型情報の追加
        }
      });
      data[k] = schema.isArray ? values : values[0];
    }

    const result: SaveFormatDto = {
      title: title,
      items: data,
    };
    return result;
  }
}
