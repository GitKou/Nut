import type { TableListData } from './table';

/** 后端返回的数据格式（不带分页） */
export interface AjaxData<T> {
  code: string;
  data: T;
  message: string;
}

/** 后端返回的 带分页的 数据格式 */
export type AjaxDataWithPage<T> = {
  code: string;
  data: TableListData<T>;
  message: string;
};

/** 格式化之后的数据格式 （不带分页）*/
export interface FormattedAjaxData<T = any> {
  success: boolean;
  data: T;
  message: string;
  code: string;
}

/** 格式化之后的 带分页的 数据格式 */
export interface FormattedAjaxDataWithPage<T = any> {
  success: boolean;
  data: T[];
  total: number;
  current: number;
  message: string;
  code: string;
}
