import { createContext } from 'react';
import { RefreshState } from './RefreshState';

export const RefreshControlContext = createContext<RefreshState>(RefreshState.INITIALIZING);

RefreshControlContext.displayName = 'RefreshControlContext';
