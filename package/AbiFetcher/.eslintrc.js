module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['plugin:vue/essential'],
  rules: {
    'import/extensions': 'off',
    'import/first': 'off',
    'import/no-dynamic-require': 'off',
    'linebreak-style': 'off',
    'global-require': 'off',
    'no-console': 'off',
    'no-alert': 'off',
    eqeqeq: 'off',
    'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
    'no-param-reassign': ['error', { props: false }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    'no-restricted-syntax': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
};
