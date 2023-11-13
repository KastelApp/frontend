import {atom} from 'recoil'

const store = typeof window !== 'undefined' ? window.localStorage : null;
const localStorageEffect = key => ({setSelf, onSet}) => {
    if (store) {
        const savedValue = store.getItem(key)
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

// readyStore
export const readyStore = atom({
    key: 'ready',
    default: false
})

// tokenStore
export const tokenStore = atom({
    key: 'token',
    default: null,
    effects: [
        localStorageEffect('ready'),
    ]
});


// guildStore
export const guildStore = atom({
    key: 'guilds',
    default: null
});

// channelStore
export const channelStore = atom({
    key: 'channels',
    default: null
});
