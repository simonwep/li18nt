import {JSONArray, JSONObject, PropertyPath} from '@types';
import {startsWithDeep} from '@utils/containsDeep';
import {propertyPath} from '@utils/propertyPath';
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
    const keys: string[] = [];

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
                        if (!startsWithDeep(ignored, newKey)) {
                            walk(value as JSONObject, newKey);
                        }
                    } else if (keys.includes(key)) {
                        const list = duplicates.get(key) || [];

                        // Check against ignored list
                        if (!startsWithDeep(ignored, newKey)) {
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
