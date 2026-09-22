import tseslint from 'typescript-eslint';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginJsdoc from 'eslint-plugin-jsdoc';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['**/*.js', '**/*.mjs'],
  },
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintConfigPrettier,
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    plugins: {
      import: eslintPluginImport,
      jsdoc: eslintPluginJsdoc,
    },
    languageOptions: {
      parserOptions: {
        project: [
          './packages/**/tsconfig.json',
          './packages/**/test/tsconfig.json',
          './tsconfig.json',
          './test/tsconfig.json',
        ],
        sourceType: 'module',
      },
    },
    rules: {
      'import/no-extraneous-dependencies': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
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
      '@typescript-eslint/no-wrapper-object-types': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-duplicate-type-constituents': 'off',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/only-throw-error': 'off',

      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/restrict-template-expressions': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/return-await': 'error',
      'no-return-await': 'error',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/unified-signatures': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-reduce-type-parameter': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': ['error', { allowDefaultCaseForExhaustiveSwitch: true, requireDefaultForNonUnion: false, considerDefaultExhaustiveForUnions: true }],
    },
  },
  {
    files: ['src/**/*.ts'],
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
);
