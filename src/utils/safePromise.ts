/**
 * Wraps a promise in a try-catch block and returns the result and error
 * @param promise The promise to wrap
 * @returns The result and error
 */
const safePromise = async <T>(promise: Promise<T>): Promise<[
    T | null,
    Error | null
]> => {
    try {
        return [await promise, null]
    } catch (e) {
        return [null, e as Error]
    }
}

export default safePromise;