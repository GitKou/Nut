/** 后端返回list给的page格式 */
export type Pagination = {
  currentPage: number;
  totalCount: number;
};

/**  后端page查询参数格式 */
export type PaginationQueryParams = {
  pageSize: number;
  pageNo: number;
};


/** 标准antd/pagination组件接收的格式 */
export type PaginationData = {
  pageSize: number;
  current: number;
  total?: number;
};

/** 标准antd/pagination输出的page参数 */
export type PaginationParams = {
  pageSize: number;
  current: number;
};

/** 带分页的参数 */
export type ParamsWithPagination<T> = T & Partial<PaginationParams>;
