/**
 * Safely parse JSON data without throwing an error
 * @param data The data to parse
 * @returns The parsed data, or null if it failed to parse
 */
const safeParse = <T = unknown>(data: unknown): T | null => {
	try {
		return JSON.parse(data as string);
	} catch {
		return null;
	}
};

export default safeParse;
