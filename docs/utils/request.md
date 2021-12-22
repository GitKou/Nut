# request

# 配置

```ts
export type RequestConfigParams = {
  /** 接口模式
   * 旧的 old:用responseBody里的code表示所有状态的
   * 新的 restful，:http status 400 401 403 200 500有含义参见./http-status.ts
   * */
  mode?: 'old' | 'restful';
  /** 自定义token的名字 */
  tokenName?: string;
  /** old模式下，responseBody.code==='redirectToLoginCode',跳转至登录页面 */
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
```

## 代码示例

<code src="../../examples/utils/request/index.tsx"></code>
