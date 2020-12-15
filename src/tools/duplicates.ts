import {JSONArray, JSONObject, PropertyPath} from '@types';
import {propertyPath, startsWithPattern} from '@utils/object';
import {typeOfJsonValue} from '@utils/typeOfJsonValue';

export interface DuplicatesConfig {
    ignore?: (PropertyPath | string)[];
}

export type Duplicates = Map<string, PropertyPath[]>;

/**
 * Finds duplicate keys in the given object.
 * @param object
 * @param conf Optional configuration
 */
export const duplicates = (object: JSONObject, conf?: DuplicatesConfig): Duplicates => {
    const duplicates: Map<string, PropertyPath[]> = new Map<string, PropertyPath[]>();
    const keys: Map<string, PropertyPath> = new Map();

    const ignored = conf?.ignore?.map(v => {
        return Array.isArray(v) ? v : propertyPath(v);
    }) || [];

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
                    const newKey = [...parentPath, key];
                    const value = entry[key];
                    const type = typeOfJsonValue(value);

                    if (type === 'object' || type === 'array') {

                        // Make it possible to ignore entire sub-trees
                        if (!startsWithPattern(ignored, newKey)) {
                            walk(value as JSONObject, newKey);
                        }

                        continue;
                    }

                    const existingPath = keys.get(key);
                    if (existingPath) {
                        const list = duplicates.get(key) || [existingPath];

                        // Check against ignored list
                        if (!startsWithPattern(ignored, newKey)) {
                            duplicates.set(key, [...list, newKey]);
                        }
                    } else {
                        keys.set(key, newKey);
                    }
                }
            }
        }
    };

    walk(object, []);
    return duplicates;
};
