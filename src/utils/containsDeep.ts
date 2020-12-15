import {PropertyPath} from '@types';

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
export const startsWithPattern = <T extends string[]>(paths: Array<T>, target: T): boolean => {
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
