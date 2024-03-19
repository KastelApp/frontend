import { CopyIcon } from "@chakra-ui/icons";
import { Box, Code, IconButton, useDisclosure } from "@chakra-ui/react";
import { PrismAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { recurse } from "../../util.ts";
import coldarkDark, { coldarkDarkWithoutFont } from "./style.ts";

const Codeblock = ({
  node,
  recurseOutput,
  state,
}: {
  node: SimpleMarkdown.RefNode & { lang: string };
  recurseOutput: (content: unknown, state: unknown) => React.ReactElement;
  state: { key: string };
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      position="relative"
      display="inline-block"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      {isOpen && (
        <IconButton
          aria-label="Copy code"
          icon={<CopyIcon />}
          size="sm"
          position="absolute"
          top="0"
          right="0"
          onClick={() => {
            navigator.clipboard.writeText(node.content as unknown as string);
          }}
        />
      )}

      <Code
        rounded="md"
        display="block"
        whiteSpace="pre"
        overflow="auto"
        maxW={"calc(100vw - 600px)"}
        w="calc(100vw - 600px)" // TODO: let users configure if they want full width or not
        bg="unset"
      >
        {/* @ts-expect-error -- this is fine */}
        <SyntaxHighlighter
          language={node.lang}
          style={coldarkDark}
          lineProps={{
            style: {
              wordBreak: "break-all",
              whiteSpace: "pre-wrap",
            },
          }}
          wrapLines={true}
        >
          {recurse(node, recurseOutput, state)}
        </SyntaxHighlighter>
      </Code>
    </Box>
  );
};

const PreviewCodeblock = ({
  node,
  recurseOutput,
  state,
}: {
  node: SimpleMarkdown.RefNode & { lang: string };
  recurseOutput: (content: unknown, state: unknown) => React.ReactElement;
  state: { key: string };
}) => {
  return (
    <Box>
      <Box>
        {/* @ts-expect-error -- this is fine */}
        <SyntaxHighlighter
          language={node.lang}
          style={coldarkDarkWithoutFont}
          lineProps={{
            style: {
              backgroundColor: "unset",
              whiteSpace: "pre-line",
            },
          }}
          customStyle={{
            backgroundColor: "unset",
            fontWeight: "unset",
            fontFamily: "inherit",
            whiteSpace: "pre-line",
          }}
        >
          {recurse(node, recurseOutput, state)}
        </SyntaxHighlighter>
      </Box>
    </Box>
  );
};

export default Codeblock;

export { PreviewCodeblock };
