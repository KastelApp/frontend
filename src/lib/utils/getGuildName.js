export const getGuildName = (guildName) => {
    let end = '';

    for (const word of guildName.split(' ')) {
        end += word[0];
    };

    return end.slice(0, 4);
}