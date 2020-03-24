import { createContext } from 'react';
import { RefreshState } from './RefreshState';

const RefreshControlContext = createContext<RefreshState>(RefreshState.INITIALIZING);

RefreshControlContext.displayName = 'RefreshControlContext';

export const RefreshControlProvider = RefreshControlContext.Provider;
export const RefreshControlConsumer = RefreshControlContext.Consumer;
