import { userMention } from "@/components/Message/Markdown/UserMention.tsx";
import { defaultRules, inlineRegex } from "simple-markdown";

export const customRules = {
    escape: defaultRules.escape,
    em: defaultRules.em,
    paragraph: defaultRules.paragraph,
    newline: defaultRules.newline,
    url: defaultRules.url,
    strong: defaultRules.strong,
    link: defaultRules.link,
    br: defaultRules.br,
    u: defaultRules.u,
    inlineCode: defaultRules.inlineCode,
    heading: {
      ...defaultRules.heading,
      match: (source: string, state: SimpleMarkdown.State) => {
        const prevCaptureStr =
          state.prevCapture === null ? "" : state.prevCapture[0];
        const isStartOfLineCapture = /(?:^|\n)( *)$/.exec(prevCaptureStr);
  
        if (isStartOfLineCapture) {
          source = isStartOfLineCapture[1] + source;
          return /^ *(#{1,3})([^\n]+?)(?:\n|$)/.exec(source);
        }
  
        return null;
      },
    },
    autolink: {
      ...defaultRules.autolink,
      match: inlineRegex(/^<(https?:\/\/[^ >]+)>/),
    },
    blockQuote: {
      ...defaultRules.blockQuote,
      match: (source: string, { prevCapture }: { prevCapture: string }) =>
        /^$|\n *$/.test(prevCapture ?? "")
          ? /^( *>>> +([\s\S]*))|^( *>(?!>>) +[^\n]*(\n *>(?!>>) +[^\n]*)*\n?)/.exec(
              source,
            )
          : null,
      parse: (
        capture: string[],
        parse: (string: string, state: unknown) => void,
        state: unknown,
      ) => ({
        content: parse(capture[0].replace(/^ *>(?:>>)? ?/gm, ""), state),
      }),
    },
    emoji: {
      order: defaultRules.text.order,
      match: (source: string) => /^(¯\\_\(ツ\)_\/¯)/.exec(source),
      parse: (capture: string[]) => ({ type: "text", content: capture[1] }),
    },
    codeBlock: {
      order: defaultRules.codeBlock.order,
      match: (source: string) => {
        const match = /^```(([A-z0-9-]+?)\n+)?\n*([^]+?)\n*```/.exec(source);
  
        if (!match) return null;
  
        const match2 =
          /^```(?<m>(?<lang>[\dA-z-]+?)\n+)?\n*(?<content>[\S\s]*?)```/gm.exec(
            source,
          );
  
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
    // channelMention,
    // roleMention,
    // defaultEmoji: {
    //   order: defaultRules.text.order,
    //   match: (source: string) => /^(?!<):([^\s:]+?):(?![0-9]+>)/gu.exec(source),
    //   parse: (match: string[]) => ({
    //     content: match[1],
    //   }),
    //   react: (
    //     { content }: { content: string },
    //     _: unknown,
    //     state: { key: string },
    //   ) => <Emoji emoji={content} key={state.key} />,
    // },
  };