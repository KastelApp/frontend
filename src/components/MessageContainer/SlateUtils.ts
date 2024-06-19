import { ReactEditor } from "slate-react";
import { Token } from "./SlateTypes.ts";
import { Node, Range, Transforms } from "slate";
import { Editor } from "slate";

/**
 * Get the length of a token
 */
const getLength = (token: Token): number => {
    if (typeof token === "string") {
        return token.length;
    } else if (typeof token.content === "string") {
        return token.content.length;
    } else {
        return token.content.reduce((l, t) => l + getLength(t), 0);
    }
};

/**
 * Enables / Disables markdown around some text
 */
const toggleTextWithMarkdown = (editor: ReactEditor, wrapper: string) => {
    const { selection } = editor;

    if (!selection) return;

    const [start, end] = Range.edges(selection);
    const selectedText = Editor.string(editor, selection);

    const afterText = Editor.string(editor, {
        anchor: { path: start.path, offset: 0 },
        focus: start,
    });

    const beforeText = Editor.string(editor, {
        anchor: end,
        focus: { path: end.path, offset: Node.string(Node.parent(editor, end.path)).length },
    });

    const isLeftNRightWrapped = beforeText.startsWith(wrapper) && afterText.endsWith(wrapper);
    const isWrapped = (selectedText.startsWith(wrapper) && selectedText.endsWith(wrapper));

    if (isWrapped) {
        const unwrappedText = selectedText.slice(wrapper.length, -wrapper.length);
        Transforms.insertText(editor, unwrappedText, { at: selection });
        Transforms.move(editor, { distance: -wrapper.length, unit: "offset" });
    } else if (isLeftNRightWrapped) {
        Transforms.delete(editor, { at: { path: start.path, offset: start.offset - wrapper.length }, distance: wrapper.length });

        Transforms.delete(editor, {
            at: { path: end.path, offset: end.offset - wrapper.length },
            distance: wrapper.length
        });

    } else {
        Transforms.insertText(editor, `${wrapper}${selectedText}${wrapper}`, { at: selection });
        Transforms.select(editor, {
            anchor: { path: start.path, offset: start.offset + wrapper.length },
            focus: { path: end.path, offset: end.offset + wrapper.length }
        });
    }
};

export { getLength, toggleTextWithMarkdown };
