const store = typeof window !== "undefined" ? window.localStorage : null;

const localStorageEffect = (key: string) => {
  // @ts-expect-error -- idk how to fix this easily
  return ({ setSelf, onSet }) => {
    if (store) {
      const savedValue = store.getItem(key);
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }

      // @ts-expect-error -- idk how to fix this easily
      onSet((newValue, _, isReset) => {
        isReset
          ? store.removeItem(key)
          : store.setItem(key, JSON.stringify(newValue));
      });
    }
  };
};

export default localStorageEffect;
