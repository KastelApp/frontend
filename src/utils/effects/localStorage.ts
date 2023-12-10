const store: Storage | null = typeof window !== "undefined" ? window.localStorage : null;

const localStorageEffect = (key: string) => {
    return ({ setSelf, onSet }: { setSelf: (value: any) => void; onSet: (callback: (newValue: any, oldValue: any, isReset: boolean) => void) => void }) => {
        if (store) {
            const savedValue = store.getItem(key);
            if (savedValue !== null) {
                setSelf(JSON.parse(savedValue));
            }

            onSet((newValue, _, isReset) => {
                isReset ? store.removeItem(key) : store.setItem(key, JSON.stringify(newValue));
            });
        }
    };
};

export default localStorageEffect;
