import { message } from 'antd';
import store from 'store';
import { ErrorHandlerError } from './error-type';

export type RequestConfigParams = {
  /** old: httpStatus除了200，其他无意义，通过responseBody里的code做处理；restful：httpStatus有意义，参见./http-status.ts */
  mode?: 'old' | 'restful';
  tokenName?: string;
  loginUrl?: string;
  redirectToLoginCode?: string;
  successCode?: string | number;
  errorNotify?: (error: ErrorHandlerError) => void;
  unauthorizedCb?: (error: ErrorHandlerError) => void;
};

export class RequestConfig {
  mode: RequestConfigParams['mode'] = 'old';
  tokenName = 'access-token';
  loginUrl = '/login';
  successCode: RequestConfigParams['successCode'] = '200';
  redirectToLoginCode? = 'A0200';
  errorNotify?: (error: ErrorHandlerError) => void;

  unauthorizedCb(error: ErrorHandlerError) {
    store.remove('token');
    message.warning(error.info.message || 'token已过期，请重新登录', 1);
    message.loading('正在跳转至登录页面......', 1).then(() => {
      window.location.replace(
        `${this.loginUrl}?redirect=${window.location.href}`,
      );
    });
  }

  constructor(config?: RequestConfigParams) {
    if (config) {
      Object.keys(config).forEach((key) => {
        this[key] = config[key] || this[key];
      });
    }
  }

  update(config: Partial<RequestConfigParams>) {
    Object.keys(config).forEach((key) => {
      this[key] = config[key] || this[key];
    });
    return this;
  }
}

export const requestConfig: RequestConfig = new RequestConfig();
