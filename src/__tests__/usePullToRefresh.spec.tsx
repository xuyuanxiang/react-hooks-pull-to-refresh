import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { usePullToRefresh } from '../';

const DATA = ['雷杰', '黄刚', '薛涛', '陈勇', '姚明', '郑勇', '戴娜', '萧勇'];

let resolveOnRefresh: (() => void) | undefined;
const onRefresh = jest.fn(
  () =>
    new Promise<void>((resolve) => {
      resolveOnRefresh = () => {
        resolve();
      };
    }),
);

function wait(duration: number = 500): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, duration));
}

function App(): JSX.Element {
  const ref = usePullToRefresh<HTMLUListElement>(onRefresh);
  return (
    <ul ref={ref}>
      {DATA.map((it, idx) => (
        <li key={`item_${idx}`} style={{ height: 400 }}>
          {it}
        </li>
      ))}
    </ul>
  );
}

describe('usePullToRefresh', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
  });

  it('should render hint', async () => {
    act(() => {
      ReactDOM.render(<App />, container);
    });

    const ul = container.querySelector('ul');
    if (ul) {
      ul.dispatchEvent(new TouchEvent('touchstart', { touches: [{ screenY: 0 }], bubbles: true } as TouchEventInit));
      ul.dispatchEvent(new TouchEvent('touchmove', { touches: [{ screenY: 10 }], bubbles: true } as TouchEventInit));
      await wait();
      ul.dispatchEvent(new TouchEvent('touchmove', { touches: [{ screenY: 12 }], bubbles: true } as TouchEventInit));
      await wait();
      ul.dispatchEvent(new TouchEvent('touchmove', { touches: [{ screenY: 14 }], bubbles: true } as TouchEventInit));
      await wait();
      expect(ul.children.item(0)).toMatchSnapshot();
    } else {
      throw new Error('ul should be rendered');
    }
  });

  it('should render edge', async () => {
    act(() => {
      ReactDOM.render(<App />, container);
    });

    const ul = container.querySelector('ul');
    if (ul) {
      ul.dispatchEvent(new TouchEvent('touchstart', { touches: [{ screenY: 1 }], bubbles: true } as TouchEventInit));
      ul.dispatchEvent(new TouchEvent('touchmove', { touches: [{ screenY: 12 }], bubbles: true } as TouchEventInit));
      await wait();
      ul.dispatchEvent(new TouchEvent('touchmove', { touches: [{ screenY: 46 }], bubbles: true } as TouchEventInit));
      await wait();
      expect(ul.children.item(0)).toMatchSnapshot();
    } else {
      throw new Error('ul should be rendered');
    }
  });

  it('should render indicator', async () => {
    act(() => {
      ReactDOM.render(<App />, container);
    });

    const ul = container.querySelector('ul');
    if (ul) {
      ul.dispatchEvent(new TouchEvent('touchstart', { touches: [{ screenY: 2 }], bubbles: true } as TouchEventInit));
      ul.dispatchEvent(new TouchEvent('touchmove', { touches: [{ screenY: 14 }], bubbles: true } as TouchEventInit));
      await wait();
      ul.dispatchEvent(new TouchEvent('touchmove', { touches: [{ screenY: 48 }], bubbles: true } as TouchEventInit));
      await wait();
      ul.dispatchEvent(new TouchEvent('touchend', { touches: [{ screenY: 48 }], bubbles: true } as TouchEventInit));
      await wait();
      expect(onRefresh).toHaveBeenCalled();
      expect(ul.children.item(0)).toMatchSnapshot();
    } else {
      throw new Error('ul should be rendered');
    }
  });

  it('should render empty', async () => {
    act(() => {
      ReactDOM.render(<App />, container);
    });

    const ul = container.querySelector('ul');
    if (ul) {
      ul.dispatchEvent(new TouchEvent('touchstart', { touches: [{ screenY: 3 }], bubbles: true } as TouchEventInit));
      ul.dispatchEvent(new TouchEvent('touchmove', { touches: [{ screenY: 19 }], bubbles: true } as TouchEventInit));
      await wait();
      ul.dispatchEvent(new TouchEvent('touchmove', { touches: [{ screenY: 66 }], bubbles: true } as TouchEventInit));
      await wait();
      ul.dispatchEvent(new TouchEvent('touchend', { touches: [{ screenY: 66 }], bubbles: true } as TouchEventInit));
      await wait();
      expect(onRefresh).toHaveBeenCalled();
      resolveOnRefresh && resolveOnRefresh();
      await wait();
      expect(ul.children.item(0)).toMatchSnapshot();
    } else {
      throw new Error('ul should be rendered');
    }
  });
});
