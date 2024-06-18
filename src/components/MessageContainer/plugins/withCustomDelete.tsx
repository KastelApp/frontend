import { Editor, Node, Range, Transforms } from "slate";
import { ReactEditor } from "slate-react";

type TypeNode = Node & { type: string };

const withCustomDelete = (editor: ReactEditor): ReactEditor => {
    const { deleteBackward } = editor;

    editor.deleteBackward = (unit) => {
        const { selection } = editor;

        if (selection) {
            const [currentNode] = Editor.nodes<TypeNode>(editor, {
                match: (n) => "type" in n && n.type === "blockquote",
            });

            if (currentNode) {
                const [start] = Range.edges(selection);

                if (start.offset === 0 && start.path[start.path.length - 1] === 0) {
                    Transforms.setNodes<TypeNode>(editor, { type: "paragraph" });

                    return;
                }
            }
        }

        deleteBackward(unit);
    };
    return editor;
};

export default withCustomDelete;

export type { TypeNode };