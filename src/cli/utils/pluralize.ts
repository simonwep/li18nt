/**
 * Pluralizes the given string and count
 * @param str
 * @param count
 */
export const pluralize = (str: string, count: number): string => {
    return count === 1 ? `one ${str}` : `${count} ${str}s`;
};
