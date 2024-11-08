import memoize from "memoizee";
import { pipe } from "ramda";
import SimpleMarkdown, { defaultRules } from "simple-markdown";
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
import Constants from "@/utils/Constants.ts";

const parseFor = (rules: SimpleMarkdown.ReactRules, returnAst = false) => {
	const parser = SimpleMarkdown.parserFor(rules);
	const renderer = SimpleMarkdown.outputFor(rules, "react");

	return memoize(
		(input = "", inline = true, props = {}, transform = null) => {
			if (!inline) {
				input += "\n\n";
			}

			const parseSteps = [
				parser,
				flattenAst,
				transform,
				!returnAst && renderer
			].filter(Boolean);

			const parse = pipe(
				// @ts-expect-error -- ignore this
				...parseSteps
			);

			return parse(input, { inline, ...props });
		},
		{
			normalizer: (...args) => JSON.stringify(args),
		}
	);
};

const createRules = (rule: SimpleMarkdown.ReactRules, message?: CustomizedMessage): SimpleMarkdown.ReactRules => {
	const {
		paragraph,
		link,
		codeBlock,
		inlineCode,
		blockQuote,
		heading,
	} = rule;

	return {
		...defaultRules,
		...rule,
		heading: {
			...heading,
			react: (
				node: SimpleMarkdown.RefNode & { level: number; },
				recurseOutput: (content: unknown, state: unknown) => React.ReactElement,
				state: { key: string; },
			) => {
				const sizes = {
					"1": H1Heading,
					"2": H2Heading,
					"3": H3Heading,
				};

				const Heading = sizes[node.level.toString() as keyof typeof sizes] || H3Heading;

				return <Heading key={state.key}>{recurseOutput(node.content, state)}</Heading>;
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
					title={node.title || astToString(node.content!)}
					href={SimpleMarkdown.sanitizeUrl(node.target)!}
					target="_blank"
					rel="noreferrer"
					key={state.key}
					phishingMessage={
						message && (message.flags & Constants.messageFlags.Phishing) === Constants.messageFlags.Phishing
					}
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
				<blockquote key={state.key} className="border-l-4 border-gray-400 pl-2">
					{recurseOutput(node.content, state)}
				</blockquote>
			),
		},
		list: {
			...defaultRules.list,
			react: (
				node: SimpleMarkdown.RefNode & { ordered: boolean; items: unknown[]; },
				recurseOutput: (content: unknown, state: unknown) => React.ReactElement,
				state: { key: string; },
			) => {
				const Tag = node.ordered ? OrderedList : UnOrderedList;

				const mapped = recurseOutput(node.items, state) as unknown as string[];

				return (
					<Tag key={state.key}>
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
				<Code key={state.key} className="text-gray-300">
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
				return <p key={state.key}>{recurseOutput(node.content, state)}</p>;
			},
		},
	} as unknown as SimpleMarkdown.ReactRules;
};

const MessageMarkDown = ({ children, message, disabledRules }: { children: string; message?: CustomizedMessage; disabledRules?: ("link" | "autolink" | "url" | "code" | "blockquote" | "heading" | "list" | "inlineCode" | "paragraph" | "all")[] }) => {
	const createdRules = createRules(customRules as never, message);

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
