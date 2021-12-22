export default {
  'POST /api/user/add': (req, res) => {
    res.type('text').status(401).send('请重新登录');
    // res.type('application/json').status(200).send({ name: 'gmm', age: 18 });
  },
  // 支持自定义函数，API 参考 express@4
  'GET /api/user/list': (req, res) => {
    // res.sendStatus(403);
    res.type('application/json').status(403).send({
      code: 'B0001',
      message: '不存在该id',
    });
  },
  // 'GET /api/user/list': {
  //   code: '200',
  //   data: {
  //     list: [
  //       { name: 'gmm', age: 18, id: 1 },
  //       { name: 'gmm2', age: 16, id: 2 },
  //     ],
  //     currentPage: 1,
  //     totalCount: 2,
  //   },
  //   message: '成功',
  // },
};
