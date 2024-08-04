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
        /(^|\s)kastelapp\.com\/invite\/([\w-]+)/g,
        /https:\/\/development\.kastelapp\.com\/invite\/([\w-]+)/g,
        /(^|\s)development\.kastelapp\.com\/invite\/([\w-]+)/g,
        /https:\/\/kastel\.dev\/([\w-]+)/g,
        /(^|\s)kastel\.dev\/([\w-]+)/g,
        new RegExp(`https://${currentDomain.replace(".", "\\.")}/invite/([\\w-]+)`, "g"),
        new RegExp(`(^|\\s)${currentDomain.replace(".", "\\.")}/invite/([\\w-]+)`, "g")
    ];

    const discordPatterns = [
        /https:\/\/discord\.gg\/([\w-]+)/g,
        /(^|\s)discord\.gg\/([\w-]+)/g,
        /https:\/\/discord\.com\/invite\/([\w-]+)/g,
        /(^|\s)discord\.com\/invite\/([\w-]+)/g
    ];

    for (const pattern of (discordOnly ? discordPatterns : patterns)) {
        let match;

        while ((match = pattern.exec(message)) !== null) {
            inviteCodes.push(match[1].trim() || match[2].trim());
        }
    }

    return inviteCodes;
}

export default getInviteCodes;