const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');
const prettierConfig = require('../prettier.config');

module.exports = ({ config }) => {
  config.module.rules.push(
    {
      test: /\.[tj]sx?$/,
      exclude: [/node_modules/],
      use: [require.resolve('babel-loader'), require.resolve('react-docgen-typescript-loader')],
    },
    {
      test: /\.mdx$/,
      exclude: [/node_modules/],
      use: [
        require.resolve('babel-loader'),
        require.resolve('react-docgen-typescript-loader'),
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
