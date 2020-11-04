import {flatObject} from '@utils/flatObject';

describe('[utils] flatObject', () => {

    it('Should flatten a simple object', () => {
        const map = new Map();
        map.set('hello', 'world');
        map.set('num', 12);

        expect(flatObject({
            hello: 'world',
            num: 12
        })).toStrictEqual(map);
    });

    it('Should flatten a nested object', () => {
        const map = new Map();
        map.set('hello', 'world');
        map.set('num', 12);
        map.set('sub.x', 100);
        map.set('sub.b', 290);
        map.set('sub.c.x-y-z', 499);

        expect(flatObject({
            hello: 'world',
            num: 12,
            sub: {
                x: 100,
                b: 290,
                c: {
                    'x-y-z': 499
                }
            }
        })).toStrictEqual(map);
    });

    it('Should work with arrays', () => {
        const map = new Map();
        map.set('num', 100);
        map.set('array[0].x', 199);
        map.set('array[1].z.a', 10);
        map.set('array[2].u[0].o', 100);

        expect(flatObject({
            num: 100,
            array: [
                {x: 199},
                {z: {a: 10}},
                {u: [{o: 100}]}
            ]
        })).toStrictEqual(map);
    });

    it('Should escape dots', () => {
        const map = new Map();
        map.set('sub.my\\.sub-key', 1000);

        expect(flatObject({
            sub: {
                'my.sub-key': 1000
            }
        })).toStrictEqual(map);
    });
});
