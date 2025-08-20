module.exports = {
  root: true,
  env: {},
  globals: {},
  extends: ['ts-prefixer', 'plugin:jsx-a11y/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json'],
  },
  plugins: ['react-hooks', 'jsx-a11y'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'prettier/prettier': [
      'error',
      {
        semi: true,
        endOfLine: 'auto',
      },
    ],
    '@typescript-eslint/promise-function-async': [
      'error',
      {
        checkArrowFunctions: false,
      },
    ],
    curly: ['error', 'all'],
    'prefer-const': 'error',
    'no-var': 'error',
    'no-shadow-restricted-names': 'error',
    'no-console': 'warn',
  },
  settings: {},
  overrides: [],
};
