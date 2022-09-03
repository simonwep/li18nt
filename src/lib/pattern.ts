import {JSONObject, PropertyPath} from '@types';
import {paths} from '@shared';

export interface PatternConfig {
    patterns: (string | RegExp)[];
}

export interface PatternMismatch {
    path: PropertyPath;
    key: string;
    failed: string[];
}

const mapRegexp = <T extends (string | RegExp)[]>(arr: T): RegExp[] =>
    arr.map(v => v instanceof RegExp ? v : new RegExp(v));

/**
 * Finds duplicate keys in the given object.
 * @param object
 * @param conf Optional configuration
 */
export const pattern = (object: JSONObject, conf?: PatternConfig): PatternMismatch[] => {
    const errors: PatternMismatch[] = [];
    const patterns = mapRegexp(conf?.patterns || []);

    for (const {key, path} of paths(object, true)) {

        // Validate
        const matches = patterns.filter(v => !v.test(key));
        if (matches.length) {
            errors.push({
                failed: matches.map(v => v.toString()),
                key, path
            });
        }
    }

    return errors;
};
