declare module 'lodash.throttle' {
  function throttle<T>(fn: T, throttle: number): T;

  export = throttle;
}
