/**
 * Merges strings together with a given separator
 */
const stringMerger = (separator: string, ...strings: (string | undefined | null)[]): string => {
    return strings.filter((s) => s).join(separator);
}

export default stringMerger;