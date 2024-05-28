import { Token } from "./SlateTypes.ts";

const getLength = (token: Token): number => {
	if (typeof token === "string") {
		return token.length;
	} else if (typeof token.content === "string") {
		return token.content.length;
	} else {
		return token.content.reduce((l, t) => l + getLength(t), 0);
	}
};

export { getLength };
