import { request, requestTable } from '@lc-nut/utils';
import type { UserInfo } from './interface';
// import fetchMock from 'fetch-mock';

// fetchMock.post('/api/user/add', {
//   body: JSON.stringify({
//     code: '200',
//     data: { name: 'gmm', age: 20, id: 3 },
//     message: '成功',
//   })
// });

// fetchMock.get('/api/user/list', {
//   body: JSON.stringify({
//     code: '200',
//     data: {
//       list: [
//         { name: 'gmm', age: 18, id: 1 },
//         { name: 'gmm2', age: 16, id: 2 },
//       ],
//       currentPage: 1,
//       totalCount: 2,
//     },
//     message: '成功',
//   })
// });

export async function addUser(data: Omit<UserInfo, 'id'>) {
  return request<UserInfo>('/api/user/add', { data });
}

export async function getUserList() {
  return requestTable<UserInfo>('/api/user/list');
}
