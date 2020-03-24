import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { RefreshState } from './RefreshState';
import { Indicator } from './Indicator';
import { RefreshControlConsumer } from './RefreshControlContext';

export interface IRefreshControlProps {
  /**
   * 视图滚动到顶部后，继续下拉显示hint，缺省值：<p>下拉可以刷新</p>
   */
  hint?: ReactNode;
  /**
   * 已经显示hint后，继续下拉threshold属性所传距离后显示edge，缺省值：<p>释放后刷新</p>
   */
  edge?: ReactNode;
  /**
   * 用户释放后，onRefresh返回结果前显示indicator，缺省值：<p>正在刷新...</p>
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
      {(state) => (
        <Wrapper>
          {state === RefreshState.DID_MOUNT && hint}
          {state === RefreshState.WILL_REFRESH && edge}
          {state === RefreshState.REFRESHING && indicator}
        </Wrapper>
      )}
    </RefreshControlConsumer>
  );
}
