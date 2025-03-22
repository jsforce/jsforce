module.exports = {
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'eslint-config-prettier',
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [
      './packages/**/tsconfig.json',
      './packages/**/test/tsconfig.json',
      './tsconfig.json',
      './test/tsconfig.json',
    ],
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'eslint-plugin-import',
    'eslint-plugin-jsdoc',
  ],
  rules: {
    // TODO: turn all of these that are 'off' to 'error'
    // turn the rule off everywhere.  Then, in overrides, turn it on for just src
    'import/no-extraneous-dependencies': 'off',
    // Override @typescript-eslint/recommended
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/member-ordering': 'off',
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-redundant-type-constituents': 'off',
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/prefer-optional-chain': 'off',

    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/restrict-template-expressions': 'error',
    // Custom @typescript-eslint
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/return-await': 'error',
    // turning off the base rule is recommended by ts-eslint
    'no-return-await': 'error',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/unified-signatures': 'error',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/prefer-includes': 'error',
    '@typescript-eslint/prefer-reduce-type-parameter': 'error',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        avoidEscape: true,
      },
    ],
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    '@typescript-eslint/type-annotation-spacing': 'error',
  },
  ignorePatterns: ['*.js'],
  overrides: [
    {
      files: ['src/**'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            includeTypes: false,
            devDependencies: false,
            peerDependencies: false,
            bundledDependencies: false,
            optionalDependencies: false,
          },
        ],
      },
    },
  ],
};
