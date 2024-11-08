/**
 * Fetch invites from a message
 * @param message The message to get the invites from
 * @param discordOnly If we should fetch ONLY discord invites
 * @returns The array of Invites found in the message
 */
const getInviteCodes = (message: string, discordOnly = false) => {
	const inviteCodes: string[] = [];

	const currentDomain = window.location.host;

	const patterns = [
		/(?:https:\/\/|(^|\s))kastelapp\.com\/invite\/([\w-]+)/g,
		/(?:https:\/\/|(^|\s))development\.kastelapp\.com\/invite\/([\w-]+)/g,
		/(?:https:\/\/|(^|\s))kstl\.app\/invite\/([\w-]+)/g,
		new RegExp(`(?:https://|(^|\\s))${currentDomain.replace(".", "\\.")}/invite/([\\w-]+)`, "g")
	];

	const discordPatterns = [
		/(?:https:\/\/|(^|\s))discord\.gg\/([\w-]+)/g,
		/(?:https:\/\/|(^|\s))discord\.com\/invite\/([\w-]+)/g
	];

	for (const pattern of discordOnly ? discordPatterns : patterns) {
		let match;

		while ((match = pattern.exec(message)) !== null) {
			const code = match[2] || match[1];
			if (code) inviteCodes.push(code.trim());
		}
	}

	return inviteCodes;
};


export default getInviteCodes;
