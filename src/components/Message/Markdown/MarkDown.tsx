import memoize from "memoizee";
import { pipe } from "ramda";
import SimpleMarkdown, { ReactRules, ReactNodeOutput } from "@kastelapp/simple-markdown";
import { customRules } from "./ast.tsx";
import { astToString, flattenAst } from "@/utils/markdown.ts";
import Link from "@/components/Message/Markdown/Link.tsx";
import { H1Heading, H2Heading, H3Heading } from "@/components/Message/Markdown/Heading.tsx";
import OrderedList from "@/components/Message/Markdown/OrderedList.tsx";
import UnOrderedList from "@/components/Message/Markdown/UnOrderedList.tsx";
import ListItem from "@/components/Message/Markdown/ListItem.tsx";
import Codeblock from "@/components/Message/Markdown/Codeblock.tsx";
import { Code } from "@nextui-org/react";
import type { CustomizedMessage } from "@/components/Message/Message.tsx";
import Constants from "@/data/constants.ts";
import cn from "@/utils/cn.ts";

const parseFor = (rules: ReactRules, returnAst = false) => {
	const parser = SimpleMarkdown.parserFor(rules);
	const renderer = SimpleMarkdown.outputFor(rules, "react");

	return memoize(
		(input = "", inline = true, props = {}, transform = null) => {
			if (!inline) {
				input += "\n\n";
			}

			const parseSteps = [parser, flattenAst, transform, !returnAst && renderer].filter(Boolean);

			const parse = pipe(
				// @ts-expect-error -- ignore this
				...parseSteps,
			);

			return parse(input, { inline, ...props });
		},
		{
			normalizer: (...args) => JSON.stringify(args),
		},
	);
};

const createRules = (rule: ReactRules, message?: CustomizedMessage, props?: {
	classNames?: {
		heading?: string;
		link?: string;
		blockQuote?: string;
		list?: string;
		codeBlock?: string;
		inlineCode?: string;
		paragraph?: string;
	};
}): ReactRules => {
	const { paragraph, link, codeBlock, inlineCode, blockQuote, heading } = rule;

	return {
		...SimpleMarkdown.defaultRules,
		...rule,
		heading: {
			...heading,
			react: (
				node: ReactNodeOutput & { level: number; },
				recurseOutput: (content: unknown, state: unknown) => React.ReactElement,
				state: { key: string; },
			) => {
				const sizes = {
					"1": H1Heading,
					"2": H2Heading,
					"3": H3Heading,
				};

				const Heading = sizes[node.level.toString() as keyof typeof sizes] || H3Heading;

				return (
					<Heading key={state.key} className={props?.classNames?.heading}>
						{recurseOutput((node as unknown as { content: unknown; }).content, state)}
					</Heading>
				);
			},
		},
		link: {
			...link,
			react: (
				node: SimpleMarkdown.RefNode & { target: string; },
				recurseOutput: (content: unknown, state: unknown) => React.ReactElement,
				state: { key: string; },
			) => (
				<Link
					title={node.title || astToString((node as unknown as { content: SimpleMarkdown.RefNode; }).content)}
					href={SimpleMarkdown.sanitizeUrl(node.target)!}
					target="_blank"
					rel="noreferrer"
					key={state.key}
					phishingMessage={
						message && (message.flags & Constants.messageFlags.Phishing) === Constants.messageFlags.Phishing
					}
					className={props?.classNames?.link}
				>
					{recurseOutput(node.content, state)}
				</Link>
			),
		},
		blockQuote: {
			...blockQuote,
			react: (
				node: SimpleMarkdown.RefNode,
				recurseOutput: (content: unknown, state: unknown) => React.ReactElement,
				state: { key: string; },
			) => (
				<blockquote key={state.key} className={cn("border-l-4 border-gray-400 pl-2", props?.classNames?.blockQuote)}>
					{recurseOutput(node.content, state)}
				</blockquote>
			),
		},
		list: {
			...SimpleMarkdown.defaultRules.list,
			react: (
				node: SimpleMarkdown.RefNode & { ordered: boolean; items: unknown[]; },
				recurseOutput: (content: unknown, state: unknown) => React.ReactElement,
				state: { key: string; },
			) => {
				const Tag = node.ordered ? OrderedList : UnOrderedList;

				const mapped = recurseOutput(node.items, state) as unknown as string[];

				return (
					<Tag key={state.key} className={props?.classNames?.list}>
						{mapped.map((item, index) => (
							<ListItem key={index}>{item}</ListItem>
						))}
					</Tag>
				);
			},
		},
		codeBlock: {
			...codeBlock,
			react: (
				node: SimpleMarkdown.RefNode & { lang: string; },
				_: (content: unknown, state: unknown) => React.ReactElement,
				state: { key: string; },
			) => {
				return <Codeblock language={node.lang} code={(node.content as unknown as string) ?? ""} key={state.key} />;
			},
		},
		inlineCode: {
			...inlineCode,
			react: (
				node: SimpleMarkdown.RefNode,
				_: (content: unknown, state: unknown) => React.ReactElement,
				state: { key: string; },
			) => (
				<Code key={state.key} className={cn("text-gray-300 text-base", props?.classNames?.inlineCode)}>
					{node.content as unknown as string}
				</Code>
			),
		},
		paragraph: {
			...paragraph,
			react: (
				node: SimpleMarkdown.RefNode,
				recurseOutput: (content: unknown, state: unknown) => React.ReactElement,
				state: { key: string; },
			) => {
				return <p key={state.key} className={props?.classNames?.paragraph}>{recurseOutput(node.content, state)}</p>;
			},
		},
	} as unknown as ReactRules;
};

const MessageMarkDown = ({
	children,
	message,
	disabledRules,
	classNames
}: {
	children: string;
	message?: CustomizedMessage;
	disabledRules?: (
		| "all"
		| "heading"
		| "link"
		| "blockQuote"
		| "list"
		| "codeBlock"
		| "inlineCode"
		| "paragraph"
	)[];
	classNames?: {
		heading?: string;
		link?: string;
		blockQuote?: string;
		list?: string;
		codeBlock?: string;
		inlineCode?: string;
		paragraph?: string;
	};
}) => {
	if (children === null) return null;

	const createdRules = createRules(customRules as never, message, {
		classNames: classNames,
	});

	for (const rule of disabledRules ?? []) {
		if (rule === "all") {
			return <>{children}</>;
		}

		// @ts-expect-error -- ignore this
		delete createdRules[rule];
	}

	const renderer = parseFor(createdRules)(children, true, {
		message: message,
	});

	return <>{renderer}</>;
};

export default MessageMarkDown;
