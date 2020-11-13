import {lint} from '../src';

describe('Main library', () => {

    it('Should properly lint the given objects', ()=>{
        expect(lint({
            prettify: 4,
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

    it('Should work with the example given in the README', ()=>{
        expect(lint({
            prettify: '\t',
            duplicates: true,
            conflicts: true
        }, [
            {a: 20, b: null, c: {x: 20}},
            {a: 50, b: 'Hello', c: {x: 100, y: 20}},
            {a: 'Five', b: 'Super', c: null}
        ]));
    });
});
