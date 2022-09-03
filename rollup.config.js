import {terser} from 'rollup-plugin-terser';
import ts from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';

const variables = replace({
    VERSION: JSON.stringify(pkg.version),
    preventAssignment: true
});

export default [
    {
        input: 'src/cli/index.ts',
        plugins: [ts(), variables],
        external: ['commander', 'chalk', 'fs', 'path', 'glob', 'os', 'child_process', 'util'],
        output: {
            file: 'lib/cli.js',
            format: 'es',
            sourcemap: true
        }
    },
    {
        input: 'src/lib/index.ts',
        plugins: [ts(), terser(), variables],
        output: {
            banner: `/*! Li18nt ${pkg.version} MIT | https://github.com/Simonwep/li18nt */`,
            file: pkg.main,
            format: 'es',
            sourcemap: true
        }
    }
];
