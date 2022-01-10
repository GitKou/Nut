import { notification } from 'antd';
import type {
  ParamsWithPagination,
  AjaxData,
  TableListData,
  FormattedAjaxData,
  FormattedAjaxDataWithPage,
} from '@lc-nut/interfaces';
import type { ErrorInfoStructure, ErrorHandlerError } from './error-type';
import { ErrorInfo, ErrorNames } from './error-type';
import { HTTP_STATUS } from './http-status';
import type {
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
      description: `${error?.info.status} ${error?.info.statusText} ${error?.request?.url}`,
    });
    // 阻断执行，并将错误信息传递下去
    return Promise.reject(error);
  }

  if (error.name === 'Unauthorized') {
    requestConfig?.unauthorizedCb(error);
    return Promise.reject(error);
  }

  if (ErrorNames.includes(error.name)) {
    if (requestConfig?.errorNotify) {
      // 如果有自定义，用自定义的
      requestConfig?.errorNotify(error);
      return Promise.reject(error);
    }
    // 默认notification
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
  const token = store.get(requestConfig.tokenName);
  const { headers, ...rest } = options;

  return {
    url,
    options: {
      ...rest,
      headers: {
        ...headers,
        ...(token ? { [requestConfig.tokenName]: token } : {}),
      },
    },
  };
};

export const pageTransformMap = {
  currentLabel: 'pageNo',
  pageSizeLabel: 'pageSize',
};

const replacePageParams = (params) => {
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
};
// 处理page参数
export const pageParamsTransformer: RequestInterceptor = (
  url: string,
  options: RequestOptionsInit,
) => {
  const params = options.params as
    | ParamsWithPagination<Record<any, any>>
    | undefined;
  const data = options.data as
    | ParamsWithPagination<Record<any, any>>
    | undefined;

  replacePageParams(params);
  replacePageParams(data);
  return {
    url,
    options,
  };
};

export const restfulErrorInterceptors: ResponseInterceptor = async (
  response,
  options,
) => {
  // console.log("restfulErrorInterceptors: ", response);
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
    // 401 需要登录
    const unauthorizedErrorInfo: ErrorInfoStructure = {
      success: false,
      // todo, maybe get the message from response body
      message: 'token已过期，请重新登录',
      statusText: response.statusText,
      status: response.status,
    };
    throw new ErrorInfo('Unauthorized', unauthorizedErrorInfo);
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
export const oldErrorInterceptors: ResponseInterceptor = async (
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
            const unauthorizedErrorInfo: ErrorInfoStructure = {
              success: false,
              message: message || 'token已过期，请重新登录',
              statusText: response.statusText,
              status: response.status,
            };
            throw new ErrorInfo('Unauthorized', unauthorizedErrorInfo);
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
  throw new ErrorInfo('HttpError', httpErrorInfo);
};

export const errorInterceptors: ResponseInterceptor = (response, options) => {
  if (requestConfig.mode === 'restful') {
    return restfulErrorInterceptors(response, options);
  }
  return oldErrorInterceptors(response, options);
};

const formattedAjaxData = (resp: any) => {
  if (
    typeof resp === 'object' &&
    resp !== null &&
    'totalCount' in resp &&
    'currentPage' in resp
  ) {
    // 如果是带分页的json
    const { totalCount, currentPage } = resp as TableListData<any>;
    return {
      success: true,
      data: resp?.list || [],
      total: totalCount,
      current: currentPage,
      code: resp?.code || HTTP_STATUS.SUCCESS,
      message: resp?.message || 'OK',
    } as unknown as FormattedAjaxDataWithPage;
  } else {
    // 如果是不带分页的json
    return {
      success: true,
      data: resp,
      code: resp?.code || HTTP_STATUS.SUCCESS,
      message: resp?.message || 'OK',
    } as unknown as FormattedAjaxData;
  }
};

export const oldResponseDataFormatter: OnionMiddleware = async (
  ctx: Context,
  next: () => void,
) => {
  await next();
  const { res } = ctx;
  if (res instanceof Error) return;
  const oRes = res as AjaxData<any>;
  const { code, data } = oRes;
  // 如果返回responseType的是json
  if (code !== undefined) {
    ctx.res = formattedAjaxData(data);
  }
  // responseType非json不做处理
};

export const restfulResponseDataFormatter: OnionMiddleware = async (
  ctx: Context,
  next: () => void,
) => {
  // console.log("restfulResponseDataFormatter: ", ctx.res);
  await next();
  const { res } = ctx;
  if (res instanceof Error) return;
  ctx.res = formattedAjaxData(res);
};

export const responseDataFormatter: OnionMiddleware = (
  ctx: Context,
  next: () => void,
) => {
  if (requestConfig.mode === 'restful') {
    return restfulResponseDataFormatter(ctx, next);
  }
  return oldResponseDataFormatter(ctx, next);
};
