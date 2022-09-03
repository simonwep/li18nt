/**
 * Returns a set with all keys from the given objects
 * @param objects
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const keysFrom = <T extends Record<any, any>>(objects: T[]): Set<string> => {
    return new Set(objects.map(obj => Object.keys(obj)).flat());
};
