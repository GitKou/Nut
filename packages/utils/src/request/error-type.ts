import { ResponseError } from 'umi-request';

export interface ErrorInfoStructure {
  success: boolean; // if request is success
  data?: any; // response data
  code?: string; // code for errorType
  message?: string; // message display to user
  // showType?: number; // error display type： 0 silent; 1 message.warn; 2 message.error; 4 notification; 9 page
  // traceId?: string; // Convenient for back-end Troubleshooting: unique request ID
  // host?: string; // Convenient for backend Troubleshooting: host of current access server
  status?: number; /// response status
  statusText?: string; //response status text
}

export type ErrorName = 'BusinessError' | 'HttpError' | 'PremiseError';
export const ErrorNames: ErrorName[] = [
  /**
   * 系统错误，
   * old 模式下：http 状态码为 200，但响应数据中 res.code !== '200'的错误
   * restful模式下：http状态码为403，{code: 'XX', message: 'XXX'}
   */
  'BusinessError',
  /**
   * 网络错误
   * old 模式下：http 状态码不为200
   * restful模式下：http状态码不为200、401、403
   */
  'HttpError',
  /**
   *  前提错误
   * 如：全局常量不存在，用户信息不存在，Token 不存在等
   */
  'PremiseError',
];
export const ErrorCnames: Record<ErrorName, string> = {
  BusinessError: '系统错误',
  HttpError: '网络错误',
  PremiseError: '前置错误',
};
export class ErrorInfo extends Error {
  info: ErrorInfoStructure;
  name: ErrorName;
  cname: string;
  constructor(name: ErrorName, info: ErrorInfoStructure) {
    super(info.message);
    this.name = name;
    this.cname = ErrorCnames[name];
    this.info = info;
  }
}

export type ErrorHandlerError = ResponseError & ErrorInfo;
