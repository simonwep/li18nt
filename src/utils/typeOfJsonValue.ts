type JSONValueType = 'object' | 'array' | 'number' | 'string' | 'boolean' | 'null'

/**
 * Returns the type of a value. Limited to json types, excluding undefined.
 * @param v
 */
export const typeOfJsonValue = (v: unknown): JSONValueType | 'undefined' | null => {
    switch (typeof v) {
        case 'undefined':
            return 'undefined';
        case 'object':
            return Array.isArray(v) ? 'array' : v === null ? 'null' : 'object';
        case 'boolean':
            return 'boolean';
        case 'number':
            return 'number';
        case 'string':
            return 'string';
    }

    return null;
};
