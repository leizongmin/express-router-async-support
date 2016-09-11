module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: false,
  },
  extends: 'lei/mocha',
  rules: {
    'generator-star-spacing': 'off',
    'require-yield': 'off',
  },
};
