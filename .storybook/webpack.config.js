const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');
const prettierConfig = require('../prettier.config');

module.exports = ({ config }) => {
  config.module.rules.push(
    {
      test: /\.[tj]sx?$/,
      exclude: [/node_modules/],
      use: [
        {
          loader: require.resolve('babel-loader'),
        },
      ],
    },
    {
      test: /\.mdx$/,
      exclude: [/node_modules/],
      use: [
        {
          loader: require.resolve('babel-loader'),
        },
        {
          loader: require.resolve('@mdx-js/loader'),
          options: {
            compilers: [createCompiler({})],
          },
        },
      ],
    },
    {
      test: /\.stories\.[tj]sx?$/,
      loader: require.resolve('@storybook/source-loader'),
      options: { parser: 'typescript', prettierConfig },
      exclude: [/node_modules/],
      enforce: 'pre',
    },
  );
  config.resolve.extensions.push('.ts', '.tsx', '.mdx');
  return config;
};
