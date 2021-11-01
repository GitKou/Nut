/* eslint-disable @typescript-eslint/no-unused-expressions */
/** Request 网络请求工具 更详细的 api 文档: https://github.com/umijs/umi-request */
import { notification } from 'antd';
import { extend } from 'umi-request';

import store from 'store';
import type {
  RequestInterceptor,
  RequestOptionsInit,
  ResponseError,
  ResponseInterceptor,
  Context,
  OnionMiddleware,
} from 'umi-request';
import type { AjaxData, ParamsWithPagination, TableListData } from '@lc-nut/interfaces';
import type { ErrorInfoStructure } from './error-type';
import { HttpError, SystemError } from './error-type';

/** 异常处理程序 */
const errorHandler = (error: ResponseError) => {
  // 网络异常
  if (error.message === 'Failed to fetch') {
    notification.error({
      message: '网络异常',
      description: `${error.message}:${error?.request?.url}`,
    });
    // 阻断执行，并将错误信息传递下去
    return Promise.reject(error);
  }

  // HTTP 错误
  if (error.name === 'HttpError') {
    notification.error({
      message: 'HTTP 错误',
      description: error.message,
    });
    return Promise.reject(error);
  }

  // 系统错误
  if (error.name === 'SystemError') {
    notification.error({
      message: '系统错误',
      description: error.message,
    });
    return Promise.reject(error);
  }

  // 前置错误
  if (error.name === 'PremiseError') {
    notification.error({
      message: '前置错误',
      description: error.message,
    });
    return Promise.reject(error);
  }

  notification.error({
    message: '其他错误',
    description: error.message,
  });
  return Promise.reject(error);
};
/** 请求加token */
const authHeaderInterceptor: RequestInterceptor = (url: string, options: RequestOptionsInit) => {
  const token = store.get('token') || '';
  const { headers, ...rest } = options;

  return {
    url,
    options: {
      ...rest,
      headers: {
        ...headers,
        'access-token': token,
      },
    },
  };
};
const pageTransformMap = {
  currentLabel: 'pageNo',
  pageSizeLabel: 'pageSize',
};
// 处理page参数
const pageParamsTransformer: RequestInterceptor = (url: string, options: RequestOptionsInit) => {
  const params = options.params as (ParamsWithPagination<Record<any, any>>) | undefined;
  if (params?.current !== undefined) {
    const { current } = params;
    delete params.current;
    params[pageTransformMap.currentLabel] = current;
  }
  if (params?.pageSize !== undefined) {
    const { pageSize } = params;
    delete params.pageSize;
    params[pageTransformMap.pageSizeLabel] = pageSize;
  }

  return {
    url,
    options,
  };
};
const errorInterceptors: ResponseInterceptor = async (response, options) => {
  // 网络成功
  if (response.status === 200) {
    if (options.responseType === 'json') {
      return response
        .clone()
        .json()
        .then((responseJson: AjaxData<any>) => {
          const code = responseJson?.code;
          if (code === '200') {
            return response;
          }
          if (code === 'A0200') {
            store.remove('token');
            setTimeout(() => {
              window.location.replace(`/login?redirect=${window.location.href}`);
            }, 200);
          }
          const systemErrorInfo: ErrorInfoStructure = {
            success: false,
            data: responseJson?.data,
            message: responseJson?.message,
            code: responseJson?.code,
          };

          // throw new SystemError(`${code} ${responseJson.message} ${response.url}`, systemErrorInfo);
          throw new SystemError(`${code} ${responseJson.message}`, systemErrorInfo);
        });
    }
    return response;
  }
  // 网络失败
  const httpErrorInfo: ErrorInfoStructure = {
    success: false,
  };
  // throw new HttpError(`${response.status} ${response.statusText} ${response.url}`, httpErrorInfo);
  throw new HttpError(`${response.status} ${response.statusText}`, httpErrorInfo);
};

const responseDataFormatter: OnionMiddleware = async (ctx: Context, next: () => void) => {
  await next();
  const { res } = ctx;
  if (res instanceof Error) return;
  const oRes = res as AjaxData<any>;
  const { code, message, data } = oRes;
  // 如果返回responseType的是json
  if (code !== undefined) {
    if (
      typeof data === 'object' &&
      data !== null &&
      'totalCount' in data &&
      'currentPage' in data
    ) {
      // 如果是带分页的json
      const { totalCount, currentPage } = data as TableListData<any>;
      ctx.res = {
        success: true,
        data: data?.list,
        total: totalCount,
        current: currentPage,
        message,
        code,
      };
    } else {
      // 如果是不带分页的json
      ctx.res = {
        success: true,
        data,
        message,
        code,
      };
    }
  }
  // responseType非json不做处理
};

/** 配置request请求时的默认参数 */
const request = extend({
  responseType: 'json',
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

request.interceptors.request.use(authHeaderInterceptor);
request.interceptors.request.use(pageParamsTransformer);
request.interceptors.response.use(errorInterceptors);
request.use(responseDataFormatter);

export default request;
