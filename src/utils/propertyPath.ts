import {PropertyPath} from '@types';

const PATH_REGEX = /(\.|^)([a-zA-Z]\w*|\*)|\[(\d+|'(.*?)'|"(.*?)")]/g;

/**
 * Parses a property path
 * foo.bar[4].xy['test prop'] -> ['foo', 'bar', 4, 'xy', 'test prop']
 * @param str
 */
export const propertyPath = (str: string): PropertyPath => {
    const path: PropertyPath = [];

    let lastIndex;
    for (let match; (match = PATH_REGEX.exec(str));) {
        const [full, , prop, arrayIndex, namedIndex, namedIndex2] = match;
        const str = prop || namedIndex || namedIndex2;
        lastIndex = match.index + full.length;

        if (str) {
            path.push(str);
        } else if (arrayIndex) {
            path.push(Number(arrayIndex));
        }
    }

    // Validate that the whole path has been parsed
    if (lastIndex !== str.length) {
        throw new Error(`Cannot parse "${str}", invalid character at index ${lastIndex}.`);
    }

    return path;
};
