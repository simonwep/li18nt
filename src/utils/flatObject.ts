import {isObject} from '@utils/isObject';

/**
 * Flattens an object (or array) and returns an map with the property-path and corresponding value
 * @param obj Object
 * @param prepend String to prepend (optional)
 * @param parent Parent map
 */
export const flatObject = (
    obj: Record<string, unknown> | unknown[],
    prepend = '',
    parent: Map<string, unknown> = new Map()
): Map<string, unknown> => {

    const handleValue = (value: unknown, key: string): void => {
        if (isObject(value)) {
            flatObject(value, `${key}.`, parent);
        } else if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                handleValue(value[i], `${key}[${i}]`);
            }
        } else {
            parent.set(key, value);
        }
    };

    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            handleValue(obj[i], `${prepend}[${i}]`);
        }
    } else {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                const subKey = prepend + key.replace('.', '\\.');
                handleValue(value, subKey);
            }
        }
    }


    return parent;
};
