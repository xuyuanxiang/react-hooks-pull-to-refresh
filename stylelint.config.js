module.exports = {
  processors: ['stylelint-processor-styled-components'],
  extends: ['stylelint-config-recommended', 'stylelint-config-styled-components', 'stylelint-prettier/recommended'],
  plugins: ['stylelint-prettier'],
  rules: {
    'prettier/prettier': true,
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['/-styled-mixin/', '$dummyValue'],
      },
    ],
    'no-descending-specificity': null,
  },
  ignoreFiles: ['node_modules', 'packages/*/lib'],
};
