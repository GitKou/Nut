module.exports = {
  presets: [
    [
      '@babel/env',
      {
        loose: true,
        // modules: false,
      },
    ],
    // '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  plugins: [],
};
