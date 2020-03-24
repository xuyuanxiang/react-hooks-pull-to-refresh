import React from 'react';
import { storiesOf } from '@storybook/react';
import { Indicator } from '../';

storiesOf('Components|Indicator', module)
  .addParameters({ component: Indicator })
  .add('Default', function App(): JSX.Element {
    return <Indicator />;
  })
  .add('Custom Color', function App(): JSX.Element {
    return <Indicator color="green" />;
  })
  .add('Custom Size', function App(): JSX.Element {
    return <Indicator size={44} />;
  });
