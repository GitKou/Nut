const { defaults } = require('jest-config');

module.exports = {
  testURL: 'http://localhost:8000',
  // testEnvironment: './tests/PuppeteerEnvironment',
  verbose: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFiles: ['./tests/setup.js'],
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/components/src/**/*.{ts,tsx}',
    'packages/!components/src/*/style/index.tsx',
    'packages/!components/src/style/index.tsx',
    'packages/!components/src/*/__tests__/type.test.tsx',
    'packages/!components/src/**/*/interface.{ts,tsx}',
    'packages/!components/src/*/__tests__/image.test.{ts,tsx}',
  ],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy', //Jest less encountered an unexpected token
  },
};
