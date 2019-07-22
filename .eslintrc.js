module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  plugins: [
    '@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 2,
    'prettier/prettier': [2, {
      arrowParens: 'always',
      singleQuote: true,
      trailingComma: 'all',
    }],
  },
};
