import React from 'react';
import { storiesOf } from '@storybook/react';
import { Indicator } from '../';

storiesOf('Components|Indicator', module)
  .add('Default', function App(): JSX.Element {
    return <Indicator />;
  })
  .add('Custom color', function App(): JSX.Element {
    return <Indicator color="green" />;
  })
  .add('Custom size', function App(): JSX.Element {
    return <Indicator size={44} />;
  });
