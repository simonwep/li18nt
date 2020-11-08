import {JSONArray, JSONObject, PropertyPath} from '@types';
import {typeOfJsonValue} from '@utils/typeOfJsonValue';

/**
 * Finds duplicate keys in the given object.
 * @param object
 */
export const duplicates = (object: JSONObject): Map<string, PropertyPath[]> => {
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
                        duplicates.set(key, [...list, [...parentPath, key]]);
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
