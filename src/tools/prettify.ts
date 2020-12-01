import {JSONArray, JSONObject, JSONValue} from '@types';
import {typeOfJsonValue} from '@utils/typeOfJsonValue';

export type Indentation = 'tab' | number;

export interface PrettifyOptions {
    indent?: Indentation;
}

/**
 * Returns the sorted keys of an object as string array
 * @param obj
 */
const sortedKeys = (obj: JSONObject): string[] => {
    return Object.keys(obj).sort(
        (a, b) => a === b ? 0 : a.localeCompare(b)
    );
};

/**
 * Sorts an object by its keys, returns a string as ordering properties manually
 * is slow and we can't rely on their order after inserting them.
 * @param obj
 * @param space
 */
export const prettify = (obj: JSONObject, {indent = 4}: PrettifyOptions): string => {
    const spacer = indent === 'tab' ? '\t' : ' '.repeat(indent);
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
                return v as (boolean | number | null);
            case 'string':
                return JSON.stringify(v);
        }

        return null;
    };

    for (const key of sortedKeys(obj)) {
        str += `${spacer}"${key}": ${stringify(obj[key], spacer)},\n`;
    }

    return str.length > 2 ? `${str.slice(0, str.length - 2)}\n}` : '{}';
};

