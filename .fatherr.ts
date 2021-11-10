let config = {};

const type = process.env.BUILD_TYPE;

if (type === 'lib') {
  config = {
    cjs: { type: 'babel', lazy: true },
    esm: false,
  };
}

if (type === 'es') {
  config = {
    cjs: false,
    esm: {
      type: 'babel',
    },
    extraBabelPlugins: [
      [
        'babel-plugin-import',
        { libraryName: 'antd', libraryDirectory: 'es', style: true },
        'antd',
      ],
      // [require('./scripts/replaceLib')],
    ],
  };
}
