import {difference} from '../../src/tools/difference';

describe('[tool] difference', () => {

    it('Should find the difference between three, two-dimensional object', () => {
        expect(difference([
            {a: 10, b: '20'},
            {c: 10, b: 20},
            {c: 10, z: 200}
        ])).toMatchSnapshot();
    });

    it('Should work with nested objects', () => {
        expect(difference([
            {
                a: 10,
                b: {u: 'u'},
                x: {
                    p: {v: 10}
                }
            },
            {
                c: 10,
                b: 20,
                x: {
                    p: {v: 10, k: 100},
                    i: 10
                }
            },
            {
                c: '10',
                b: 20,
                x: {
                    p: {v: 10, k: 'hello', z: 20},
                    i: 10
                }
            }
        ])).toMatchSnapshot();
    });

    it('Should work with nested objects and arrays', () => {
        expect(difference([
            {
                a: 10,
                b: {u: 'u'},
                x: [{l: 10}, 'hello']
            },
            {
                a: 10,
                b: {u: 'u'},
                x: [{l: 10}, 5],
                l: 20
            },
            {
                a: 10,
                b: {u: 'u'},
                x: [{l: 10}, 'hello', {'5': 100}]
            }
        ])).toMatchSnapshot();
    });
});
