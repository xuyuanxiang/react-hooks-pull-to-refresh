import React from 'react';
import { storiesOf } from '@storybook/react';
import { RefreshControl, RefreshState, RefreshControlProvider } from '../';

storiesOf('Components|RefreshControl/Default', module)
  .add('RefreshState.DID_MOUNT', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={RefreshState.DID_MOUNT}>
        <RefreshControl />
      </RefreshControlProvider>
    );
  })
  .add('RefreshState.WILL_REFRESH', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={RefreshState.WILL_REFRESH}>
        <RefreshControl />
      </RefreshControlProvider>
    );
  })
  .add('RefreshState.REFRESHING', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={RefreshState.REFRESHING}>
        <RefreshControl />
      </RefreshControlProvider>
    );
  });
