# react-hooks-pull-to-refresh

[![npm version](https://img.shields.io/npm/v/react-hooks-pull-to-refresh.svg?style=flat-square)](https://www.npmjs.com/package/react-hooks-pull-to-refresh) [![Build Status](https://api.travis-ci.org/xuyuanxiang/react-hooks-pull-to-refresh.svg)](https://travis-ci.org/xuyuanxiang/react-hooks-pull-to-refresh) [![codecov](https://codecov.io/gh/xuyuanxiang/react-hooks-pull-to-refresh/branch/master/graph/badge.svg)](https://codecov.io/gh/xuyuanxiang/react-hooks-pull-to-refresh)

The pull-to-refresh user interface pattern implemented with React Hooks.

## Installation

npm:

```npm
npm install react-hooks-pull-to-refresh --save
```

yarn:

```shell
yarn add react-hooks-pull-to-refresh
```

## Requirement

You need to install the following `peerDependencies` into your project at the same time:

```json
{
  "peerDependencies": {
    "react": "^16.8.0",
    "react-dom": "^16.8.0",
    "styled-components": ">= 4.1.4 || >= 5.0.0"
  }
}
```

## Usage

```typescript jsx
import React, { useState } from 'react';
import { usePullToRefresh } from 'react-hooks-pull-to-refresh';

function MyComponent() {
  const [dataSource, setDataSource] = useState<string[]>([]);

  const onRefresh = async (): Promise<void> => {
    const res = await fetch('/api/to/something');
    if (res.ok) {
      const { data } = await res.json();
      setDataSource(data);
    }
  };

  const refresherRef = usePullToRefresh(onRefresh);

  return (
    <ul ref={refresherRef}>
      {dataSource.map((it, idx) => (
        <li key={`item_${idx}`}>{it}</li>
      ))}
    </ul>
  );
}
```

## Document

[storybook](https://xuyuanxiang.github.io/react-hooks-pull-to-refresh)
