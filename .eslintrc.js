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
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'no-unused-vars': 0,
    'no-dupe-class-members': 0,
    '@typescript-eslint/no-unused-vars': [2, {
      argsIgnorePattern: '^_',
      ignoreRestSiblings: true,
    }],
    'prettier/prettier': [2, {
      arrowParens: 'always',
      singleQuote: true,
      trailingComma: 'all',
    }],
  },
};
