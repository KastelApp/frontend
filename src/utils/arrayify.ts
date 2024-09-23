const arrayify = <T>(value: T | T[] | undefined): T[] => {
    if (Array.isArray(value)) {
        return value;
    }

    if (value === undefined) {
        return [];
    }

    return [value];
}

export default arrayify;