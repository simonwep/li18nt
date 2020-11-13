import {conflicts} from '@tools/conflicts';
import {duplicates} from '@tools/duplicates';
import {prettify} from '@tools/prettify';
import {JSONObject, Li18ntOptions, Li18ntResult} from '@types';

// Current version
export const version = typeof VERSION !== 'undefined' ? VERSION : 'unknown';

/**
 * Lints objects using the given configuration.
 * @param conf
 * @param objects
 */
export const lint = (conf: Li18ntOptions, objects: JSONObject[]): Li18ntResult => {
    const res: Li18ntResult = {};

    if (conf.conflicts) {
        res.conflicts = conflicts(objects);
    }

    if (conf.duplicates) {
        res.duplicates = [];

        for (const obj of objects) {
            res.duplicates.push(duplicates(obj));
        }
    }

    if (typeof conf.prettify !== 'undefined') {
        res.prettified = [];

        for (const obj of objects) {
            res.prettified.push(prettify(obj, conf.prettify));
        }
    }

    return res;
};
