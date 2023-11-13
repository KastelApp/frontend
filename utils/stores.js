import {atom} from 'recoil'
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
