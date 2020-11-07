import {JSONArray, JSONObject, JSONValue} from '../types';

type ReturnType<T extends JSONValue> =
    T extends JSONObject ? 'object' :
    T extends JSONArray ? 'array' :
    T extends number ? 'number' :
    T extends string ? 'string' :
    T extends undefined ? 'undefined' :
    T extends boolean ? 'boolean' :
    T extends null ? 'null' : never;

/**
 * Returns the type of a value. Limited to json types, excluding undefined.
 * @param v
 */
export function typeOfJsonValue<T extends JSONValue>(v: T): ReturnType<T> {
    switch (typeof v) {
        case 'undefined':
            return 'undefined' as ReturnType<T>;
        case 'object':
            return (Array.isArray(v) ? 'array' : v === null ? 'null' : 'object') as ReturnType<T>;
        case 'boolean':
            return 'boolean' as ReturnType<T>;
        case 'number':
            return 'number' as ReturnType<T>;
        case 'string':
            return 'string' as ReturnType<T>;
    }
}
