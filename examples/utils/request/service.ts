import { request, requestTable, setRequestConfig } from '@lc-nut/utils';
import type { UserInfo } from './interface';

setRequestConfig({
  mode: 'restful',
});

export async function addUser(data: Omit<UserInfo, 'id'>) {
  return request<UserInfo>('/api/user/add', { data });
}

export async function getUserList() {
  return requestTable<UserInfo>('/api/user/list', {
    errorHandler: (e) => {
      console.log(e.info);
    },
  });
}
