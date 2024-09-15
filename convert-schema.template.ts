// 自動生成

/** 入力形式 */
export const InputType = {
  CHECKBOX: 'checkbox',
  COLOR: 'color',
  NUMBER: 'number',
  SELECT: 'select',
  TEXTBOX: 'textbox',
  URL: 'url',
} as const;

/** 入力形式の型エイリアス */
export type InputType = typeof InputType[keyof typeof InputType];

/** 入力欄に設定できる型 */
export type InputValueType = string | number | boolean;

/**
 * 入力項目の書式
 */
export interface InputSchemaDto {

  /** 入力形式 */
  inputType: InputType;

  /** 複数入力できるかどうか */
  isArray: boolean;

  /** キー名 */
  key: string;

  /** 概要 */
  label: string;

  /** (デフォルトの)入力値 */
  value: InputValueType[];


  /** 数値入力できる最高値 */
  max?: number;

  /** 数値入力できる最低値 */
  min?: number;

  /** 選択肢 */
  options?: InputValueType[];

  /** 許可する入力パターンの正規表現 */
  pattern?: string;

  /** 数値入力の1回あたりの増減幅 */
  step?: number;
}

/**
 * 入力の書式
 */
export interface SchemaDto {

  /** 書式バージョン */
  version: string;

  /** 書式グループ */
  groups: {

    /** グループ名 */
    name: string;

    /** 概要 */
    description: string;

    /** 書式一覧 */
    items: InputSchemaDto[];
  }[];
}

/** 入力の書式データ */
export const schemaData: SchemaDto = {
  version: '%%VERSION%%',
  groups: [/** Data */]
};
