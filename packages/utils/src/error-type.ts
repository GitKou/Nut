/* eslint-disable max-classes-per-file */

export interface ErrorInfoStructure {
  success: boolean; // if request is success
  data?: any; // response data
  code?: string; // code for errorType
  message?: string; // message display to user
  // showType?: number; // error display type： 0 silent; 1 message.warn; 2 message.error; 4 notification; 9 page
  // traceId?: string; // Convenient for back-end Troubleshooting: unique request ID
  // host?: string; // Convenient for backend Troubleshooting: host of current access server
}

/**
 * HTTP 错误，除网络错误、http 状态码为 200 以外的错误
 */
export class HttpError extends Error {
  info: ErrorInfoStructure;
  constructor(message: string, info: ErrorInfoStructure) {
    super(message);
    this.name = this.constructor.name;
    this.info = info;
  }
}

/**
 * 系统错误，http 状态码为 200，但响应数据中 res.code !== '200'的错误
 */
export class SystemError extends Error {
  info: ErrorInfoStructure;
  constructor(message: string, info: ErrorInfoStructure) {
    super(message);
    this.name = this.constructor.name;
    this.info = info;
  }
}

/**
 * Premise Error
 * 前提错误
 * 如：全局常量不存在，用户信息不存在，Token 不存在等
 */
export class PremiseError extends Error {
  info: ErrorInfoStructure;
  constructor(message: string, info: ErrorInfoStructure) {
    super(message);
    this.name = this.constructor.name;
    this.info = info;
  }
}
