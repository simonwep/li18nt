import {PropertyPath} from '@types';
import {propertyPath} from '@utils/propertyPath';

describe('[util] propertyPath', () => {

    const ok: [string, PropertyPath][] = [
        ['a.b.c', ['a', 'b', 'c']],
        ['a[4].b[5]', ['a', 4, 'b', 5]],
        ['[4].xy[\'Test \'string\'\'].abc', [4, 'xy', 'Test \'string\'', 'abc']],
        ['["foo \'bar\'"].baz.bam', ['foo \'bar\'', 'baz', 'bam']]
    ];

    for (const [str, expected] of ok) {
        it(`Should parse ${str}`, () => {
            expect(propertyPath(str)).toStrictEqual(expected);
        });
    }

    const invalid: string[] = [
        'abc.[s2]',
        'abc.23.',
        'abc.22'
    ];

    for (const str of invalid) {
        it(`Should crash for ${str}`, () => {
            expect(() => propertyPath(str)).toThrow();
        });
    }
});
