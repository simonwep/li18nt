import {terser} from 'rollup-plugin-terser';
import ts from '@wessberg/rollup-plugin-ts';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';

const production = process.env.NODE_ENV === 'production';
const banner = `/*! LintI18n ${pkg.version} MIT | https://github.com/Simonwep/lint-i18n */`;

const variables = replace({
    VERSION: JSON.stringify(pkg.version)
});

export default [
    {
        input: 'src/cli.ts',
        plugins: [variables],
        output: {
            file: 'lib/cli.js',
            format: 'iife'
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
                name: 'LintI18n',
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
