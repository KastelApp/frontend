import { LeafProps } from "../SlateTypes.ts";

const shouldBeBold = (text: string): boolean => {
	return text?.startsWith("**") && text?.endsWith("**");
};

const shouldBeUnderlined = (text: string): boolean => {
	return text?.startsWith("__") && text?.endsWith("__");
};

const Leaf = ({ attributes, children, leaf }: LeafProps) => {
	const { list, italic, code } = leaf;
	let tailwindStyles = "";

	// ? Check for bold styling first to handle nested cases correctly
	if (shouldBeBold(children?.props?.leaf?.text)) {
		tailwindStyles += "font-bold ";
		// ? Remove bold markers for further processing
		const textWithoutBoldMarkers = children?.props?.leaf?.text?.slice(2, -2);
		if (shouldBeUnderlined(textWithoutBoldMarkers)) {
			tailwindStyles += "underline ";
		}
	} else if (shouldBeUnderlined(children?.props?.leaf?.text)) {
		tailwindStyles += "underline ";
	}

	if (italic) {
		tailwindStyles += "italic ";
	}

	if (list) {
		tailwindStyles += "list-disc ";
	}

	if (code) {
		tailwindStyles += "bg-gray-200 px-1 ";
	}

	return (
		<span {...attributes} className={tailwindStyles}>
			{children}
		</span>
	);
};

export default Leaf;

export {
	// ? I don't think we ever use these functions outside of this file, but I'll export them just in case
	shouldBeBold,
	shouldBeUnderlined,
};
