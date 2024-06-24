/**
 * Fetch invites from a message
 * @param message The message to get the invites from
 * @param discordOnly If we should fetch ONLY discord invites
 * @returns The array of Invites found in the message
 */
const getInviteCodes = (message: string, discordOnly = false) => {
    const inviteCodes: string[] = [];

    const currentDomain = window.location.hostname;

    const patterns = [
        /https:\/\/kastelapp\.com\/invite\/([\w-]+)/g,
        /kastelapp\.com\/invite\/([\w-]+)/g,
        /https:\/\/kastel\.dev\/([\w-]+)/g,
        /kastel\.dev\/([\w-]+)/g,
        new RegExp(`https://${currentDomain.replace(".", "\\.")}/invite/([\\w-]+)`, "g"),
        new RegExp(`${currentDomain.replace(".", "\\.")}/invite/([\\w-]+)`, "g")
    ];

    const discordPatterns = [
        /https:\/\/discord\.gg\/([\w-]+)/g,
        /discord\.gg\/([\w-]+)/g,
        /https:\/\/discord\.com\/invite\/([\w-]+)/g,
        /discord\.com\/invite\/([\w-]+)/g
    ];

    for (const pattern of (discordOnly ? discordPatterns : patterns)) {
        let match;

        while ((match = pattern.exec(message)) !== null) {
            inviteCodes.push(match[1]);
        }
    }

    return inviteCodes;
}

export default getInviteCodes;