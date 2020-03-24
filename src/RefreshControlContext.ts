import { createContext } from 'react';
import { RefreshState } from './RefreshState';

export interface IRefreshContext {
  state: RefreshState;
}

const RefreshControlContext = createContext<IRefreshContext>({ state: RefreshState.INITIALIZING });

RefreshControlContext.displayName = 'RefreshControlContext';

export const RefreshControlProvider = RefreshControlContext.Provider;
export const RefreshControlConsumer = RefreshControlContext.Consumer;
