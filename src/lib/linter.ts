// Current version
import {JSONObject, Li18ntOptions, Li18ntResult, PartialLi18ntResult} from '@types';
import {conflicts} from './conflicts';
import {duplicates} from './duplicates';
import {pattern} from './pattern';
import {prettify} from './prettify';

export const version = typeof VERSION !== 'undefined' ? VERSION : 'unknown';

/**
 * Lints objects using the given configuration.
 * @param conf
 * @param objects
 */
export const lint = <T extends Partial<Li18ntOptions>>(conf: T, objects: JSONObject[]): PartialLi18ntResult<T> => {
    const res: Partial<Li18ntResult> = {};

    if (conf.naming) {
        const mismatches = [];
        for (const obj of objects) {
            mismatches.push(pattern(obj, conf.naming));
        }

        res.naming = mismatches;
    }

    if (conf.conflicts) {
        res.conflicts = conflicts(objects);
    }

    if (conf.duplicates) {
        const options = typeof conf.duplicates === 'boolean' ? {} : conf.duplicates;

        res.duplicates = [];
        for (const obj of objects) {
            res.duplicates.push(duplicates(obj, options));
        }
    }

    if (typeof conf.prettified !== 'undefined') {
        const options = typeof conf.prettified !== 'object' ? {
            indent: conf.prettified
        } : conf.prettified;

        res.prettified = [];
        for (const obj of objects) {
            res.prettified.push(prettify(obj, options));
        }
    }

    return res as PartialLi18ntResult<T>;
};
