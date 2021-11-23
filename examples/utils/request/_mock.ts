export default {
  'POST /api/user/add': {
    code: '200',
    data: { name: 'gmm', age: 20, id: 3 },
    message: '成功',
  },
  'GET /api/user/list': {
    code: '200',
    data: {
      list: [
        { name: 'gmm', age: 18, id: 1 },
        { name: 'gmm2', age: 16, id: 2 },
      ],
      currentPage: 1,
      totalCount: 2,
    },
    message: '成功',
  },
};
