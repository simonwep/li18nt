/**
 * Checks if the given array contains another array, only works with primitives.
 * @param arr
 * @param target
 */
export const containsDeep = <T extends Array<string | number | boolean | null | undefined>>(arr: Array<T>, target: T): boolean => {
    outer: for (const element of arr) {
        if (element.length === target.length) {

            for (let i = 0; i < arr.length; i++) {
                if (element[i] !== target[i]) {
                    continue outer;
                }
            }

            return true;
        }
    }

    return false;
};
