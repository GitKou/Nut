/** Http状态码 */
export const HTTP_STATUS = {
  SUCCESS: 200, // 请求成功
  BAD_REQUEST: 400, // 参数错误
  UNAUTHORIZED: 401, // 授权相关，清空用户和token跳转登陆
  BUSINESS_EXCEPTION: 403, // 业务异常，返回对应的code和message
  ERROR: 500, // 服务器异常
};
