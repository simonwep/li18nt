import {prettify} from '@tools/prettify';

describe('[tool] sort', () => {

    it('Should sort a simple object', () => {
        expect(prettify({
            'z': 10,
            'y': 20,
            'a': 1
        })).toMatchSnapshot();
    });

    it('Should sort a nested object and indent using spaces', () => {
        expect(prettify({
            'z': 10,
            'y': 20,
            'a': {
                'p': 100,
                's': {
                    'i': 10,
                    'x': 50,
                    'u': 5
                }
            }
        }, 4)).toMatchSnapshot();
    });

    it('Should sort a package.json file and indent using tab', () => {
        expect(prettify({
            'name': 'lint-i18n',
            'version': '1.0.0',
            'description': 'Locales linter, formatter, sorter and prettifier',
            'main': './lib/index.min.js',
            'module': './lib/index.min.mjs',
            'types': './lib/index.min.d.ts',
            'author': 'Simon Reinisch <trash@reinisch.io>',
            'license': 'MIT',
            'emptyObj': {},
            'emptyArray': [],
            'bin': {
                'lint-i18n': 'bin/cli.js'
            },
            'scripts': {
                'test': 'jest --runInBand',
                'lint': 'eslint ./src/**/*.ts ./test/**/*.ts',
                'build': 'cross-env NODE_ENV=production rollup -c rollup.config.js',
                'watch': 'cross-env NODE_ENV=development rollup -c rollup.config.js --watch',
                'lint:fix': 'eslint ./src/**/*.ts ./test/**/*.ts --fix',
                'test:watch': 'jest --runInBand --watch'
            },
            'keywords': [
                'lint',
                'linter',
                'i18n',
                'locales',
                'translation',
                'formatter',
                'prettier',
                {
                    '@types/jest': '^26.0.15',
                    'rollup': '^2.33.1',
                    '@babel/preset-env': '^7.12.1',
                    '@typescript-eslint/eslint-plugin': '^4.6.1',
                    '@wessberg/rollup-plugin-ts': '^1.3.7',
                    'jest': '^26.6.3',
                    '@typescript-eslint/parser': '^4.6.1',
                    'babel-jest': '^26.6.3',
                    '@rollup/plugin-replace': '^2.3.4',
                    'typescript': '^4.0.5',
                    'rollup-plugin-terser': '^7.0.2',
                    'cross-env': '^7.0.2',
                    '@babel/preset-typescript': '^7.12.1',
                    'eslint': '^7.12.1',
                    '@babel/core': '^7.12.3',
                    'eslint-config-simon': '^2.1.0'
                }
            ]
        }, '\t')).toMatchSnapshot();
    });
});
