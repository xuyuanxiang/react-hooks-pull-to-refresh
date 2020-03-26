import React from 'react';
import { storiesOf } from '@storybook/react';
import { Indicator } from '../src';

storiesOf('Components|Indicator', module)
  .addParameters({ component: Indicator })
  .add('默认样式', function App(): JSX.Element {
    return <Indicator />;
  })
  .add('自定义颜色', function App(): JSX.Element {
    return <Indicator color="green" />;
  })
  .add('自定义尺寸', function App(): JSX.Element {
    return <Indicator size={44} />;
  });
