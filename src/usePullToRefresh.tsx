import React, { DependencyList, ElementType, RefObject, useLayoutEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import _throttle from 'lodash.throttle';
import { RefreshState } from './RefreshState';
import { toFixed } from './toFixed';
import { debounceTimingFn } from './debounceTimingFn';
import { rAF } from './rAF';
import { IRefreshControlProps, RefreshControl } from './RefreshControl';
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
  refreshControl: ElementType<IRefreshControlProps>;
  /**
   * 节流器限制频率，更小的数值能够更及时的跟踪滚动位置，不过可能会带来性能问题。单位：毫秒，缺省值：150。
   */
  throttle: number;
}

const DEFAULTS: IUsePullToRefreshOptions = {
  threshold: 50,
  throttle: 150,
  refreshControl: RefreshControl,
};

export function usePullToRefresh<T extends HTMLElement>(
  onRefresh: RefreshCallback,
  {
    threshold = DEFAULTS.threshold,
    throttle = DEFAULTS.throttle,
    refreshControl: RefreshControl = DEFAULTS.refreshControl,
  }: Partial<IUsePullToRefreshOptions> = DEFAULTS,
  deps?: DependencyList,
): RefObject<T> {
  const containerRef = useRef<T>(null);
  let refresherRoot: HTMLDivElement | undefined;

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
    let isAnimating = true;

    function step(): void {
      let now = Date.now();
      if (now >= endTime) {
        isAnimating = false;
        transformY(destY);
        return;
      }

      now = (now - startTime) / duration;
      const easing = debounceTimingFn(now);
      const newY = (destY - startY) * easing + startY;
      transformY(newY);

      if (isAnimating) {
        rAF(step);
      }
    }

    if (containerRef.current) {
      containerRef.current.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      containerRef.current.style.webkitTransition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    }
    step();
  }

  useLayoutEffect(() => {
    let scrollTop = getScrollTop();
    let start: number = 0;
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

    function handleGestureStart(event: TouchEvent | MouseEvent): void {
      if (state === RefreshState.REFRESHING) return;
      scrollTop = getScrollTop();
      if (event.type === 'touchstart') {
        const touch = (event as TouchEvent).touches[0];
        if (touch) {
          start = touch.clientY;
        } else {
          start = 0;
        }
      } else {
        start = (event as MouseEvent).clientY || 0;
      }
      state = RefreshState.INITIALIZING;
    }

    const handleGestureMove = _throttle((event: TouchEvent | MouseEvent): void => {
      if (!refresherRoot) return;
      if (scrollTop !== 0) return;
      if (event.type === 'touchmove') {
        const touch = (event as TouchEvent).touches[0];
        if (!touch) return;
        distance = touch.clientY - start;
      } else {
        distance = ((event as MouseEvent).clientY || 0) - start;
      }
      if (state === RefreshState.INITIALIZING) {
        if (distance > 0) {
          transformY('-100%');
          ReactDOM.render(
            <RefreshControlProvider value={{ state: RefreshState.DID_MOUNT }}>
              <RefreshControl />
            </RefreshControlProvider>,
            refresherRoot,
            () => {
              state = RefreshState.DID_MOUNT;
            },
          );
        }
      }

      if (state === RefreshState.DID_MOUNT) {
        const startY = destY;
        destY += distance;
        debounceAnimate(startY, destY, throttle);
        if (destY >= threshold) {
          ReactDOM.unmountComponentAtNode(refresherRoot);
          ReactDOM.render(
            <RefreshControlProvider value={{ state: RefreshState.WILL_REFRESH }}>
              <RefreshControl />
            </RefreshControlProvider>,
            refresherRoot,
            () => {
              state = RefreshState.WILL_REFRESH;
            },
          );
        }
      }
    }, throttle);

    function disableBodyMove(event: TouchEvent): void {
      switch (state) {
        case RefreshState.DID_MOUNT:
        case RefreshState.WILL_REFRESH:
        case RefreshState.REFRESHING:
          event.preventDefault();
          break;
      }
    }

    function handleGestureEnd(): void {
      start = 0;
      distance = 0;
      scrollTop = getScrollTop();
      if (refresherRoot) {
        ReactDOM.unmountComponentAtNode(refresherRoot);
        if (state === RefreshState.WILL_REFRESH) {
          debounceAnimate(destY, 0, throttle);
          ReactDOM.render(
            <RefreshControlProvider value={{ state: RefreshState.REFRESHING }}>
              <RefreshControl />
            </RefreshControlProvider>,
            refresherRoot,
            () => {
              state = RefreshState.REFRESHING;
              if (typeof onRefresh === 'function') {
                const promiseLike = onRefresh();
                if (promiseLike && typeof promiseLike.then === 'function') {
                  const teardown = (): void => {
                    if (containerRef.current) {
                      containerRef.current.style.transform = originTransform;
                      containerRef.current.style.webkitTransform = originWebkitTransform;
                      containerRef.current.style.transition = originTransition;
                      containerRef.current.style.webkitTransition = originWebkitTransition;
                    }
                    refresherRoot && ReactDOM.unmountComponentAtNode(refresherRoot);
                    state = RefreshState.DID_REFRESH;
                  };
                  promiseLike.then(teardown, teardown);
                }
              }
            },
          );
          return;
        }
      }
      state = null;
    }

    if (containerRef.current) {
      containerRef.current.addEventListener('touchstart', handleGestureStart, { passive: true });
      containerRef.current.addEventListener('touchmove', handleGestureMove, { passive: true });
      containerRef.current.addEventListener('touchend', handleGestureEnd, { passive: true });
      containerRef.current.addEventListener('mousedown', handleGestureStart, { passive: true });
      containerRef.current.addEventListener('mousemove', handleGestureMove, { passive: true });
      containerRef.current.addEventListener('mouseup', handleGestureEnd, { passive: true });

      // 禁用iOS橡皮筋，以及微信网站信息
      document.body.addEventListener('touchmove', disableBodyMove, { passive: false });

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
        containerRef.current.removeEventListener('touchmove', handleGestureMove);
        containerRef.current.removeEventListener('touchstart', handleGestureStart);
        containerRef.current.removeEventListener('touchend', handleGestureEnd);
        containerRef.current.removeEventListener('mousedown', handleGestureMove);
        containerRef.current.removeEventListener('mousemove', handleGestureStart);
        containerRef.current.removeEventListener('mouseup', handleGestureEnd);
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

      document.body.removeEventListener('touchmove', disableBodyMove);
    };
  }, deps);

  return containerRef;
}
