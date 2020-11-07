import {keysFrom} from '@utils/keysFrom';
import {typeOfJsonValue} from '@utils/typeOfJsonValue';

type JSONRecord = {[key: string]: JSONValue;};
type JSONValue = string | number | JSONRecord | JSONArray;
type JSONArray = string[] | number[] | JSONValue[];

export type PropertyPath = (string | number)[];
export type Difference = {
    missing: PropertyPath[];
    conflicts: PropertyPath[];
};

/**
 * Compares an object to others
 * @param target
 * @param others
 */
const compare = (target: JSONRecord, others: JSONRecord[]): Difference => {
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
            diff.missing.push([...parent, key]);
            return;
        }

        // Compare with others
        for (const obj of others) {
            const objValue = obj[key];
            const objType = typeOfJsonValue(objValue);

            // Property missing, skip
            if (objType === 'undefined') {
                return;
            }

            // Property-type mismatch?
            if (objType !== targetType) {
                diff.conflicts.push([...parent, key]);
                return;
            }

            // Child object?
            if (objType === 'object' && objType === targetType) {
                resolve(targetValue as JSONRecord, [objValue] as Record<number, JSONArray>[], [...parent, key]);
                return;
            }

            // Child array?
            if (objType === 'array') {

                // Length mismatch
                if ((targetValue as JSONArray).length !== (targetValue as JSONArray).length) {
                    diff.conflicts.push([...parent, key]);
                    return;
                }

                // Resolve
                resolve(targetValue as JSONArray, objValue as JSONArray, [...parent, key]);
            }
        }
    }

    function resolve<T extends JSONRecord | JSONArray, O extends(T extends JSONRecord ? JSONRecord[] : JSONArray)>(
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
            for (const key of keysFrom([target as JSONRecord, ...(others as JSONRecord[])])) {
                handle(key, target as JSONRecord, others as Record<string, JSONArray>[], parent);
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
export const difference = (objects: JSONRecord[]): Difference[] => {

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
