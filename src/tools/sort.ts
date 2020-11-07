import {typeOfJsonValue} from '@utils/typeOfJsonValue';
import {JSONArray, JSONObject, JSONValue} from '../types';

/**
 * Returns the sorted keys of an object as string array
 * @param obj
 */
const sortedKeys = (obj: JSONObject): string[] => {
    return Object.keys(obj).sort(
        (a, b) => a === b ? 0 : a > b ? 1 : -1
    );
};

/**
 * Sorts an object by its keys, returns a string as ordering properties manually
 * is slow and we can't rely on their order after inserting them.
 * @param obj
 * @param space
 */
export const sort = (obj: JSONObject, space?: number | string): string => {
    const spacer = typeof space === 'number' ? ' '.repeat(space) : typeof space === 'string' ? space : '';
    let str = '{\n';

    const stringify = (v: JSONValue, indent: string): string | boolean | number | null => {
        const type = typeOfJsonValue(v);
        const nextIndent = indent + spacer;

        switch (type) {
            case 'object': {
                let str = '{\n';

                for (const key of sortedKeys(v as JSONObject)) {
                    str += `${nextIndent}"${key}": ${stringify((v as JSONObject)[key], nextIndent)},\n`;
                }

                return str.length > 2 ? `${str.slice(0, str.length - 2)}\n${indent}}` : '{}';
            }
            case 'array': {
                let str = '[\n';

                for (let i = 0; i < (v as JSONArray).length; i++) {
                    str += `${nextIndent + stringify((v as JSONArray)[i], nextIndent)},\n`;
                }

                return str.length > 2 ? `${str.slice(0, str.length - 2)}\n${indent}]` : '[]';
            }
            case 'boolean':
            case 'number':
            case 'null':
                return v as (string | boolean | number);
            case 'string':
                return `"${v}"`;
        }

        return null;
    };

    for (const key of sortedKeys(obj)) {
        str += `${spacer}"${key}": ${stringify(obj[key], spacer)},\n`;
    }

    return str.length > 2 ? `${str.slice(0, str.length - 2)}\n}` : '{}';
};

