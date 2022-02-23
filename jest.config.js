const { defaults } = require('jest-config');

module.exports = {
  testURL: 'http://localhost:8000',
  // testEnvironment: './tests/PuppeteerEnvironment',
  verbose: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFiles: ['./tests/setup.js'],
  testEnvironment: 'jsdom',
};
