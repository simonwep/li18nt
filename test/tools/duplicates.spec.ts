import {duplicates} from '@tools/duplicates';

describe('[tool] duplicates', () => {

    it('Should find a duplicate property and its paths', () => {
        expect(duplicates({
            'welcome': 'Willkommen',
            'home': {
                'welcome': 'Willkommen'
            }
        })).toMatchSnapshot();
    });

    it('Should find multiple, nested duplicate', () => {
        expect(duplicates({
            'welcome': 'Willkommen',
            'back': 'Zurück',
            'home': {
                'welcome': 'Willkommen',
                'sideBar': {
                    'welcome': 'Willkommen'
                }
            }
        })).toMatchSnapshot();
    });

    it('Should work with arrays too', () => {
        expect(duplicates({
            'welcome': 'Willkommen',
            'copyright': 'Urheberrecht',
            'back': 'Zurück',
            'home': {
                'welcome': 'Willkommen',
                'sideBar': {
                    'welcome': 'Willkommen'
                }
            },
            'about': {
                'footer': [
                    {'welcome': 'Willkommen'},
                    {'welcome': 'Willkommen'},
                    {'welcome': 'Willkommen', 'copyright': 'Urheberrecht'}
                ]
            }
        })).toMatchSnapshot();
    });

    it('Should be able to ignore certain paths', () => {
        expect(duplicates({
            'welcome': 'Willkommen',
            'back': 'Zurück',
            'home': {
                'welcome': 'Willkommen'
            },
            'about': {
                'header': {
                    'welcome': 'Willkommen'
                },
                'footer': {
                    'welcome': 'Willkommen'
                }
            }
        }, {
            ignore: [
                ['home', 'welcome'],
                ['about', 'header', 'welcome']
            ]
        })).toMatchSnapshot();
    });

    it('Should be able to ignore sub-trees', () => {
        expect(duplicates({
            'welcome': 'Willkommen',
            'back': 'Zurück',
            'home': {
                'welcome': 'Willkommen'
            },
            'about': {
                'header': {
                    'welcome': 'Willkommen'
                },
                'footer': {
                    'welcome': 'Willkommen',
                    'side': {
                        'welcome': 'Willkommen'
                    }
                }
            }
        }, {
            ignore: [
                'about.footer'
            ]
        })).toMatchSnapshot();
    });
});
