import {JSONArray, JSONObject, PropertyPath} from '@types';
import {typeOfJsonValue} from '@utils/typeOfJsonValue';

const PATH_REGEX = /(\.|^)([a-zA-Z]\w*|\*)|\[(\d+|'(.*?)'|"(.*?)")]/g;

/**
 * Parses a property path
 * foo.bar[4].xy['test prop'] -> ['foo', 'bar', 4, 'xy', 'test prop']
 * @param str
 */
export const propertyPath = (str: string): PropertyPath => {
    const path: PropertyPath = [];

    let lastIndex;
    for (let match; (match = PATH_REGEX.exec(str));) {
        const [full, , prop, arrayIndex, namedIndex, namedIndex2] = match;
        const str = prop || namedIndex || namedIndex2;
        lastIndex = match.index + full.length;

        if (str) {
            path.push(str);
        } else if (arrayIndex) {
            path.push(Number(arrayIndex));
        }
    }

    // Validate that the whole path has been parsed
    if (lastIndex !== str.length) {
        throw new Error(`Cannot parse "${str}", invalid character at index ${lastIndex}.`);
    }

    return path;
};

/**
 * Checks if the given array contains another array, only works with primitives.
 * @param paths
 * @param target
 */
export const containsDeep = <T extends PropertyPath>(paths: Array<T>, target: T): boolean => {
    outer: for (const path of paths) {
        if (path.length === target.length) {

            for (let i = 0; i < paths.length; i++) {
                if (path[i] !== target[i]) {
                    continue outer;
                }
            }

            return true;
        }
    }

    return false;
};

/**
 * Same as containsDeep but only the beginning of the array needs to match the given target
 * @param paths
 * @param target
 */
export const startsWithPattern = <T extends PropertyPath>(paths: Array<T>, target: T): boolean => {
    outer: for (const path of paths) {
        if (path.length <= target.length) {

            for (let i = 0; i < path.length; i++) {
                const prop = path[i];

                if (prop === '*') {
                    return true;
                } else if (prop !== target[i]) {
                    continue outer;
                }
            }

            return true;
        }
    }

    return false;
};

export interface Property<K extends (string | number)> {
    key: K;
    path: PropertyPath;
}

/**
 * Iterates over all properties (including nested ones) of an object
 * @param obj Target object
 * @param skipArrays Do not list array items (will still include objects in arrays)
 */
export function* paths<T extends JSONObject,
    S extends boolean,
    P = Property<S extends true ? string :(string | number)>
>(obj: T, skipArrays?: S): IterableIterator<P> {
    function* process(val: JSONObject | JSONArray, path: PropertyPath = []): IterableIterator<P> {
        if (Array.isArray(val)) {
            for (let i = 0; i < val.length; i++) {
                const valuePath = [...path, i];
                const value = val[i];

                if (!skipArrays) {
                    yield {path: valuePath, key: i} as unknown as P;
                }

                switch (typeOfJsonValue(value)) {
                    case 'array':
                    case 'object':
                        yield* process(value as JSONObject | JSONArray, valuePath);
                }
            }
        } else {
            for (const [key, value] of Object.entries(val)) {
                const valuePath = [...path, key];

                yield {path: valuePath, key} as unknown as P;
                switch (typeOfJsonValue(value)) {
                    case 'array':
                    case 'object':
                        yield* process(value as JSONObject | JSONArray, valuePath);
                }
            }
        }
    }

    yield* process(obj);
}
