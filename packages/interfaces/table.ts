import type { Pagination } from './pagination'

export type TableListData<T> = {
  list: T[];
} & Pagination;