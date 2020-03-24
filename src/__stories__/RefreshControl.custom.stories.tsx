import React from 'react';
import { storiesOf } from '@storybook/react';
import { RefreshControl, RefreshState, RefreshControlProvider } from '../';

storiesOf('Components|RefreshControl/Custom', module)
  .add('RefreshState.DID_MOUNT', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={RefreshState.DID_MOUNT}>
        <RefreshControl hint={<p>👇Pull to refresh</p>} />
      </RefreshControlProvider>
    );
  })
  .add('RefreshState.WILL_REFRESH', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={RefreshState.WILL_REFRESH}>
        <RefreshControl edge={<p>Release for refreshing</p>} />
      </RefreshControlProvider>
    );
  })
  .add('RefreshState.REFRESHING', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={RefreshState.REFRESHING}>
        <RefreshControl indicator="Loading..." />
      </RefreshControlProvider>
    );
  });
