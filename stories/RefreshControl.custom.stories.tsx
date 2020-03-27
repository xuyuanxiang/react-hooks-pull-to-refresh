import React from 'react';
import { storiesOf } from '@storybook/react';
import { RefreshControl, RefreshState, RefreshControlProvider } from '../src';

storiesOf('Components|RefreshControl/Custom', module)
  .addParameters({ component: RefreshControl })
  .add('Custom hint', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={{ state: RefreshState.DID_MOUNT }}>
        <RefreshControl hint={<p>👇</p>} />
      </RefreshControlProvider>
    );
  })
  .add('Custom edge', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={{ state: RefreshState.WILL_REFRESH }}>
        <RefreshControl edge={<p>👆</p>} />
      </RefreshControlProvider>
    );
  })
  .add('Custom indicator', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={{ state: RefreshState.REFRESHING }}>
        <RefreshControl indicator="Loading..." />
      </RefreshControlProvider>
    );
  });
