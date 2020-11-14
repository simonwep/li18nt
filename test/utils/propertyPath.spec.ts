import {PropertyPath} from '@types';
import {propertyPath} from '@utils/propertyPath';

describe('[util] propertyPath', () => {

    const tests: [string, PropertyPath][] = [
        ['a.b.c', ['a', 'b', 'c']],
        ['a[4].b[5]', ['a', 4, 'b', 5]],
        ['[4].xy[\'Test \'string\'\'].abc', [4, 'xy', 'Test \'string\'', 'abc']],
        ['["foo \'bar\'"].baz.bam', ['foo \'bar\'', 'baz', 'bam']]
    ];


    for (const [str, expected] of tests) {
        it(`Should parse ${str}`, () => {
            expect(propertyPath(str)).toStrictEqual(expected);
        });
    }
});
