import React from 'react';
import { storiesOf } from '@storybook/react';
import { RefreshControl, RefreshState, RefreshControlProvider } from '../';

storiesOf('Components|RefreshControl/Default', module)
  .addParameters({ component: RefreshControl })
  .add('Hint', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={RefreshState.DID_MOUNT}>
        <RefreshControl />
      </RefreshControlProvider>
    );
  })
  .add('Edge', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={RefreshState.WILL_REFRESH}>
        <RefreshControl />
      </RefreshControlProvider>
    );
  })
  .add('Indicator', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={RefreshState.REFRESHING}>
        <RefreshControl />
      </RefreshControlProvider>
    );
  });
