import React from 'react';
import { storiesOf } from '@storybook/react';
import { RefreshControl, RefreshState, RefreshControlProvider } from '../src';

storiesOf('Components|RefreshControl/Default', module)
  .addParameters({ component: RefreshControl })
  .add('Default hint', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={{ state: RefreshState.DID_MOUNT }}>
        <RefreshControl />
      </RefreshControlProvider>
    );
  })
  .add('Default edge', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={{ state: RefreshState.WILL_REFRESH }}>
        <RefreshControl />
      </RefreshControlProvider>
    );
  })
  .add('Default indicator', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={{ state: RefreshState.REFRESHING }}>
        <RefreshControl />
      </RefreshControlProvider>
    );
  });
