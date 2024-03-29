import {lint} from '@lib';
import {describe, expect, it} from 'vitest';

describe('Test api', () => {

    it('Should properly lint the given objects', () => {
        expect(lint({
            prettified: 4,
            duplicates: true,
            conflicts: true
        }, [
            {
                'back': 'Zurück',
                'dashboard': 'Dashboard',
                'pages': {
                    'back': 'Zurück',
                    'dashboard': {
                        's': null,
                        'dashboard': 'Dashboard',
                        'footer': 'Fußbar'
                    }
                }
            },
            {
                'about': 'About',
                'back': 'Back',
                'dashboard': 'Dashboard',
                'pages': {
                    'back': 'Back',
                    'dashboard': {
                        's': [],
                        'dashboard': 'Dashboard',
                        'footer': [],
                        'panels': 'Panels'
                    },
                    'main': {
                        'dashboard': 'Dashboard'
                    }
                }
            }
        ])).toMatchSnapshot();
    });

    it('Should work with the example given in the README', () => {
        expect(lint({
            prettified: 'tab',
            duplicates: true,
            conflicts: true
        }, [
            {a: 20, b: null, c: {x: 20}},
            {a: 50, b: 'Hello', c: {x: 100, y: 20}},
            {a: 'Five', b: 'Super', c: null}
        ])).toMatchSnapshot();
    });

    it('Should accept further duplicates-configuration', () => {
        expect(lint({
            prettified: 'tab',
            duplicates: {
                ignore: [
                    ['c', 'a'],
                    'b.a'
                ]
            },
            conflicts: true
        }, [
            {a: 20, b: {a: 322}, c: {a: 50}},
            {a: 23, b: 'Super', c: {x: {a: 100}}}
        ])).toMatchSnapshot();
    });

    it('Should work with naming conventions', () => {
        expect(lint({
            prettified: 'tab',
            duplicates: true,
            conflicts: true,
            naming: {
                patterns: [/[^x]/]
            }
        }, [
            {a: 20, b: null, c: {x: 20}},
            {a: 50, b: 'Hello', c: {x: 100, y: 20}},
            {a: 'Five', b: 'Super', c: null}
        ])).toMatchSnapshot();
    });
});
