import { Element } from "slate";

export interface ExtendedElement extends Element {
	type?: string;
}

export interface MainProps {
	attributes: React.HTMLAttributes<HTMLSpanElement>;
	children: React.ReactNode;
	element: {
		id: string;
		children: { bold: boolean; italic: boolean }[];
		type: string;
		mentionType: "channel" | "role" | "member";
	};
}

export interface LeafProps {
	attributes: React.HTMLAttributes<HTMLSpanElement>;
	children: React.ReactNode & { props: { leaf: { text: string } } };
	leaf: {
		bold: boolean;
		italic: boolean;
		underlined: boolean;
		title: boolean;
		list: boolean;
		hr: boolean;
		blockquote: boolean;
		code: boolean;
	};
}

export type Token = string | { type: string; content: Token[] | string };
