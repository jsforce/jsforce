module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: 18 },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: "3",
      },
    ],
  ],
  env: {
    browser: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            useBuiltIns: 'usage',
            corejs: "3.33",
            targets: { browsers: 'last 2 versions, not dead, > 0.2%' },
          },
        ],
        '@babel/preset-typescript',
      ],
    },
    // This env config is used by jest for TS:
    // https://jestjs.io/docs/getting-started#using-babel
    //
    // for type-check run `tsc` before running tests.
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: { node: 18 },
          },
        ],
        '@babel/preset-typescript',
        'power-assert',
      ],
    },
  },
};
