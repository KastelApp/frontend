export const getTopOffset = (guilds, guildId) => {
    const index = guilds.indexOf(guilds.find((guild) => guild.id === guildId));
    const initialOffset = 93;
    const difference = 64;

    return initialOffset + index * difference;
};