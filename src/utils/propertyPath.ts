import {PropertyPath} from '@types';

const PATH_REGEX = /(\.|^)([\w*]+)|\[(\d+|'(.*?)'|"(.*?)")]/g;

/**
 * Parses a property path
 * foo.bar[4].xy['test prop'] -> ['foo', 'bar', 4, 'xy', 'test prop']
 * @param str
 */
export const propertyPath = (str: string): PropertyPath => {
    const path: PropertyPath = [];

    for (let match; (match = PATH_REGEX.exec(str));) {
        const [, , prop, arrayIndex, namedIndex, namedIndex2] = match;
        const str = prop || namedIndex || namedIndex2;

        if (str) {
            path.push(str);
        } else if (arrayIndex) {
            path.push(Number(arrayIndex));
        }
    }

    return path;
};
