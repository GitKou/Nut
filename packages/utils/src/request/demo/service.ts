import { request, requestTable } from '@lc-nut/utils';
import type { UserInfo } from './interface';

export async function addUser(data: Omit<UserInfo, 'id'>) {
  return request<UserInfo>('/api/user/add', { data });
}

export async function getUserList() {
  return requestTable<UserInfo>('/api/user/list');
}
