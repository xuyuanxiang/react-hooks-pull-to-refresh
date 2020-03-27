const { writeFile } = require('fs');
const { EOL } = require('os');
const conventionalChangelog = require('conventional-changelog');

let changeLog = '';
const stream = conventionalChangelog({
  preset: 'angular',
  releaseCount: 0,
});
stream.on('data', (chunk) => {
  changeLog += chunk;
});
stream.on('end', () => {
  write(changeLog);
});

function write(data) {
  writeFile(
    'stories/Changelog.stories.mdx',
    `import { Meta } from '@storybook/addon-docs/blocks';

${EOL}<Meta title="Basic|Changelog" />${EOL}

[![npm version](https://img.shields.io/npm/v/react-hooks-pull-to-refresh.svg?style=flat-square)](https://www.npmjs.com/package/react-hooks-pull-to-refresh) [![Build Status](https://api.travis-ci.org/xuyuanxiang/react-hooks-pull-to-refresh.svg)](https://travis-ci.org/xuyuanxiang/react-hooks-pull-to-refresh) [![codecov](https://codecov.io/gh/xuyuanxiang/react-hooks-pull-to-refresh/branch/master/graph/badge.svg)](https://codecov.io/gh/xuyuanxiang/react-hooks-pull-to-refresh)

${EOL}${data}${EOL}

`,
    'utf8',
    (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      } else {
        process.exit(0);
      }
    },
  );
}
