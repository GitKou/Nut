module.exports = {
  output: {
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  mode: 'production',
  resolve: {
    extensions: ['.json', '.js'],
  },
  externals: [
    {
      react: 'React',
    },
  ],
};
