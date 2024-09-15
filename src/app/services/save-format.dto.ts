import { InputValueType } from "../../schema";

/**
 * ファイル保存時の書式
 */
export interface SaveFormatDto {

  /** タイトル */
  title: string;

  /** 項目 */
  items: Record<string, InputValueType | InputValueType[]>;
}
