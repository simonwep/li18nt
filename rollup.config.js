import {terser} from 'rollup-plugin-terser';
import ts from '@wessberg/rollup-plugin-ts';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';

const production = process.env.NODE_ENV === 'production';
const banner = `/*! Li18nt ${pkg.version} MIT | https://github.com/Simonwep/li18nt */`;

const variables = replace({
    VERSION: JSON.stringify(pkg.version)
});

export default [
    {
        input: 'src/cli/index.ts',
        plugins: [ts(), variables],
        external: ['commander', 'chalk', 'fs', 'path', 'glob', 'os', 'child_process', 'util'],
        output: {
            file: 'lib/cli.js',
            format: 'cjs'
        }
    },
    {
        input: 'src/index.ts',
        plugins: [
            ts(),
            ...(production ? [terser()] : []),
            variables
        ],
        output: [
            {
                banner,
                file: pkg.main,
                name: 'Li18nt',
                format: 'umd',
                sourcemap: true
            },
            {
                banner,
                file: pkg.module,
                format: 'es',
                sourcemap: true
            }
        ]
    }
];
