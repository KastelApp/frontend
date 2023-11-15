const store = typeof window !== "undefined" ? window.localStorage : null;

const localStorageEffect = (key) => {
    return ({ setSelf, onSet }) => {
        if (store) {
            const savedValue = store.getItem(key);
            if (savedValue != null) {
                setSelf(JSON.parse(savedValue));
            }

            onSet((newValue, _, isReset) => {
                isReset
                    ? store.removeItem(key)
                    : store.setItem(key, JSON.stringify(newValue));
            });
        }
    };
};

export default localStorageEffect;