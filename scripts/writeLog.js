const { writeFile } = require('fs');
const conventionalChangelog = require('conventional-changelog');

let changeLog = '';
const stream = conventionalChangelog({
  preset: 'angular',
  releaseCount: 0,
});
stream.on('data', chunk => {
  changeLog += chunk;
});
stream.on('end', () => {
  write(changeLog);
});

function write(data) {
  writeFile(
    'packages/components/src/Changelog.stories.mdx',
    `import { Meta } from '@storybook/addon-docs/blocks';

<Meta title="Basic|Changelog" />

${data}

`,
    'utf8',
    err => {
      if (err) {
        console.error(err);
        process.exit(1);
      } else {
        process.exit(0);
      }
    },
  );
}
