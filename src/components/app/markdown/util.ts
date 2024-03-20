import { ASTNode } from "simple-markdown";

export const flattenAst = (
  node: SimpleMarkdown.RefNode | ASTNode,
  parent?: SimpleMarkdown.RefNode,
) => {
  if (Array.isArray(node)) {
    for (let n = 0; n < node.length; n++) {
      node[n] = flattenAst(node[n], parent);
    }

    return node;
  }

  if (!node || !parent) return node;

  if (node.content) {
    node.content = flattenAst(node.content, node);
  }

  if (node.type === parent.type) {
    return node.content;
  }

  return node;
};

const inner = (
  node: SimpleMarkdown.RefNode | ASTNode,
  result: string[] = [],
) => {
  if (Array.isArray(node)) {
    node.forEach((subNode) => astToString(subNode));
  } else if (typeof node.content === "string") {
    result.push(node.content);
  } else if (node.content !== null) {
    astToString(node.content);
  }

  return result;
};

export const astToString = (node: SimpleMarkdown.RefNode | ASTNode) => {
  return inner(node).join("");
};

export const recurse = (
  node: SimpleMarkdown.RefNode,
  recurseOutput: (content: unknown, state: unknown) => React.ReactElement,
  state: { key: string },
) => {
  return typeof node.content === "string"
    ? node.content
    : recurseOutput(node.content, state);
};

export const recurseStrings = (
  node: SimpleMarkdown.RefNode,
  recurseOutput: (content: unknown, state: unknown) => React.ReactElement,
  state: { key: string },
): string => {
  if (Array.isArray(node.content)) {
    return node.content
      .map((content) => recurseStrings(content, recurseOutput, state))
      .join("");
  } else if (typeof node.content === "string") {
    return node.content;
  } else {
    // @ts-expect-error -- ignore this
    return recurseOutput(node.content, state);
  }
};
