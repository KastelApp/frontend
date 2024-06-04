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