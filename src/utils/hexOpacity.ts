/**
 * Converts a hex into an RGBA that supports opacity
 * @param hex The hex color code
 * @param opacity The opacity value from 0 to 1 (0% to 100%)
 * @returns The RGBA color code
 */
const hexOpacity = (hex: string, opacity: number) => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);

	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default hexOpacity;
