// 自動生成

/** 入力欄の書式 */
export const InputFormatType = {
  CHECKBOX: 'checkbox',
  COLOR: 'color',
  COLOR_ALPHA: 'color_alpha',
  DOUBLE: 'double',
  NUMBER: 'number',
  SELECT_INT: 'select_int',
  SELECT_TEXT: 'select_text',
  TEXT: 'text',
  URL: 'url',
} as const;
export type InputFormatType = typeof InputFormatType[keyof typeof InputFormatType];

/** 入力値の型 */
export type InputValueType = string | number | boolean;


/**
 * 各入力項目の定義
 */
export interface InputSchemaDto {

  /** 入力欄の書式 */
  inputFormat: InputFormatType;

  /** 複数の入力欄を編集できるかどうか */
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
 * 編集項目の定義
 */
export interface EditSchemaDto {

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


/** 編集項目のデータ */
export const schemaData: EditSchemaDto = {
  version: '%%VERSION%%',
  groups: [/** Data */]
};
