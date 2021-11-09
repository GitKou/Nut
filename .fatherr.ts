export default {
  target: 'browser',
  esm: 'babel',
  lessInBabelMode: true, // babel 模式下做 less 编译
  autoprefixer: {
    browsers: ['ie>9', 'Safari >= 6'],
  },
};
