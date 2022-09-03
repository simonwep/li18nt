import {PropertyPath} from '@types';
import {ChalkInstance} from 'chalk';

const NO_WHITESPACE = /^\S*$/;

/**
 * Prettifies a property path
 * @param path
 * @param last
 */
export const prettyPropertyPath = (path: PropertyPath, last: ChalkInstance | null = null): string => {
    let str = '';

    for (let i = 0; i < path.length; i++) {
        const part = path[i];
        let divider = false;
        let snippet;

        if (typeof part === 'string') {
            if (NO_WHITESPACE.exec(part)) {
                divider = !!i;
                snippet = part;
            } else {
                snippet = `['${part.replace(/'/g, '\\\'')}']`;
            }
        } else {
            snippet = `[${part}]`;
        }

        str += (i === path.length - 1) && last ?
            (divider ? '.' : '') + last(snippet) :
            (divider ? '.' : '') + snippet;
    }

    return str;
};
