import React from 'react';
import { storiesOf } from '@storybook/react';
import { RefreshControl, RefreshState, RefreshControlProvider } from '../src';

storiesOf('Components|RefreshControl/默认', module)
  .addParameters({ component: RefreshControl })
  .add('默认hint', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={{ state: RefreshState.DID_MOUNT }}>
        <RefreshControl />
      </RefreshControlProvider>
    );
  })
  .add('默认edge', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={{ state: RefreshState.WILL_REFRESH }}>
        <RefreshControl />
      </RefreshControlProvider>
    );
  })
  .add('默认indicator', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={{ state: RefreshState.REFRESHING }}>
        <RefreshControl />
      </RefreshControlProvider>
    );
  });
