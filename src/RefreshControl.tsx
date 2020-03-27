import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { RefreshState } from './RefreshState';
import { Indicator } from './Indicator';
import { RefreshControlConsumer } from './RefreshControlContext';

export interface IRefreshControlProps {
  /**
   * When the scroll view reaches the top, `hint` appears with the user's pull action.
   */
  hint?: ReactNode;
  /**
   * `edge` will display instead of `hint` when the pulled distance has reached the threshold value
   */
  edge?: ReactNode;
  /**
   * `indicator` will keep in view during `onRefresh` pending
   */
  indicator?: ReactNode;
}

const Wrapper = styled.div`
  background-color: #f6f6f6;
  text-align: center;
  padding: 32px;
`;

export function RefreshControl({
  hint = <p>下拉可以刷新</p>,
  edge = <p>释放后刷新</p>,
  indicator = <Indicator />,
}: IRefreshControlProps): JSX.Element {
  return (
    <RefreshControlConsumer>
      {({ state }) => (
        <Wrapper>
          {state === RefreshState.DID_MOUNT && hint}
          {state === RefreshState.WILL_REFRESH && edge}
          {state === RefreshState.REFRESHING && indicator}
        </Wrapper>
      )}
    </RefreshControlConsumer>
  );
}
