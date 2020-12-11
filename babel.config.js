module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-class-properties',
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 3,
      },
    ],
  ],
  sourceMaps: 'inline',
  env: {
    module: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            useBuiltIns: 'usage',
            corejs: 3,
            targets: { esmodules: true },
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
            corejs: 3,
            targets: { node: true },
          },
        ],
        '@babel/preset-typescript',
        'power-assert',
      ],
    },
  },
};
