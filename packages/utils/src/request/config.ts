export type RequestConfigParams = {
  /** old: httpStatus除了200，其他无意义，通过responseBody里的code做处理；restful：httpStatus有意义，参见./http-status.ts */
  mode?: 'old' | 'restful';
  tokenName?: string;
  loginUrl?: string;
  redirectToLoginCode?: string;
  successCode?: string | number;
  unauthorizedCb?: () => void;
};

export class RequestConfig {
  mode: RequestConfigParams['mode'] = 'old';
  tokenName = 'access-token';
  loginUrl = '/login';
  successCode: RequestConfigParams['successCode'] = '200';
  redirectToLoginCode? = 'A0200';

  unauthorizedCb() {
    store.remove('token');
    setTimeout(() => {
      window.location.replace(
        `${this.loginUrl}?redirect=${window.location.href}`,
      );
    }, 200);
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
