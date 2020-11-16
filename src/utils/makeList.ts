/**
 * Iterates over the list providing a list-number as first and the array-item
 * as second value.
 * @param arr Source array.
 */
export function* makeList<T>(arr: T[]): IterableIterator<[string, T]> {
    const padding = Math.max(1, Math.log10(arr.length));

    for (let i = 0; i < arr.length; i++) {
        const str = String(i + 1).padStart(padding, '0');
        yield [str, arr[i]];
    }
}
