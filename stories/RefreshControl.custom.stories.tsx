import React from 'react';
import { storiesOf } from '@storybook/react';
import { RefreshControl, RefreshState, RefreshControlProvider, RefreshControlConsumer } from '../src';

storiesOf('Components|RefreshControl/自定义', module)
  .addParameters({ component: RefreshControl })
  .add('自定义hint', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={{ state: RefreshState.DID_MOUNT }}>
        <RefreshControl hint={<p>👇</p>} />
      </RefreshControlProvider>
    );
  })
  .add('自定义edge', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={{ state: RefreshState.WILL_REFRESH }}>
        <RefreshControl edge={<p>👆</p>} />
      </RefreshControlProvider>
    );
  })
  .add('自定义indicator', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={{ state: RefreshState.REFRESHING }}>
        <RefreshControl indicator="加载中..." />
      </RefreshControlProvider>
    );
  })
  .add('自定义RefreshControl', function MyRefreshControl(): JSX.Element {
    return (
      <RefreshControlConsumer>
        {({ state }) => {
          if (state === RefreshState.REFRESHING) {
            return (
              <div>
                <button>Loading</button>
              </div>
            );
          }
        }}
      </RefreshControlConsumer>
    );
  });
