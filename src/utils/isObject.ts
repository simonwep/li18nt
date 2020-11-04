/**
 * Checks if the given value is a pure object
 * @param v
 */
export const isObject = (v: unknown): v is Record<string, unknown> => {
    return !Array.isArray(v) &&
        typeof v === 'object' &&
        v !== null &&
        v.constructor === Object;
};
