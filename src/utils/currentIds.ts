const getCurrentGuildId = () => {
    if (typeof window === "undefined") return null;

    const match = window.location.pathname.match(/\/app\/guilds\/(\d+)/);

    if (!match) return null;

    return match[1];
};

const getCurrentChannelId = () => {
    if (typeof window === "undefined") return null;

    const match = window.location.pathname.match(/\/app\/guilds\/\d+\/channels\/(\d+)/);

    if (!match) return null;

    return match[1];
};

export { getCurrentGuildId, getCurrentChannelId };