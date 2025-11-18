module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  globals: {
    cy: 'readonly',
    describe: 'readonly',
    it: 'readonly',
    beforeEach: 'readonly',
    Cypress: 'readonly'
  },
  plugins: ['react-hooks', 'react-refresh'],
  extends: [
    'eslint:recommended',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'react-refresh/only-export-components': 'warn',
    'no-unused-vars': 'off'
  },
  ignorePatterns: ['dist', 'node_modules']
}
