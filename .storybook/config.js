import { configure, addParameters } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';

addParameters({
  options: {
    storySort: (a, b) => {
      return a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, { numeric: true });
    },
  },
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
  viewport: {
    defaultViewport: 'iphone6',
    viewports: {
      ...INITIAL_VIEWPORTS,
      responsive: {
        /**
         * name to display in the dropdown
         * @type {String}
         */
        name: 'Responsive',

        /**
         * Inline styles to be applied to the story (iframe).
         * styles is an object whose key is the camelCased version of the style name, and whose
         * value is the style’s value, usually a string
         * @type {Object}
         */
        styles: {
          width: '100%',
          height: '100%',
        },

        /**
         * type of the device (e.g. desktop, mobile, or tablet)
         * @type {String}
         */
        type: 'mobile',
      },
    },
  },
});

configure(
  [require.context('../stories', true, /\.stories\.mdx$/), require.context('../stories', true, /\.stories\.tsx?$/)],
  module,
);
