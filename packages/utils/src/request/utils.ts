import { notification } from 'antd';
import {
  ParamsWithPagination,
  AjaxData,
  TableListData,
} from '@lc-nut/interfaces';
import {
  ErrorInfoStructure,
  ErrorInfo,
  ErrorNames,
  ErrorHandlerError,
} from './error-type';
import { HTTP_STATUS } from './http-status';
import {
  Context,
  OnionMiddleware,
  RequestInterceptor,
  RequestOptionsInit,
  ResponseInterceptor,
} from 'umi-request';
import { requestConfig } from './config';
import store from 'store';

/** 异常处理程序 */
export const errorHandler = (error: ErrorHandlerError) => {
  if (error.message === 'Failed to fetch') {
    // 网络异常
    notification.error({
      message: '网络异常',
      description: `${error.message}:${error?.request?.url}`,
    });
    // 阻断执行，并将错误信息传递下去
    return Promise.reject(error);
  }

  if (ErrorNames.includes(error.name)) {
    // 自定义异常
    notification.error({
      message: error.info.message || error.cname,
      description: `${error?.info.status} ${error?.info.statusText} ${error?.request?.url}`,
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
export const authHeaderInterceptor: RequestInterceptor = (
  url: string,
  options: RequestOptionsInit,
) => {
  const token = store.get(requestConfig.tokenName) || '';
  const { headers, ...rest } = options;

  return {
    url,
    options: {
      ...rest,
      headers: {
        ...headers,
        [requestConfig.tokenName]: token,
      },
    },
  };
};

export const pageTransformMap = {
  currentLabel: 'pageNo',
  pageSizeLabel: 'pageSize',
};
// 处理page参数
export const pageParamsTransformer: RequestInterceptor = (
  url: string,
  options: RequestOptionsInit,
) => {
  const params = options.params as
    | ParamsWithPagination<Record<any, any>>
    | undefined;
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

export const restfulErrorInterceptors: ResponseInterceptor = async (
  response,
  options,
) => {
  if (response.status === HTTP_STATUS.SUCCESS) {
    // 200, 接口正常返回，body任何形式
    if (options.responseType === 'json') {
      // 处理body为空的情况
      response
        .clone()
        .json()
        .then(() => {
          return response.clone().json();
        })
        .catch(() => {
          return {
            ...response,
            body: {},
          };
        });
    }
    return response;
  }
  if (response.status === HTTP_STATUS.BAD_REQUEST) {
    // 400 参数错误
    const badRequestErrorInfo: ErrorInfoStructure = {
      success: false,
      message: '参数错误',
      statusText: response.statusText,
      status: response.status,
    };
    throw new ErrorInfo('HttpError', badRequestErrorInfo);
  }
  if (response.status === HTTP_STATUS.UNAUTHORIZED) {
    // 401, 未登录，body文本类型
    requestConfig.unauthorizedCb();
    return response;
  }
  if (response.status === HTTP_STATUS.BUSINESS_EXCEPTION) {
    // 403, 业务异常，body: {code:string, message:string}
    if (options.responseType === 'json') {
      return response
        .clone()
        .json()
        .then((responseJson: AjaxData<any>) => {
          const { code, message } = responseJson;
          const businessErrorInfo: ErrorInfoStructure = {
            success: false,
            message: message,
            code: code || HTTP_STATUS.BUSINESS_EXCEPTION.toString(),
            status: response.status,
            statusText: response.statusText,
          };
          throw new ErrorInfo('BusinessError', businessErrorInfo);
        });
    }
    return response;
  }
  // 网络失败
  const httpErrorInfo: ErrorInfoStructure = {
    success: false,
    status: response.status,
    statusText: response.statusText,
  };
  throw new ErrorInfo('HttpError', httpErrorInfo);
};
export const errorInterceptors: ResponseInterceptor = async (
  response,
  options,
) => {
  if (response.status === 200) {
    // 网络成功
    if (options.responseType === 'json') {
      return response
        .clone()
        .json()
        .then((responseJson: AjaxData<any>) => {
          const { code, message, data } = responseJson;
          if (code === requestConfig.successCode) {
            return response;
          }
          if (code === requestConfig.redirectToLoginCode) {
            requestConfig?.unauthorizedCb();
            return response;
          }

          const systemErrorInfo: ErrorInfoStructure = {
            success: false,
            data,
            message,
            code,
            status: response.status,
            statusText: response.statusText,
          };

          throw new ErrorInfo('BusinessError', systemErrorInfo);
        });
    }
    return response;
  }
  // 网络失败
  const httpErrorInfo: ErrorInfoStructure = {
    success: false,
    status: response.status,
    statusText: response.statusText,
  };
  // throw new HttpError(`${response.status} ${response.statusText} ${response.url}`, httpErrorInfo);
  throw new ErrorInfo('HttpError', httpErrorInfo);
};

export const responseDataFormatter: OnionMiddleware = async (
  ctx: Context,
  next: () => void,
) => {
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
