import React from 'react';
import { storiesOf } from '@storybook/react';
import { RefreshControl, RefreshState, RefreshControlProvider, RefreshControlConsumer } from '../src';

storiesOf('Components|RefreshControl/Custom', module)
  .addParameters({ component: RefreshControl })
  .add('Custom Hint', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={{ state: RefreshState.DID_MOUNT }}>
        <RefreshControl hint={<p>👇Pull to refresh</p>} />
      </RefreshControlProvider>
    );
  })
  .add('Custom Edge', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={{ state: RefreshState.WILL_REFRESH }}>
        <RefreshControl edge={<p>Release for refreshing</p>} />
      </RefreshControlProvider>
    );
  })
  .add('Custom Indicator', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={{ state: RefreshState.REFRESHING }}>
        <RefreshControl indicator="Loading..." />
      </RefreshControlProvider>
    );
  })
  .add('Custom Wrapper', function App(): JSX.Element {
    return (
      <RefreshControlProvider value={{ state: RefreshState.REFRESHING }}>
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
      </RefreshControlProvider>
    );
  });
