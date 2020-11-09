import {JSONArray, JSONObject, JSONValue, PropertyPath} from '@types';
import {keysFrom} from '@utils/keysFrom';
import {typeOfJsonValue} from '@utils/typeOfJsonValue';

export type Difference = {
    missing: PropertyPath[];
    conflicts: PropertyPath[];
};

/**
 * Pushes the item if not already present.
 * @param arr
 * @param el
 */
const pushUnique = (arr: PropertyPath[], el: PropertyPath): boolean => {
    outer: for (const item of arr) {
        if (item.length === el.length) {

            for (let i = 0; i < arr.length; i++) {
                if (item[i] !== el[i]) {
                    continue outer;
                }
            }

            return false;
        }
    }

    arr.push(el);
    return true;
};

/**
 * Compares an object to others
 * @param target
 * @param others
 */
const compare = (target: JSONObject, others: JSONObject[]): Difference => {
    const diff: Difference = {
        conflicts: [],
        missing: []
    };

    function handle<K extends string | number, T extends Record<K, JSONValue>, O extends Record<K, JSONArray>[]>(
        key: K,
        target: T,
        others: O,
        parent: PropertyPath = []
    ): void {
        const targetValue = target[key];
        const targetType = typeOfJsonValue(targetValue);

        // Property missing?
        if (targetType === 'undefined') {
            pushUnique(diff.missing, [...parent, key]);
            return;
        }

        // Compare with others
        for (const obj of others) {
            const objValue = obj[key];
            const objType = typeOfJsonValue(objValue);

            // Property missing, skip
            if (objType === 'undefined') {
                continue;
            }

            // Property-type mismatch?
            if (objType !== targetType) {
                pushUnique(diff.conflicts, [...parent, key]);
                continue;
            }

            // Child object?
            if (objType === 'object' && objType === targetType) {
                resolve(targetValue as JSONObject, [objValue] as Record<number, JSONArray>[], [...parent, key]);
                continue;
            }

            // Child array?
            if (objType === 'array') {

                // Length mismatch
                if ((targetValue as JSONArray).length !== (targetValue as JSONArray).length) {
                    pushUnique(diff.conflicts, [...parent, key]);
                    continue;
                }

                // Resolve
                resolve(targetValue as JSONArray, objValue as JSONArray, [...parent, key]);
            }
        }
    }

    function resolve<T extends JSONObject | JSONArray, O extends (T extends JSONObject ? JSONObject[] : JSONArray)>(
        target: T,
        others: O,
        parent: PropertyPath = []
    ): void {
        if (Array.isArray(target) && Array.isArray(others)) {
            const maxLength = Math.max(
                target.length,
                others.length
            );

            for (let i = 0; i < maxLength; i++) {
                handle(i, target as JSONArray, others as Record<number, JSONArray>[], parent);
            }
        } else {
            for (const key of keysFrom([target as JSONObject, ...(others as JSONObject[])])) {
                handle(key, target as JSONObject, others as Record<string, JSONArray>[], parent);
            }
        }
    }

    resolve(target, others);
    return diff;
};

/**
 * Finds the difference between given objects
 * @param objects
 */
export const difference = (objects: JSONObject[]): Difference[] => {

    // Create result objects
    const differences: Difference[] = [];
    for (let i = 0; i < objects.length; i++) {
        const target = objects[i];
        const others = [...objects];
        others.splice(i, 1);
        differences.push(compare(target, others));
    }

    return differences;
};
