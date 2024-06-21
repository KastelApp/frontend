const getInviteCodes = (message: string) => {
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

    for (const pattern of patterns) {
        let match;

        while ((match = pattern.exec(message)) !== null) {
            inviteCodes.push(match[1]);
        }
    }

    return inviteCodes;
}

export default getInviteCodes;