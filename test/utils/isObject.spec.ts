import {isObject} from '@utils/isObject';

describe('[utils] isObject', () => {

    it('Should verify if the given value is an object', () => {
        expect(isObject({})).toBe(true);
        expect(isObject(null)).toBe(false);
        expect(isObject(0)).toBe(false);
        expect(isObject([])).toBe(false);
        expect(isObject(Symbol())).toBe(false);
        expect(isObject(new Date())).toBe(false);
    });
});
