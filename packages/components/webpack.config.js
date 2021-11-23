const { merge } = require('webpack-merge');
const common = require('../../webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  entry: './es/index.js',
  output: {
    filename: 'nut-components.js',
    library: 'nutComponents',
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['css-loader', 'less-loader'],
      },
    ],
  },
  externals: ['antd'],
});
