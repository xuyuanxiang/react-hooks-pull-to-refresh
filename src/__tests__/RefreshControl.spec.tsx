import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import 'jest-styled-components';
import { RefreshControl, RefreshControlProvider, RefreshState } from '../';

describe('<RefreshControl/>', () => {
  let root = document.createElement('div');

  beforeEach(() => {
    document.body.appendChild(root);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(root);
    document.body.removeChild(root);
  });

  it('should render default props', () => {
    act(() => {
      ReactDOM.render(
        <RefreshControlProvider value={{ state: RefreshState.DID_MOUNT }}>
          <RefreshControl />
        </RefreshControlProvider>,
        root,
      );
    });
    expect(document.documentElement).toMatchSnapshot();
  });
});
