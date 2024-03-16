import SimpleMarkdown, { defaultRules } from "simple-markdown";
import memoize from "memoizee";
import * as ramda from "ramda";
import { flattenAst, astToString, recurse, recurseStrings } from "@/components/app/markdown/util.ts";
import { Box, Code, Heading, Link, Text } from "@chakra-ui/react";
import { getEmojiByUnicode } from "@/components/app/markdown/defaultEmojis.ts";
import Codeblock, { PreviewCodeblock } from "./components/codeblock/Codeblock.tsx";
import { customRules } from "./ast.tsx";

const parserFor = (rules: SimpleMarkdown.ReactRules, returnAst?: unknown) => {
  const parser = SimpleMarkdown.parserFor(rules);
  const renderer = SimpleMarkdown.outputFor(rules, "react");
  return memoize(
    (input = "", inline = true, state = {}, transform = null) => {
      if (!inline) {
        input += "\n\n";
      }

      const parse = ramda.pipe.apply(
        this,
        // @ts-expect-error -- TODO: fix this
        [parser, flattenAst, transform, !returnAst && renderer].filter(Boolean)
      );

      return parse(input, { inline, ...state });
    },
    {
      normalizer: (...args) => JSON.stringify(args),
    }
  );
};

const createRules = (rule: SimpleMarkdown.ReactRules, keepSpecial = false) => {
  const {
    paragraph,
    url,
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
      react: (node: SimpleMarkdown.RefNode & { level: number; }, recurseOutput: (content: unknown, state: unknown) => React.ReactElement, state: { key: string; }) => {
        const sizes = {
          "1": "lg",
          "2": "md",
          "3": "sm",
        };

        const size = sizes[String(node.level) as "1" | "2" | "3"] ?? "md";

        return (
          <Heading key={state.key} as={"h2"} size={size}>
            {recurseOutput(node.content, state)}
          </Heading>
        );
      },
    },
    s: {
      order: rule.u!.order,
      match: SimpleMarkdown.inlineRegex(/^~~([\s\S]+?)~~(?!_)/),
      parse: rule.u!.parse,
      react: (node: SimpleMarkdown.RefNode, recurseOutput: (content: unknown, state: unknown) => React.ReactElement, state: { key: string; }) => {
        if (!keepSpecial) {
          return (
            <s key={state.key}>{recurseOutput(node.content, state)}</s>
          );
        }

        return (
          <>
            <Text as="span" color="gray.500">~~</Text>
            <s key={state.key}>{recurseOutput(node.content, state)}</s>
            <Text as="span" color="gray.500">~~</Text>
          </>
        );
      },
    },
    paragraph: {
      ...paragraph,
      react: (node: SimpleMarkdown.RefNode, recurseOutput: (content: unknown, state: unknown) => React.ReactElement, state: { key: string; }) => (
        <p key={state.key}>{recurseOutput(node.content, state)}</p>
      ),
    },
    url: {
      ...url,
      match: SimpleMarkdown.inlineRegex(
        /^((https?|steam):\/\/[^\s<]+[^<.,:;"')\]\s])/
      ),
    },
    link: {
      ...link,
      react: (node: SimpleMarkdown.RefNode & { target: string; }, recurseOutput: (content: unknown, state: unknown) => React.ReactElement, state: { key: string; }) => (
        <Link
          title={node.title || astToString(node.content!)}
          href={SimpleMarkdown.sanitizeUrl(node.target)!}
          target="_blank"
          rel="noreferrer"
          key={state.key}
          color={"blue.400"}
        >
          {recurseOutput(node.content, state)}
        </Link>
      )
    },
    inlineCode: {
      ...inlineCode,
      react: (node: SimpleMarkdown.RefNode, recurseOutput: (content: unknown, state: unknown) => React.ReactElement, state: { key: string; }) => {
        if (!keepSpecial) {
          return (
            <Code key={state.key}>
              {recurse(node, recurseOutput, state)}
            </Code>
          );
        }

        return (
          <>
            <Text as="span" color="gray.500">`</Text>
            <Code key={state.key}>
              {recurse(node, recurseOutput, state)}
            </Code>
            <Text as="span" color="gray.500">`</Text>
          </>
        );
      },
    },
    codeBlock: {
      ...codeBlock,
      react: (node: SimpleMarkdown.RefNode & { lang: string; }, recurseOutput: (content: unknown, state: unknown) => React.ReactElement, state: { key: string; }) => {
        if (!keepSpecial) {
          return (
            <Codeblock node={node} recurseOutput={recurseOutput} state={state} key={state.key} />
          );
        }

        return (
          <Box display={"inline"} key={state.key}>
            <Text as="span" color="gray.500">```<Text as="span" color="blue.400">{node.lang}</Text></Text>
            <Box>
              <PreviewCodeblock node={node} recurseOutput={recurseOutput} state={state} />
            </Box>
            <Text as="span" color="gray.500">```</Text>
          </Box>
        );
      },
    },
    blockQuote: {
      ...blockQuote,
      match: (source: string, { prevCapture }: { prevCapture: string; }) => {
        return /^$|\n *$/.test(prevCapture ?? "")
          ? /^( *>{1,9} [^\n]*\n?)/.exec(source)
          : null;
      },
      react: (node: SimpleMarkdown.RefNode, recurseOutput: (content: unknown, state: unknown) => React.ReactElement, state: { key: string; }) => {
        if (!keepSpecial) {
          return (
            <Box key={state.key}
              borderColor={"gray.500"}
              pl={2}
              ml={0}
              mr={0}
              borderLeftWidth={3}
            >
              {recurseStrings(node, recurseOutput, state)}
            </Box>
          );
        }

        return (
          <Box key={state.key} display={"inline"}>
            <Text as="span" color="gray.500">&gt;</Text>
            <Text as="span">
              {recurseStrings(node, recurseOutput, state)}
            </Text>
          </Box>
        );
      },
    },
    strong: {
      ...rule.strong,
      react: (node: SimpleMarkdown.RefNode, recurseOutput: (content: unknown, state: unknown) => React.ReactElement, state: { key: string; }) => {
        if (!keepSpecial) {
          return (
            <strong key={state.key}>{recurseOutput(node.content, state)}</strong>
          );
        }

        return (
          <>
            <Text as="span" color="gray.500">**</Text>
            <Text as="span" color="blue.400">{recurseOutput(node.content, state)}</Text>
            <Text as="span" color="gray.500">**</Text>
          </>
        );
      },
    }
  };
};

// @ts-expect-error -- TODO: fix this
const textRules = parserFor(createRules({
  ...customRules,
  link: { // masked link
    ...customRules.link,
    match: () => null,
  },
  // disable heading
  heading: {
    ...customRules.heading,
    match: () => null,
  },
}));

// @ts-expect-error -- TODO: fix this
const previewRules = parserFor(createRules({
  ...customRules,
  link: { // masked link
    ...customRules.link,
    match: () => null,
  },
  // disable heading
  heading: {
    ...customRules.heading,
    match: () => null,
  },
}, true));

// @ts-expect-error -- TODO: fix this
const markdownChannelRules = parserFor(createRules(customRules));

const handleUnicodeEmojis = (content: string): string => {
  let emojiCount = 0;
  return content.replace(
    /(\p{RI}\p{RI}|\p{Emoji}(?:\p{EMod}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?(?:\u{200D}(?:\p{RI}\p{RI}|\p{Emoji}(\p{EMod}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?))*)/gu,
    (match) => {
      if (emojiCount >= 200) return ""; // Stop processing after 200 emojis

      const emojiResult = getEmojiByUnicode(match);

      if (!emojiResult) return match;

      if (content.startsWith("\\")) return emojiResult.unicode;

      emojiCount++; // Increment the counter for each processed emoji

      return `:${emojiResult.emoji.slug}:`;
    }
  );
};


export const Markdown = ({
  children: content,
}: {
  children: React.ReactNode;
}): React.ReactElement | null => {
  const uniEmojis = handleUnicodeEmojis(content as unknown as string);

  return content
    ? textRules(uniEmojis, undefined) as React.ReactElement
    : null;
};

export const ChannelMarkdown = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement | null => {
  return children
    ? markdownChannelRules(children as unknown as string, undefined) as React.ReactElement
    : null;
};

export const PreviewMarkdown = ({
  children,
  keepSpecial = true
}: {
  children: React.ReactNode;
  keepSpecial?: boolean;
}): React.ReactElement | null => {
  const uniEmojis = handleUnicodeEmojis(children as unknown as string);

  return children
    ? keepSpecial ? previewRules(uniEmojis as unknown as string, undefined) as React.ReactElement : textRules(uniEmojis as unknown as string, undefined) as React.ReactElement
    : null;
};