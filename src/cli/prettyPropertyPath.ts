import {PropertyPath} from '@types';

const NO_WHITESPACE = /^\S*$/;

/**
 * Prettifies a property path
 * @param path
 */
export const prettyPropertyPath = (path: PropertyPath): string => {
    let str = '';

    for (const part of path) {
        if (typeof part === 'string') {
            if (NO_WHITESPACE.exec(part)) {
                str += (str.length ? ' > ' : '') + part;
            } else {
                str += `['${part.replace(/'/g, '\\\'')}']`;
            }
        } else {
            str += `[${part}]`;
        }
    }

    return str;
};
