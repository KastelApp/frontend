import { MainProps } from "../SlateTypes.ts";

const Element = (props: MainProps) => {
	const { attributes, children, element } = props;

	// todo: implement the logic for mentions
	switch (element.type) {
		case "blockquote": {
			return <blockquote className="border-l-4 border-gray-400 pl-2" {...attributes}>{children}</blockquote>;
		}

		default: {
			return <div {...attributes}>{children}</div>;
		}
	}
};

export default Element;
