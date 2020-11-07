/**
 * Returns a set with all keys from the given objects
 * @param objects
 */
export const keysFrom = <T extends Record<string | number | symbol, unknown>>(objects: T[]): Set<string> => {
    return new Set(objects.map(obj => Object.keys(obj)).flat());
};
