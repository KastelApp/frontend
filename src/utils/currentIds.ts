const getCurrentHubId = () => {
	if (typeof window === "undefined") return null;

	const match = window.location.pathname.match(/\/app\/hubs\/(\d+)/);

	if (!match) return null;

	return match[1];
};

const getCurrentChannelId = () => {
	if (typeof window === "undefined") return null;

	const match = window.location.pathname.match(/\/app\/hubs\/\d+\/channels\/(\d+)/);

	if (!match) return null;

	return match[1];
};

export { getCurrentHubId, getCurrentChannelId };
