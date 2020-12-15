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

/**
 * Checks if the given array contains another array, only works with primitives.
 * @param paths
 * @param target
 */
export const containsDeep = <T extends PropertyPath>(paths: Array<T>, target: T): boolean => {
    outer: for (const path of paths) {
        if (path.length === target.length) {

            for (let i = 0; i < paths.length; i++) {
                if (path[i] !== target[i]) {
                    continue outer;
                }
            }

            return true;
        }
    }

    return false;
};

/**
 * Same as containsDeep but only the beginning of the array needs to match the given target
 * @param paths
 * @param target
 */
export const startsWithPattern = <T extends PropertyPath>(paths: Array<T>, target: T): boolean => {
    outer: for (const path of paths) {
        if (path.length <= target.length) {

            for (let i = 0; i < path.length; i++) {
                const prop = path[i];

                if (prop === '*') {
                    return true;
                } else if (prop !== target[i]) {
                    continue outer;
                }
            }

            return true;
        }
    }

    return false;
};
