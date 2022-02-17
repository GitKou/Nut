/* eslint-disable @typescript-eslint/no-unused-expressions */
/** Request 网络请求工具 更详细的 api 文档: https://github.com/umijs/umi-request */
import { extend } from 'umi-request';

import type { ExtendOptionsInit } from 'umi-request';
import type { RequestConfigParams } from './config';
import { requestConfig } from './config';
import type { FormattedRequestMethod } from './interfaces';
import {
  authHeaderInterceptor,
  errorHandler,
  errorInterceptors,
  pageParamsTransformer,
  responseDataFormatter,
  // restfulErrorInterceptors,
  // restfulResponseDataFormatter,
} from './utils';

/** 配置request请求时的默认参数 */
export const options: ExtendOptionsInit = {
  responseType: 'json',
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
};

let request = newARequest() as FormattedRequestMethod;

let requestTable = request as FormattedRequestMethod<true>;

function newARequest() {
  request = extend(options) as FormattedRequestMethod;
  request.interceptors.request.use(authHeaderInterceptor, { global: false });
  request.interceptors.request.use(pageParamsTransformer, { global: false });
  request.interceptors.response.use(errorInterceptors, { global: false });
  request.use(responseDataFormatter, { global: false });
  requestTable = request;
  return request;
}

/** 设置配置项config */
function setRequestConfig(configParams: Partial<RequestConfigParams>) {
  // 更新配置
  requestConfig.update(configParams);
  // 新生成request
  newARequest();
}

export { request, requestTable, setRequestConfig, requestConfig };
