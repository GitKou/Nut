import { request, requestTable, setRequestConfig } from '@lc-nut/utils';
import { message } from 'antd';
import { requestConfig } from '@lc-nut/utils/src/request/config';
import type { UserInfo } from './interface';

// 实际代码中，请在app.ts文件中，初始化配置
setRequestConfig({
  mode: 'restful',
  errorNotify: (e) => {
    message.error(e.info.message);
  },
});

console.log('requestConfig==', requestConfig);
export async function addUser(data: Omit<UserInfo, 'id'>) {
  return request.post<UserInfo>('/api/user/add', { data });
}

export async function getUserList() {
  return requestTable<UserInfo>('/api/user/list', {
    // errorHandler: (e) => {
    //   console.log(e.info);
    // },
  });
}
