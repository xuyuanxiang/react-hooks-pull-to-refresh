import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { RefreshState } from './RefreshState';
import { Indicator } from './Indicator';
import { RefreshControlConsumer } from './RefreshControlContext';

export interface IRefreshControlProps {
  /**
   * 滚动视图已经到达顶部后，继续下拉显示 hint。
   */
  hint?: ReactNode;
  /**
   * 已经显示 hint 后，继续下拉距离达到 threshold 属性所传距离后显示edge。
   */
  edge?: ReactNode;
  /**
   * 已经显示 edge 后，用户释放手指（touchend)，会调用onRefresh，在Promise返回结果前一直显示 indicator。
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
