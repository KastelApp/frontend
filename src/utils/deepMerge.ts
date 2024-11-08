/**
 * Deep merge two objects
 * @param target The target object to merge into
 * @param source The source object to merge from
 */
const deepMerge = <T extends Record<string, unknown>, R extends Record<string, unknown>>(target: T, source: R): T & R => {
    for (const key in source) {
        if (source[key] instanceof Object && key in target) {
            // @ts-expect-error idk how to fix this type easily
            target[key] = deepMerge(target[key], source[key]);
        } else {
            // @ts-expect-error idk how to fix this type easily
            target[key] = source[key];
        }
    }
    return target as T & R;
};

export default deepMerge;