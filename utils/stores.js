import {atom, selector} from 'recoil'
const localStorageEffect = key => ({setSelf, onSet}) => {
    const savedValue = localStorage.getItem(key)
    if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
        isReset
            ? localStorage.removeItem(key)
            : localStorage.setItem(key, JSON.stringify(newValue));
    });
};

// readyStore
export const readyStore = atom({
    key: 'ready',
    default: false,
    effects: [
        localStorageEffect('ready'),
    ]
})

export const ready = selector({
    key: 'ready',
    get: ({get}) => get(readyStore),
    set: ({set}, newValue) => set(readyStore, newValue)
})

// tokenStore
export const tokenStore = atom({
    key: 'token',
    default: null
});

export const token = selector({
    key: 'token',
    get: ({get}) => get(tokenStore),
    set: ({set}, newValue) => set(tokenStore, newValue)
});


// guildStore
export const guildStore = atom({
    key: 'guilds',
    default: null
});

export const guilds = selector({
    key: 'guilds',
    get: ({get}) => get(guildStore),
    set: ({set}, newValue) => set(guildStore, newValue)
});


// channelStore
export const channelStore = atom({
    key: 'channels',
    default: null
});

export const channels = selector({
    key: 'channels',
    get: ({get}) => get(channelStore),
    set: ({set}, newValue) => set(channelStore, newValue)
});