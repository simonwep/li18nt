import {pattern} from '@tools/pattern';

describe('[tool] pattern', () => {

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
