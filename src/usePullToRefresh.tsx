import React, { DependencyList, ReactNode, RefObject, useLayoutEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { toFixed } from './toFixed';
import _throttle from 'lodash.throttle';
import { RefreshState } from './RefreshState';
import { debounceTimingFn } from './debounceTimingFn';
import { rAF } from './rAF';
import { RefreshControl } from './RefreshControl';
import { RefreshControlProvider } from './RefreshControlContext';

export type RefreshCallback = () => Promise<void | undefined>;

export interface IUsePullToRefreshOptions {
  /**
   * 自定义下拉刷新阈值，视图滚动到顶部后，继续下拉该距离后，触发刷新。单位：px，缺省值：45。
   */
  threshold: number;
  /**
   * 下拉刷新视图容器
   */
  refreshControl: ReactNode;
  /**
   * 节流器限制频率，更小的数值能够更及时的跟踪滚动位置，不过可能会带来性能问题。单位：毫秒，缺省值：150。
   */
  throttle: number;
}

const DEFAULTS: IUsePullToRefreshOptions = {
  threshold: 45,
  throttle: 150,
  refreshControl: <RefreshControl />,
};

export function usePullToRefresh<T extends HTMLElement>(
  onRefresh: RefreshCallback,
  {
    threshold = DEFAULTS.threshold,
    throttle = DEFAULTS.throttle,
    refreshControl = DEFAULTS.refreshControl,
  }: Partial<IUsePullToRefreshOptions> = DEFAULTS,
  deps?: DependencyList,
): RefObject<T> {
  const containerRef = useRef<T>(null);
  let refresherRoot: HTMLDivElement | undefined;
  let isAnimating = false;

  function getScrollTop(): number {
    if (deps && typeof deps[0] === 'number') {
      return deps[0];
    }
    let ele: HTMLElement | null = containerRef.current;
    while (ele) {
      if (ele.scrollTop) return ele.scrollTop;
      ele = ele.parentElement;
    }
    return 0;
  }

  function transformY(y: string | number): void {
    if (containerRef.current) {
      if (typeof y === 'number') {
        const value = toFixed(y, 2);
        containerRef.current.style.transform = `translateY(${value}px)`;
        containerRef.current.style.webkitTransform = `translateY(${value}px)`;
      } else {
        containerRef.current.style.transform = `translateY(${y})`;
        containerRef.current.style.webkitTransform = `translateY(${y})`;
      }
    }
  }

  function debounceAnimate(startY: number, destY: number, duration: number): void {
    const startTime = Date.now();
    const endTime = startTime + duration;

    function step(): void {
      let now = Date.now();
      if (now >= endTime) {
        isAnimating = false;
        transformY(destY);
        return;
      }

      if (isAnimating) {
        now = (now - startTime) / duration;
        const easing = debounceTimingFn(now);
        const newY = (destY - startY) * easing + startY;
        transformY(newY);

        rAF(step);
      }
    }

    if (containerRef.current) {
      containerRef.current.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      containerRef.current.style.webkitTransition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    }

    isAnimating = true;
    step();
  }

  useLayoutEffect(() => {
    let scrollTop = getScrollTop();
    let start: number = 0;
    let startTimestamp: number = 0;
    let distance: number = 0;
    let destY: number = 0;
    let state: RefreshState | null = null;
    let originTransform: string;
    let originWebkitTransform: string;
    let originTransition: string;
    let originWebkitTransition: string;
    if (containerRef.current) {
      const style = getComputedStyle(containerRef.current);
      originTransform = style.transform;
      originWebkitTransform = style.webkitTransform;
      originTransition = style.transition;
      originWebkitTransition = style.webkitTransition;
    }

    function disableBodyMove(event: TouchEvent | MouseEvent): void {
      switch (state) {
        case RefreshState.DID_MOUNT:
        case RefreshState.WILL_REFRESH:
        case RefreshState.REFRESHING:
          event.preventDefault();
          break;
      }
    }

    function handleGestureStart(event: TouchEvent | MouseEvent): void {
      if (state === RefreshState.REFRESHING) return;
      scrollTop = getScrollTop();
      if (event.type === 'touchstart') {
        const touch = (event as TouchEvent).touches[0];
        if (touch) {
          start = touch.screenY;
        } else {
          start = 0;
        }
      } else {
        start = (event as MouseEvent).screenY || 0;
      }
      startTimestamp = event.timeStamp;
      state = RefreshState.INITIALIZING;
    }

    const handleGestureMove = _throttle((event: TouchEvent | MouseEvent): void => {
      disableBodyMove(event);
      if (!refresherRoot) return;
      if (scrollTop !== 0) return;
      if (event.type === 'touchmove') {
        const touch = (event as TouchEvent).touches[0];
        if (!touch) return;
        distance = touch.screenY - start;
      } else {
        distance = ((event as MouseEvent).screenY || 0) - start;
      }
      if (state === RefreshState.INITIALIZING) {
        if (distance > 0) {
          ReactDOM.render(
            <RefreshControlProvider value={{ state: RefreshState.DID_MOUNT }}>{refreshControl}</RefreshControlProvider>,
            refresherRoot,
            () => {
              if (refresherRoot) {
                const rect = refresherRoot.getBoundingClientRect();
                transformY(-(rect.height + rect.top));
              }
              state = RefreshState.DID_MOUNT;
            },
          );
        }
      } else if (state === RefreshState.DID_MOUNT) {
        const duration = event.timeStamp - startTimestamp;
        const startY = destY;
        destY += distance;
        debounceAnimate(startY, destY, duration);
        if (distance >= threshold) {
          ReactDOM.unmountComponentAtNode(refresherRoot);
          ReactDOM.render(
            <RefreshControlProvider value={{ state: RefreshState.WILL_REFRESH }}>
              {refreshControl}
            </RefreshControlProvider>,
            refresherRoot,
            () => {
              state = RefreshState.WILL_REFRESH;
            },
          );
        }
      }
    }, throttle);

    const teardown = (): void => {
      state = RefreshState.DID_REFRESH;
      start = 0;
      distance = 0;
      scrollTop = getScrollTop();
      startTimestamp = 0;
      isAnimating = false;
      if (containerRef.current) {
        containerRef.current.style.transform = originTransform;
        containerRef.current.style.webkitTransform = originWebkitTransform;
        containerRef.current.style.transition = originTransition;
        containerRef.current.style.webkitTransition = originWebkitTransition;
      }
      refresherRoot && ReactDOM.unmountComponentAtNode(refresherRoot);
    };

    function handleGestureEnd(): void {
      if (state === RefreshState.WILL_REFRESH) {
        if (refresherRoot) {
          ReactDOM.unmountComponentAtNode(refresherRoot);
          debounceAnimate(destY, 0, threshold);
          ReactDOM.render(
            <RefreshControlProvider value={{ state: RefreshState.REFRESHING }}>
              {refreshControl}
            </RefreshControlProvider>,
            refresherRoot,
            () => {
              state = RefreshState.REFRESHING;
              if (typeof onRefresh === 'function') {
                const promiseLike = onRefresh();
                if (promiseLike && typeof promiseLike.then === 'function') {
                  promiseLike.then(teardown, teardown);
                }
              }
            },
          );
        } else {
          teardown();
        }
      } else {
        teardown();
      }
    }

    if (containerRef.current) {
      document.body.addEventListener('touchstart', handleGestureStart, { passive: true });
      document.body.addEventListener('touchmove', handleGestureMove, { passive: false });
      document.body.addEventListener('touchend', handleGestureEnd, { passive: true });
      document.body.addEventListener('touchcancel', teardown, { passive: true });
      document.body.addEventListener('mousedown', handleGestureStart, { passive: true });
      document.body.addEventListener('mousemove', handleGestureMove, { passive: false });
      document.body.addEventListener('mouseup', handleGestureEnd, { passive: true });

      // 禁用iOS橡皮筋，以及微信网站信息
      // document.body.addEventListener('touchmove', disableBodyMove, { passive: false });

      if (!refresherRoot) {
        refresherRoot = document.createElement('div');
      }
      if (containerRef.current.firstChild) {
        containerRef.current.insertBefore(refresherRoot, containerRef.current.firstChild);
      } else {
        containerRef.current.appendChild(refresherRoot);
      }
    }

    return () => {
      if (containerRef.current) {
        document.body.removeEventListener('touchmove', handleGestureMove);
        document.body.removeEventListener('touchstart', handleGestureStart);
        document.body.removeEventListener('touchcancel', teardown);
        document.body.removeEventListener('touchend', handleGestureEnd);
        document.body.removeEventListener('mousedown', handleGestureMove);
        document.body.removeEventListener('mousemove', handleGestureStart);
        document.body.removeEventListener('mouseup', handleGestureEnd);
        containerRef.current.style.transform = originTransform;
        containerRef.current.style.webkitTransform = originWebkitTransform;
        containerRef.current.style.transition = originTransition;
        containerRef.current.style.webkitTransition = originWebkitTransition;
      }

      if (refresherRoot) {
        ReactDOM.unmountComponentAtNode(refresherRoot);
        if (refresherRoot.parentElement) {
          refresherRoot.parentElement.removeChild(refresherRoot);
        }
      }

      // document.body.removeEventListener('touchmove', disableBodyMove);
    };
  }, deps);

  return containerRef;
}
