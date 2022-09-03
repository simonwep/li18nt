import {pattern} from '@lib';
import {describe, expect, it} from 'vitest';

describe('Test pattern tool', () => {

    it('Should do nothing without options', () => {
        expect(pattern({
            'home': {
                'back': 'Back',
                'welcome': {
                    'footer': 'Footer',
                    'header': 'Header'
                }
            }
        })).toMatchSnapshot();
    });

    it('Should validate a simple object', () => {
        expect(pattern({
            'abOut': 'About',
            'home': {
                'back': 'Back',
                '1next': 'Next',
                'welcome': {
                    'footer': 'Footer',
                    'heaDer': 'Header'
                }
            }
        }, {
            patterns: [
                /^[a-z]+$/
            ]
        })).toMatchSnapshot();
    });
});
