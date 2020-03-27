import React from 'react';
import { storiesOf } from '@storybook/react';
import { Indicator } from '../src';

storiesOf('Components|Indicator', module)
  .addParameters({ component: Indicator })
  .add('Default', function App(): JSX.Element {
    return <Indicator />;
  })
  .add('Custom color', function App(): JSX.Element {
    return <Indicator color="green" />;
  })
  .add('Custom size', function App(): JSX.Element {
    return <Indicator size={44} />;
  });
