import {JSONArray, JSONObject, PropertyPath} from '@types';
import {containsDeep} from '@utils/containsDeep';
import {typeOfJsonValue} from '@utils/typeOfJsonValue';

export type DuplicatesConfig = {
    ignore?: PropertyPath[]
};

export type Duplicates = Map<string, PropertyPath[]>;

/**
 * Finds duplicate keys in the given object.
 * @param object
 * @param conf Optional configuration
 */
export const duplicates = (object: JSONObject, conf?: DuplicatesConfig): Duplicates => {
    const duplicates: Map<string, PropertyPath[]> = new Map<string, PropertyPath[]>();
    const keys: string[] = [];

    const walk = (entry: JSONObject | JSONArray, parentPath: PropertyPath): void => {
        if (Array.isArray(entry)) {
            for (let i = 0; i < entry.length; i++) {
                const value = entry[i];

                if (typeOfJsonValue(value) === 'object') {
                    walk(value as JSONObject, [...parentPath, i]);
                }
            }
        } else {
            for (const key in entry) {
                if (Object.prototype.hasOwnProperty.call(entry, key)) {
                    const value = entry[key];
                    const type = typeOfJsonValue(value);

                    if (type === 'object' || type === 'array') {
                        walk(value as JSONObject, [...parentPath, key]);
                    } else if (keys.includes(key)) {
                        const list = duplicates.get(key) || [];
                        const newKey = [...parentPath, key];

                        // Check against ignored list
                        if (!conf?.ignore || !containsDeep(conf.ignore, newKey)) {
                            duplicates.set(key, [...list, newKey]);
                        }
                    } else {
                        keys.push(key);
                    }
                }
            }
        }
    };

    walk(object, []);
    return duplicates;
};
