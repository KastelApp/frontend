// @ts-expect-error -- I don't want the types
import Prism from "prismjs";
import "prismjs/components/prism-markdown";
import { useCallback, useEffect, useRef } from "react";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { Editor, Node, Range, Text, Transforms, createEditor } from "slate";
import { withHistory } from "slate-history";
import Leaf from "./renderers/Leaf.tsx";
import { LeafProps, MainProps } from "./SlateTypes.ts";
import withMentions from "./plugins/withMentions.tsx";
import { getLength, toggleTextWithMarkdown } from "./SlateUtils.ts";
import Element from "./renderers/Element.tsx";
import withCustomDelete, { TypeNode } from "./plugins/withCustomDelete.tsx";
import Constants from "@/utils/Constants.ts";

const convertSTringToDescendantText = (text: string) => {
	const textArray = text.split("\n");

	return textArray.map((text) => {
		if (text.startsWith("> ") || text.startsWith(">>> ")) {
			return {
				type: "blockquote",
				children: [{ text: text.slice(2) }],
			};
		}

		return {
			type: "paragraph",
			children: [{ text }],
		};
	});
};

const SlateEditor = ({
	placeholder,
	isReadOnly,
	readOnlyMessage,
	sendMessage,
	onType,
	initialText = "",
}: {
	placeholder: string;
	readOnlyMessage?: string;
	isReadOnly?: boolean;
	sendMessage?: (message: string) => void;
	onType?: (message: string) => void;
	initialText?: string;
}) => {
	const renderLeaf = useCallback((props: LeafProps) => {
		return <Leaf {...props} />;
	}, []);
	const renderElement = useCallback((props: MainProps) => <Element {...props} />, []);

	// ? The ref is used since if you edit the text, the editor will be re-rendered, but the useMemo also gets re-rendered causing the text box's
	// ? state to be lost causing pathing issues, the ref should not get re-rendered
	const editorRef = useRef<ReactEditor | null>(null);

	if (!editorRef.current) {
		editorRef.current = withCustomDelete(withMentions(withReact(withHistory(createEditor()))));
	}

	const editor = editorRef.current;

	// useEffect(() => {
	// 	const slateEditor = document.getElementById("slate-editor");

	// 	document.addEventListener("keydown", (event) => {
	// 		if (event.key.length !== 1) return;

	// 		if (ReactEditor.isFocused(editor)) return;

	// 		event.preventDefault();

	// 		const observerOptions = {
	// 			root: null,
	// 			rootMargin: "0px",
	// 			threshold: 0,
	// 			trackVisibility: true,
	// 			delay: 100
	// 		};

	// 		const observer = new IntersectionObserver((entries) => {
	// 			if (!entries[0].isVisible) return;

	// 			ReactEditor.focus(editor);

	// 			editor.insertText(event.key);
	// 		}, observerOptions);

	// 		observer.observe(slateEditor!);
	// 	});

	// }, []);

	const decorate = useCallback(([node, path]: [Text, number[]]) => {
		const ranges: {
			[key: string]: boolean | { path: number[]; offset: number };
		}[] = [];

		if (!Text.isText(node)) {
			return ranges;
		}

		const tokens = Prism.tokenize(node.text, Prism.languages.markdown);
		let start = 0;

		for (const token of tokens) {
			const length = getLength(token);
			const end = start + length;

			if (typeof token !== "string") {
				ranges.push({
					[token.type]: true,
					anchor: { path, offset: start },
					focus: { path, offset: end },
				});
			}

			start = end;
		}

		return ranges;
	}, []);

	useEffect(() => {
		editor.children = convertSTringToDescendantText(initialText);
	}, [initialText]);

	return (
		<Slate
			editor={editor}
			initialValue={convertSTringToDescendantText(initialText)}
			onChange={() => {
				if (onType && !isReadOnly) {
					const text = editor.children
						.map((node) => {
							const str = Node.string(node);

							return "type" in node && node.type === "blockquote" ? `> ${str}` : str;
						})
						.join("\n");

					if (!text.trim()) {
						return;
					}

					onType(text);
				}
			}}
		>
			<Editable
				// @ts-expect-error -- Unsure how to fix these types
				decorate={decorate}
				// @ts-expect-error -- Unsure how to fix these types
				renderLeaf={renderLeaf}
				// @ts-expect-error -- Unsure how to fix these types
				renderElement={renderElement}
				placeholder={isReadOnly ? readOnlyMessage : placeholder}
				className="w-full overflow-y-auto overflow-x-hidden outline-none"
				id="slate-editor"
				readOnly={isReadOnly}
				onKeyDown={(event) => {
					// ? Bold
					if (event.ctrlKey && event.key === "b") {
						event.preventDefault();

						toggleTextWithMarkdown(editor, "**");
					}

					// ? Italic
					if (event.ctrlKey && event.key === "i") {
						event.preventDefault();
						toggleTextWithMarkdown(editor, "*");
					}

					// ? Underline
					if (event.ctrlKey && event.key === "u") {
						event.preventDefault();
						toggleTextWithMarkdown(editor, "__");
					}

					if (event.key === " " && editor.selection && Range.isCollapsed(editor.selection)) {
						const { selection } = editor;
						const [start] = Range.edges(selection);

						const beforeText = Editor.string(editor, {
							anchor: { path: start.path, offset: 0 },
							focus: start,
						});

						if (beforeText.startsWith(">")) {
							event.preventDefault();
							Transforms.setNodes<TypeNode>(
								editor,
								{ type: "blockquote" },
								{ match: (n) => "type" in n && n.type === "paragraph" },
							);
							Transforms.move(editor, { distance: 1, unit: "line" });
							Transforms.delete(editor, { at: { path: start.path, offset: 0 }, distance: 1 });
						}
					}

					if (sendMessage && event.key === "Enter" && !isReadOnly && !event.shiftKey) {
						event.preventDefault();

						const text = editor.children
							.map((node) => {
								const str = Node.string(node);

								return "type" in node && node.type === "blockquote" ? `> ${str}` : str;
							})
							.join("\n");

						if (!text.trim()) {
							return;
						}

						sendMessage(text);

						editor.children.map(() => {
							Transforms.delete(editor, { at: [0] });
						});

						editor.children = [
							{
								// @ts-expect-error -- Unsure how to fix these types
								type: "paragraph",
								children: [{ text: "" }],
							},
						];

						// ? refocus
						// note: Editor.focus(editor) does not seem to work, unsure why, this is a hack / workaround which works
						Transforms.select(editor, { offset: 0, path: [0, 0] });
					}
				}}
				onDOMBeforeInput={(event) => {
					if (!["insertFromPaste", "insertText"].includes(event.inputType)) {
						return;
					}

					const textLength = Editor.string(editor, []).length;
					const text = (event.data as string) ?? event.dataTransfer?.getData("text/plain");

					if (
						textLength >= Constants.settings.maxMessageSize + 2000 ||
						textLength + text.length >= Constants.settings.maxMessageSize + 2000
					) {
						event.preventDefault();
					}
				}}
			/>
		</Slate>
	);
};

export default SlateEditor;
