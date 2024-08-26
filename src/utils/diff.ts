import fastDeepEqual from "fast-deep-equal";

/**
 * Get the difference between two arrays
 */
const diff = <A>(a: A[], b: A[]): { added: A[], removed: A[], changed: A[]; } => {
    const added: A[] = [];
    const removed: A[] = [];
    const changed: A[] = [];

    const bSet = new Set(b);

    // ? find removed items
    for (const item of a) {
        if (!bSet.has(item)) {
            removed.push(item);
        } else {
            bSet.delete(item);
        }
    }

    // ? the last elements in bSet are the added items
    for (const item of bSet) {
        added.push(item);
    }

    // ? find changed items
    const aMap = new Map(a.map(item => [JSON.stringify(item), item]));
    const bMap = new Map(b.map(item => [JSON.stringify(item), item]));

    for (const [key, value] of aMap.entries()) {
        if (bMap.has(key) && !fastDeepEqual(value, bMap.get(key))) {
            changed.push(bMap.get(key) as A);
        }
    }

    return { added, removed, changed };
};

export default diff;
