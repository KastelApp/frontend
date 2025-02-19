import { channelMention } from "@/components/Message/Markdown/ChannelMention.tsx";
import { emoji } from "@/components/Message/Markdown/Emoji.tsx";
import { roleMention } from "@/components/Message/Markdown/RoleMention.tsx";
import { userMention } from "@/components/Message/Markdown/UserMention.tsx";
import SimpleMarkdown from "@kastelapp/simple-markdown";

export const customRules = {
	escape: SimpleMarkdown.defaultRules.escape,
	em: SimpleMarkdown.defaultRules.em,
	paragraph: SimpleMarkdown.defaultRules.paragraph,
	newline: SimpleMarkdown.defaultRules.newline,
	url: SimpleMarkdown.defaultRules.url,
	strong: SimpleMarkdown.defaultRules.strong,
	link: SimpleMarkdown.defaultRules.link,
	br: SimpleMarkdown.defaultRules.br,
	u: SimpleMarkdown.defaultRules.u,
	inlineCode: SimpleMarkdown.defaultRules.inlineCode,
	heading: {
		...SimpleMarkdown.defaultRules.heading,
		match: (source: string, state: SimpleMarkdown.State) => {
			const prevCaptureStr = state.prevCapture === null ? "" : state.prevCapture[0];
			const isStartOfLineCapture = /(?:^|\n)( *)$/.exec(prevCaptureStr);

			if (isStartOfLineCapture) {
				source = isStartOfLineCapture[1] + source;
				return /^ *(#{1,3})([^\n]+?)(?:\n|$)/.exec(source);
			}

			return null;
		},
	},
	autolink: {
		...SimpleMarkdown.defaultRules.autolink,
		match: SimpleMarkdown.inlineRegex(/^<(https?:\/\/[^ >]+)>/),
	},
	blockQuote: {
		...SimpleMarkdown.defaultRules.blockQuote,
		match: (source: string, { prevCapture }: { prevCapture: string }) =>
			/^$|\n *$/.test(prevCapture ?? "")
				? /^( *>>> +([\s\S]*))|^( *>(?!>>) +[^\n]*(\n *>(?!>>) +[^\n]*)*\n?)/.exec(source)
				: null,
		parse: (capture: string[], parse: (string: string, state: unknown) => void, state: unknown) => ({
			content: parse(capture[0].replace(/^ *>(?:>>)? ?/gm, ""), state),
		}),
	},
	codeBlock: {
		order: SimpleMarkdown.defaultRules.codeBlock.order,
		match: (source: string) => {
			const match = /^```(([A-z0-9-]+?)\n+)?\n*([^]+?)\n*```/.exec(source);

			if (!match) return null;

			const match2 = /^```(?<m>(?<lang>[\dA-z-]+?)\n+)?\n*(?<content>[\S\s]*?)```/gm.exec(source);

			// ? is this scuffed? yes, do I care? no

			match[3] = match2?.groups?.content ?? match[3];

			return match;
		},
		parse: ([, , lang, content]: [unknown, unknown, string, string]) => ({
			lang: (lang || "").trim(),
			content: content || "",
		}),
	},
	userMention,
	channelMention,
	roleMention,
	emoji,
};
