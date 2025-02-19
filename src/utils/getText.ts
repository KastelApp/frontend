import { isValidElement } from "react";

const getText = (children: React.ReactNode): string => {
	if (typeof children === "string" || typeof children === "number") {
		return children.toString().replaceAll(" ", "-").toLowerCase();
	}

	if (isValidElement(children)) {
		return getText(children.props.children);
	}

	if (Array.isArray(children)) {
		return children.map((child) => getText(child)).join("-");
	}

	return "";
};

const getTextWithoutSeparator = (children: React.ReactNode): string => {
	if (typeof children === "string" || typeof children === "number") {
		return children.toString().toLowerCase();
	}

	if (isValidElement(children)) {
		return getTextWithoutSeparator(children.props.children);
	}

	if (Array.isArray(children)) {
		return children.map((child) => getTextWithoutSeparator(child)).join("");
	}

	return "";
}

export default getText;

export { getTextWithoutSeparator };