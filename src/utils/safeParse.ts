/**
 * Safely parse JSON data without throwing an error
 * @param data The data to parse
 * @returns The parsed data, or null if it failed to parse
 */
const safeParse = <T = unknown>(data: string): T | null => {
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
};

export default safeParse;