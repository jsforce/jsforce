module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
        targets: { node: '8' },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-async-generator-functions',
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 3,
      },
    ],
  ],
  env: {
    module: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            useBuiltIns: 'usage',
            corejs: 3,
            targets: { node: '8' },
          },
        ],
        '@babel/preset-typescript',
      ],
    },
    browser: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            useBuiltIns: 'usage',
            corejs: 3,
            targets: { browsers: 'last 2 versions, ie 11, not dead' },
          },
        ],
        '@babel/preset-typescript',
      ],
    },
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: { node: '8' },
          },
        ],
        '@babel/preset-typescript',
        'power-assert',
      ],
    },
  },
};
