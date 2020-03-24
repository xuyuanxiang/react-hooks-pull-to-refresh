export enum RefreshState {
  INITIALIZING = 'INITIALIZING', // touchstart
  DID_MOUNT = 'DID_MOUNT', // start pull
  WILL_REFRESH = 'WILL_REFRESH', // reach edge
  REFRESHING = 'REFRESHING', // call onRefresh
  DID_REFRESH = 'DID_REFRESH', // onRefresh resolved
}
