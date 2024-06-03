// @ts-expect-error -- I don't want the types
import Prism from "prismjs";
import "prismjs/components/prism-markdown";
import React, { useCallback, useEffect, useRef } from "react";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { Text, createEditor } from "slate";
import { withHistory } from "slate-history";
import Leaf from "./renderers/Leaf.tsx";
import { LeafProps, MainProps } from "./SlateTypes.ts";
import withMentions from "./plugins/withMentions.tsx";
import { getLength } from "./SlateUtils.ts";
import Element from "./renderers/Element.tsx";

const SlateEditor = ({ placeholder }: { placeholder: string; }) => {
	const renderLeaf = useCallback((props: LeafProps) => {
		return <Leaf {...props} />;
	}, []);
	const renderElement = useCallback((props: MainProps) => <Element {...props} />, []);

	// ? The ref is used since if you edit the text, the editor will be re-rendered, but the useMemo also gets re-rendered causing the text box's
	// ? state to be lost causing pathing issues, the ref should not get re-rendered
	const editorRef = useRef<ReactEditor | null>(null);

	if (!editorRef.current) {
		editorRef.current = withMentions(withReact(withHistory(createEditor())));
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
			[key: string]: boolean | { path: number[]; offset: number; };
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

	return (
		<Slate
			editor={editor}
			initialValue={[
				{
					// @ts-expect-error -- Unsure how to fix these types
					type: "paragraph",
					children: [{ text: "" }], // ? we are requred to have an empty text node
				},
			]}
		>
			<Editable
				// @ts-expect-error -- Unsure how to fix these types
				decorate={decorate}
				// @ts-expect-error -- Unsure how to fix these types
				renderLeaf={renderLeaf}
				// @ts-expect-error -- Unsure how to fix these types
				renderElement={renderElement}
				placeholder={placeholder}
				className="outline-none overflow-y-auto"
				id="slate-editor"
			/>
		</Slate>
	);
};

export default SlateEditor;
