import { message } from 'antd';
import store from 'store';
import { ErrorHandlerError } from './error-type';

export type RequestConfigParams = {
  /** 接口模式，默认值old
   * 旧的 old:用responseBody里的code表示所有状态的
   * 新的 restful，:http status 400 401 403 200 500有含义参见./http-status.ts
   * */
  mode?: 'old' | 'restful';
  /** 自定义token的名字，默认是 access-token */
  tokenName?: string;
  /** old模式下，responseBody.code==='redirectToLoginCode',跳转至登录页面 , 默认值是A0200*/
  redirectToLoginCode?: string;
  /** 登录地址
   * restful模式 httpStatus=401
   * 或 old模式 responseBody.code==='redirectToLoginCode'
   * 的时候跳转至该地址 */
  loginUrl?: string;
  /** old模式下，responseBody.code==='successCode',代表请求成功 */
  successCode?: string | number;
  /** 自定义错误提示方法，默认是notification */
  errorNotify?: (error: ErrorHandlerError) => void;
  /** 自定义需要登录的方法，默认是message.loading 1s后，跳转至登陆页 */
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
