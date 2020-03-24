import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    external: ['react', 'react-dom', 'styled-components', 'lodash.throttle'],
    plugins: [
      resolve(),
      typescript({
        tsconfigOverride: {
          compilerOptions: { module: 'es2015', declaration: true, sourceMap: true },
          include: ['src', 'types'],
        },
      }),
      commonjs({
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/index.js',
      format: 'cjs',
    },
    external: ['react', 'react-dom', 'styled-components', 'lodash.throttle'],
    plugins: [
      resolve(),
      typescript({
        tsconfigOverride: {
          compilerOptions: { module: 'es2015' },
          include: ['src', 'types'],
        },
      }),
      commonjs({
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      }),
      terser({
        output: {
          comments: false,
        },
        compress: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          drop_console: true,
        },
      }),
    ],
  },
];
